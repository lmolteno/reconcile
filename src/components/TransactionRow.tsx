import {format} from "fecha";

interface TransactionRowProps {
  data: Transaction
}

export const TransactionRow = ({data}:TransactionRowProps) => {
  return (
    <tr className={"odd:bg-slate-50 even:bg-white"}>
      <td>{data.date && format(data.date, 'YY-MM-dd')}</td>
      <td>{data.description}</td>
      <td className={"text-right"}>{data.amount.toFixed(2)}</td>
      <td className={"text-right"}>{data.balance?.toFixed(2)}</td>
    </tr>
  )
}