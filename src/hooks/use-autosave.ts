"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Proposal } from "@/lib/types";

interface AutosaveState {
  isSaving: boolean;
  lastSaved: Date | null;
}

export function useAutosave(
  formState: Proposal,
  proposalId?: string,
  debounceMs = 2000
) {
  const [autosaveState, setAutosaveState] = useState<AutosaveState>({
    isSaving: false,
    lastSaved: null,
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const save = useCallback(
    async (data: Proposal) => {
      setAutosaveState((prev) => ({ ...prev, isSaving: true }));

      // For now, log to console. Server Action integration comes later.
      console.log(
        `[Autosave] ${proposalId ?? "new"} — saving at ${new Date().toISOString()}`,
        data
      );

      // Simulate a short delay so the indicator is visible
      await new Promise((resolve) => setTimeout(resolve, 300));

      setAutosaveState({ isSaving: false, lastSaved: new Date() });
    },
    [proposalId]
  );

  useEffect(() => {
    // Skip autosave on initial mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      save(formState);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formState, debounceMs, save]);

  return autosaveState;
}
