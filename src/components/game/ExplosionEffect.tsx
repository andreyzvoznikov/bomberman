import { Explosion, CELL_SIZE, EXPLOSION_DURATION } from '@/game/types';

interface ExplosionEffectProps {
  explosion: Explosion;
}

export const ExplosionEffect = ({ explosion }: ExplosionEffectProps) => {
  const style = {
    left: explosion.position.x * CELL_SIZE,
    top: explosion.position.y * CELL_SIZE,
    width: CELL_SIZE,
    height: CELL_SIZE,
  };

  const progress = 1 - (explosion.timer / EXPLOSION_DURATION);

  return (
    <div 
      className="absolute z-30 pointer-events-none"
      style={style}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Core explosion */}
        <div 
          className="absolute inset-1 bg-game-explosion rounded-sm"
          style={{
            opacity: 1 - progress * 0.5,
            transform: `scale(${1 + progress * 0.2})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-game-explosion rounded-sm" />
        </div>
        
        {/* Inner glow */}
        <div 
          className="absolute inset-2 bg-primary rounded-sm"
          style={{
            opacity: 1 - progress,
          }}
        />
        
        {/* Outer glow */}
        <div 
          className="absolute -inset-2 bg-game-explosion/40 rounded-lg blur-md"
          style={{
            opacity: 1 - progress,
          }}
        />
        
        {/* Particles */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: '50%',
              top: '50%',
              transform: `rotate(${angle}deg) translateY(${-8 - progress * 16}px)`,
              opacity: 1 - progress,
            }}
          />
        ))}
      </div>
    </div>
  );
};