import { useEffect, useRef } from "react";
import { remote, SaveDialogOptions } from "electron";
import { ipcRenderer as ipc } from "electron-better-ipc";
import { basename } from "path";
import { homedir } from "os";

import { initGrid, getGridDimensions } from "./util";
import { generateXBM } from "./generate_xbm";

type GridTransformation = (grid: boolean[][]) => boolean[][];

const invertGrid: GridTransformation = (grid) => {
  return grid.map((col) => {
    return col.map((pixel) => !pixel);
  });
};

const clearGrid: GridTransformation = (grid) => {
  return initGrid(getGridDimensions(grid));
};

const exportGrid: GridTransformation = (grid) => {
  (async () => {
    const dialogOptions: SaveDialogOptions = {
      title: "Save data as",
      defaultPath: homedir() + "/image.xbm",
      buttonLabel: "Choose"
    };

    const result = await remote.dialog.showSaveDialog(
      remote.getCurrentWindow(),
      dialogOptions
    );

    const path = result.filePath;

    if (!path) {
      return;
    }

    const name = basename(path).split(".")[0];

    const err = await ipc.callMain(
      "save-file",
      [ path, generateXBM(name, grid) ]
    ) as NodeJS.ErrnoException | undefined;

    if (err) {
      alert("Could not export file: " + err.message);
      return;
    }

    alert("File exported successfully!");
  })();

  return grid;
};

function useMenu(grid: boolean[][], setGrid: (grid: boolean[][]) => void) {
  const gridRef = useRef<boolean[][]>(grid);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  useEffect(() => {
    const unregister = ipc.answerMain("menu-item-clicked", (itemId: string) => {
      console.log("Menu item clicked:", itemId);
      const grid = gridRef.current;

      switch (itemId) {
        case "invert":
          return setGrid(invertGrid(grid));
        case "clear":
          return setGrid(clearGrid(grid));
        case "export":
          return setGrid(exportGrid(grid));
        default:
          return grid;
      }
    });

    return () => {
      unregister();
    };
  }, []);

}

export default useMenu;
