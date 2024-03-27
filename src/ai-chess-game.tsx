import { AiChessBoard } from "./ai-chess-board";
import { AiChessPanel } from "./ai-chess-panel";

export const AiChessGame = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col gap-4 md:gap-8 justify-center items-center w-full">
        <p className="text-zinc-200 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">React Chess by oxboxx</p>
        <AiChessBoard />
        <AiChessPanel />
      </div>
    </div>
  );
};
