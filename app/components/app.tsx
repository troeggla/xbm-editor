import * as React from "react";

function initMatrix(dimensions: [number, number]): boolean[][] {
  const [width, height] = dimensions;
  const matrix: boolean[][] = [];

  for (let x = 0; x < width; x++) {
    matrix[x] = [];

    for (let y = 0; y < height; y++) {
      matrix[x][y] = false;
    }
  }

  return matrix;
}

const App: React.FC = () => {
  return (
    <div id="app">
    </div>
  );
};

export default App;
