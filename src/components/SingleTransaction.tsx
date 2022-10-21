import {db} from "../db";
import {useLiveQuery} from "dexie-react-hooks";
import {formatDate} from "../utils";
import {toast} from "react-toastify";
import {useCallback, useContext} from "react";
import {AppContext} from "../contexts/AppContext";
import {Step} from "../App";

interface SingleTransactionProps {
  t: Transaction;
}

export const SingleTransaction = ({t}: SingleTransactionProps) => {
  const categories = useLiveQuery(() => db.categories.toArray()) || [];
  const rules = useLiveQuery(() => db.rules.toArray()) || [];
  const { setTransactionId, setStep } = useContext(AppContext);

  const saveTransaction = async (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    setTransactionId(undefined);
    if (!category) return;
    await db.transactions.where('id').equals(t.id || -1).modify({categoryId});
    toast.success(
      <p>Saved to <span style={{color:category.color}}>{category.name}</span>
      </p>, {
        onClick: () => unsaveTransaction(t.id),
        autoClose: 2000
      });
  }

  const unsaveTransaction = async (tId?: number) => {
    await db.transactions.where('id').equals(tId || -1).modify({categoryId: undefined});
    setTransactionId(tId);
    toast.success("Unsaved transaction");
  }

  const matchingRule = useCallback(() => rules.find(r => t.description.match(new RegExp(r.regex, 'g'))), [rules])();
  const matchingCategory = useCallback(() => categories.find(c => c.id === matchingRule?.categoryId), [categories, matchingRule])();

  return (
    <div className={"bg-slate-200 grid grid-cols-1 p-5 divide-y divide-jet"}>
      <div className={"grid grid-cols-3 space-x-5"}>
        <h2 className={"text-xl text-left"}>{t.date ? formatDate(t.date) : 'Unknown date'}</h2>
        <h2 className={"text-xl text-center"}>${t.amount.toFixed(2)}</h2>
        <h2 className={"text-xl text-right"}>{t.amount > 0 ? "in" : "out"}</h2>
      </div>
      <div className={"grid grid-cols-2 gap-4 py-4"}>
        <div>
          <h2 className={"text-xl"}>Description</h2>
          {t.description}
        </div>
        <div>
          <h2 className={"text-xl"}>Particulars</h2>
          {t.inParticulars}{t.outParticulars}
        </div>
      </div>
      <div className={"grid grid-cols-1 gap-4 py-4"}>
        <div>
          <h2 className={"text-xl pb-2"}>Category &nbsp;
            {matchingRule && <span className={"text-secondary text-lg"}>This transaction is matched by the &quot;
              <span onClick={() => setStep(Step.RULES)} className={"hover:cursor-pointer"} style={{color: matchingCategory?.color}}>{matchingRule.name}</span>
              &quot; rule</span>}
          </h2>
          <div className={"grid grid-cols-fill-40 w-full gap-3"}>
            {categories.map((c, idx) => {
              const categoryMatches = c.id === t.categoryId || !!matchingRule?.categoryId;
              return (
                <button key={idx} className={"btn-green"} style={{backgroundColor: c.color + (categoryMatches ? '66' : '')}} disabled={categoryMatches}
                        onClick={() => saveTransaction(c.id!)}>{c.name}</button>
              );
            })}
          </div>
        </div>
      </div>
    </div>);
};