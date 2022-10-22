import {FaTrash} from "react-icons/fa";
import {db} from "../db";
import {useLiveQuery} from "dexie-react-hooks";
import {toast} from "react-toastify";

interface FileListProps {
  forUpload: string
}

export const FileList = ({forUpload}: FileListProps) => {
  const files = useLiveQuery(() => db.files.toArray()) || [];

  const removeFile = async (fId: number) => {
    await db.files
      .where("id").equals(fId)
      .delete();

    await db.transactions
      .where("fileId").equals(fId)
      .delete();

    toast("File deleted")
  };

  return (
    <fieldset className={"content-container"}>
      <legend>Upload Files</legend>
      <div className={"flex-col divide-y-2"}>
        {files?.map((f, idx) => (
          <div key={idx} className={"container flex transition duration-50 hover:bg-slate-100 p-2 justify-between"}>
            <h2 className={"text-xl"}>{f.name}</h2>
            <FaTrash className={"fill-jet cursor-pointer m-2"} onClick={async () => await removeFile(f.id!)}/>
          </div>))}
        <div className={"container flex transition duration-50 hover:bg-slate-100 justify-between"}>
          <label htmlFor={forUpload}
                 className={"w-full cursor-pointer p-2 text-secondary"}>Add {files?.length > 0 ? "more" : "files"}...</label>
        </div>
      </div>
    </fieldset>
  );
}