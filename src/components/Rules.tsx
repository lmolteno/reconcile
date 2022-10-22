import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../db";
import {FaPlus, FaTrash} from "react-icons/fa";
import {useState} from "react";
import {TransactionTable} from "./TransactionTable";
import {CategoryDropdown} from "./CategoryDropdown";

export const Rules = () => {
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleCategory, setNewRuleCategory] = useState<number>();
  const [newRuleRegex, setNewRuleRegex] = useState("");
  const rules = useLiveQuery(() => db.rules.toArray()) || [];
  const categories = useLiveQuery(() => db.categories.toArray()) || [];
  let re = new RegExp('', 'g');
  let invalidRegexp = false;
  try {
    re = new RegExp(newRuleRegex, 'g');
    invalidRegexp = false;
  } catch {
    invalidRegexp = true;
  }

  const transactions = useLiveQuery(() => (db.transactions.orderBy('date').toArray())) || [];

  const currentFilteredTransactions = transactions.filter(t => t.description?.match(re) && rules.every(r => !t.description?.match(new RegExp(r.regex, 'g'))));

  const addRule = async () => {
    if (!newRuleCategory || invalidRegexp || !newRuleName.length) return;
    await db.rules.add({name: newRuleName, categoryId: newRuleCategory, regex: newRuleRegex})
    setNewRuleName("");
    setNewRuleRegex("");
  };

  const removeRule = async (id?: number) => {
    if (id) await db.rules.delete(id);
  }

  return (
    <fieldset className={"content-container"}>
      <legend>Rules</legend>
      <fieldset className={"border p-3 border-slate-300 mt-[-0.5em]"}>
        <legend className={"text-lg"}>New Rule</legend>
        <div className={"flex space-x-5 justify-between pb-3"}>
          <input
            type="text"
            inputMode="text"
            className={"w-full cursor-pointer p-2"}
            placeholder={"Rule Name"}
            value={newRuleName}
            onChange={e => setNewRuleName(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === 'Enter') await addRule()
            }}/>
          <p className={"my-auto"}>matching</p>
          <input
            type="text"
            inputMode="text"
            className={`w-full cursor-pointer p-2 ${invalidRegexp && 'bg-red-200'}`}
            placeholder={"Rule Regex"}
            value={newRuleRegex}
            onChange={e => setNewRuleRegex(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === 'Enter') await addRule()
            }}/>
          <p className={"my-auto"}>to</p>
          <CategoryDropdown onChange={setNewRuleCategory}/>
          <button onClick={addRule} disabled={invalidRegexp || !newRuleCategory || !newRuleName.length}
                  className={"pr-2"}><FaPlus className={"fill-jet"}/></button>
        </div>

        <TransactionTable data={currentFilteredTransactions}/>
      </fieldset>

      <div className={"flex flex-col divide-y-2 border-t-2 border-persian my-3"}>
        {rules?.map((r, idx) => {
          const filteredTransactions = transactions.filter(t => t.description?.match(new RegExp(r.regex, 'g')));
          const category = categories.find(c => c.id == r.categoryId);
          if (!category) return;
          return (
            <div key={idx}
                 className={"container grid grid-cols-10 transition duration-50 hover:bg-slate-100 p-2 justify-between auto-cols-fr"}>
              <h2 className={"text-xl col-span-4"}>{r.name}</h2>
              <h2 className={"text-xl text-secondary col-span-5"}>
                {filteredTransactions.length} Transactions
                to <span
                style={{color: category.color}}>{category.name}</span> ({filteredTransactions.reduce((p, c) => p + c.amount, 0).toFixed(2)})
              </h2>
              <button className={"w-6 justify-self-end mr-3"}><FaTrash className={"fill-jet cursor-pointer m-2"}
                                                                       onClick={() => removeRule(r.id)}/></button>
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}
