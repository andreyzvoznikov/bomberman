import { Bomb, CELL_SIZE, BOMB_TIMER } from '@/game/types';

interface BombSpriteProps {
  bomb: Bomb;
}

export const BombSprite = ({ bomb }: BombSpriteProps) => {
  const style = {
    left: bomb.position.x * CELL_SIZE,
    top: bomb.position.y * CELL_SIZE,
    width: CELL_SIZE,
    height: CELL_SIZE,
  };

  // Calculate urgency based on timer
  const urgency = 1 - (bomb.timer / BOMB_TIMER);
  const pulseSpeed = urgency > 0.7 ? 'animate-bomb-pulse' : '';

  return (
    <div 
      className="absolute z-20"
      style={style}
    >
      <div className={`relative w-full h-full flex items-center justify-center ${pulseSpeed}`}>
        {/* Bomb body */}
        <div className="relative w-9 h-9">
          {/* Shadow */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-7 h-2 bg-black/40 rounded-full blur-sm" />
          
          {/* Main bomb sphere */}
          <div className="absolute inset-0 bg-foreground rounded-full">
            <div className="absolute inset-1 bg-gradient-to-br from-muted-foreground/50 to-transparent rounded-full" />
            <div className="absolute top-1 left-2 w-2 h-2 bg-white/40 rounded-full blur-sm" />
          </div>
          
          {/* Fuse */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-3 bg-game-brick rounded-t-full" />
          
          {/* Spark */}
          <div 
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-game-explosion rounded-full blur-sm"
            style={{
              animation: 'pulse-glow 0.3s ease-in-out infinite',
              opacity: 0.5 + urgency * 0.5,
            }}
          />
          <div 
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
            style={{ opacity: 0.7 + urgency * 0.3 }}
          />
        </div>

        {/* Warning glow when about to explode */}
        {urgency > 0.7 && (
          <div 
            className="absolute inset-0 bg-game-explosion/30 rounded-full blur-lg"
            style={{ opacity: urgency }}
          />
        )}
      </div>
    </div>
  );
};