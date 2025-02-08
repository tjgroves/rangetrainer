import React from 'react';
import { ArrowLeft, ArrowRight, Calculator, Plus, RefreshCw, Save, Trash2, Check } from 'lucide-react';
import { HandCell, Position, Preset } from '../types';
import { POSITIONS, DRILL_LENGTHS, DrillLength } from '../constants';

type RangeEditorProps = {
  currentPosition: number;
  setCurrentPosition: (value: number | ((prev: number) => number)) => void;
  ranges: Record<Position, HandCell[][]>;
  toggleHand: (rowIndex: number, colIndex: number) => void;
  selectedDrillLength: DrillLength;
  setSelectedDrillLength: React.Dispatch<React.SetStateAction<DrillLength>>;
  startDrill: () => void;
  presets: Preset[];
  isAddingPreset: boolean;
  setIsAddingPreset: (value: boolean) => void;
  newPresetName: string;
  setNewPresetName: (value: string) => void;
  activePresetId: string | null;
  presetHandlers: {
    save: () => void;
    load: (preset: Preset) => void;
    delete: (id: string) => void;
    update: () => void;
  };
};

export function RangeEditor({
  currentPosition,
  setCurrentPosition,
  ranges,
  toggleHand,
  selectedDrillLength,
  setSelectedDrillLength,
  startDrill,
  presets,
  isAddingPreset,
  setIsAddingPreset,
  newPresetName,
  setNewPresetName,
  activePresetId,
  presetHandlers
}: RangeEditorProps) {
  const position = POSITIONS[currentPosition];
  if (!position || !ranges[position]) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPosition(prev => Math.max(0, prev - 1))}
            className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPosition === 0}
            aria-label="Previous position"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-white bg-poker-violet-600 px-4 py-1 rounded-lg">{position}</h2>
          <button
            onClick={() => setCurrentPosition(prev => Math.min(POSITIONS.length - 1, prev + 1))}
            className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPosition === POSITIONS.length - 1}
            aria-label="Next position"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex flex-wrap justify-center items-center gap-3">
            {DRILL_LENGTHS.map(length => (
              <label key={length} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="drillLength"
                  value={length}
                  checked={selectedDrillLength === length}
                  onChange={() => setSelectedDrillLength(length)}
                  className="w-4 h-4 bg-gray-700 border-gray-600 focus:ring-1 focus:ring-poker-violet-400"
                />
                <span className="text-sm text-white">{length} hands</span>
              </label>
            ))}
          </div>
          <button
            onClick={startDrill}
            className="flex items-center gap-1.5 px-4 py-2 bg-poker-violet-600 hover:bg-poker-violet-500 rounded-lg transition-colors text-white shadow-lg hover:shadow-poker-violet-500/20 text-base w-full sm:w-auto justify-center font-medium"
          >
            <Calculator className="w-4 h-4" />
            <span>Start Drill</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-800/80 rounded-xl p-3 sm:p-4 backdrop-blur-sm overflow-x-auto">
        <div className="grid grid-cols-13 gap-0.5 sm:gap-1 min-w-[600px]">
          {ranges[position].map((row, rowIndex) => (
            row.map((cell, colIndex) => {
              const isPair = cell.hand[0] === cell.hand[1];
              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => toggleHand(rowIndex, colIndex)}
                  className={`
                    relative group h-11 text-xs sm:text-sm font-mono rounded-md
                    flex items-center justify-center
                    transition-all duration-200 transform hover:scale-105
                    ${cell.selected
                      ? 'bg-poker-violet-600 hover:bg-poker-violet-500 text-white shadow-lg hover:shadow-poker-violet-500/20'
                      : 'bg-gray-700/90 hover:bg-gray-600 text-gray-100 border border-gray-600/50'
                    }
                    ${isPair ? 'font-bold' : ''}
                  `}
                >
                  {cell.hand}
                  <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </button>
              );
            })
          ))}
        </div>
      </div>

      <div className="bg-gray-800/80 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-white">Range Presets</h3>
          <div className="flex items-center gap-2">
            {activePresetId && (
              <button
                onClick={presetHandlers.update}
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm shadow-lg text-white font-medium"
                title="Save changes to current preset"
              >
                <RefreshCw className="w-4 h-4" />
                Update
              </button>
            )}
            <button
              onClick={() => setIsAddingPreset(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-poker-violet-600 hover:bg-poker-violet-500 rounded-lg transition-colors text-sm shadow-lg hover:shadow-poker-violet-500/20 text-white font-medium"
            >
              <Plus className="w-4 h-4" />
              New Preset
            </button>
          </div>
        </div>

        {isAddingPreset && (
          <div className="flex flex-col sm:flex-row items-center gap-2 mb-6 bg-gray-700/50 p-4 rounded-lg backdrop-blur-sm border border-gray-600/50">
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="Enter preset name"
              className="w-full sm:flex-1 px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-poker-violet-400 focus:ring-1 focus:ring-poker-violet-400 outline-none text-sm text-white placeholder-gray-400"
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={presetHandlers.save}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-poker-violet-600 hover:bg-poker-violet-500 rounded-lg transition-colors text-sm shadow-lg hover:shadow-poker-violet-500/20 text-white font-medium"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setIsAddingPreset(false);
                  setNewPresetName('');
                }}
                className="flex-1 sm:flex-initial px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm shadow-lg text-white font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {presets.map(preset => {
            const isActive = preset.id === activePresetId;
            return (
              <div
                key={preset.id}
                className={`
                  rounded-lg p-4 transition-all duration-200
                  ${isActive 
                    ? 'bg-gray-700/90 ring-2 ring-poker-violet-400 shadow-lg shadow-poker-violet-500/10' 
                    : 'bg-gray-700/50 border border-gray-600/50 hover:bg-gray-700/80'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-medium text-sm text-white">{preset.name}</h4>
                    {isActive && (
                      <Check className="w-3.5 h-3.5 text-poker-violet-400" />
                    )}
                  </div>
                  <button
                    onClick={() => presetHandlers.delete(preset.id)}
                    className="p-1 hover:bg-gray-600 rounded-lg transition-colors"
                    aria-label="Delete preset"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
                <button
                  onClick={() => presetHandlers.load(preset)}
                  className={`
                    w-full px-3 py-2 rounded-lg transition-colors text-sm shadow-md font-medium
                    ${isActive 
                      ? 'bg-poker-violet-600 hover:bg-poker-violet-500 text-white hover:shadow-poker-violet-500/20'
                      : 'bg-gray-600/80 hover:bg-gray-600 text-white border border-gray-500/50'
                    }
                  `}
                >
                  {isActive ? 'Active' : 'Load Preset'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}