import {TransactionRow} from "./TransactionRow";

interface TransactionTableProps {
  data: Transaction[]
}

export const TransactionTable = ({data}: TransactionTableProps) => {
  return (
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
        {data.map((d, idx) => <TransactionRow key={idx} data={d}/>)}
        </tbody>
      </table>
    </div>
  )
}