import { Enemy, CELL_SIZE } from '@/game/types';
import { cn } from '@/lib/utils';

interface EnemySpriteProps {
  enemy: Enemy;
}

export const EnemySprite = ({ enemy }: EnemySpriteProps) => {
  if (!enemy.isAlive) return null;

  const style = {
    left: enemy.position.x * CELL_SIZE,
    top: enemy.position.y * CELL_SIZE,
    width: CELL_SIZE,
    height: CELL_SIZE,
  };

  return (
    <div 
      className="absolute transition-all duration-200 z-10"
      style={style}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Body */}
        <div className="relative w-10 h-10">
          {/* Shadow */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/30 rounded-full blur-sm" />
          
          {/* Main body - ghost shape */}
          <div className="absolute inset-0 bg-game-enemy rounded-t-full">
            <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-t-full" />
            
            {/* Wavy bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-3 flex">
              <div className="flex-1 bg-game-enemy rounded-b-full" />
              <div className="flex-1 bg-transparent" />
              <div className="flex-1 bg-game-enemy rounded-b-full" />
              <div className="flex-1 bg-transparent" />
              <div className="flex-1 bg-game-enemy rounded-b-full" />
            </div>
          </div>
          
          {/* Eyes */}
          <div className="absolute top-3 left-2 w-2 h-3 bg-white rounded-full">
            <div className="absolute bottom-0.5 left-0.5 w-1 h-1.5 bg-foreground rounded-full" />
          </div>
          <div className="absolute top-3 right-2 w-2 h-3 bg-white rounded-full">
            <div className="absolute bottom-0.5 right-0.5 w-1 h-1.5 bg-foreground rounded-full" />
          </div>
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-game-enemy/20 rounded-full blur-md animate-pulse-glow" />
      </div>
    </div>
  );
};