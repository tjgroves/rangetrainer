import { useState, useEffect, useRef } from 'react';
import { DrillResult, Position } from '../types';
import { parseHandToCards } from '../utils/hands';
import { DrillLength } from '../constants';
import { Trophy, RefreshCw, ArrowLeft, Clock, Target, CheckCircle, XCircle } from 'lucide-react';

function Feedback({ isCorrect, show }: { isCorrect: boolean; show: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`
        fixed top-8 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg
        transition-all duration-500
        ${isCorrect ? 'bg-green-500/90' : 'bg-red-500/90'}
        backdrop-blur-sm
        ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}
      `}
      aria-live="polite"
      role="status"
    >
      {isCorrect ? (
        <CheckCircle className="w-6 h-6" />
      ) : (
        <XCircle className="w-6 h-6" />
      )}
      <span className="font-bold text-lg">
        {isCorrect ? 'Correct!' : 'Incorrect'}
      </span>
    </div>
  );
}

type DrillModeProps = {
  currentHand: { cards: string; position: Position } | null;
  score: { correct: number; total: number };
  drillComplete: boolean;
  selectedDrillLength: DrillLength;
  drillResults: DrillResult[];
  handleDrillAnswer: (answer: boolean, drillLength: DrillLength) => boolean;
  setMode: (mode: 'edit' | 'drill') => void;
  startDrill: () => void;
};

export function DrillMode({
  currentHand,
  score,
  drillComplete,
  selectedDrillLength,
  drillResults,
  handleDrillAnswer,
  setMode,
  startDrill
}: DrillModeProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const feedbackTimeoutRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  const getCardImageUrl = (card: { rank: string; suit: '♠' | '♥' }) => {
    const rankMap: Record<string, string> = {
      '10': '0',
      'JACK': 'J',
      'QUEEN': 'Q',
      'KING': 'K',
      'ACE': 'A'
    };
    const rank = rankMap[card.rank] || card.rank;
    const suit = card.suit === '♠' ? 'S' : 'H';
    return `https://deckofcardsapi.com/static/img/${rank}${suit}.png`;
  };

  const handleAnswer = (answer: boolean) => {
    if (!currentHand) return;

    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    const isCorrect = handleDrillAnswer(answer, selectedDrillLength);
    setLastAnswerCorrect(isCorrect);
    setShowFeedback(true);

    feedbackTimeoutRef.current = window.setTimeout(() => {
      setShowFeedback(false);
    }, 1000);
  };

  if (drillComplete) {
    const accuracy = (score.correct / score.total) * 100;
    const incorrectHands = drillResults.filter(r => r.expected !== r.actual);
    const hasIncorrectHands = incorrectHands.length > 0;

    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-poker-violet-400/20 to-poker-violet-600/20 mb-4">
            <Trophy className="w-10 h-10 text-poker-violet-400" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Drill Complete!</h2>
          <p className="text-gray-400">Here's how you performed</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-poker-violet-600/20">
              <Target className="w-5 h-5 text-poker-violet-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Score</p>
              <p className="text-xl font-bold">
                <span className="text-poker-violet-400">{score.correct}</span>
                <span className="text-gray-600 mx-1">/</span>
                <span className="text-gray-300">{score.total}</span>
              </p>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-poker-violet-600/20">
              <Clock className="w-5 h-5 text-poker-violet-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Accuracy</p>
              <p className="text-xl font-bold">
                <span className={accuracy >= 70 ? "text-green-400" : "text-yellow-400"}>
                  {Math.round(accuracy)}%
                </span>
              </p>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 sm:col-span-2 lg:col-span-1">
            <div className="p-3 rounded-lg bg-poker-violet-600/20">
              <RefreshCw className="w-5 h-5 text-poker-violet-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Incorrect Hands</p>
              <p className="text-xl font-bold">
                <span className={incorrectHands.length === 0 ? "text-green-400" : "text-red-400"}>
                  {incorrectHands.length}
                </span>
              </p>
            </div>
          </div>
        </div>

        {hasIncorrectHands && (
          <div className="w-full mb-8 space-y-4">
            <h3 className="text-xl font-semibold text-gray-300 mb-4">Review Mistakes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {incorrectHands.map((result, index) => {
                const cards = parseHandToCards(result.hand);
                return (
                  <div 
                    key={index}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center"
                  >
                    <div className="flex -space-x-8 mb-4">
                      {cards.map((card, cardIndex) => (
                        <img
                          key={cardIndex}
                          src={getCardImageUrl(card)}
                          alt={`${card.rank}${card.suit}`}
                          className="w-24 h-36 object-contain drop-shadow-lg first:rotate-[-5deg] last:rotate-[5deg]"
                        />
                      ))}
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <span className="px-3 py-1.5 bg-poker-violet-900/50 text-poker-violet-200 rounded-lg text-sm font-medium">
                        {result.position}
                      </span>

                      <div className="flex items-center gap-4 mt-2">
                        <div className="text-center px-3">
                          <p className="text-xs text-gray-400 mb-1">Expected</p>
                          <span className={`text-sm font-medium ${result.expected ? "text-green-400" : "text-red-400"}`}>
                            {result.expected ? "Raise" : "Fold"}
                          </span>
                        </div>
                        <div className="h-8 w-px bg-gray-700"></div>
                        <div className="text-center px-3">
                          <p className="text-xs text-gray-400 mb-1">Your Answer</p>
                          <span className={`text-sm font-medium ${result.actual ? "text-green-400" : "text-red-400"}`}>
                            {result.actual ? "Raise" : "Fold"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
          <button
            onClick={startDrill}
            className="w-full sm:flex-1 px-6 py-3 bg-poker-violet-600 hover:bg-poker-violet-500 rounded-xl font-bold text-base shadow-lg hover:shadow-poker-violet-500/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={() => setMode('edit')}
            className="w-full sm:flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-base shadow-lg hover:shadow-gray-500/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </button>
        </div>
      </div>
    );
  }

  if (!currentHand) return null;

  return (
    <>
      <Feedback isCorrect={lastAnswerCorrect} show={showFeedback} />

      <div className="flex flex-col items-center max-w-6xl mx-auto">
        <div className="relative w-full max-w-3xl aspect-[2/1] mx-auto">
          <div className="absolute inset-0 translate-y-3 rounded-[40%] bg-black/25 blur-xl"></div>
          
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-emerald-900 rounded-[40%] border-[14px] border-[#5C4033]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_60%)]"></div>

              {Object.entries({
                'BTN': { top: '75%', left: '85%' },
                'CO': { top: '30%', left: '85%' },
                'HJ': { top: '15%', left: '65%' },
                'LJ': { top: '15%', left: '35%' },
                'SB': { top: '75%', left: '15%' },
                'BB': { top: '30%', left: '15%' }
              }).map(([pos, { top, left }]) => (
                <div
                  key={pos}
                  className={`absolute ${
                    pos === currentHand?.position 
                      ? `bg-poker-violet-600
                         border border-white/90
                         animate-[position-pulse_2s_ease-in-out_infinite]
                         z-10
                         text-white
                         font-black` 
                      : `bg-slate-800
                         hover:scale-105
                         -translate-x-1/2 -translate-y-1/2
                         shadow-lg`
                  } rounded-full w-12 h-12 flex items-center justify-center 
                     transition-all duration-300
                     font-bold tracking-wide text-base
                     backdrop-blur-sm
                     text-slate-200`}
                  style={{ top, left }}
                >
                  {pos}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-6">
          {parseHandToCards(currentHand.cards).map((card, index) => (
            <div key={index} className="transform hover:-translate-y-2 transition-transform">
              <img
                src={getCardImageUrl(card)}
                alt={`${card.rank}${card.suit}`}
                className="w-28 h-42 object-contain drop-shadow-xl"
              />
            </div>
          ))}
        </div>

        <div className="text-center space-y-4 mt-6">
          <div className="inline-block px-5 py-2.5 bg-gray-800/90 rounded-xl mb-2 border border-poker-violet-700 shadow-lg backdrop-blur-sm">
            <p className="text-gray-300 text-sm uppercase tracking-wider mb-1">Current Position</p>
            <p className="text-xl font-bold text-poker-violet-300">{currentHand.position}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => handleAnswer(false)}
              className="px-7 py-2.5 bg-red-600 rounded-xl hover:bg-red-500 font-bold min-w-[130px] text-base shadow-lg hover:shadow-red-500/20 transition-all duration-300"
            >
              Fold
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="px-7 py-2.5 bg-green-600 rounded-xl hover:bg-green-500 font-bold min-w-[130px] text-base shadow-lg hover:shadow-green-500/20 transition-all duration-300"
            >
              Raise
            </button>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-5 text-center backdrop-blur-sm w-full max-w-sm mx-auto mt-6">
          <div className="flex items-center justify-center gap-10">
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Progress</p>
              <p className="text-lg font-bold">
                <span className="text-poker-violet-300">{score.total}</span>
                <span className="text-gray-500 mx-1">/</span>
                <span>{selectedDrillLength}</span>
              </p>
            </div>
            <div className="h-12 w-px bg-gray-700"></div>
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Correct</p>
              <p className="text-lg font-bold text-green-500">{score.correct}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}