import type { CSSProperties } from "react";

export type TileIconSource = {
  image: string;
  x: number;
  y: number;
  cellWidth: number;
  cellHeight: number;
  sheetWidth: number;
  sheetHeight: number;
};

/** Build a CSS sprite/tile crop at an arbitrary display width. */
export function createTileIconStyle(source: TileIconSource, width: number): CSSProperties {
  const scale = width / source.cellWidth;
  return {
    width,
    height: Math.round(source.cellHeight * scale),
    backgroundImage: `url(${source.image})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${source.sheetWidth * scale}px ${source.sheetHeight * scale}px`,
    backgroundPosition: `${-source.x * scale}px ${-source.y * scale}px`,
  };
}
