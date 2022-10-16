import {formatDate} from "../utils";

interface TransactionRowProps {
  data: Transaction,
  color?: string
}

export const TransactionRow = ({data, color}:TransactionRowProps) => {
  return (
    <tr className={color ? undefined : "odd:bg-slate-50 even:bg-white"} style={{backgroundColor: color}} onClick={() => console.log(data)}>
      <td>{data.date && formatDate(data.date)}</td>
      <td>{data.description}</td>
      <td className={"text-right"}>{data.amount.toFixed(2)}</td>
      <td className={"text-right"}>{data.balance?.toFixed(2)}</td>
    </tr>
  )
}