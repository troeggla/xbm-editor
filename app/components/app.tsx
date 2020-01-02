import * as React from "react";
import { useState } from "react";
import { basename } from "path";
import { ipcRenderer as ipc } from "electron-better-ipc";

import { generateXBM } from "../generate_xbm";
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
