import {db} from "../db";
import {useLiveQuery} from "dexie-react-hooks";
import {SingleTransaction} from "./SingleTransaction";
import {useState} from "react";

export const ReconcileTransactions = () => {
  const rules = useLiveQuery(() => db.rules.toArray()) || [];
  const transactions = useLiveQuery(() => (
    db.transactions
      .filter(t => t.categoryId === undefined && rules.every(r => !t.description?.match(new RegExp(r.regex, 'g')))
      ).sortBy('date')
  ), [rules]);

  return (
    <div className={"content-container space-y-5"}>
      <div className={"flex justify-between"}>
        <div className={"flex space-x-5"}>
          <h2 className={"text-4xl"}>Reconcile</h2>
          <p className={"text-xl align-text-bottom text-secondary"}>{transactions?.length} unreconciled transactions</p>
        </div>
        <div className={"flex space-x-3"}>
        </div>
      </div>
      {transactions?.length > 0 ?
        <SingleTransaction t={transactions[0]} /> :
        <h2 className={"text-3xl text-center"}>All Done!</h2>
      }
    </div>
  )
};