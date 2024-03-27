import { cn } from "./lib/utils";

interface CellProps {
  squareId: string;
  type?: string;
  color?: string;
  selectable: boolean;
  selected: boolean;
  legalTo: boolean;
  lastMoveFrom: boolean;
  lastMoveTo: boolean;
  isDark: boolean;
  onClick?: () => void;
  y: number;
  x: number;
}

const basePath = "/react-chess/chess-pieces";
const svg = {
  "k-b": `${basePath}/king-dark.svg`,
  "k-w": `${basePath}/king-light.svg`,
  "q-b": `${basePath}/queen-dark.svg`,
  "q-w": `${basePath}/queen-light.svg`,
  "r-b": `${basePath}/rook-dark.svg`,
  "r-w": `${basePath}/rook-light.svg`,
  "n-b": `${basePath}/knight-dark.svg`,
  "n-w": `${basePath}/knight-light.svg`,
  "b-b": `${basePath}/bishop-dark.svg`,
  "b-w": `${basePath}/bishop-light.svg`,
  "p-b": `${basePath}/pawn-dark.svg`,
  "p-w": `${basePath}/pawn-light.svg`,
};

export const AiChessSquare = ({
  squareId,
  type,
  color,
  isDark,
  selectable,
  selected,
  legalTo,
  lastMoveFrom,
  lastMoveTo,
  onClick,
  y,
  x,
}: CellProps) => {
  const pointer = legalTo || selectable;
  const capturable = legalTo && type;

  return (
    <div
      id={squareId}
      style={{
        top: `${12.5 * y}%`,
        left: `${12.5 * x}%`,
        height: `12.5%`,
        width: `12.5%`,
      }}
      className={cn(
        "absolute grid place-content-center group overflow-clip",
        pointer && "cursor-pointer",
        selected && (isDark ? "bg-selected-dark" : "bg-selected-light"),
        !selected && (isDark ? "bg-chess-dark" : "bg-chess-light"),
        lastMoveFrom && (isDark ? "bg-last-move-dark" : "bg-last-move-light"),
        lastMoveTo && (isDark ? "bg-last-move-dark" : "bg-last-move-light"),
        legalTo && (isDark ? "hover:bg-hover-dark" : "hover:bg-hover-light"),
        capturable && (isDark ? "bg-hover-dark" : "bg-hover-light")
      )}
      onClick={onClick}
    >
      {type && color && (
        <div
          style={{
            backgroundImage: `url(${svg[`${type}-${color}`]})`,
            backgroundSize: "80%",
            height: "110%",
            width: "110%",
          }}
          className={cn(
            "chess-piece absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-no-repeat bg-center rounded-full group-hover:bg-transparent",
            capturable && (isDark ? "bg-chess-dark" : "bg-chess-light")
          )}
        />
      )}
      {!type && legalTo && (
        <div
          style={{
            height: "25%",
            width: "25%",
          }}
          className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full group-hover:hidden",
            isDark ? "bg-legal-dark" : "bg-legal-light"
          )}
        />
      )}
    </div>
  );
};
