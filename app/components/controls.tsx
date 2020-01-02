import * as React from "react";
import { remote, SaveDialogOptions } from "electron";
import { homedir } from "os";

async function getFilename() {
  const dialogOptions: SaveDialogOptions = {
    title: "Save data as",
    defaultPath: homedir() + "/image.xbm",
    buttonLabel: "Choose"
  };

  const result = await remote.dialog.showSaveDialog(
    remote.getCurrentWindow(),
    dialogOptions
  );

  return result.filePath;
}

interface ControlsProps {
  cellSize: number;
  dimensions: [number, number];

  onCellSizeUpdated: (cellSize: number) => void;
  onDimensionsUpdated: (dimensions: [number, number]) => void;
  onGenerateClicked: (filename: string) => void;
}

const Controls: React.FC<ControlsProps> = (props) => {
  const { cellSize, dimensions, onCellSizeUpdated, onDimensionsUpdated, onGenerateClicked } = props;

  const selectFilename = async () => {
    const filename = await getFilename();

    if (filename) {
      onGenerateClicked(filename);
    }
  };

  return (
    <div className="controls">
      <div>
        <label className="input-label">Zoom:</label>
        <input
          type="range"
          className="range"
          value={cellSize}
          min={1}
          max={100}
          onChange={(e) => onCellSizeUpdated(e.target.valueAsNumber)}
        />
      </div>

      <div>
        <label className="input-label">Dimensions:</label>
        <input
          type="number"
          className="input is-small number-input"
          value={dimensions[0]}
          min={1}
          onChange={(e) => onDimensionsUpdated([e.target.valueAsNumber, dimensions[1]])}
        />
        &times;
        <input
          type="number"
          className="input is-small number-input"
          value={dimensions[1]}
          min={1}
          onChange={(e) => onDimensionsUpdated([dimensions[0], e.target.valueAsNumber])}
        />
      </div>

      <div>
        <button className="button is-small" onClick={selectFilename}>
          Export
        </button>
      </div>
    </div>
  );
};

export default Controls;
