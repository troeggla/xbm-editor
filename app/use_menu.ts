import { ipcRenderer } from "electron";
import { useEffect, useRef } from "react";

import { initGrid, getGridDimensions } from "./util";
import { generateXBM, readXBM } from "xbm";

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
    const err = await ipcRenderer.invoke(
      "save-file", generateXBM("image", grid, true)
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
  const compactGrid = grid.map((col) => {
    return col.map((x) => (x) ? 1 : 0);
  });

  const err = await ipcRenderer.invoke(
    "save-file", JSON.stringify(compactGrid)
  ) as NodeJS.ErrnoException | undefined;

  if (err) {
    alert("Could not save file: " + err.message);
    return grid;
  }

  alert("File saved successfully!");
  return grid;
};

const loadGrid: GridTransformation = async (grid) => {
  const [err, content, path] = await ipcRenderer.invoke(
    "open-file"
  ) as [NodeJS.ErrnoException, string, string];

  if (err) {
    alert("Could not open file");
    return grid;
  }

  if (path.endsWith("xbme")) {
    return JSON.parse(content) as boolean[][];
  } else {
    try {
      return readXBM(content);
    } catch (e) {
      alert(e);
      return grid;
    }
  }
};

function useMenu(grid: boolean[][], setGrid: (grid: boolean[][]) => void) {
  const gridRef = useRef<boolean[][]>(grid);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  useEffect(() => {
    ipcRenderer.on("menu-item-clicked", async (_, itemId: string) => {
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
      ipcRenderer.removeAllListeners("menu-item-clicked");
    };
  }, []);

}

export default useMenu;
