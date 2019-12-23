import * as React from "react";

const MAX_SCREEN_HEIGHT = 32;
const MAX_SCREEN_WIDTH = 128;

interface ControlsProps {
  cellSize: number;
  dimensions: [number, number];

  onCellSizeUpdated: (cellSize: number) => void;
  onDimensionsUpdated: (dimensions: [number, number]) => void;
}

const Controls: React.FC<ControlsProps> = (props) => {
  const { cellSize, dimensions, onCellSizeUpdated, onDimensionsUpdated } = props;

  return (
    <div>
      Cell size:&emsp;
      <input
        type="number"
        value={cellSize}
        min={0}
        onChange={(e) => onCellSizeUpdated(e.target.valueAsNumber)}
      />

      <br />

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

      <br />
      <br />
    </div>
  );
};

export default Controls;
