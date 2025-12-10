import { Button } from '@/components/ui/button';
import { Trophy, Skull, Pause, Play, RotateCcw } from 'lucide-react';

interface GameOverlayProps {
  isGameOver: boolean;
  isWin: boolean;
  isPaused: boolean;
  score: number;
  onRestart: () => void;
  onResume: () => void;
}

export const GameOverlay = ({ 
  isGameOver, 
  isWin, 
  isPaused, 
  score, 
  onRestart,
  onResume 
}: GameOverlayProps) => {
  if (!isGameOver && !isPaused) return null;

  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
      <div className="game-card text-center animate-scale-in">
        {isGameOver ? (
          <>
            {isWin ? (
              <div className="flex flex-col items-center gap-4">
                <Trophy className="w-16 h-16 text-primary animate-float" />
                <h2 className="font-arcade text-2xl text-primary neon-text">VICTORY!</h2>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Skull className="w-16 h-16 text-destructive" />
                <h2 className="font-arcade text-2xl text-destructive">GAME OVER</h2>
              </div>
            )}
            
            <div className="mt-6 mb-8">
              <div className="text-sm text-muted-foreground font-arcade">FINAL SCORE</div>
              <div className="text-3xl font-arcade text-primary mt-2">
                {score.toString().padStart(6, '0')}
              </div>
            </div>

            <Button onClick={onRestart} className="game-button">
              <RotateCcw className="w-4 h-4 mr-2" />
              PLAY AGAIN
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <Pause className="w-12 h-12 text-primary" />
            <h2 className="font-arcade text-xl text-foreground">PAUSED</h2>
            
            <div className="flex gap-4">
              <Button onClick={onResume} className="game-button">
                <Play className="w-4 h-4 mr-2" />
                RESUME
              </Button>
              <Button onClick={onRestart} variant="outline" className="font-arcade">
                <RotateCcw className="w-4 h-4 mr-2" />
                RESTART
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};