import { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Chess } from "chess.js";

import { move, select, deselect } from "./redux/features/chess-slice";
import { AppDispatch, useAppSelector } from "./redux/store";
import { fenToSquareInfo, playAudio } from "./lib/chess-utils";

import { AiChessSquare } from "./ai-chess-square";

let stockfish: any;

export const AiChessBoard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useAppSelector((state) => state.chessReducer);

  // chess가 useCallback의 의존성 배열에 들어가 있는데
  // chess = new Chess(state.history[state.boardIndex])의 경우
  // 렌더링 될 때마다 chess가 변하므로 useCallback의 의미를 상실하므로
  // useMemo를 통해 매번 바뀌지 않는다는 것을 보장한다.
  const chess = useMemo(() => {
    return new Chess(state.history[state.boardIndex]);
  }, [state.boardIndex, state.history]);

  // Web Worker는 브라우저 전용 API이므로 서버사이드 환경에서는 사용할 수 없다.
  // 컴포넌트가 마운트 될 때 한 번만 실행되도록 빈 의존성 배열을 설정한다.
  useEffect(() => {
    if (typeof window !== "undefined") {
      stockfish = new Worker("/react-chess/worker/stockfish.js");
    }
  }, []);

  const selectPiece = (squareId: string) => {
    const possibleMoves = chess.moves({ square: squareId as any, verbose: true }).map((detail) => detail.to);
    dispatch(select({ from: squareId, possibleMoves }));
  };

  // AI 움직임을 담당하는 useEffect 훅의 의존성 배열에 movePiece가 들어가있다.
  // chess와 마찬가지의 이유로 useCallback을 통해 매번 변하지 않는 값임을 보장한다.
  const movePiece = useCallback(
    (from: string, to: string) => {
      chess.move({ from, to, promotion: "q" });
      dispatch(move({ fen: chess.fen(), from, to }));
      playAudio(chess.history()[0]);
    },
    [chess, dispatch]
  );

  const handleSquareClick = (squareId: string) => {
    if (state.from === squareId) {
      dispatch(deselect());
    } else if (squareInfo[squareId].color === state.turnColor) {
      selectPiece(squareId);
    } else if (squareInfo[squareId].color !== state.turnColor && !state.to.some((str) => str.includes(squareId))) {
      dispatch(deselect());
    } else if (state.to.some((str) => str.includes(squareId))) {
      movePiece(state.from, squareId);
    }
  };

  // useEffect 훅을 사용하지 않으면 여러 번 동작하면서 에러가 발생한다.
  const aiTurn = state.aiMode && state.turnColor === state.opponentColor;
  useEffect(() => {
    if (aiTurn) {
      stockfish.postMessage(`position fen ${state.history[state.boardIndex]}`);
      stockfish.postMessage("go depth 15");
      stockfish.onmessage = (event: any) => {
        const receivedMessage = event.data.split(" ");
        if (aiTurn && receivedMessage.includes("bestmove")) {
          const aiFrom = receivedMessage[1].slice(0, 2);
          const aiTo = receivedMessage[1].slice(2, 4);
          movePiece(aiFrom, aiTo);
        }
      };
    }
  }, [movePiece, aiTurn, state.boardIndex, state.history]);

  let board = [];
  const squareInfo = fenToSquareInfo(chess.fen());
  const last = state.lastMove[state.boardIndex];

  let rows, cols;
  if (state.playerColor === "b") {
    rows = ["1", "2", "3", "4", "5", "6", "7", "8"];
    cols = ["h", "g", "f", "e", "d", "c", "b", "a"];
  } else {
    rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
    cols = ["a", "b", "c", "d", "e", "f", "g", "h"];
  }

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const squareId = cols[col].concat(rows[row]);
      board.push(
        <AiChessSquare
          key={squareId}
          squareId={squareId}
          type={squareInfo[squareId].type}
          color={squareInfo[squareId].color}
          selectable={squareInfo[squareId].color === state.turnColor}
          selected={state.from === squareId}
          legalTo={state.to.some((str) => str.includes(squareId))}
          isDark={squareInfo[squareId].isEven}
          lastMoveFrom={last && last.from === squareId}
          lastMoveTo={last && last.to === squareId}
          onClick={() => handleSquareClick(squareId)}
          y={row}
          x={col}
        />
      );
    }
  }

  return (
    <div style={{ width: "min(75%, 70vh)", maxWidth: "800px" }} className="relative">
      <div className="pb-[100%]"></div>
      {board}
    </div>
  );
  // return <div className="relative w-3/4 pb-[100%] grid grid-cols-8">{board}</div>;
};
