// Typescript => PayLoadAction
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { startFen } from "@/lib/chess-utils";

type MovePayload = {
  fen: string;
  from: string;
  to: string;
};

type SelectPayload = {
  from: string;
  possibleMoves: string[];
};

type LastMove = {
  from: string;
  to: string;
};

type ChessState = {
  boardIndex: number;
  history: string[];
  lastMove: LastMove[];
  playerColor: string;
  opponentColor: string;
  aiMode: boolean;
  turnColor: string;
  from: string;
  to: string[];
};

type ServerState = {
  roomId: string;
  hostEmail: string;
  hostColor: string;
  opponentEmail: string;
  opponentColor: string;
  history: string[];
  turnIndex: number;
  turnColor: string;
  lastMoveFrom: string;
  lastMoveTo: string;
  isStarted: boolean;
  isEnd: boolean;
};

const initialState = {
  boardIndex: 0,
  history: [startFen],
  lastMove: [{ from: "none", to: "none" }],
  playerColor: "w",
  opponentColor: "b",
  aiMode: true,
  turnColor: "w",
  from: "",
  to: [] as string[],
} as ChessState;

export const chessSlice = createSlice({
  name: "chess",
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
    move: (state, action: PayloadAction<MovePayload>) => {
      state.boardIndex = state.boardIndex + 1;
      state.history = [
        ...state.history.slice(0, state.boardIndex),
        action.payload.fen,
      ];
      state.lastMove = [
        ...state.lastMove.slice(0, state.boardIndex),
        { from: action.payload.from, to: action.payload.to },
      ];
      state.turnColor = state.turnColor === "w" ? "b" : "w";
      state.from = "";
      state.to = [];
    },
    select: (state, action: PayloadAction<SelectPayload>) => {
      state.from = action.payload.from;
      state.to = action.payload.possibleMoves;
    },
    deselect: (state) => {
      state.from = "";
      state.to = [];
    },
    gotoPrev: (state) => {
      if (state.aiMode && state.boardIndex > 1) {
        state.boardIndex = state.boardIndex - 2;
      } else if (state.boardIndex > 0) {
        state.boardIndex = state.boardIndex - 1;
        state.turnColor = state.turnColor === "w" ? "b" : "w";
      }
    },
    gotoNext: (state) => {
      if (state.aiMode && state.boardIndex < state.history.length - 2) {
        state.boardIndex = state.boardIndex + 2;
      } else if (state.boardIndex < state.history.length - 1) {
        state.boardIndex = state.boardIndex + 1;
        state.turnColor = state.turnColor === "w" ? "b" : "w";
      }
    },
    changeColor: (state) => {
      state.playerColor = state.playerColor === "w" ? "b" : "w";
      state.opponentColor = state.opponentColor === "w" ? "b" : "w";
    },
  },
});

export const {
  reset,
  move,
  gotoPrev,
  gotoNext,
  select,
  deselect,
  changeColor,
} = chessSlice.actions;

export default chessSlice.reducer;
