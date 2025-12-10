import { useGameEngine } from '@/game/useGameEngine';
import { GameBoard } from './GameBoard';
import { GameHUD } from './GameHUD';
import { GameOverlay } from './GameOverlay';
import { GameControls } from './GameControls';
import { Bomb } from 'lucide-react';

export const BombermanGame = () => {
  const { gameState, resetGame, togglePause } = useGameEngine();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Bomb className="w-10 h-10 text-primary animate-pulse-glow" />
          <h1 className="game-title text-3xl md:text-4xl">BOMBERMAN</h1>
          <Bomb className="w-10 h-10 text-primary animate-pulse-glow" />
        </div>
        <p className="text-muted-foreground text-sm">
          Destroy all enemies to win!
        </p>
      </header>

      {/* Game area */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex flex-col gap-4">
          {/* HUD */}
          <GameHUD 
            player={gameState.player} 
            enemies={gameState.enemies}
            score={gameState.score}
          />

          {/* Game board with overlay */}
          <div className="relative">
            <GameBoard gameState={gameState} />
            <GameOverlay
              isGameOver={gameState.isGameOver}
              isWin={gameState.isWin}
              isPaused={gameState.isPaused}
              score={gameState.score}
              onRestart={resetGame}
              onResume={togglePause}
            />
          </div>
        </div>

        {/* Controls panel */}
        <div className="lg:w-48">
          <GameControls />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-muted-foreground">
        <p>Use arrow keys or WASD to move • SPACE to place bomb • ESC to pause</p>
      </footer>
    </div>
  );
};