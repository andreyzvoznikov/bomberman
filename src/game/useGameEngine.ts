import { useCallback, useEffect, useRef, useState } from 'react';
import {
  GameState,
  Position,
  Bomb,
  Explosion,
  Powerup,
  BOMB_TIMER,
  EXPLOSION_DURATION,
  ENEMY_MOVE_INTERVAL,
} from './types';
import {
  createInitialGameState,
  canMoveTo,
  getExplosionCells,
  positionsEqual,
  getValidEnemyMoves,
  generateId,
  shouldSpawnPowerup,
  getRandomPowerupType,
} from './gameUtils';

export const useGameEngine = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);
  const gameLoopRef = useRef<number>();
  const keysPressed = useRef<Set<string>>(new Set());
  const lastMoveTime = useRef<number>(0);

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setGameState(prev => {
      if (prev.isGameOver || prev.isPaused || !prev.player.isAlive) return prev;

      const deltas: Record<string, Position> = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
      };

      const delta = deltas[direction];
      const newPos: Position = {
        x: prev.player.position.x + delta.x,
        y: prev.player.position.y + delta.y,
      };

      if (!canMoveTo(prev.grid, newPos, prev.bombs)) {
        return { ...prev, player: { ...prev.player, direction } };
      }

      // Check for powerup collection
      let newPowerups = [...prev.powerups];
      let player = { ...prev.player, position: newPos, direction };
      
      const collectedPowerup = newPowerups.find(p => positionsEqual(p.position, newPos));
      if (collectedPowerup) {
        newPowerups = newPowerups.filter(p => p.id !== collectedPowerup.id);
        
        switch (collectedPowerup.type) {
          case 'bomb':
            player.maxBombs = Math.min(player.maxBombs + 1, 10);
            break;
          case 'fire':
            player.explosionRadius = Math.min(player.explosionRadius + 1, 10);
            break;
          case 'speed':
            player.speed = Math.min(player.speed + 0.2, 3);
            break;
        }
      }

      return { ...prev, player, powerups: newPowerups };
    });
  }, []);

  const placeBomb = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver || prev.isPaused || !prev.player.isAlive) return prev;
      
      const activeBombs = prev.bombs.filter(b => b.ownerId === prev.player.id).length;
      if (activeBombs >= prev.player.maxBombs) return prev;

      // Check if there's already a bomb at this position
      const hasBombHere = prev.bombs.some(
        b => positionsEqual(b.position, prev.player.position)
      );
      if (hasBombHere) return prev;

      const newBomb: Bomb = {
        id: generateId(),
        position: { ...prev.player.position },
        ownerId: prev.player.id,
        timer: BOMB_TIMER,
        radius: prev.player.explosionRadius,
      };

      return {
        ...prev,
        bombs: [...prev.bombs, newBomb],
        player: { ...prev.player, bombCount: prev.player.bombCount + 1 },
      };
    });
  }, []);

  const explodeBomb = useCallback((bombId: string) => {
    setGameState(prev => {
      const bomb = prev.bombs.find(b => b.id === bombId);
      if (!bomb) return prev;

      const explosionCells = getExplosionCells(bomb, prev.grid);
      const newExplosions: Explosion[] = explosionCells.map(pos => ({
        id: generateId(),
        position: pos,
        timer: EXPLOSION_DURATION,
      }));

      // Update grid - destroy bricks
      const newGrid = prev.grid.map(row => [...row]);
      const newPowerups: Powerup[] = [...prev.powerups];
      
      for (const cell of explosionCells) {
        if (newGrid[cell.y][cell.x] === 'brick') {
          newGrid[cell.y][cell.x] = 'empty';
          
          // Chance to spawn powerup
          if (shouldSpawnPowerup()) {
            newPowerups.push({
              id: generateId(),
              position: { ...cell },
              type: getRandomPowerupType(),
            });
          }
        }
      }

      // Check for chain reactions
      const triggeredBombs = prev.bombs.filter(b => 
        b.id !== bombId && 
        explosionCells.some(c => positionsEqual(c, b.position))
      );

      // Check player hit
      let player = { ...prev.player };
      const playerHit = explosionCells.some(c => positionsEqual(c, player.position));
      if (playerHit) {
        player.isAlive = false;
      }

      // Check enemies hit
      let score = prev.score;
      const enemies = prev.enemies.map(enemy => {
        const hit = explosionCells.some(c => positionsEqual(c, enemy.position));
        if (hit && enemy.isAlive) {
          score += 100;
          return { ...enemy, isAlive: false };
        }
        return enemy;
      });

      // Destroy powerups in explosion
      const survivingPowerups = newPowerups.filter(
        p => !explosionCells.some(c => positionsEqual(c, p.position))
      );

      const allEnemiesDead = enemies.every(e => !e.isAlive);
      const playerWins = allEnemiesDead && player.isAlive;

      const newState = {
        ...prev,
        grid: newGrid,
        bombs: prev.bombs.filter(b => b.id !== bombId),
        explosions: [...prev.explosions, ...newExplosions],
        powerups: survivingPowerups,
        player,
        enemies,
        score,
        isGameOver: !player.isAlive || playerWins,
        isWin: playerWins,
      };

      // Trigger chain reactions
      for (const triggeredBomb of triggeredBombs) {
        setTimeout(() => explodeBomb(triggeredBomb.id), 50);
      }

      return newState;
    });
  }, []);

  // Game loop
  useEffect(() => {
    let lastTime = performance.now();

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      setGameState(prev => {
        if (prev.isGameOver || prev.isPaused) return prev;

        // Update bomb timers
        let bombs = prev.bombs.map(bomb => ({
          ...bomb,
          timer: bomb.timer - deltaTime,
        }));

        // Explode bombs with timer <= 0
        const explodingBombs = bombs.filter(b => b.timer <= 0);
        for (const bomb of explodingBombs) {
          setTimeout(() => explodeBomb(bomb.id), 0);
        }

        // Update explosion timers
        const explosions = prev.explosions
          .map(e => ({ ...e, timer: e.timer - deltaTime }))
          .filter(e => e.timer > 0);

        // Update enemy movement
        const enemies = prev.enemies.map(enemy => {
          if (!enemy.isAlive) return enemy;
          
          const newMoveTimer = enemy.moveTimer + deltaTime;
          
          if (newMoveTimer >= ENEMY_MOVE_INTERVAL) {
            const validMoves = getValidEnemyMoves(enemy, prev.grid, prev.bombs, prev.explosions);
            
            if (validMoves.length > 0) {
              const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
              const dx = randomMove.x - enemy.position.x;
              const dy = randomMove.y - enemy.position.y;
              
              let direction: 'up' | 'down' | 'left' | 'right' = 'down';
              if (dy < 0) direction = 'up';
              else if (dy > 0) direction = 'down';
              else if (dx < 0) direction = 'left';
              else if (dx > 0) direction = 'right';
              
              return { ...enemy, position: randomMove, direction, moveTimer: 0 };
            }
            
            return { ...enemy, moveTimer: 0 };
          }
          
          return { ...enemy, moveTimer: newMoveTimer };
        });

        // Check enemy collision with explosions
        let score = prev.score;
        const updatedEnemies = enemies.map(enemy => {
          if (!enemy.isAlive) return enemy;
          
          const hit = prev.explosions.some(e => positionsEqual(e.position, enemy.position));
          if (hit) {
            score += 100;
            return { ...enemy, isAlive: false };
          }
          return enemy;
        });

        // Check player collision with enemy
        let player = { ...prev.player };
        const enemyCollision = updatedEnemies.some(
          e => e.isAlive && positionsEqual(e.position, player.position)
        );
        if (enemyCollision) {
          player.isAlive = false;
        }

        // Check player collision with explosion
        const explosionHit = explosions.some(e => positionsEqual(e.position, player.position));
        if (explosionHit) {
          player.isAlive = false;
        }

        const allEnemiesDead = updatedEnemies.every(e => !e.isAlive);
        const playerWins = allEnemiesDead && player.isAlive;

        return {
          ...prev,
          bombs,
          explosions,
          enemies: updatedEnemies,
          player,
          score,
          isGameOver: !player.isAlive || playerWins,
          isWin: playerWins,
        };
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [explodeBomb]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());

      if (e.key === 'Escape') {
        togglePause();
        return;
      }

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        placeBomb();
        return;
      }

      const now = performance.now();
      const moveDelay = 150 / (gameState.player.speed || 1);
      
      if (now - lastMoveTime.current < moveDelay) return;
      lastMoveTime.current = now;

      if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        movePlayer('up');
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        movePlayer('down');
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault();
        movePlayer('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        e.preventDefault();
        movePlayer('right');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [movePlayer, placeBomb, togglePause, gameState.player.speed]);

  return {
    gameState,
    resetGame,
    togglePause,
  };
};