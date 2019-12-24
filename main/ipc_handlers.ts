import { ipcMain } from "electron";
import { writeFile } from "fs";

export function setupHandlers() {
  ipcMain.on("save-file", (e, path: string, content: string) => {
    console.log("path:", path);

    writeFile(path, content, (err) => {
      if (err) {
        console.error(err);
      }

      e.reply("save-file-reply", err);
    });
  });
}
