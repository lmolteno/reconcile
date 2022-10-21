import {useCallback, useEffect, useState} from "react";
import {TransactionTable} from "./TransactionTable";
import {filterData, transformKiwibank} from "../utils";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../db";
import {FilesDropdown} from "./FilesDropdown";
import {toast} from "react-toastify";

export const MergeFiles = () => {
  const files = useLiveQuery(() => db.files.toArray()) || [];
  const savedFileIds = useLiveQuery(async () => {
    const transactions = await db.transactions.toArray();
    return transactions
      .map(t => t.fileId)
      .filter((val, idx, arr) => arr.indexOf(val) === idx); // Distinct
  }) || [];

  const [currentFileId, setCurrentFileId] = useState<number>();

  useEffect(() => files && setCurrentFileId(files[0]?.id), [files]);

  const [excludeTransactions, setExcludeTransactions] = useState<string>('');
  const re = useCallback(
    () => excludeTransactions !== '' ? new RegExp(excludeTransactions || '', 'g') : undefined,
    [excludeTransactions])();

  const file = useCallback(
    () => files.find(f => f.id === currentFileId),
    [files, currentFileId])();

  const processedData = useCallback(
    () => file && transformKiwibank(file.rawData, file.id || 0) || [],
    [files, currentFileId])();

  const filteredTransactions = useCallback(
    () => filterData(processedData, re),
    [processedData, re])();

  const saveFile = async () => {
    const numberOfTransactions = filteredTransactions.length;
    await db.transactions.bulkAdd(filteredTransactions);
    toast.success(`Saved ${numberOfTransactions} transactions`);
    const nextFile = files.find(f => !savedFileIds.includes(f.id!) && f.id !== currentFileId);
    setCurrentFileId(nextFile?.id || currentFileId);
  };

  const unsaveFile = async () => {
    const numberOfTransactions = filteredTransactions.length;
    const affectedRows = await db.transactions
      .where("fileId").equals(currentFileId!)
      .delete();

    toast.success(`Removed ${affectedRows} transactions`);
  };

  return (
    <div className={"content-container space-y-5"}>
      <div className={"flex justify-between"}>
        <div className={"flex space-x-5"}>
          <FilesDropdown onChange={setCurrentFileId} value={currentFileId} />
          <h2 className={"text-xl text-secondary"}>{filteredTransactions.length} Transactions</h2>
        </div>
        <div className={"flex space-x-3"}>
          <h2 className={"text-xl"}>Reject Transactions Matching:</h2>
          <input
            type={"text"}
            inputMode={"text"}
            value={excludeTransactions}
            onChange={e => setExcludeTransactions(e.target.value)}
            className={"border-2 border-middleBlue"}
            disabled={savedFileIds.includes(currentFileId!)}/>
        </div>
      </div>
      <TransactionTable data={filteredTransactions} />
      <div>
        <button className={"btn-green mx-2 float-right"} disabled={savedFileIds.includes(file?.id || -1)} onClick={saveFile}>Import</button>
        <button className={"btn-green mx-2 float-right"} disabled={!savedFileIds.includes(file?.id || -1)} onClick={unsaveFile}>Unimport</button>
      </div>
    </div>
  )
}