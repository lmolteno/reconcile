import {useState} from "react";

interface MergeFileProps {
  file: UnmergedData
}

export const MergeFiles = ({file}: MergeFileProps) => {
  const [excludeTransactions, setExcludeTransactions] = useState<string>();

  return (
    <div className={"content-container"}>
      <div className={"flex justify-between"}>
        <div className={"flex space-x-5"}>
          <h2 className={"text-xl"}>{file.name}</h2>
          <h2 className={"text-xl text-secondary"}>{file.data.length} Transactions</h2>
        </div>
        <input type={"text"} inputMode={"text"} />
      </div>
    </div>
  )
}