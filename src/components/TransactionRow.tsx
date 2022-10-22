import {formatDate} from "../utils";
import {MouseEventHandler} from "react";

interface TransactionRowProps {
  data: Transaction,
  color?: string,
  onClick?: MouseEventHandler<HTMLTableRowElement>
}

export const TransactionRow = ({data, color, onClick}:TransactionRowProps) => {
  return (
    <tr className={(color ? "" : "odd:bg-slate-50 even:bg-white") + (onClick && "hover:cursor-pointer")} style={{backgroundColor: color}} onClick={onClick}>
      <td>{data.date && formatDate(data.date)}</td>
      <td>{data.description}</td>
      <td className={"text-right"}>{data.amount.toFixed(2)}</td>
      <td className={"text-right"}>{data.balance?.toFixed(2)}</td>
    </tr>
  )
}