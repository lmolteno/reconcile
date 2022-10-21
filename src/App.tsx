import './App.css'
import {ChangeEvent, useState} from "react";
import Papa from "papaparse";
import {FileList} from "./components/FileList";
import {MergeFiles} from "./components/MergeFiles";
import {ReconcileTransactions} from "./components/ReconcileTransactions";
import {Categories} from "./components/Categories";
import {db} from "./db";
import {Rules} from "./components/Rules";
import {ColouredTransactionTable} from "./components/ColouredTransactionTable";
import {Summary} from "./components/Summary";
import {useLiveQuery} from "dexie-react-hooks";
import {cssTransition, Slide, toast, ToastContainer} from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';

enum Step {
  UPLOAD,
  MANAGE,
  CATEGORIES,
  RULES,
  RECONCILE,
  ALL,
  SUMMARY
}

const App = () => {
  const [step, setStep] = useState<Step>(Step.UPLOAD);
  const pastDataExists = useLiveQuery(() => db.transactions.count());
  const importedFiles = useLiveQuery(() => db.files.toArray()) || [];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const filesArray = Array.from(e.target.files);
      filesArray.filter(f => importedFiles?.every(impF => impF.name !== f.name)) // Ignore already imported files
        .forEach(readData)
    }
  }

  const readData = (f: File) => {
    Papa.parse(f, {
      header: true, complete: results => {
        const importedFile: ImportedFile = {
          name: f.name,
          rawData: results.data,
          // @ts-ignore
          columns: Object.keys(results.data[0])
        }
        db.files.add(importedFile);
      }
    });
  }

  return (
    <>
      <div className="container max-w-screen-xl min-h-screen mx-auto flex flex-col py-5">
        <div className="container my-auto flex flex-col align-content-center space-y-8">
          <h1 className={`text-center text-8xl font-barlow text-jet pb-5`}>
            RECONCILE
          </h1>
          {importedFiles?.length ?
            <div className={"grid grid-cols-fill-40 gap-4"}>
              <button className="btn-green w-100" onClick={() => setStep(Step.UPLOAD)}
                      disabled={step == Step.UPLOAD}>Upload Files
              </button>
              <button className="btn-green w-100" onClick={() => setStep(Step.MANAGE)}
                      disabled={step == Step.MANAGE}>Manage Files
              </button>
              <button className="btn-green w-100" onClick={() => setStep(Step.CATEGORIES)}
                      disabled={step == Step.CATEGORIES || !pastDataExists}>Categories
              </button>
              <button className="btn-green w-100" onClick={() => setStep(Step.RULES)}
                      disabled={step == Step.RULES || !pastDataExists}>Rules
              </button>
              <button className="btn-green w-100" onClick={() => setStep(Step.RECONCILE)}
                      disabled={step == Step.RECONCILE || !pastDataExists}>Reconcile
              </button>
              <button className="btn-green w-100" onClick={() => setStep(Step.ALL)}
                      disabled={step == Step.ALL || !pastDataExists}>All Transactions
              </button>
              <button className="btn-green w-100" onClick={() => setStep(Step.SUMMARY)}
                      disabled={step == Step.SUMMARY || !pastDataExists}>Summary
              </button>
            </div> : <><h2 className="text-2xl text-center transition-all">A simple tool for reconciling and categorising
              transactions.</h2>
            <label htmlFor="csv-upload" className="btn-green cursor-pointer">Upload your statements</label></>
          }
          {[!importedFiles?.length && !pastDataExists ? <></> :
            <FileList forUpload={"csv-upload"}/>,
            <MergeFiles/>,
            <Categories/>,
            <Rules/>,
            <ReconcileTransactions/>,
            <ColouredTransactionTable/>,
            <Summary/>
          ][step]
          }

          <input onChange={handleFileChange}
                 type="file"
                 id="csv-upload"
                 className="hidden"/>
        </div>
      </div>
      <ToastContainer
        transition={FastSlide}
        autoClose={1000}
        hideProgressBar={true}
      />
    </>
  )
}

const FastSlide = cssTransition({
  enter: 'toast_animate Toastify__slide-enter',
  exit: 'toast_animate Toastify__slide-exit',
  collapseDuration: 300,
  appendPosition: true
})

export default App
