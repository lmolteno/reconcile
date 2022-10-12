import './App.css'
import {ChangeEvent, useState} from "react";
import Papa from "papaparse";
import {FileList} from "./components/FileList";
import {MergeFiles} from "./components/MergeFiles";

function App() {
  const [files, setFiles] = useState<File[]>();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<UnmergedData[]>();

  console.log(data);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files.length) {
      const filesArray = Array.from(e.target.files);
      setFiles(files?.concat(...filesArray) || filesArray);
    }
  }

  const parseFile = async (target) => {
    const csv = Papa.parse(target.result, { header: true });
    const parsedData = csv?.data;
    return parsedData;
  }

  const advance = () => {
    setData([]);
    if (step === 0) {
      console.log("Reading files");
      const reader = new FileReader();
      files?.forEach(f => {
        reader.onload = async ({target}) => {
          const parsedData = await parseFile(target);
          const newDataObject: UnmergedData = {
            name: f.name,
            data: parsedData,
            columns: Object.keys(parsedData)
          };
          setData([...data, newDataObject]);
        }
        reader.readAsText(f);
      });
    }
    setStep(step + 1);

  };


  const removeFile = (fname: string) => {
    setFiles(files?.filter(f => f.name != fname));
  }
  return (
    <div className="container h-screen mx-auto flex flex-col">
      <div className="container my-auto flex flex-col align-content-center space-y-8">
        <h1 className={`text-center text-8xl font-barlow text-jet transition-margin duration-500 ease-in-out`}>
          RECONCILE
        </h1>
        {[!files?.length ?
          <h2 className="text-2xl text-center transition-all">A simple tool for reconciling and categorising transactions.</h2> :
          <FileList files={files} removeFile={removeFile} forUpload={"csv-upload"} />,
          data?.length ? <MergeFiles file={data[0]} /> : <p>Loading...</p>
         ][step]
        }

        { files?.length ?
          <button className="btn-green" onClick={advance}>Next</button> :
          <label for="csv-upload" className="btn-green cursor-pointer">Upload your statements</label>
        }
        <input onChange={handleFileChange}
               type="file"
               id="csv-upload"
               className="hidden" />
      </div>
      <button onClick={() => setStep(0)} className={"btn-green"}>Reset to step 0 (step {step})</button>
    </div>
  )
}

export default App
