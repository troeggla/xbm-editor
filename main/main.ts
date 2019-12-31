import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from "electron";
import { ipcMain as ipc } from "electron-better-ipc";

import * as path from "path";
import * as url from "url";

import { setupHandlers } from "./ipc_handlers";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null;

function launchMenuAction(itemId: string) {
  ipc.callFocusedRenderer("menu-item-clicked", itemId);
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    title: app.getName(),
    titleBarStyle: "hidden",
    icon: __dirname + "/icon.icns",
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
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forcereload" },
      { role: "toggledevtools" },
      { type: "separator" },
      { role: "resetzoom" },
      { role: "zoomin" },
      { role: "zoomout" },
      { type: "separator" },
      { role: "togglefullscreen" }
    ] as Array<MenuItemConstructorOptions>
  }, {
    label: "Edit",
    submenu: [
      { click: launchMenuAction.bind(null, "invert"), label: "Invert" },
      { click: launchMenuAction.bind(null, "clear"), label: "Clear" }
    ]
  }];

  if (process.platform === "darwin") {
    menuTemplate.unshift({
      label: app.getName(),
      submenu: [
        {role: "about"},
        {type: "separator"},
        {role: "services", },
        {type: "separator"},
        {role: "hide"},
        {role: "hideothers"},
        {role: "unhide"},
        {type: "separator"},
        {role: "quit"}
      ] as Array<MenuItemConstructorOptions>
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
