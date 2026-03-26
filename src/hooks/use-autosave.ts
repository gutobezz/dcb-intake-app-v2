"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Proposal } from "@/lib/types";

interface AutosaveState {
  isSaving: boolean;
  lastSaved: Date | null;
}

export function useAutosave(
  formState: Proposal,
  onSave: (data: Proposal) => Promise<void>,
  debounceMs = 2000
) {
  const [autosaveState, setAutosaveState] = useState<AutosaveState>({
    isSaving: false,
    lastSaved: null,
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const isSavingRef = useRef(false);

  const save = useCallback(
    async (data: Proposal) => {
      if (isSavingRef.current) return;
      isSavingRef.current = true;
      setAutosaveState((prev) => ({ ...prev, isSaving: true }));

      try {
        await onSave(data);
        setAutosaveState({ isSaving: false, lastSaved: new Date() });
      } catch (err) {
        console.error("[Autosave] Failed:", err);
        setAutosaveState((prev) => ({ ...prev, isSaving: false }));
      } finally {
        isSavingRef.current = false;
      }
    },
    [onSave]
  );

  const saveNow = useCallback(
    (data: Proposal) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return save(data);
    },
    [save]
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      save(formState);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [formState, debounceMs, save]);

  return { ...autosaveState, saveNow };
}
