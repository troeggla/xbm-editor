import { useEffect, useRef } from "react";
import { ipcRenderer as ipc } from "electron-better-ipc";
import { basename } from "path";
import { homedir } from "os";

import { initGrid, getGridDimensions, showSaveDialog, showOpenDialog } from "./util";
import { generateXBM, readXBM } from "./xbm_utils";

type GridTransformation = (grid: boolean[][]) => boolean[][] | Promise<boolean[][]>;

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

const saveGrid: GridTransformation = async (grid) => {
  const path = await showSaveDialog(homedir() + "/image.xbme");
  if (!path) {
    return grid;
  }

  const compactGrid = grid.map((col) => {
    return col.map((x) => (x) ? 1 : 0);
  });

  const err = await ipc.callMain(
    "save-file",
    [ path, JSON.stringify(compactGrid) ]
  ) as NodeJS.ErrnoException | undefined;

  if (err) {
    alert("Could not save file: " + err.message);
    return grid;
  }

  alert("File saved successfully!");
  return grid;
};

const loadGrid: GridTransformation = async (grid) => {
  const path = await showOpenDialog(homedir());

  if (!path) {
    return grid;
  }

  const [err, content] = await ipc.callMain(
    "open-file", path
  ) as [NodeJS.ErrnoException, string];

  if (err) {
    alert("Could not open file at " + path);
    return grid;
  }

  if (path.endsWith("xbme")) {
    return JSON.parse(content) as boolean[][];
  } else {
    return readXBM(content) || grid;
  }
};

function useMenu(grid: boolean[][], setGrid: (grid: boolean[][]) => void) {
  const gridRef = useRef<boolean[][]>(grid);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  useEffect(() => {
    const unregister = ipc.answerMain("menu-item-clicked", async (itemId: string) => {
      console.log("Menu item clicked:", itemId);
      const grid = gridRef.current;

      switch (itemId) {
        case "invert":
          setGrid(await invertGrid(grid));
          break;
        case "clear":
          setGrid(await clearGrid(grid));
          break;
        case "export":
          setGrid(await exportGrid(grid));
          break;
        case "save":
          setGrid(await saveGrid(grid));
          break;
        case "open":
          setGrid(await loadGrid(grid));
          break;
      }
    });

    return () => {
      unregister();
    };
  }, []);

}

export default useMenu;
