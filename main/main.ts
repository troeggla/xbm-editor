import { app, BrowserWindow, Menu, MenuItemConstructorOptions, webContents } from "electron";

import * as path from "path";
import * as url from "url";

import { setupHandlers } from "./ipc_handlers";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null;

function launchMenuAction(itemId: string) {
  const renderer = webContents.getFocusedWebContents();

  if (renderer) {
    console.log("Calling renderer with item", itemId);
    renderer.send("menu-item-clicked", itemId);
  }
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    title: app.name,
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "../index.html"),
    protocol: "file:",
    slashes: true
  }));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  let menuTemplate: Array<MenuItemConstructorOptions> = [{
    label: "File",
    submenu: [
      { click: launchMenuAction.bind(null, "open"), label: "Open", accelerator: "CmdOrCtrl+O" },
      { click: launchMenuAction.bind(null, "save"), label: "Save", accelerator: "CmdOrCtrl+S" },
      { type: "separator" },
      { click: launchMenuAction.bind(null, "export"), label: "Export" }
    ]
  }, {
    label: "Edit",
    submenu: [
      { click: launchMenuAction.bind(null, "invert"), label: "Invert", accelerator: "CmdOrCtrl+I" },
      { click: launchMenuAction.bind(null, "clear"), label: "Clear" }
    ]
  }, {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "togglefullscreen" }
    ]
  }];

  if (process.platform === "darwin") {
    menuTemplate.unshift({
      label: app.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  setupHandlers();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
