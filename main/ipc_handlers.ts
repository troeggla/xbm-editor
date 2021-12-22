import { ipcMain } from "electron";
import { writeFile, readFile } from "fs";

function writeFilePromise(path: string, content: string): Promise<void> {
  return new Promise((resolve, reject) => {
    writeFile(path, content, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function readFilePromise(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    readFile(path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString("utf-8"));
      }
    });
  });
}

export function setupHandlers() {
  ipcMain.handle("save-file", async (_, path: string, content: string) => {
    console.log("path:", path);

    try {
      await writeFilePromise(path, content);
    } catch (err) {
      return err;
    }
  });

  ipcMain.handle("open-file", async (_, path: string) => {
    try {
      return [null, await readFilePromise(path)];
    } catch (err) {
      return [err, null];
    }
  });
}
