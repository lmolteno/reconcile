import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../db";
import {ChangeEvent, useState} from "react";

interface CategoryDropdownProps {
  onChange: (cId: number) => void,
  value?: number
}

export const CategoryDropdown = ({onChange, value}:CategoryDropdownProps) => {
  const categories = useLiveQuery(() => db.categories.toArray()) || [];
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newVal = parseInt(e.target.value);
    if (newVal >= 0) onChange(newVal);
    setVal(newVal);
  }
  const [val, setVal] = useState(value);
  return (
    <select onChange={handleChange} value={val}>
      <option value={-1}>Category...</option>
      {categories.map((c, idx) => <option key={idx} value={c.id}>{c.name}</option>)}
    </select>
  )
};