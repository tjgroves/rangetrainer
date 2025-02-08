import { useState } from 'react';
import { HandCell, Position, Preset } from '../types';
import { storage } from '../utils/storage';
import { STORAGE } from '../constants';

export function useRangePresets() {
  const [presets, setPresets] = useState<Preset[]>(() => storage.get(STORAGE.PRESETS, []));
  const [activePresetId, setActivePresetId] = useState<string | null>(() => storage.get(STORAGE.LAST_PRESET, null));
  const [isAddingPreset, setIsAddingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');

  const presetHandlers = {
    save: (ranges: Record<Position, HandCell[][]>) => {
      if (!newPresetName.trim()) return;

      const newPreset: Preset = {
        id: crypto.randomUUID(),
        name: newPresetName.trim(),
        ranges: structuredClone(ranges)
      };

      setPresets(prev => {
        const updated = [...prev, newPreset];
        storage.set(STORAGE.PRESETS, updated);
        return updated;
      });

      setIsAddingPreset(false);
      setNewPresetName('');
      setActivePresetId(newPreset.id);
      storage.set(STORAGE.LAST_PRESET, newPreset.id);
    },
    load: (preset: Preset) => {
      setActivePresetId(preset.id);
      storage.set(STORAGE.LAST_PRESET, preset.id);
      return structuredClone(preset.ranges);
    },
    delete: (presetId: string) => {
      setPresets(prev => {
        const updated = prev.filter(p => p.id !== presetId);
        storage.set(STORAGE.PRESETS, updated);
        return updated;
      });

      if (activePresetId === presetId) {
        setActivePresetId(null);
        storage.set(STORAGE.LAST_PRESET, null);
      }
    },
    update: (ranges: Record<Position, HandCell[][]>) => {
      if (!activePresetId) return;
      
      setPresets(prev => {
        const updated = prev.map(preset => 
          preset.id === activePresetId
            ? { ...preset, ranges: structuredClone(ranges) }
            : preset
        );
        storage.set(STORAGE.PRESETS, updated);
        return updated;
      });
    }
  };

  return {
    presets,
    activePresetId,
    isAddingPreset,
    setIsAddingPreset,
    newPresetName,
    setNewPresetName,
    presetHandlers
  };
}