import { GameState, GRID_WIDTH, GRID_HEIGHT, CELL_SIZE } from '@/game/types';
import { GameCell } from './GameCell';
import { PlayerSprite } from './PlayerSprite';
import { EnemySprite } from './EnemySprite';
import { BombSprite } from './BombSprite';
import { ExplosionEffect } from './ExplosionEffect';
import { PowerupSprite } from './PowerupSprite';

interface GameBoardProps {
  gameState: GameState;
}

export const GameBoard = ({ gameState }: GameBoardProps) => {
  const { grid, player, enemies, bombs, explosions, powerups } = gameState;

  const boardStyle = {
    width: GRID_WIDTH * CELL_SIZE,
    height: GRID_HEIGHT * CELL_SIZE,
  };

  return (
    <div 
      className="relative bg-muted rounded-lg overflow-hidden pixel-border"
      style={boardStyle}
    >
      {/* Render grid cells */}
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <GameCell key={`${x}-${y}`} type={cell} x={x} y={y} />
        ))
      )}

      {/* Render powerups */}
      {powerups.map(powerup => (
        <PowerupSprite key={powerup.id} powerup={powerup} />
      ))}

      {/* Render bombs */}
      {bombs.map(bomb => (
        <BombSprite key={bomb.id} bomb={bomb} />
      ))}

      {/* Render explosions */}
      {explosions.map(explosion => (
        <ExplosionEffect key={explosion.id} explosion={explosion} />
      ))}

      {/* Render enemies */}
      {enemies.map(enemy => (
        <EnemySprite key={enemy.id} enemy={enemy} />
      ))}

      {/* Render player */}
      <PlayerSprite player={player} />
    </div>
  );
};