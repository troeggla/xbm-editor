import * as React from "react";

async function getFilename() {
}

interface ControlsProps {
  cellSize: number;
  dimensions: [number, number];

  onCellSizeUpdated: (cellSize: number) => void;
  onDimensionsUpdated: (dimensions: [number, number]) => void;
}

const Controls: React.FC<ControlsProps> = (props) => {
  const { cellSize, dimensions, onCellSizeUpdated, onDimensionsUpdated } = props;

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
    </div>
  );
};

export default Controls;
