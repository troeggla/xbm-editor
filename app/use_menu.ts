import { useEffect, useRef } from "react";
import { ipcRenderer as ipc } from "electron-better-ipc";

import { initGrid, getGridDimensions } from "./util";

type GridTransformation = (grid: boolean[][]) => boolean[][];

const invertGrid: GridTransformation = (grid) => {
  return grid.map((col) => {
    return col.map((pixel) => !pixel);
  });
};

const clearGrid: GridTransformation = (grid) => {
  return initGrid(getGridDimensions(grid));
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
