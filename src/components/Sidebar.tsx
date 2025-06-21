import { useState } from "react";
import { IFile } from "../types";
import { open } from "@tauri-apps/plugin-dialog";
import NavFiles from "./NavFiles";
import { readDirectory } from "../helpers/filesys";
import { debug } from "@tauri-apps/plugin-log";
import { invoke } from "@tauri-apps/api/core";

export default function Sidebar() {
  const [projectName, setProjectName] = useState("");
  const [files, setFiles] = useState<IFile[]>([]);
  const [isExpanded, setIsExpanded] = useState(true); // State for sidebar width

  const loadFile = async () => {
    const selected = await open({
      directory: true,
    });

    if (!selected) return;

    setProjectName(selected as string);
    readDirectory(selected + "/").then((files) => {
      console.log(files);
      setFiles(files);
    });
  };

  const cloneRepository = async () => {
    debug(`Cloning repository ${projectName}`);

    await invoke("ssh_clone", {
      repoUrl: "https://github.com/setoelkahfi/personal-website.git",
    });
  };

  return (
    <aside
      id="sidebar"
      className={`h-full bg-darken transition-all duration-300 ${
        isExpanded ? "w-60" : "w-16"
      }`}
    >
      <div className="sidebar-header flex items-center justify-between p-4 py-2.5">
        <button
          className="toggle-sidebar text-white" // Added `text-white` class
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "<" : ">"}
        </button>
      </div>
      {isExpanded && (
        <>
          <div className="sidebar-header items-center justify-between p-4 py-2.5">
            <button className="project-explorer" onClick={loadFile}>
              Open Folder
            </button>
            <button className="project-explorer" onClick={cloneRepository}>
              Clone Repository
            </button>
          </div>
          <div className="menu-section">
            <div className="menu-header cursor-pointer p-2 bg-gray-700 text-white">
              Project Explorer
            </div>
            <div className="menu-content p-2">
              <NavFiles visible={true} files={files} />
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
