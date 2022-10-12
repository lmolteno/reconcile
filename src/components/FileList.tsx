import { FaTrash } from "react-icons/fa";

export const FileList = ({files, removeFile, forUpload}) => (
  <div className={"content-container divide-y-2"}>
    {files?.map((f, idx) => (
      <div className={"container flex transition duration-50 hover:bg-slate-100 p-2 justify-between"}>
        <h2 className={"text-xl"}>{f.name}</h2>
        <FaTrash className={"fill-jet cursor-pointer m-2"} onClick={() => removeFile(f.name)} />
      </div>))}
    <div className={"container flex transition duration-50 hover:bg-slate-100 justify-between"}>
      <label for={forUpload} className={"w-full cursor-pointer p-2 text-secondary"}>Add more...</label>
    </div>
  </div>
)