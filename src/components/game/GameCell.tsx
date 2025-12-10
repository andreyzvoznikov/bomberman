import { CellType, CELL_SIZE } from '@/game/types';
import { cn } from '@/lib/utils';

interface GameCellProps {
  type: CellType;
  x: number;
  y: number;
}

export const GameCell = ({ type, x, y }: GameCellProps) => {
  const baseClasses = "absolute transition-all duration-100";
  
  const style = {
    left: x * CELL_SIZE,
    top: y * CELL_SIZE,
    width: CELL_SIZE,
    height: CELL_SIZE,
  };

  if (type === 'wall') {
    return (
      <div 
        className={cn(baseClasses, "bg-game-wall border-2 border-muted")}
        style={style}
      >
        <div className="w-full h-full bg-gradient-to-br from-muted/30 to-transparent" />
        <div className="absolute inset-1 border border-muted-foreground/20" />
      </div>
    );
  }

  if (type === 'brick') {
    return (
      <div 
        className={cn(baseClasses, "bg-game-brick")}
        style={style}
      >
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-px p-px">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i} 
              className="bg-game-brick border border-t-primary/20 border-l-primary/20 border-r-muted/40 border-b-muted/40"
            />
          ))}
        </div>
      </div>
    );
  }

  // Empty cell - grass
  return (
    <div 
      className={cn(baseClasses, "bg-game-grass")}
      style={style}
    >
      <div className="w-full h-full bg-gradient-to-br from-secondary/10 to-transparent" />
      {/* Grass texture dots */}
      <div className="absolute inset-0 opacity-30">
        {((x + y) % 3 === 0) && (
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-secondary rounded-full" />
        )}
        {((x + y) % 2 === 0) && (
          <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-secondary/70 rounded-full" />
        )}
      </div>
    </div>
  );
};