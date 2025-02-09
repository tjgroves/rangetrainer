// Game types
export type Rank = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';
export type Position = 'BTN' | 'CO' | 'MP' | 'UTG';
export type Mode = 'edit' | 'drill';
export type HandType = 'pair' | 'suited' | 'offsuit';

export type HandCell = {
  hand: string;
  selected: boolean;
};

export type DrillResult = {
  hand: string;
  position: Position;
  expected: boolean;
  actual: boolean;
};

export type Preset = {
  id: string;
  name: string;
  ranges: Record<Position, HandCell[][]>;
};