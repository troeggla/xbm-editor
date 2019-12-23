import * as React from "react";

const MAX_SCREEN_HEIGHT = 32;
const MAX_SCREEN_WIDTH = 128;

interface ControlsProps {
  cellSize: number;
  dimensions: [number, number];

  onCellSizeUpdated: (cellSize: number) => void;
  onDimensionsUpdated: (dimensions: [number, number]) => void;
  onGenerateClicked: () => void;
  onClearClicked: () => void;
}

const Controls: React.FC<ControlsProps> = (props) => {
  const { cellSize, dimensions, onCellSizeUpdated, onDimensionsUpdated, onGenerateClicked, onClearClicked } = props;

  return (
    <div className="controls">
      <div>
        Cell size:&emsp;
        <input
          type="number"
          value={cellSize}
          min={0}
          onChange={(e) => onCellSizeUpdated(e.target.valueAsNumber)}
        />
      </div>

      <div>
        Dimensions:&emsp;
        <input
          type="number"
          value={dimensions[0]}
          min={1}
          max={MAX_SCREEN_WIDTH}
          onChange={(e) => onDimensionsUpdated([e.target.valueAsNumber, dimensions[1]])}
        />
        <input
          type="number"
          value={dimensions[1]}
          min={1}
          max={MAX_SCREEN_HEIGHT}
          onChange={(e) => onDimensionsUpdated([dimensions[0], e.target.valueAsNumber])}
        />
      </div>

      <div>
        <button onClick={onClearClicked}>
          Clear
        </button>
      </div>

      <div>
        <button onClick={onGenerateClicked}>
          Generate
        </button>
      </div>
    </div>
  );
};

export default Controls;
