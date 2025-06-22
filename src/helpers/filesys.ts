import { invoke } from "@tauri-apps/api/core";
import { nanoid } from "nanoid";
import { saveFileObject } from "../stores/file";
import { IFile } from "../types";

export const readFile = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    invoke("get_file_content", { filePath })
      .then((message: unknown) => {
        resolve(message as string);
      })
      .catch((error) => reject(error));
  });
};

export const writeFile = (
  filePath: string,
  content: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    invoke("write_file", { filePath, content }).then((message: unknown) => {
      if (message === "OK") {
        resolve(message as string);
      } else {
        reject("ERROR");
      }
    });
  });
};

export const readDirectory = (folderPath: string): Promise<IFile[]> => {
  return new Promise((resolve, _reject) => {
    invoke("open_folder", { folderPath }).then((message: unknown) => {
      const mess = message as string;
      const files = JSON.parse(mess.replace(/\\/g, "/").replace(/\/\//g, "/"));
      const entries: IFile[] = [];
      const folders: IFile[] = [];

      if (!files || !files.length) {
        resolve(entries);
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const id = nanoid();
        const entry: IFile = {
          id,
          kind: file.kind,
          name: file.name,
          path: file.path,
        };

        if (file.kind === "file") {
          entries.push(entry);
        } else {
          folders.push(entry);
        }

        saveFileObject(id, entry);
      }

      resolve([...folders, ...entries]);
    });
  });
};

export const createProject = (projectPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    invoke("create_project", { projectPath })
      .then((message: unknown) => {
        const result = message as string;
        if (result === "OK") {
          resolve(result);
        } else {
          reject("Failed to create project");
        }
      })
      .catch((error) => reject(error));
  });
};
