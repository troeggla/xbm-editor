import * as React from "react";
import { useState } from "react";

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
  const [cellSize, setCellSize] = useState<number>(15);

  const updateDimensions = (dimensions: [number, number]) => {
    setDimensions(dimensions);
    setGrid(initGrid(dimensions, grid));
  };

  return (
    <div id="app">
      <Controls
        cellSize={cellSize}
        dimensions={dimensions}
        onCellSizeUpdated={setCellSize}
        onDimensionsUpdated={updateDimensions}
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
