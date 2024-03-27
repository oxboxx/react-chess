import { useDispatch } from "react-redux";
import { Chess } from "chess.js";

import { move, reset, gotoPrev, gotoNext, changeColor } from "./redux/features/chess-slice";
import { AppDispatch, useAppSelector } from "./redux/store";
import { playAudio } from "./lib/chess-utils";
import { ActionTooltip } from "./components/action-tooltip";

export const AiChessPanel = () => {
  const state = useAppSelector((state) => state.chessReducer);
  const dispatch = useDispatch<AppDispatch>();
  const chess = new Chess(state.history[state.boardIndex]);

  const requestStockfish = () => {
    const stockfish = new Worker("/react-chess/worker/stockfish.js");
    stockfish.postMessage(`position fen ${state.history[state.boardIndex]}`);
    stockfish.postMessage("go depth 15");
    stockfish.onmessage = function (event) {
      const receivedMessage = event.data.split(" ");
      if (receivedMessage.includes("bestmove")) {
        const aiFrom = receivedMessage[1].slice(0, 2);
        const aiTo = receivedMessage[1].slice(2, 4);
        chess.move({ from: aiFrom, to: aiTo, promotion: "q" });
        dispatch(move({ fen: chess.fen(), from: aiFrom, to: aiTo }));
        playAudio(chess.history()[0]);
      }
    };
  };

  return (
    <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center text-zinc-200 sm:text-xl md:text-2xl">
      <ActionTooltip side="bottom" align="center" label="change color">
        <button onClick={() => dispatch(changeColor())}>Color</button>
      </ActionTooltip>
      <ActionTooltip side="bottom" align="center" label="go to previous state">
        <button onClick={() => dispatch(gotoPrev())}>Prev</button>
      </ActionTooltip>
      <ActionTooltip side="bottom" align="center" label="go to next state">
        <button onClick={() => dispatch(gotoNext())}>Next</button>
      </ActionTooltip>
      <ActionTooltip side="bottom" align="center" label="reset">
        <button onClick={() => dispatch(reset())}>Reset</button>
      </ActionTooltip>
      <ActionTooltip side="bottom" align="center" label="ai recommendation">
        <button onClick={requestStockfish}>AI-Rec</button>
      </ActionTooltip>
    </div>
  );
};
