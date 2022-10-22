import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../db";
import {ChangeEvent, useEffect, useState} from "react";

interface FilesDropdownProps {
  onChange: (fId: number) => void,
  value?: number
}

export const FilesDropdown = ({onChange, value}:FilesDropdownProps) => {
  const files = useLiveQuery(() => db.files.toArray()) || [];
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newVal = parseInt(e.target.value);
    if (newVal >= 0) onChange(newVal);
    setVal(newVal);
  }
  const [val, setVal] = useState(value);

  useEffect(() => setVal(value), [value]);

  return (
    <select onChange={handleChange} value={val}>
      {files.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
    </select>
  )
};