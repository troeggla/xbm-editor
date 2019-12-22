import * as React from "react";
import { useEffect, useRef } from "react";

type Point = [number, number];

function getCanvasPosition(canvas: HTMLCanvasElement, mouseEvent: MouseEvent): Point {
  const { top, left } = canvas.getBoundingClientRect();

  return [
    mouseEvent.clientX - left,
    mouseEvent.clientY - top
  ];
}

function getPathPoints(linePoints: Array<Point>): Array<Point> {
  const pathPoints: Array<Point> = [];

  for (let i = 0; i < linePoints.length - 1; i++) {
    const [ x1, y1 ] = linePoints[i];
    const [ x2, y2 ] = linePoints[i + 1];

    if (x2 - x1 === 0) {
      pathPoints.push([x1, y1]);
      pathPoints.push([x2, y2]);

      continue;
    }

    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - (m * x1);

    const [ leftX, rightX ] = [x1, x2].sort();

    for (let x = leftX; x <= rightX; x++) {
      const y = m * x + b;
      pathPoints.push([x, y]);
    }
  }

  return pathPoints;
}

function allPointsEqual(points: Array<Point>) {
  const firstPoint = points[0];

  return points.slice(1).reduce((eq, [x, y]) => {
    return eq && firstPoint[0] === x && firstPoint[1] === y;
  }, true);
}

interface CanvasProps {
  grid: boolean[][];
  cellSize: number;
  onGridUpdated: (newGrid: boolean[][]) => void;
}

const Canvas: React.FC<CanvasProps> = (props) => {
  const { grid , cellSize, onGridUpdated } = props;
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
    let linePoints: Array<Point>;

    canvas.onmousedown = (e) => {
      mouseDown = true;
      linePoints = [getCanvasPosition(canvas, e)];
    };

    canvas.onmousemove = (e) => {
      if (mouseDown) {
        ctx.beginPath();
        ctx.strokeStyle = "#008577";

        ctx.moveTo(...linePoints[linePoints.length - 1]);
        linePoints.push(getCanvasPosition(canvas, e));
        ctx.lineTo(...linePoints[linePoints.length - 1]);

        ctx.stroke();
      }
    };

    canvas.onmouseup = () => {
      mouseDown = false;

      const pathPoints = getPathPoints(linePoints);
      const activeCells = pathPoints.map<Point>(([x, y]) => {
        return [
          Math.floor(x / cellSize),
          Math.floor(y / cellSize)
        ];
      });

      if (allPointsEqual(activeCells)) {
        const [cellX, cellY] = linePoints.map(([x, y]) => [
          Math.floor(x / cellSize),
          Math.floor(y / cellSize)
        ])[0];

        const newGrid = grid.slice();
        newGrid[cellX][cellY] = !newGrid[cellX][cellY];

        onGridUpdated(newGrid);
        return;
      }

      onGridUpdated(
        activeCells.reduce((grid, cell) => {
          const [x, y] = cell;
          grid[x][y] = true;

          return grid;
        }, grid.slice())
      );

      linePoints = [];
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
