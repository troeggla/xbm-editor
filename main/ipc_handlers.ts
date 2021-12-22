import { ipcMain, dialog } from "electron";
import { writeFile, readFile } from "fs";
import { homedir } from "os";
import { join } from "path";

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
  ipcMain.handle("save-file", async (_, filename: string, content: string) => {
    const result = await dialog.showSaveDialog({
      title: "Save as",
      buttonLabel: "Choose",
      defaultPath: join(homedir(), filename)
    });

    if (result.canceled) {
      return;
    }

    try {
      await writeFilePromise(result.filePath!, content);
    } catch (err) {
      return err;
    }
  });

  ipcMain.handle("open-file", async (_) => {
    const result = await dialog.showOpenDialog({
      title: "Open",
      filters: [{
        name: "XBM Editor files, XBM files, Header files",
        extensions: ["xbme", "xbm", "h"]
      }]
    });

    if (result.canceled) {
      return;
    }

    const openPath = result.filePaths[0];

    try {
      return [null, await readFilePromise(openPath), openPath];
    } catch (err) {
      return [err, null];
    }
  });
}
