import { contextBridge, ipcRenderer } from "electron";

async function openFile() {
  return await ipcRenderer.invoke(
    "open-file"
  ) as [NodeJS.ErrnoException | null, string, string];
}

async function saveFile(name: string, content: string) {
  return await ipcRenderer.invoke(
    "save-file", name, content
  ) as [NodeJS.ErrnoException | null, "success" | "cancelled"];
}

function onMenuItemClicked(callback: (itemId: string) => void) {
  ipcRenderer.on("menu-item-clicked", (_, itemId: string) => {
    callback(itemId);
  });
}

function clearMenuListeners() {
  ipcRenderer.removeAllListeners("menu-item-clicked");
}

contextBridge.exposeInMainWorld("menuHandler", {
  openFile,
  saveFile,
  onMenuItemClicked,
  clearMenuListeners
});
