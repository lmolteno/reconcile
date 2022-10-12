import {format} from "fecha";
import {db} from "../db";
import {useLiveQuery} from "dexie-react-hooks";
import {CategoryDropdown} from "./CategoryDropdown";
import {useState} from "react";

interface SingleTransactionProps {
  t: Transaction;
  onSave: () => void;
}

export const SingleTransaction = ({t, onSave}:SingleTransactionProps) => {
  const [category, setCategory] = useState<number>();
  const categories = useLiveQuery(() => db.categories.toArray());

  const saveTransaction = async () => {
    await db.transactions.update({id: t.id!}, {categoryId: category});
  }

  return (
    <div className={"bg-slate-200 p-5"}>
      <div className={"grid grid-cols-3 space-x-5"}>
        <h2 className={"text-xl text-left"}>{t.date ? format(t.date, 'YY-MM-DD') : 'Unknown date'}</h2>
        <h2 className={"text-xl text-center"}>${t.amount.toFixed(2)}</h2>
        <h2 className={"text-xl text-right"}>{t.amount > 0 ? "in" : "out"}</h2>
      </div>
      <div className={"grid grid-cols-2 gap-4"}>
        <div >
          <h2 className={"text-xl"}>Description</h2>
          {t.description}
        </div>
        <div>
          <h2 className={"text-xl"}>Particulars</h2>
          {t.inParticulars}{t.outParticulars}
        </div>
      </div>
      <div className={"grid grid-cols-2 gap-4"}>
        <div>
          <h2 className={"text-xl"}>Category</h2>
          <CategoryDropdown onChange={setCategory} value={categories?.find(c => c.id === t.categoryId) || -1}/>
        </div>
        <div>
          <button className={"btn-green float-right"} onClick={saveTransaction}>Save</button>
        </div>
      </div>
    </div>);
};