function flatten<T>(grid: T[][]): Array<T> {
  return grid.reduce((acc, col) => acc.concat(col), []);
}

function toHex(byte: number) {
  const hexStr = byte.toString(16).toUpperCase();
  return (hexStr.length === 1) ? `0x0${hexStr}` : `0x${hexStr}`;
}

export function generateXBM(name: string, grid: boolean[][]): string {
  const width = grid.length;
  const height = grid[0].length;

  const flatGrid = flatten(grid);
  const byteArray = [];

  for (let i = 0; i < flatGrid.length; i += 8) {
    byteArray.push(
      (+flatGrid[i + 0] << 0) |
      (+flatGrid[i + 1] << 1) |
      (+flatGrid[i + 2] << 2) |
      (+flatGrid[i + 3] << 3) |
      (+flatGrid[i + 4] << 4) |
      (+flatGrid[i + 5] << 5) |
      (+flatGrid[i + 6] << 6) |
      (+flatGrid[i + 7] << 7)
    );
  }

  return `
    #include <Arduino.h>

    #define ${name}_width ${width}
    #define ${name}_height ${height}

    const PROGMEM uint8_t ${name}_bits[] = {
      ${byteArray.map((byte) => toHex(byte)).join(", ")}
    };
  `;
}
