import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../db";
import {ChangeEvent, useState} from "react";

interface CategoryDropdownProps {
  onChange: (cId?: number) => void,
  value?: any,
  className?: string,
  placeHolder?: string
}

export const CategoryDropdown = ({onChange, value, className, placeHolder}:CategoryDropdownProps) => {
  const categories = useLiveQuery(() => db.categories.toArray()) || [];
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newVal = parseInt(e.target.value);
    setVal(newVal);
    if (newVal < 0) onChange(undefined);
    else onChange(newVal);
  }
  const [val, setVal] = useState(value);
  return (
    <select onChange={handleChange} value={val} className={className}>
      <option value={-1}>{placeHolder || "Category..."}</option>
      {categories.map((c, idx) => <option key={idx} value={c.id}>{c.name}</option>)}
    </select>
  )
};