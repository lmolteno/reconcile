import {TransactionRow} from "./TransactionRow";
import {db} from "../db";
import {useLiveQuery} from "dexie-react-hooks";
import {useContext, useState} from "react";
import {AppContext} from "../contexts/AppContext";
import {Step} from "../App";
import {CategoryDropdown} from "./CategoryDropdown";

const enum AmountFiltering {
  All = 0,
  Credit = 1,
  Debit = -1
}

export const ColouredTransactionTable = () => {
  const {setTransactionId, setStep, categoryId, setCategoryId} = useContext(AppContext);
  const [amountFiltering, setAmountFiltering] = useState<AmountFiltering>(AmountFiltering.All);

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
            <div onChange={e => setAmountFiltering(e.target.value)}>
              <input type={"radio"} id={"debit"} name={"amountFiltering"} value={AmountFiltering.Debit} />
              <label htmlFor={"debit"}>Debit</label>
              <input type={"radio"} id={"credit"} name={"amountFiltering"} value={AmountFiltering.Credit} />
              <label htmlFor={"credit"}>Credit</label>
              <input type={"radio"} id={"all"} name={"amountFiltering"} value={AmountFiltering.All} />
              <label htmlFor={"all"}>All</label>
            </div>
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