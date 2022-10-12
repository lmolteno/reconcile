import './App.css'
import {ChangeEvent, useState} from "react";
import Papa from "papaparse";
import {FileList} from "./components/FileList";
import {MergeFiles} from "./components/MergeFiles";
import {ReconcileTransactions} from "./components/ReconcileTransactions";
import {Categories} from "./components/Categories";
import {filterData, transformKiwibank} from "./utils";
import {db} from "./db";
import {Rules} from "./components/Rules";

const App = () => {
  const [files, setFiles] = useState<File[]>();
  const [step, setStep] = useState(0);
  const [pastDataExists, setPastDataExists] = useState(false);
  const [unmergedData, setUnmergedData] = useState<UnmergedData[]>();
  const [excluded, setExcluded] = useState<RegExp>();

  db.transactions.count().then(c => {
    if (c > 0) setPastDataExists(true);
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files.length) {
      const filesArray = Array.from(e.target.files);
      setFiles(files?.concat(...filesArray) || filesArray);
    }
  }

  const parseFile = async (target) => {
    const csv = Papa.parse(target.result, { header: true });
    return csv?.data;
  }

  const readData = () => {
    setUnmergedData([]);
    files?.forEach(f => {
      const reader = new FileReader();
      reader.onload = async ({target}) => {
        const parsedData = await parseFile(target);
        const newDataObject: UnmergedData = {
          name: f.name,
          rawData: parsedData,
          data: transformKiwibank(parsedData),
          columns: Object.keys(parsedData[0])
        };
        setUnmergedData(unmergedData ? [...unmergedData, newDataObject] : [newDataObject]);
      }
      reader.readAsText(f);
    });
  }

  const addToMergedData = async () => {
    if (unmergedData) {
      const filteredData = filterData(unmergedData[0].data, excluded);
      await db.transactions.bulkAdd(filteredData);
      setUnmergedData(unmergedData.splice(1));
    } else {
      setStep(step + 1);
    }
  }

  const advance = async () => {
    console.log(unmergedData, step);
    switch(step) {
      case 0:
        readData();
        setStep(step + 1);
        break;
      case 1:
        if (unmergedData && unmergedData.length !== 0) await addToMergedData();
        else setStep(step + 1);
        break;
      default:
        setStep(step + 1);
    }
  };


  const removeFile = (fname: string) => {
    setFiles(files?.filter(f => f.name != fname));
  }
  return (
    <div className="container min-h-screen mx-auto flex flex-col py-5">
      <div className="container my-auto flex flex-col align-content-center space-y-8">
        <h1 className={`text-center text-8xl font-barlow text-jet transition-margin duration-500 ease-in-out`}>
          RECONCILE
        </h1>
        {[!files?.length && !pastDataExists ?
          <h2 className="text-2xl text-center transition-all">A simple tool for reconciling and categorising transactions.</h2> :
          <FileList files={files} removeFile={removeFile} forUpload={"csv-upload"} />,
          unmergedData?.length && <MergeFiles file={unmergedData[0]} onExcludeChange={setExcluded} />,
          <Categories />,
          <Rules />,
          <ReconcileTransactions />
         ][step]
        }

        { (files?.length || pastDataExists)  ?
          (!pastDataExists ? <button className="btn-green" onClick={advance}>Next</button>
            : <div className={"flex justify-between"}>
              <button className="btn-green w-100" onClick={() => setStep(0)} disabled={step == 0}>Upload Files</button>
              <button className="btn-green w-100" onClick={() => setStep(1)} disabled={step != 0}>Merge Files</button>
              <button className="btn-green w-100" onClick={() => setStep(2)} disabled={step == 2}>Categories</button>
              <button className="btn-green w-100" onClick={() => setStep(3)} disabled={step == 3}>Rules</button>
              <button className="btn-green w-100" onClick={() => setStep(4)} disabled={step == 4}>Reconcile</button>
            </div>) :
          <label htmlFor="csv-upload" className="btn-green cursor-pointer">Upload your statements</label>
        }
        <input onChange={handleFileChange}
               type="file"
               id="csv-upload"
               className="hidden" />
      </div>
    </div>
  )
}

export default App
