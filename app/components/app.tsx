import * as React from "react";
import { useState } from "react";

import Pixel from "./pixel";

function initMatrix(dimensions: [number, number]): boolean[][] {
  const [width, height] = dimensions;
  const matrix: boolean[][] = [];

  for (let x = 0; x < width; x++) {
    matrix[x] = [];

    for (let y = 0; y < height; y++) {
      matrix[x][y] = false;
    }
  }

  return matrix;
}

const App: React.FC = () => {
  const [dimensions, setDimensions] = useState<[number, number]>([32, 32]);
  const [grid, setGrid] = useState<boolean[][]>(initMatrix(dimensions));

  const togglePixel = (x: number, y: number) => {
    const tmpGrid = grid.slice();
    tmpGrid[x][y] = !tmpGrid[x][y];

    setGrid(tmpGrid);
  };

  const [width, height] = dimensions;
  const gridTemplate = `repeat(${height}, 10px) / repeat(${width}, 10px)`;

  return (
    <div id="app">
      <div style={{ display: "grid", gridTemplate }}>
        {grid.map((col, x) => {
          return col.map((filled, y) => {
            return (
              <Pixel
                key={`${x}.${y}`}
                filled={filled}
                onUpdate={togglePixel.bind(null, x, y)}
              />
            );
          });
        })}
      </div>
    </div>
  );
};

export default App;
