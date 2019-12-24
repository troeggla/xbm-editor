import * as React from "react";
import { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import { basename } from "path";

import { generateXBM } from "../generate_xbm";

import Canvas from "./canvas";
import Controls from "./controls";

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
  const [dimensions, setDimensions] = useState<[number, number]>([32, 32]);
  const [grid, setGrid] = useState<boolean[][]>(initGrid(dimensions));
  const [cellSize, setCellSize] = useState<number>(20);

  useEffect(() => {
    ipcRenderer.on("save-file-reply", (_, err: NodeJS.ErrnoException | null) => {
      if (err) {
        alert("Could not save file: " + err.message);
        return;
      }

      alert("File saved successfully!");
    });
  }, []);

  const updateDimensions = (dimensions: [number, number]) => {
    setDimensions(dimensions);
    setGrid(initGrid(dimensions, grid));
  };

  const generateOutputFile = (path: string) => {
    const name = basename(path).split(".")[0];

    ipcRenderer.send(
      "save-file",
      path,
      generateXBM(name, grid)
    );
  };

  return (
    <div id="app">
      <Controls
        cellSize={cellSize}
        dimensions={dimensions}
        onCellSizeUpdated={setCellSize}
        onDimensionsUpdated={updateDimensions}
        onGenerateClicked={generateOutputFile}
        onClearClicked={() => setGrid(initGrid(dimensions))}
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
