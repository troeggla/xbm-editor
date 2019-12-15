import * as React from "react";
import * as classNames from "classnames";

interface PixelProps {
  filled: boolean;
  onUpdate: () => void;
}

const Pixel: React.FC<PixelProps> = (props) => {
  const { filled, onUpdate } = props;

  return (
    <div
      className={classNames("pixel", { "filled": filled })}
      onClick={onUpdate}
    />
  );
};

export default Pixel;
