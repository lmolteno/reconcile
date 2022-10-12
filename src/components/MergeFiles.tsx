import {useEffect, useState} from "react";
import {TransactionTable} from "./TransactionTable";
import {filterData} from "../utils";

interface MergeFileProps {
  file: UnmergedData,
  onExcludeChange: (re: RegExp) => void
}

export const MergeFiles = ({file, onExcludeChange}: MergeFileProps) => {
  const [excludeTransactions, setExcludeTransactions] = useState<string>();
  const re = new RegExp(excludeTransactions || '', 'g');

  useEffect(() => onExcludeChange(re), [excludeTransactions]);

  const filteredTransactions = filterData(file.data, re);
  return (
    <div className={"content-container space-y-5"}>
      <div className={"flex justify-between"}>
        <div className={"flex space-x-5"}>
          <h2 className={"text-xl"}>{file.name}</h2>
          <h2 className={"text-xl text-secondary"}>{filteredTransactions.length} Transactions</h2>
        </div>
        <div className={"flex space-x-3"}>
          <h2 className={"text-xl"}>Reject Transactions Matching:</h2>
          <input
            type={"text"}
            inputMode={"text"}
            value={excludeTransactions}
            onChange={e => setExcludeTransactions(e.target.value)}
            className={"border-2 border-middleBlue"} />
        </div>
      </div>
      <TransactionTable data={filteredTransactions} />
    </div>
  )
}