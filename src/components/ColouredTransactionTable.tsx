import {TransactionRow} from "./TransactionRow";
import {db} from "../db";
import {useLiveQuery} from "dexie-react-hooks";

export const ColouredTransactionTable = () => {
  const rules: Rule[] = useLiveQuery(() => db.rules.toArray()) || [];
  const categories: Category[] = useLiveQuery(() => db.categories.toArray()) || [];
  const transactions = useLiveQuery(() => db.transactions.orderBy('date').toArray()) || [];

  return (
    <div className={"content-container"}>
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
          {transactions.map((t, idx) => {
            const matchingRule = rules.find(r => t.description?.match(new RegExp(r.regex, 'g')));
            const matchingCategoryId = matchingRule?.categoryId || t.categoryId;
            const categoryColor = categories.find(c => c.id === matchingCategoryId)?.color;
            return <TransactionRow key={idx} data={t} color={categoryColor + '88' || ''}/>
          })}
          </tbody>
        </table>
      </div>
    </div>
  )
}