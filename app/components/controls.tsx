import * as React from "react";

interface ControlsProps {
  cellSize: number;
  dimensions: [number, number];

  onCellSizeUpdated: (cellSize: number) => void;
  onDimensionsUpdated: (dimensions: [number, number]) => void;
}

const Controls: React.FC<ControlsProps> = (props) => {
  const { cellSize, dimensions, onCellSizeUpdated, onDimensionsUpdated } = props;

  const onChange = (dimension: "x" | "y", e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;

    if (!Number.isNaN(value) && value > 0) {
      if (dimension == "x") {
        onDimensionsUpdated([e.target.valueAsNumber, dimensions[1]]);
      } else {
        onDimensionsUpdated([dimensions[0], e.target.valueAsNumber]);
      }
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
          onChange={onChange.bind(null, "x")}
        />
        &times;
        <input
          type="number"
          className="input is-small number-input"
          value={dimensions[1]}
          min={1}
          onChange={onChange.bind(null, "y")}
        />
      </div>
    </div>
  );
};

export default Controls;
