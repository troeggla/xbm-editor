import { ipcMain } from "electron";

export function setupHandlers() {
  ipcMain.on("save-file", (e, filename: string, content: string) => {
    console.log("filename:", filename);
    console.log(content);

    e.reply("save-file-reply", true);
  });
}
