import { remote, OpenDialogOptions, SaveDialogOptions } from "electron";

export function getGridDimensions<T>(grid: T[][]): [number, number] {
  return [
    grid.length,
    (grid.length === 0) ? 0 : grid[0].length
  ];
}

export function initGrid(dimensions: [number, number], initialData: boolean[][] = []): boolean[][] {
  const [width, height] = dimensions;
  const matrix: boolean[][] = [];

  for (let x = 0; x < width; x++) {
    matrix[x] = [];

    for (let y = 0; y < height; y++) {
      matrix[x][y] = false;
    }
  }

  if (initialData.length > 0) {
    const copyWidth = Math.min(width, initialData.length);
    const copyHeight = Math.min(height, initialData[0].length);

    for (let x = 0; x < copyWidth; x++) {
      for (let y = 0; y < copyHeight; y++) {
        matrix[x][y] = initialData[x][y];
      }
    }
  }

  return matrix;
}

export async function showSaveDialog(defaultPath: string) {
  const dialogOptions: SaveDialogOptions = {
    title: "Save as",
    defaultPath,
    buttonLabel: "Choose"
  };

  const result = await remote.dialog.showSaveDialog(
    remote.getCurrentWindow(),
    dialogOptions
  );

  return result.filePath;
}

export async function showOpenDialog(defaultPath: string): Promise<string | undefined> {
  const dialogOptions: OpenDialogOptions = {
    title: "Open",
    filters: [
      { name: "XBM Editor files, XBM files, Header files", extensions: [ "xbme", "xbm", "h" ] }
    ],
    defaultPath,
  };

  const result = await remote.dialog.showOpenDialog(
    remote.getCurrentWindow(),
    dialogOptions
  );

  return result.filePaths![0];
}
