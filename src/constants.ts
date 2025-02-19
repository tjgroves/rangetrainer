import { Position, Rank } from './types';

export const POSITIONS: Position[] = ['UTG', 'MP', 'CO', 'BTN'];
export const RANKS: Rank[] = [
  'A',
  'K',
  'Q',
  'J',
  'T',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
];
export const DRILL_LENGTHS = [10, 50, 100] as const;
export type DrillLength = (typeof DRILL_LENGTHS)[number];

export const STORAGE = {
  RANGES: 'poker-trainer-ranges',
  PRESETS: 'poker-trainer-presets',
  LAST_PRESET: 'poker-trainer-last-preset',
} as const;
