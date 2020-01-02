import * as React from "react";
import { useState } from "react";

import { initGrid, getGridDimensions } from "../util";
import useMenu from "../use_menu";

import Canvas from "./canvas";
import Controls from "./controls";

const App: React.FC = () => {
  const [grid, setGrid] = useState<boolean[][]>(initGrid([32, 32]));
  const [cellSize, setCellSize] = useState<number>(20);

  useMenu(grid, setGrid);

  const updateDimensions = (dimensions: [number, number]) => {
    setGrid(initGrid(dimensions, grid.slice()));
  };

  return (
    <div id="app">
      <Controls
        cellSize={cellSize}
        dimensions={getGridDimensions(grid)}
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
