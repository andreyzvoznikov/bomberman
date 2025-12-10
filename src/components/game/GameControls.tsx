import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Circle } from 'lucide-react';

export const GameControls = () => {
  return (
    <div className="game-card">
      <h3 className="font-arcade text-sm text-primary mb-4">CONTROLS</h3>
      
      <div className="space-y-4 text-sm">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-arcade">W</kbd>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-arcade">A</kbd>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-arcade">S</kbd>
            <kbd className="px-2 py-1 bg-muted rounded text-xs font-arcade">D</kbd>
          </div>
          <span className="text-muted-foreground">or</span>
          <div className="flex gap-1">
            <ArrowUp className="w-4 h-4 text-muted-foreground" />
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            <ArrowDown className="w-4 h-4 text-muted-foreground" />
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-foreground">Move</span>
        </div>

        <div className="flex items-center gap-3">
          <kbd className="px-3 py-1 bg-muted rounded text-xs font-arcade">SPACE</kbd>
          <span className="text-foreground">Place Bomb</span>
        </div>

        <div className="flex items-center gap-3">
          <kbd className="px-2 py-1 bg-muted rounded text-xs font-arcade">ESC</kbd>
          <span className="text-foreground">Pause</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="font-arcade text-xs text-secondary mb-3">POWER-UPS</h4>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-secondary rounded flex items-center justify-center">
              <Circle className="w-2 h-2" />
            </div>
            <span>+1 Bomb</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-game-explosion/80 rounded flex items-center justify-center">
              <span className="text-[8px]">🔥</span>
            </div>
            <span>+1 Range</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary/80 rounded flex items-center justify-center">
              <span className="text-[8px]">⚡</span>
            </div>
            <span>+Speed</span>
          </div>
        </div>
      </div>
    </div>
  );
};