import React from "react";
import { Plus, Save, Trash2, Check, Drill } from "lucide-react";
import { HandCell, Position, Preset } from "../types";
import { POSITIONS, DRILL_LENGTHS, DrillLength } from "../constants";

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
  presetHandlers,
}: RangeEditorProps) {
  const position = POSITIONS[currentPosition];
  if (!position || !ranges[position]) return null;

  return (
    <div className="space-y-4">
      {/* Main content area */}
      <div className="bg-gray-800/80 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="text-white font-medium whitespace-nowrap">
              Positions:
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {POSITIONS.map((pos, index) => (
                <label
                  key={pos}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="position"
                    value={index}
                    checked={currentPosition === index}
                    onChange={() => setCurrentPosition(index)}
                    className="w-4 h-4 bg-gray-700 border-gray-600 focus:ring-1 focus:ring-poker-violet-400"
                  />
                  <span className="text-sm text-white font-medium">{pos}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {DRILL_LENGTHS.map((length) => (
                <label
                  key={length}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="drillLength"
                    value={length}
                    checked={selectedDrillLength === length}
                    onChange={() => setSelectedDrillLength(length)}
                    className="w-4 h-4 bg-gray-700 border-gray-600 focus:ring-1 focus:ring-poker-violet-400"
                  />
                  <span className="text-sm text-white whitespace-nowrap">
                    {length} hands
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={startDrill}
              className="flex items-center gap-1.5 px-4 py-2 bg-poker-violet-600 hover:bg-poker-violet-500 rounded-lg transition-colors text-white shadow-lg hover:shadow-poker-violet-500/20 text-base font-medium w-full sm:w-auto justify-center sm:justify-start"
            >
              <Drill className="w-4 h-4 text-yellow-300" />
              <span>Start Drill</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        {/* Range chart */}
        <div className="bg-gray-800/80 rounded-xl p-4 backdrop-blur-sm order-1">
          <div className="grid grid-cols-13 gap-1">
            {ranges[position].map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const isPair = cell.hand[0] === cell.hand[1];
                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => toggleHand(rowIndex, colIndex)}
                    className={`
                      relative group h-11 text-sm font-mono rounded-md
                      flex items-center justify-center
                      transition-all duration-200 transform hover:scale-105
                      ${
                        cell.selected
                          ? "bg-poker-violet-600 hover:bg-poker-violet-500 text-white shadow-lg hover:shadow-poker-violet-500/20"
                          : "bg-gray-700/90 hover:bg-gray-600 text-gray-100 border border-gray-600/50"
                      }
                      ${isPair ? "font-bold" : ""}
                    `}
                  >
                    {cell.hand}
                    <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Preset sidebar */}
        <div className="bg-gray-800/80 rounded-xl backdrop-blur-sm flex flex-col order-2">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Range Presets
              </h3>
              <button
                onClick={() => setIsAddingPreset(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-poker-violet-600 hover:bg-poker-violet-500 rounded-lg transition-colors text-sm shadow-lg hover:shadow-poker-violet-500/20 text-white font-medium"
              >
                <Plus className="w-4 h-4" />
                New
              </button>
            </div>

            {isAddingPreset && (
              <div className="flex flex-col gap-2 mt-4 bg-gray-700/50 p-3 rounded-lg backdrop-blur-sm border border-gray-600/50">
                <input
                  type="text"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="Enter preset name"
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-poker-violet-400 focus:ring-1 focus:ring-poker-violet-400 outline-none text-sm text-white placeholder-gray-400"
                />
                <div className="flex gap-2">
                  <button
                    onClick={presetHandlers.save}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-poker-violet-600 hover:bg-poker-violet-500 rounded-lg transition-colors text-sm shadow-lg hover:shadow-poker-violet-500/20 text-white font-medium"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingPreset(false);
                      setNewPresetName("");
                    }}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm shadow-lg text-white font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {presets.map((preset) => {
              const isActive = preset.id === activePresetId;
              return (
                <div
                  key={preset.id}
                  className={`
                    rounded-lg p-3 transition-all duration-200
                    ${
                      isActive
                        ? "bg-gray-700/90 ring-2 ring-poker-violet-400 shadow-lg shadow-poker-violet-500/10"
                        : "bg-gray-700/50 border border-gray-600/50 hover:bg-gray-700/80"
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-medium text-sm text-white">
                        {preset.name}
                      </h4>
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => presetHandlers.load(preset)}
                      className={`
                        flex-1 px-3 py-1.5 rounded-lg transition-colors text-sm shadow-md font-medium
                        ${
                          isActive
                            ? "bg-poker-violet-600 hover:bg-poker-violet-500 text-white hover:shadow-poker-violet-500/20"
                            : "bg-gray-600/80 hover:bg-gray-600 text-white border border-gray-500/50"
                        }
                      `}
                    >
                      {isActive ? "Active" : "Load"}
                    </button>
                    {isActive && (
                      <button
                        onClick={presetHandlers.update}
                        className="px-3 py-1.5 bg-gray-600/80 hover:bg-gray-600 rounded-lg transition-colors text-sm shadow-md text-white font-medium border border-gray-500/50"
                        title="Save changes to current preset"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
