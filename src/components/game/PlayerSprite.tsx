import { Player, CELL_SIZE } from '@/game/types';
import { cn } from '@/lib/utils';

interface PlayerSpriteProps {
  player: Player;
}

export const PlayerSprite = ({ player }: PlayerSpriteProps) => {
  if (!player.isAlive) return null;

  const style = {
    left: player.position.x * CELL_SIZE,
    top: player.position.y * CELL_SIZE,
    width: CELL_SIZE,
    height: CELL_SIZE,
  };

  const directionRotation = {
    up: 'rotate-0',
    down: 'rotate-180',
    left: '-rotate-90',
    right: 'rotate-90',
  };

  return (
    <div 
      className="absolute transition-all duration-100 z-10"
      style={style}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Body */}
        <div className="relative w-10 h-10">
          {/* Shadow */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/30 rounded-full blur-sm" />
          
          {/* Main body */}
          <div className="absolute inset-0 bg-game-player-1 rounded-full border-2 border-foreground/20">
            <div className="absolute inset-1 bg-gradient-to-br from-white/30 to-transparent rounded-full" />
          </div>
          
          {/* Face indicator (direction) */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center",
            directionRotation[player.direction]
          )}>
            {/* Eyes */}
            <div className="absolute top-2 left-2 w-2 h-2 bg-foreground rounded-full">
              <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
            </div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-foreground rounded-full">
              <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
            </div>
          </div>
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-game-player-1/20 rounded-full blur-md animate-pulse-glow" />
      </div>
    </div>
  );
};