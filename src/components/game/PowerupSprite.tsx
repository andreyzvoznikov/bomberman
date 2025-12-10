import { Powerup, CELL_SIZE } from '@/game/types';
import { Flame, Zap, Bomb } from 'lucide-react';

interface PowerupSpriteProps {
  powerup: Powerup;
}

export const PowerupSprite = ({ powerup }: PowerupSpriteProps) => {
  const style = {
    left: powerup.position.x * CELL_SIZE,
    top: powerup.position.y * CELL_SIZE,
    width: CELL_SIZE,
    height: CELL_SIZE,
  };

  const getIcon = () => {
    switch (powerup.type) {
      case 'bomb':
        return <Bomb className="w-5 h-5 text-foreground" />;
      case 'fire':
        return <Flame className="w-5 h-5 text-game-explosion" />;
      case 'speed':
        return <Zap className="w-5 h-5 text-primary" />;
    }
  };

  const getColor = () => {
    switch (powerup.type) {
      case 'bomb':
        return 'bg-secondary';
      case 'fire':
        return 'bg-game-explosion/80';
      case 'speed':
        return 'bg-primary/80';
    }
  };

  return (
    <div 
      className="absolute z-15 animate-float"
      style={style}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Background glow */}
        <div className={`absolute w-8 h-8 ${getColor()} rounded-lg blur-md opacity-50`} />
        
        {/* Icon container */}
        <div className={`relative w-8 h-8 ${getColor()} rounded-lg flex items-center justify-center border border-foreground/20`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-lg" />
          {getIcon()}
        </div>
      </div>
    </div>
  );
};