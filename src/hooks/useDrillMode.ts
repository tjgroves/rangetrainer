import { useState } from 'react';
import { DrillResult, HandCell, Position } from '../types';
import { POSITIONS, RANKS } from '../constants';

export function useDrillMode(ranges: Record<Position, HandCell[][]>) {
  const [currentHand, setCurrentHand] = useState<{ cards: string; position: Position } | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [drillComplete, setDrillComplete] = useState(false);
  const [drillResults, setDrillResults] = useState<DrillResult[]>([]);

  const generateNewDrillHand = () => {
    const position = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
    const rowIndex = Math.floor(Math.random() * RANKS.length);
    const colIndex = Math.floor(Math.random() * RANKS.length);
    const hand = ranges[position][rowIndex][colIndex].hand;
    setCurrentHand({ cards: hand, position });
  };

  const handleDrillAnswer = (answer: boolean, selectedDrillLength: number) => {
    if (!currentHand) return;

    // Find the exact hand in the ranges
    const isSelected = ranges[currentHand.position].flat().find(
      cell => cell.hand === currentHand.cards
    )?.selected ?? false;

    const result: DrillResult = {
      hand: currentHand.cards,
      position: currentHand.position,
      expected: isSelected,
      actual: answer
    };

    setDrillResults(prev => [...prev, result]);

    setScore(prev => {
      const newScore = {
        correct: prev.correct + (isSelected === answer ? 1 : 0),
        total: prev.total + 1
      };
      
      if (newScore.total >= selectedDrillLength) {
        setDrillComplete(true);
      } else {
        generateNewDrillHand();
      }

      return newScore;
    });
  };

  const startDrill = () => {
    setScore({ correct: 0, total: 0 });
    setDrillComplete(false);
    setDrillResults([]);
    generateNewDrillHand();
  };

  return {
    currentHand,
    score,
    drillComplete,
    drillResults,
    handleDrillAnswer,
    startDrill
  };
}