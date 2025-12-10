export type CellType = 'empty' | 'wall' | 'brick' | 'bomb' | 'explosion' | 'powerup';

export type PowerupType = 'bomb' | 'fire' | 'speed';

export interface Position {
  x: number;
  y: number;
}

export interface Player {
  id: string;
  position: Position;
  bombCount: number;
  maxBombs: number;
  explosionRadius: number;
  speed: number;
  isAlive: boolean;
  direction: 'up' | 'down' | 'left' | 'right';
}

export interface Enemy {
  id: string;
  position: Position;
  isAlive: boolean;
  direction: 'up' | 'down' | 'left' | 'right';
  moveTimer: number;
}

export interface Bomb {
  id: string;
  position: Position;
  ownerId: string;
  timer: number;
  radius: number;
}

export interface Explosion {
  id: string;
  position: Position;
  timer: number;
}

export interface Powerup {
  id: string;
  position: Position;
  type: PowerupType;
}

export interface GameState {
  grid: CellType[][];
  player: Player;
  enemies: Enemy[];
  bombs: Bomb[];
  explosions: Explosion[];
  powerups: Powerup[];
  score: number;
  isGameOver: boolean;
  isWin: boolean;
  isPaused: boolean;
}

export const GRID_WIDTH = 13;
export const GRID_HEIGHT = 11;
export const CELL_SIZE = 48;
export const BOMB_TIMER = 3000; // 3 seconds
export const EXPLOSION_DURATION = 500; // 0.5 seconds
export const ENEMY_MOVE_INTERVAL = 800; // 0.8 seconds
export const POWERUP_CHANCE = 0.3; // 30% chance