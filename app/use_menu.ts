import { useEffect, useRef } from "react";
import { ipcRenderer as ipc } from "electron-better-ipc";
import { basename } from "path";
import { homedir } from "os";

import { initGrid, getGridDimensions, showSaveDialog } from "./util";
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
    const path = await showSaveDialog(homedir() + "/image.xbm");

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

const saveGrid: GridTransformation = (grid) => {
  (async () => {
    const path = await showSaveDialog(homedir() + "/image.xbme");
    if (!path) {
      return;
    }

    const compactGrid = grid.map((col) => {
      return col.map((x) => (x) ? 1 : 0)
    });

    const err = await ipc.callMain(
      "save-file",
      [ path, JSON.stringify(compactGrid) ]
    ) as NodeJS.ErrnoException | undefined;

    if (err) {
      alert("Could not save file: " + err.message);
      return;
    }

    alert("File saved successfully!");
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
        case "save":
          return setGrid(saveGrid(grid));
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
