import { 
  CellType, 
  Position, 
  GameState, 
  Player, 
  Enemy, 
  Bomb, 
  Explosion,
  Powerup,
  PowerupType,
  GRID_WIDTH, 
  GRID_HEIGHT,
  POWERUP_CHANCE
} from './types';

export const generateId = (): string => Math.random().toString(36).substr(2, 9);

export const createInitialGrid = (): CellType[][] => {
  const grid: CellType[][] = [];
  
  for (let y = 0; y < GRID_HEIGHT; y++) {
    const row: CellType[] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      // Walls on odd positions (except edges which are always walls)
      if (x === 0 || y === 0 || x === GRID_WIDTH - 1 || y === GRID_HEIGHT - 1) {
        row.push('wall');
      } else if (x % 2 === 0 && y % 2 === 0) {
        row.push('wall');
      } else {
        // Random bricks, but keep corners clear for spawn
        const isSpawnArea = 
          (x <= 2 && y <= 2) || // Top-left
          (x >= GRID_WIDTH - 3 && y <= 2) || // Top-right
          (x <= 2 && y >= GRID_HEIGHT - 3) || // Bottom-left
          (x >= GRID_WIDTH - 3 && y >= GRID_HEIGHT - 3); // Bottom-right
        
        if (isSpawnArea) {
          row.push('empty');
        } else {
          row.push(Math.random() > 0.3 ? 'brick' : 'empty');
        }
      }
    }
    grid.push(row);
  }
  
  return grid;
};

export const createInitialPlayer = (): Player => ({
  id: 'player1',
  position: { x: 1, y: 1 },
  bombCount: 0,
  maxBombs: 1,
  explosionRadius: 1,
  speed: 1,
  isAlive: true,
  direction: 'down',
});

export const createEnemies = (count: number): Enemy[] => {
  const enemies: Enemy[] = [];
  const positions: Position[] = [
    { x: GRID_WIDTH - 2, y: 1 },
    { x: 1, y: GRID_HEIGHT - 2 },
    { x: GRID_WIDTH - 2, y: GRID_HEIGHT - 2 },
  ];
  
  for (let i = 0; i < Math.min(count, positions.length); i++) {
    enemies.push({
      id: `enemy_${i}`,
      position: { ...positions[i] },
      isAlive: true,
      direction: 'down',
      moveTimer: 0,
    });
  }
  
  return enemies;
};

export const createInitialGameState = (): GameState => ({
  grid: createInitialGrid(),
  player: createInitialPlayer(),
  enemies: createEnemies(3),
  bombs: [],
  explosions: [],
  powerups: [],
  score: 0,
  isGameOver: false,
  isWin: false,
  isPaused: false,
});

export const canMoveTo = (grid: CellType[][], pos: Position, bombs: Bomb[]): boolean => {
  if (pos.x < 0 || pos.x >= GRID_WIDTH || pos.y < 0 || pos.y >= GRID_HEIGHT) {
    return false;
  }
  
  const cell = grid[pos.y][pos.x];
  if (cell === 'wall' || cell === 'brick') {
    return false;
  }
  
  // Check for bombs
  const hasBomb = bombs.some(b => b.position.x === pos.x && b.position.y === pos.y);
  if (hasBomb) {
    return false;
  }
  
  return true;
};

export const getExplosionCells = (
  bomb: Bomb, 
  grid: CellType[][]
): Position[] => {
  const cells: Position[] = [bomb.position];
  const directions = [
    { dx: 0, dy: -1 }, // up
    { dx: 0, dy: 1 },  // down
    { dx: -1, dy: 0 }, // left
    { dx: 1, dy: 0 },  // right
  ];
  
  for (const dir of directions) {
    for (let i = 1; i <= bomb.radius; i++) {
      const x = bomb.position.x + dir.dx * i;
      const y = bomb.position.y + dir.dy * i;
      
      if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) break;
      
      const cell = grid[y][x];
      if (cell === 'wall') break;
      
      cells.push({ x, y });
      
      if (cell === 'brick') break; // Stop at brick but include it
    }
  }
  
  return cells;
};

export const getRandomPowerupType = (): PowerupType => {
  const types: PowerupType[] = ['bomb', 'fire', 'speed'];
  return types[Math.floor(Math.random() * types.length)];
};

export const shouldSpawnPowerup = (): boolean => {
  return Math.random() < POWERUP_CHANCE;
};

export const positionsEqual = (a: Position, b: Position): boolean => {
  return a.x === b.x && a.y === b.y;
};

export const getValidEnemyMoves = (
  enemy: Enemy, 
  grid: CellType[][], 
  bombs: Bomb[],
  explosions: Explosion[]
): Position[] => {
  const directions = [
    { x: enemy.position.x, y: enemy.position.y - 1 },
    { x: enemy.position.x, y: enemy.position.y + 1 },
    { x: enemy.position.x - 1, y: enemy.position.y },
    { x: enemy.position.x + 1, y: enemy.position.y },
  ];
  
  return directions.filter(pos => {
    if (!canMoveTo(grid, pos, bombs)) return false;
    
    // Avoid explosions
    const hasExplosion = explosions.some(e => positionsEqual(e.position, pos));
    if (hasExplosion) return false;
    
    return true;
  });
};