import { useState } from "react";
import { IFile } from "../types";
import { open } from "@tauri-apps/plugin-dialog";
import NavFiles from "./NavFiles";
import { readDirectory, createProject } from "../helpers/filesys";
import { readDir, BaseDirectory } from "@tauri-apps/plugin-fs";
import { debug } from "@tauri-apps/plugin-log";
import { invoke } from "@tauri-apps/api/core";
import { platform } from "@tauri-apps/plugin-os";
import { warn } from "@tauri-apps/plugin-log";
import { IconButton } from "@radix-ui/themes";
import {
  PinLeftIcon,
  PinRightIcon,
  OpenInNewWindowIcon,
  DownloadIcon,
  PlusIcon,
} from "@radix-ui/react-icons";

export default function Sidebar() {
  const [projectName, setProjectName] = useState("undefined");
  const [files, setFiles] = useState<IFile[]>([]);
  const [isExpanded, setIsExpanded] = useState(true); // State for sidebar width
  const currentPlatform = platform();

  const loadFile = async () => {
    if (currentPlatform == "android" || currentPlatform == "ios") {
      warn("Unsupported platform");
      return;
    }

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

  const createNewProject = async () => {
    try {
      const projectName = await createProject();
      setProjectName(projectName);
      // Create a basic project structure
      const entries = await readDir("projectName", {
        baseDir: BaseDirectory.AppData,
      });
      readDirectory(entries + "/").then((files) => {
        console.log(files);
        setFiles(files);
      });
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  return (
    <aside
      id="sidebar"
      className={`h-full bg-darken transition-all duration-300 ${
        isExpanded ? "w-60" : "w-16"
      }`}
    >
      <div className="sidebar-header flex items-center justify-between p-4 py-2.5">
        <IconButton
          className="toggle-sidebar text-white" // Added `text-white` class
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <PinLeftIcon width="18" height="18" />
          ) : (
            <PinRightIcon width="18" height="18" />
          )}
        </IconButton>
      </div>
      {isExpanded && (
        <>
          <div className="sidebar-header items-center justify-between p-4 py-2.5">
            <div className="mb-2 pl-1">
              <IconButton
                className="project-explorer text-white" // Added `text-white` class
                onClick={loadFile}
                title="Open Folder"
              >
                <OpenInNewWindowIcon width="16" height="16" />
              </IconButton>
            </div>
            <div className="mb-2 pl-1">
              <IconButton
                className="project-explorer text-white" // Added `text-white` class
                onClick={cloneRepository}
                title="Clone Repository"
              >
                <DownloadIcon width="16" height="16" />
              </IconButton>
            </div>
            <div className="mb-2 pl-1">
              <IconButton
                className="project-explorer text-white" // Added `text-white` class
                onClick={createNewProject}
                title="New Project"
              >
                <PlusIcon width="16" height="16" />
              </IconButton>
            </div>
          </div>
          <div className="menu-section">
            <div className="menu-header cursor-pointer p-2 bg-gray-700 text-white">
              {projectName}
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
