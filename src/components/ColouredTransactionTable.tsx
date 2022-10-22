import {TransactionRow} from "./TransactionRow";
import {db} from "../db";
import {useLiveQuery} from "dexie-react-hooks";
import {useContext} from "react";
import {AppContext} from "../contexts/AppContext";
import {AmountFiltering, Step} from "../App";
import {CategoryDropdown} from "./CategoryDropdown";


export const ColouredTransactionTable = () => {
  const {
    setTransactionId,
    setStep,
    categoryId,
    setCategoryId,
    amountFiltering,
    setAmountFiltering
  } = useContext(AppContext);

  const transactions = useLiveQuery(() =>
      db.transactions
        .orderBy('date')
        .filter(t => (t.amount * amountFiltering) >= 0)
        .toArray(),
    [amountFiltering]) || [];

  const categories: Category[] = useLiveQuery(() => db.categories.toArray()) || [];

  const rules: Rule[] = useLiveQuery(() =>
      db.rules
        .filter(r => r.categoryId === categoryId || !categoryId)
        .toArray(),
    [categoryId]) || [];

  return (
    <fieldset className={"content-container"}>
      <legend>All Transactions</legend>
      <div className={"space-y-3 flex-col"}>
        <div className={"flex justify-between"}>
          <div className={"flex space-x-2"}>
            <h2 className={"text-xl mr-0"}>View transactions in</h2>
            <CategoryDropdown onChange={setCategoryId} value={categoryId} placeHolder={"All categories"}/>
          </div>
          <div className={"flex space-x-2"}>
            {/* @ts-ignore */}
            <form className={"flex space-x-2"}>
              <input type={"radio"} id={"debit"} name={"amountFiltering"}
                     value={AmountFiltering.Debit} checked={amountFiltering === AmountFiltering.Debit}
                     onChange={() => setAmountFiltering(AmountFiltering.Debit)}/>
              <label htmlFor={"debit"} className={"pr-2 border-r-2"}>Debit</label>

              <input type={"radio"} id={"credit"} name={"amountFiltering"}
                     value={AmountFiltering.Credit} checked={amountFiltering === AmountFiltering.Credit}
                     onChange={() => setAmountFiltering(AmountFiltering.Credit)}/>
              <label htmlFor={"credit"} className={"pr-2 border-r-2"}>Credit</label>

              <input type={"radio"} id={"all"} name={"amountFiltering"}
                     value={AmountFiltering.All} checked={amountFiltering === AmountFiltering.All}
                     onChange={() => setAmountFiltering(AmountFiltering.All)}/>
              <label htmlFor={"all"}>All</label>
            </form>
          </div>
        </div>
        <div className={"block h-96 overflow-y-scroll"}>
          <table className={"transtable w-full border-2 border-middleBlue"} cellPadding={4}>
            <thead className={"bg-persian text-snow h-8"}>
            <tr className={"text-left"}>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Balance</th>
            </tr>
            </thead>
            <tbody>
            {transactions
              .filter(t => t.categoryId === categoryId || rules.some(r => t.description.match(new RegExp(r.regex, 'g'))) || !categoryId)
              .map((t, idx) => {
                const matchingRule = rules.find(r => t.description?.match(new RegExp(r.regex, 'g')));
                const matchingCategoryId = matchingRule?.categoryId || t.categoryId;
                const categoryColor = categories.find(c => c.id === matchingCategoryId)?.color;
                return <TransactionRow key={idx} data={t} color={categoryColor + '88' || ''} onClick={() => {
                  setStep(Step.RECONCILE);
                  setTransactionId(t.id);
                }}/>
              })}
            </tbody>
          </table>
        </div>
      </div>
    </fieldset>
  )
}