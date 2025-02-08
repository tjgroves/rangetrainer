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
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPosition(prev => Math.max(0, prev - 1))}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={currentPosition === 0}
            aria-label="Previous position"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold bg-violet-600 px-6 py-2 rounded-lg">{position}</h2>
          <button
            onClick={() => setCurrentPosition(prev => Math.min(POSITIONS.length - 1, prev + 1))}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                  className="w-4 h-4 bg-gray-700 border-gray-600 focus:ring-1 focus:ring-violet-500"
                />
                <span className="text-sm whitespace-nowrap">{length} hands</span>
              </label>
            ))}
          </div>
          <button
            onClick={startDrill}
            className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors shadow-sm hover:shadow-violet-500/20 text-base w-full sm:w-auto justify-center"
          >
            <Calculator className="w-4 h-4" />
            <span>Start Drill</span>
          </button>
        </div>
      </div>

      <div className="relative bg-gray-800/50 rounded-xl p-3 sm:p-4 mb-4 backdrop-blur-sm overflow-x-auto">
        <div className="grid grid-cols-13 gap-0.5 sm:gap-1 min-w-[600px]">
          {ranges[position].map((row, rowIndex) => (
            row.map((cell, colIndex) => {
              const isPair = cell.hand[0] === cell.hand[1];
              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => toggleHand(rowIndex, colIndex)}
                  className={`
                    relative group p-1 sm:p-1.5 text-xs sm:text-sm font-mono rounded-md text-white
                    transition-all duration-200 transform hover:scale-105
                    ${cell.selected
                      ? 'bg-violet-600 hover:bg-violet-500 shadow-lg hover:shadow-violet-500/20'
                      : 'bg-gray-700 hover:bg-gray-600'
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

      <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <h3 className="text-base font-semibold">Range Presets</h3>
          <div className="flex items-center gap-2">
            {activePresetId && (
              <button
                onClick={presetHandlers.update}
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm shadow-lg"
                title="Save changes to current preset"
              >
                <RefreshCw className="w-4 h-4" />
                Update
              </button>
            )}
            <button
              onClick={() => setIsAddingPreset(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors text-sm shadow-lg hover:shadow-violet-500/20"
            >
              <Plus className="w-4 h-4" />
              New Preset
            </button>
          </div>
        </div>

        {isAddingPreset && (
          <div className="flex flex-col sm:flex-row items-center gap-2 mb-4 bg-gray-700/50 p-3 rounded-lg backdrop-blur-sm">
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="Enter preset name"
              className="w-full sm:flex-1 px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-sm"
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={presetHandlers.save}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors text-sm shadow-lg hover:shadow-violet-500/20"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setIsAddingPreset(false);
                  setNewPresetName('');
                }}
                className="flex-1 sm:flex-initial px-4 py-2 bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors text-sm shadow-lg hover:shadow-violet-500/20"
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
                className={`bg-gray-700/50 rounded-lg p-3 backdrop-blur-sm transition-all duration-200
                  ${isActive ? 'ring-2 ring-violet-500 shadow-lg shadow-violet-500/10' : ''}
                  hover:shadow-lg hover:shadow-violet-500/5`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-medium text-sm">{preset.name}</h4>
                    {isActive && (
                      <Check className="w-3.5 h-3.5 text-violet-500" />
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
                  className={`w-full px-3 py-2 rounded-lg transition-colors text-sm shadow-md
                    ${isActive 
                      ? 'bg-violet-600 hover:bg-violet-500 hover:shadow-violet-500/20'
                      : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                >
                  {isActive ? 'Active' : 'Load Preset'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}