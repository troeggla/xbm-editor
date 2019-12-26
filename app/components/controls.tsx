import * as React from "react";
import { remote, SaveDialogOptions } from "electron";
import { homedir } from "os";

const MAX_SCREEN_HEIGHT = 32;
const MAX_SCREEN_WIDTH = 128;

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
  onClearClicked: () => void;
}

const Controls: React.FC<ControlsProps> = (props) => {
  const { cellSize, dimensions, onCellSizeUpdated, onDimensionsUpdated, onGenerateClicked, onClearClicked } = props;

  const selectFilename = async () => {
    const filename = await getFilename();

    if (filename) {
      onGenerateClicked(filename);
    }
  };

  return (
    <div className="controls">
      <div>
        <label className="input-label">Cell size:</label>
        <input
          type="number"
          className="input is-small number-input"
          value={cellSize}
          min={0}
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
          max={MAX_SCREEN_WIDTH}
          onChange={(e) => onDimensionsUpdated([e.target.valueAsNumber, dimensions[1]])}
        />
        &times;
        <input
          type="number"
          className="input is-small number-input"
          value={dimensions[1]}
          min={1}
          max={MAX_SCREEN_HEIGHT}
          onChange={(e) => onDimensionsUpdated([dimensions[0], e.target.valueAsNumber])}
        />
      </div>

      <div>
        <button className="button is-small"  style={{ marginRight: 10 }} onClick={onClearClicked}>
          Clear
        </button>
        <button className="button is-small" onClick={selectFilename}>
          Export
        </button>
      </div>
    </div>
  );
};

export default Controls;
