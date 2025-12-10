import { Player, Enemy } from '@/game/types';
import { Bomb, Flame, Zap, Ghost, Trophy } from 'lucide-react';

interface GameHUDProps {
  player: Player;
  enemies: Enemy[];
  score: number;
}

export const GameHUD = ({ player, enemies, score }: GameHUDProps) => {
  const aliveEnemies = enemies.filter(e => e.isAlive).length;

  return (
    <div className="flex items-center justify-between gap-8 px-6 py-4 bg-card rounded-xl border border-border">
      {/* Score */}
      <div className="flex items-center gap-3">
        <Trophy className="w-5 h-5 text-primary" />
        <div className="text-right">
          <div className="text-xs text-muted-foreground font-arcade">SCORE</div>
          <div className="text-xl font-arcade text-primary">{score.toString().padStart(6, '0')}</div>
        </div>
      </div>

      {/* Player stats */}
      <div className="flex items-center gap-6">
        {/* Bombs */}
        <div className="flex items-center gap-2">
          <Bomb className="w-5 h-5 text-foreground" />
          <span className="font-arcade text-sm">{player.maxBombs}</span>
        </div>

        {/* Fire range */}
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-game-explosion" />
          <span className="font-arcade text-sm">{player.explosionRadius}</span>
        </div>

        {/* Speed */}
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-arcade text-sm">{player.speed.toFixed(1)}x</span>
        </div>
      </div>

      {/* Enemies remaining */}
      <div className="flex items-center gap-3">
        <Ghost className="w-5 h-5 text-game-enemy" />
        <div className="text-right">
          <div className="text-xs text-muted-foreground font-arcade">ENEMIES</div>
          <div className="text-xl font-arcade text-game-enemy">{aliveEnemies}</div>
        </div>
      </div>
    </div>
  );
};