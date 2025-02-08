import { HandCell, Position, Rank } from '../types';
import { RANKS } from '../constants';

export const generateHandMatrix = (): HandCell[][] => {
  const matrix: HandCell[][] = [];
  for (let i = 0; i < RANKS.length; i++) {
    const row: HandCell[] = [];
    for (let j = 0; j < RANKS.length; j++) {
      const rank1 = RANKS[i];
      const rank2 = RANKS[j];
      row.push({
        hand: i === j ? `${rank1}${rank1}` : i < j ? `${rank1}${rank2}s` : `${rank2}${rank1}o`,
        selected: false
      });
    }
    matrix.push(row);
  }
  return matrix;
};

export const generateInitialRanges = (positions: readonly Position[]): Record<Position, HandCell[][]> => {
  const ranges = {} as Record<Position, HandCell[][]>;
  positions.forEach(pos => {
    ranges[pos] = generateHandMatrix();
  });
  return ranges;
};

type Card = {
  rank: string;
  suit: '♠' | '♥';
};

export const parseHandToCards = (hand: string): Card[] => {
  if (!hand || hand.length < 2) {
    throw new Error('Invalid hand format');
  }

  const [first, second] = hand;
  const isPair = first === second;
  const isSuited = hand.includes('s');
  
  if (!RANKS.includes(first as Rank) || !RANKS.includes(second as Rank)) {
    throw new Error('Invalid card ranks');
  }

  return [
    { rank: convertRankForUrl(first), suit: '♠' },
    { rank: convertRankForUrl(second), suit: isPair || !isSuited ? '♥' : '♠' }
  ];
};

const convertRankForUrl = (rank: string): string => {
  switch (rank) {
    case 'T': return '10';
    case 'J': return 'JACK';
    case 'Q': return 'QUEEN';
    case 'K': return 'KING';
    case 'A': return 'ACE';
    default: return rank;
  }
};