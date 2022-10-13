import {format} from "fecha";

interface TransactionRowProps {
  data: Transaction,
  color?: string
}

export const TransactionRow = ({data, color}:TransactionRowProps) => {
  return (
    <tr className={color ? undefined : "odd:bg-slate-50 even:bg-white"} style={{backgroundColor: color}}>
      <td>{data.date && format(data.date, 'YY-MM-dd')}</td>
      <td>{data.description}</td>
      <td className={"text-right"}>{data.amount.toFixed(2)}</td>
      <td className={"text-right"}>{data.balance?.toFixed(2)}</td>
    </tr>
  )
}