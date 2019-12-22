import * as React from "react";
import { useEffect, useRef } from "react";

function getCanvasPosition(canvas: HTMLCanvasElement, mouseEvent: MouseEvent): [number, number] {
  const { top, left } = canvas.getBoundingClientRect();

  return [
    mouseEvent.clientX - left,
    mouseEvent.clientY - top
  ];
}

interface CanvasProps {
  grid: boolean[][];
  cellSize: number;
}

const Canvas: React.FC<CanvasProps> = (props) => {
  const { grid , cellSize } = props;
  const [width, height] = [grid.length * cellSize, grid[0].length * cellSize];

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "transparent";
    ctx.clearRect(0, 0, width, height);

    grid.forEach((col, x) => {
      col.forEach((cell, y) => {
        if (cell) {
          ctx.fillStyle = "#008577";
        } else {
          ctx.fillStyle = "transparent";
        }

        ctx.fillRect(
          x * cellSize,
          y * cellSize,
          cellSize,
          cellSize
        );

        ctx.strokeStyle = "#E2E2E2";
        ctx.strokeRect(
          x * cellSize,
          y * cellSize,
          cellSize,
          cellSize
        );
      });
    });

    let mouseDown = false;
    let lastPos: [number, number];

    canvas.onmousedown = (e) => {
      mouseDown = true;
      lastPos = getCanvasPosition(canvas, e);
    };

    canvas.onmousemove = (e) => {
      if (mouseDown) {
        ctx.beginPath();
        ctx.strokeStyle = "#008577";

        ctx.moveTo(...lastPos);
        lastPos = getCanvasPosition(canvas, e);
        ctx.lineTo(...lastPos);

        ctx.stroke();
      }
    };

    canvas.onmouseup = () => {
      mouseDown = false;
    };
  }, [grid]);

  return (
    <canvas
      style={{ border: "1px solid #E2E2E2" }}
      width={width}
      height={height}
      ref={canvasRef}
    />
  );
};

export default Canvas;
