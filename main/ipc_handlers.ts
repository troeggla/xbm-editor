import { ipcMain as ipc } from "electron-better-ipc";
import { writeFile } from "fs";

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

export function setupHandlers() {
  ipc.answerRenderer("save-file", async ([ path, content ]: Array<string>) => {
    console.log("path:", path);

    try {
      await writeFilePromise(path, content);
    } catch (err) {
      return err;
    }
  });
}
