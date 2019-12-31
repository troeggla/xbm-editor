import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { basename } from "path";
import { ipcRenderer as ipc } from "electron-better-ipc";

import { generateXBM } from "../generate_xbm";

import Canvas from "./canvas";
import Controls from "./controls";

function getGridDimensions<T>(grid: T[][]): [number, number] {
  return [
    grid.length,
    (grid.length === 0) ? 0 : grid[0].length
  ];
}

function initGrid(dimensions: [number, number], initialData: boolean[][] = []): boolean[][] {
  const [width, height] = dimensions;
  const matrix: boolean[][] = [];

  for (let x = 0; x < width; x++) {
    matrix[x] = [];

    for (let y = 0; y < height; y++) {
      matrix[x][y] = false;
    }
  }

  if (initialData.length > 0) {
    const copyWidth = Math.min(width, initialData.length);
    const copyHeight = Math.min(height, initialData[0].length);

    for (let x = 0; x < copyWidth; x++) {
      for (let y = 0; y < copyHeight; y++) {
        matrix[x][y] = initialData[x][y];
      }
    }
  }

  return matrix;
}

const App: React.FC = () => {
  const [grid, setGrid] = useState<boolean[][]>(initGrid([32, 32]));
  const [cellSize, setCellSize] = useState<number>(20);

  const gridRef = useRef(grid);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  useEffect(() => {
    const unregister = ipc.answerMain("menu-item-clicked", (itemId: string) => {
      console.log("Menu item clicked:", itemId);
      const grid = gridRef.current;

      switch (itemId) {
        case "invert":
          setGrid(grid.map((col) => {
            return col.map((pixel) => !pixel);
          }));
      }
    });

    return () => {
      unregister();
    };
  }, []);

  const updateDimensions = (dimensions: [number, number]) => {
    setGrid(initGrid(dimensions, grid.slice()));
  };

  const generateOutputFile = async (path: string) => {
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
  };

  return (
    <div id="app">
      <Controls
        cellSize={cellSize}
        dimensions={getGridDimensions(grid)}
        onCellSizeUpdated={setCellSize}
        onDimensionsUpdated={updateDimensions}
        onGenerateClicked={generateOutputFile}
        onClearClicked={() => setGrid(initGrid(getGridDimensions(grid)))}
      />
      <Canvas
        grid={grid}
        cellSize={cellSize}
        onGridUpdated={setGrid}
      />
    </div>
  );
};

export default App;
