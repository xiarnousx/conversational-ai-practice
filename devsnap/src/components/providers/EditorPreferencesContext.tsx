"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";
import { updateEditorPreferences } from "@/actions/editor-preferences";
import {
  type EditorPreferences,
  DEFAULT_EDITOR_PREFERENCES,
} from "@/types/editor-preferences";

interface EditorPreferencesContextValue {
  prefs: EditorPreferences;
  updatePref: <K extends keyof EditorPreferences>(
    key: K,
    value: EditorPreferences[K]
  ) => Promise<void>;
}

const EditorPreferencesContext = createContext<EditorPreferencesContextValue>({
  prefs: DEFAULT_EDITOR_PREFERENCES,
  updatePref: async () => {},
});

export function EditorPreferencesProvider({
  initialPrefs,
  children,
}: {
  initialPrefs: EditorPreferences;
  children: React.ReactNode;
}) {
  const [prefs, setPrefs] = useState<EditorPreferences>(initialPrefs);

  const updatePref = useCallback(
    async <K extends keyof EditorPreferences>(key: K, value: EditorPreferences[K]) => {
      const next = { ...prefs, [key]: value };
      setPrefs(next);
      const result = await updateEditorPreferences(next);
      if (result.success) {
        toast.success("Editor preference saved");
      } else {
        toast.error(result.error ?? "Failed to save preference");
        setPrefs(prefs);
      }
    },
    [prefs]
  );

  return (
    <EditorPreferencesContext.Provider value={{ prefs, updatePref }}>
      {children}
    </EditorPreferencesContext.Provider>
  );
}

export function useEditorPreferences() {
  return useContext(EditorPreferencesContext);
}
