import { ipcMain as ipc } from "electron-better-ipc";
import { writeFile, readFile } from "fs";

function writeFilePromise(path: string, content: string) {
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

function readFilePromise(path: string) {
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
  ipc.answerRenderer("save-file", async ([ path, content ]: Array<string>) => {
    console.log("path:", path);

    try {
      await writeFilePromise(path, content);
    } catch (err) {
      return err;
    }
  });

  ipc.answerRenderer("open-file", async (path: string) => {
    try {
      return [null, await readFilePromise(path)];
    } catch (err) {
      return [err, null];
    }
  });
}
