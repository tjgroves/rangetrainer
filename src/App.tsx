import { useState, useEffect } from "react";
import { Mode } from "./types";
import { POSITIONS, DRILL_LENGTHS, STORAGE, DrillLength } from "./constants";
import { storage } from "./utils/storage";
import { generateInitialRanges } from "./utils/hands";
import { RangeEditor } from "./components/RangeEditor";
import { DrillMode } from "./components/DrillMode";
import { useRangePresets } from "./hooks/useRangePresets";
import { useDrillMode } from "./hooks/useDrillMode";

function App() {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [ranges, setRanges] = useState(() =>
    storage.get(STORAGE.RANGES, generateInitialRanges(POSITIONS))
  );
  const [mode, setMode] = useState<Mode>("edit");
  const [selectedDrillLength, setSelectedDrillLength] = useState<DrillLength>(
    DRILL_LENGTHS[0]
  );

  const {
    presets,
    activePresetId,
    isAddingPreset,
    setIsAddingPreset,
    newPresetName,
    setNewPresetName,
    presetHandlers,
  } = useRangePresets();

  const {
    currentHand,
    score,
    drillComplete,
    drillResults,
    handleDrillAnswer,
    startDrill,
  } = useDrillMode(ranges);

  useEffect(() => {
    const lastPresetId = storage.get(STORAGE.LAST_PRESET, null);
    if (lastPresetId) {
      const preset = presets.find((p) => p.id === lastPresetId);
      if (preset) {
        setRanges(structuredClone(preset.ranges));
      }
    }
  }, [presets]);

  useEffect(() => {
    storage.set(STORAGE.RANGES, ranges);
  }, [ranges]);

  const toggleHand = (rowIndex: number, colIndex: number) => {
    if (mode === "drill") return;

    const position = POSITIONS[currentPosition];
    setRanges((prev) => {
      const newRanges = structuredClone(prev);
      newRanges[position][rowIndex][colIndex].selected =
        !newRanges[position][rowIndex][colIndex].selected;
      return newRanges;
    });
  };

  const enhancedPresetHandlers = {
    ...presetHandlers,
    save: () => presetHandlers.save(ranges),
    update: () => presetHandlers.update(ranges),
    load: (preset: Parameters<typeof presetHandlers.load>[0]) =>
      setRanges(presetHandlers.load(preset)),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {mode === "edit" ? (
            <RangeEditor
              currentPosition={currentPosition}
              setCurrentPosition={setCurrentPosition}
              ranges={ranges}
              toggleHand={toggleHand}
              selectedDrillLength={selectedDrillLength}
              setSelectedDrillLength={setSelectedDrillLength}
              startDrill={() => {
                setMode("drill");
                startDrill();
              }}
              presets={presets}
              isAddingPreset={isAddingPreset}
              setIsAddingPreset={setIsAddingPreset}
              newPresetName={newPresetName}
              setNewPresetName={setNewPresetName}
              activePresetId={activePresetId}
              presetHandlers={enhancedPresetHandlers}
            />
          ) : (
            <DrillMode
              currentHand={currentHand}
              score={score}
              drillComplete={drillComplete}
              selectedDrillLength={selectedDrillLength}
              drillResults={drillResults}
              handleDrillAnswer={handleDrillAnswer}
              setMode={setMode}
              startDrill={startDrill}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
