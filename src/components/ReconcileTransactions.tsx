import {db} from "../db";
import {useLiveQuery} from "dexie-react-hooks";
import {SingleTransaction} from "./SingleTransaction";
import {useCallback, useContext} from "react";
import {AppContext} from "../contexts/AppContext";

export const ReconcileTransactions = () => {
  const rules = useLiveQuery(() => db.rules.toArray()) || [];
  const transactions = useLiveQuery(() => (
    db.transactions.toArray()
  )) || [];

  const unreconciledTransactions = useCallback(() => transactions.filter(t => t.categoryId === undefined && rules.every(r => !t.description?.match(new RegExp(r.regex, 'g')))), [transactions, rules])();

  const { transactionId, setTransactionId } = useContext(AppContext);
  const transaction = useCallback(() => transactions.find(t => t.id === transactionId), [transactionId, transactions])();

  return (
    <div className={"content-container space-y-5"}>
      <div className={"flex justify-between"}>
        <div className={"flex space-x-5"}>
          <h2 className={"text-4xl"}>Reconcile</h2>
          <p className={"text-xl align-text-bottom text-secondary"}>{transaction ? `Transaction ${transactionId}` : `${unreconciledTransactions.length} unreconciled transactions`}</p>
        </div>
        <div className={"flex space-x-3"}>
          {transactionId && <button className={"btn-green"} onClick={() => setTransactionId(undefined)}>Done</button>}
        </div>
      </div>
      {transactionId ?
        (transaction && <SingleTransaction t={transaction} />) : (
        unreconciledTransactions.length ?
        <SingleTransaction t={unreconciledTransactions[0]}/> :
        <h2 className={"text-3xl text-center"}>All Done!</h2>
        )}
    </div>
  )
};