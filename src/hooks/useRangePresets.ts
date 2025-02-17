import { useState, useEffect } from "react";
import { HandCell, Position, Preset } from "../types";
import { storage } from "../utils/storage";
import { STORAGE } from "../constants";

export function useRangePresets() {
  const [presets, setPresets] = useState<Preset[]>(() => {
    const stored = storage.get(STORAGE.PRESETS, []);
    return Array.isArray(stored) ? stored : [];
  });

  const [activePresetId, setActivePresetId] = useState<string | null>(() => {
    const lastPresetId = storage.get(STORAGE.LAST_PRESET, null);
    return typeof lastPresetId === "string" ? lastPresetId : null;
  });

  const [isAddingPreset, setIsAddingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");

  // Persist presets whenever they change
  useEffect(() => {
    if (presets.length > 0) {
      storage.set(STORAGE.PRESETS, presets);
    }
  }, [presets]);

  // Persist active preset ID whenever it changes
  useEffect(() => {
    if (activePresetId) {
      storage.set(STORAGE.LAST_PRESET, activePresetId);
    }
  }, [activePresetId]);

  const presetHandlers = {
    save: (ranges: Record<Position, HandCell[][]>) => {
      if (!newPresetName.trim()) return;

      const newPreset: Preset = {
        id: crypto.randomUUID(),
        name: newPresetName.trim(),
        ranges: structuredClone(ranges),
      };

      setPresets((prev) => {
        const updated = [...prev, newPreset];
        return updated;
      });

      setIsAddingPreset(false);
      setNewPresetName("");
      setActivePresetId(newPreset.id);
    },

    load: (preset: Preset) => {
      setActivePresetId(preset.id);
      return structuredClone(preset.ranges);
    },

    delete: (presetId: string) => {
      setPresets((prev) => {
        const updated = prev.filter((p) => p.id !== presetId);
        return updated;
      });

      if (activePresetId === presetId) {
        setActivePresetId(null);
        storage.set(STORAGE.LAST_PRESET, null);
      }
    },

    update: (ranges: Record<Position, HandCell[][]>) => {
      if (!activePresetId) return;

      setPresets((prev) => {
        const updated = prev.map((preset) =>
          preset.id === activePresetId
            ? { ...preset, ranges: structuredClone(ranges) }
            : preset
        );
        return updated;
      });
    },
  };

  return {
    presets,
    activePresetId,
    isAddingPreset,
    setIsAddingPreset,
    newPresetName,
    setNewPresetName,
    presetHandlers,
  };
}
