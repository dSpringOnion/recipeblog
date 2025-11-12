import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface UseAutoSaveOptions {
  key: string;
  data: any;
  delay?: number; // milliseconds
  enabled?: boolean;
}

export function useAutoSave({ 
  key, 
  data, 
  delay = 2000, 
  enabled = true 
}: UseAutoSaveOptions) {
  const [savedData, setSavedData] = useLocalStorage(key, null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Auto-save effect
  useEffect(() => {
    if (!enabled || !data) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      setIsSaving(true);
      setSavedData(data);
      setLastSaved(new Date());
      setIsSaving(false);
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, setSavedData]);

  // Manual save function
  const saveNow = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsSaving(true);
    setSavedData(data);
    setLastSaved(new Date());
    setIsSaving(false);
  };

  // Clear saved data
  const clearSaved = () => {
    setSavedData(null);
    setLastSaved(null);
  };

  // Check if there's saved data to restore
  const hasSavedData = savedData !== null;

  return {
    savedData,
    lastSaved,
    isSaving,
    saveNow,
    clearSaved,
    hasSavedData
  };
}