import { DrillResult, Position } from '../types';
import { parseHandToCards } from '../utils/hands';
import { DrillLength } from '../constants';

type DrillModeProps = {
  currentHand: { cards: string; position: Position } | null;
  score: { correct: number; total: number };
  drillComplete: boolean;
  selectedDrillLength: DrillLength;
  drillResults: DrillResult[];
  handleDrillAnswer: (answer: boolean) => void;
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

  if (drillComplete) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 bg-gray-800/50 p-4 rounded-xl">
            <div className="text-center">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Score</p>
              <p className="text-2xl font-bold">
                <span className="text-poker-violet-300">{score.correct}</span>
                <span className="text-gray-500 mx-1">/</span>
                <span>{score.total}</span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Accuracy</p>
              <p className="text-2xl font-bold">
                <span className={score.correct / score.total >= 0.7 ? "text-green-500" : "text-yellow-500"}>
                  {Math.round((score.correct / score.total) * 100)}%
                </span>
              </p>
            </div>
          </div>

          {drillResults.filter(r => r.expected !== r.actual).length > 0 && (
            <div className="w-full bg-gray-950 rounded-xl p-4 shadow-lg mb-6">
              <h3 className="text-xl font-bold mb-4 text-red-400">Incorrect Hands</h3>
              <div className="grid grid-cols-1 gap-4">
                {drillResults
                  .filter(r => r.expected !== r.actual)
                  .map((result, index) => {
                    const cards = parseHandToCards(result.hand);
                    return (
                      <div key={index} 
                        className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-900 rounded-xl border border-poker-violet-700 hover:border-poker-violet-600 transition-colors shadow-md"
                      >
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
                          <div className="flex -space-x-4">
                            {cards.map((card, cardIndex) => (
                              <div key={cardIndex} className="relative">
                                <img
                                  src={getCardImageUrl(card)}
                                  alt={`${card.rank}${card.suit}`}
                                  className="w-20 h-28 object-contain drop-shadow-lg"
                                />
                              </div>
                            ))}
                          </div>
                          <span className="text-base font-medium px-4 py-2 bg-poker-violet-900 text-poker-violet-200 rounded-lg">
                            {result.position}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 w-full sm:w-auto justify-center mt-3 sm:mt-0 sm:ml-auto">
                          <div className="flex items-center gap-6">
                            <div className="w-24 text-center">
                              <p className="text-sm text-gray-300 mb-1.5">Expected</p>
                              <span className={`text-base ${result.expected ? "text-green-400" : "text-red-400"}`}>
                                {result.expected ? "Raise" : "Fold"}
                              </span>
                            </div>
                            <div className="h-12 w-px bg-poker-violet-800"></div>
                            <div className="w-24 text-center">
                              <p className="text-sm text-gray-300 mb-1.5">Your Answer</p>
                              <span className={`text-base ${result.actual ? "text-green-400" : "text-red-400"}`}>
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={startDrill}
              className="w-full sm:w-auto px-6 py-3 bg-poker-violet-600 hover:bg-poker-violet-500 rounded-xl transition-colors duration-300 font-bold text-base shadow-lg hover:shadow-poker-violet-500/20"
            >
              Try Again
            </button>
            <button
              onClick={() => setMode('edit')}
              className="w-full sm:w-auto px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors duration-300 font-bold text-base shadow-lg hover:shadow-gray-500/20"
            >
              Back to Range Editor
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentHand) return null;

  return (
    <div className="flex flex-col items-center max-w-6xl mx-auto space-y-6">
      <div className="relative w-full max-w-3xl aspect-[2/1] mx-auto">
        {/* Table shadow */}
        <div className="absolute inset-0 translate-y-3 rounded-[40%] bg-black/25 blur-xl"></div>
        
        {/* Main table */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-emerald-900 rounded-[40%] border-[14px] border-[#5C4033]">
            {/* Simple felt texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_60%)]"></div>

            {/* Position markers */}
            {Object.entries({
              'BTN': { top: '75%', left: '85%', color: 'bg-slate-800' },
              'CO': { top: '30%', left: '85%', color: 'bg-slate-800' },
              'HJ': { top: '15%', left: '65%', color: 'bg-slate-800' },
              'LJ': { top: '15%', left: '35%', color: 'bg-slate-800' },
              'SB': { top: '75%', left: '15%', color: 'bg-amber-700' },
              'BB': { top: '30%', left: '15%', color: 'bg-red-700' }
            }).map(([pos, { top, left, color }]) => (
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
                    : `${color}
                       hover:scale-105
                       -translate-x-1/2 -translate-y-1/2
                       shadow-lg`
                } rounded-full w-12 h-12 flex items-center justify-center 
                   transition-all duration-300
                   font-bold tracking-wide text-base
                   backdrop-blur-sm
                   ${!currentHand?.position || pos !== currentHand.position 
                     ? !['SB', 'BB'].includes(pos)
                       ? 'text-slate-200'
                       : 'text-white'
                     : ''}`}
                style={{ top, left }}
              >
                {pos}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3">
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

      <div className="text-center space-y-4">
        <div className="inline-block px-5 py-2.5 bg-gray-800/90 rounded-xl mb-2 border border-poker-violet-700 shadow-lg backdrop-blur-sm">
          <p className="text-gray-300 text-sm uppercase tracking-wider mb-1">Current Position</p>
          <p className="text-xl font-bold text-poker-violet-300">{currentHand.position}</p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => handleDrillAnswer(false)}
            className="px-7 py-2.5 bg-red-600 rounded-xl hover:bg-red-500 font-bold min-w-[130px] text-base shadow-lg hover:shadow-red-500/20 transition-all duration-300"
          >
            Fold
          </button>
          <button
            onClick={() => handleDrillAnswer(true)}
            className="px-7 py-2.5 bg-green-600 rounded-xl hover:bg-green-500 font-bold min-w-[130px] text-base shadow-lg hover:shadow-green-500/20 transition-all duration-300"
          >
            Raise
          </button>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-5 text-center backdrop-blur-sm w-full max-w-sm mx-auto">
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
  );
}