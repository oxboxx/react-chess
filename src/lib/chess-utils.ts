export const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const fenToSquareInfo = (fen: string) => {
  const squareInfo: {
    [key: string]: { type: string; color: string; isEven: boolean };
  } = {};
  const board = fen.split(" ")[0].split("/").join("");

  let newBoard = "";
  for (let i = 0; i < board.length; i++) {
    const char = board[i];
    if (!isNaN(parseInt(char))) {
      newBoard += "x".repeat(parseInt(char));
    } else {
      newBoard += char;
    }
  }

  const rows = ["1", "2", "3", "4", "5", "6", "7", "8"].reverse();
  const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];

  let i = 0;
  for (const row of rows) {
    for (const col of cols) {
      const squareId = col.concat(row);
      const isEven = (parseInt(row) + col.charCodeAt(0)) % 2 === 0;
      const char = newBoard[i];
      i += 1;
      if (char === "x") {
        squareInfo[squareId] = {
          type: "",
          color: "",
          isEven,
        };
      } else {
        squareInfo[squareId] = {
          type: char.toLowerCase(),
          color: char === char.toLowerCase() ? "b" : "w",
          isEven,
        };
      }
    }
  }

  return squareInfo;
};

export const playAudio = (note: string | undefined) => {
  const basePath = "/react-chess/sounds";
  if (note === undefined) {
    return;
  }
  // checkmate
  else if (note.includes("#")) {
    new Audio(`${basePath}/game-end.mp3`).play();
  }
  // check
  else if (note.includes("+")) {
    new Audio(`${basePath}/move-check.mp3`).play();
  }
  // capture
  else if (note.includes("x")) {
    new Audio(`${basePath}/move-opponent.mp3`).play();
  }
  // castling
  else if (note.includes("-")) {
    new Audio(`${basePath}/castle.mp3`).play();
  }
  // promotion
  else if (note.includes("=Q")) {
    new Audio(`${basePath}/promote.mp3`).play();
  }
  // move
  else {
    new Audio(`${basePath}/move-player.mp3`).play();
  }
};
