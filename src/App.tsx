import { AiChessGame } from "./ai-chess-game";
import { ReduxProvider } from "./redux/provider";

const App = () => {
  return (
    <div className="h-dvh flex items-center justify-center bg-zinc-900">
      <ReduxProvider>
        <AiChessGame />
      </ReduxProvider>
    </div>
  );
};

export default App;
