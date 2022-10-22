import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../db";
import {FaPlus, FaTrash} from "react-icons/fa";
import {useState} from "react";
import {genRandomColour} from "../utils";

export const Categories = () => {
  const [newCategoryName, setNewCategoryName] = useState("");
  let categories: Category[] = [];
  try {
    categories = useLiveQuery(() => db.categories.toArray()) || [];
  } catch {
  }

  const addCategory = async () => {
    await db.categories.add({name: newCategoryName, color: genRandomColour()})
    setNewCategoryName("");
  };

  const removeCategory = async (id?: number) => {
    if (id) await db.categories.delete(id);
  }

  const recolorCategory = async (id: number, color: string) => await db.categories.where({id}).modify({color});

  return (
    <fieldset className={"content-container"}>
      <legend>Categories</legend>
      <div className={"flex flex-col divide-y-2"}>
        {categories?.map((c, idx) => (
          <div key={idx} className={"container flex transition duration-50 hover:bg-slate-100 p-2 justify-between"}>
            <input type={'color'} value={c.color} onChange={(e) => recolorCategory(c.id!, e.target.value)}/>
            <h2 className={"text-xl"}>{c.name}</h2>
            <FaTrash className={"fill-jet cursor-pointer m-2"} onClick={() => removeCategory(c.id)}/>
          </div>
        ))}
        <div className={"container flex space-x-5 justify-between p-3"}>
          <input
            type="text"
            inputMode="text"
            className={"w-full cursor-pointer p-2"}
            placeholder={"Add more..."}
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === 'Enter') await addCategory()
            }}/>
          <button onClick={addCategory}><FaPlus className={"fill-secondary"}/></button>
        </div>
      </div>
    </fieldset>
  )
}