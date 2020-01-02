import { useEffect, useRef } from "react";
import { ipcRenderer as ipc } from "electron-better-ipc";

import { initGrid, getGridDimensions } from "./util";

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
          return setGrid(grid.map((col) => {
            return col.map((pixel) => !pixel);
          }));
        case "clear":
          return setGrid(initGrid(getGridDimensions(grid)));
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
