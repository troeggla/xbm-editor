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
    const [err, status] = await window.menuHandler.saveFile(
      "image.xbm",
      generateXBM("image", grid, true)
    );

    if (err) {
      alert("Could not export file: " + err.message);
      return;
    }

    if (status == "success") {
      alert("File exported successfully!");
    }
  })();

  return grid;
};

const saveGrid: GridTransformation = async (grid) => {
  const compactGrid = grid.map((col) => {
    return col.map((x) => (x) ? 1 : 0);
  });

  const [err, status] = await window.menuHandler.saveFile(
    "image.xbme",
    JSON.stringify(compactGrid)
  );

  if (err) {
    alert("Could not save file: " + err.message);
  }

  if (status == "success") {
    alert("File saved successfully!");
  }

  return grid;
};

const loadGrid: GridTransformation = async (grid) => {
  const [err, content, path] = await window.menuHandler.openFile();

  if (err) {
    alert("Could not open file");
    return grid;
  }

  if (path == null) {
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
    window.menuHandler.onMenuItemClicked(async (itemId: string) => {
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
      window.menuHandler.clearMenuListeners();
    };
  }, []);

}

export default useMenu;
