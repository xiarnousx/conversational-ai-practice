export interface EditorPreferences {
  fontSize: number;
  tabSize: 2 | 4;
  wordWrap: "on" | "off";
  minimap: boolean;
  theme: "vs-dark" | "monokai" | "github-dark";
}

export const DEFAULT_EDITOR_PREFERENCES: EditorPreferences = {
  fontSize: 14,
  tabSize: 2,
  wordWrap: "on",
  minimap: false,
  theme: "vs-dark",
};

export function parseEditorPreferences(raw: unknown): EditorPreferences {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_EDITOR_PREFERENCES };
  const p = raw as Record<string, unknown>;
  return {
    fontSize: typeof p.fontSize === "number" ? p.fontSize : DEFAULT_EDITOR_PREFERENCES.fontSize,
    tabSize: p.tabSize === 2 || p.tabSize === 4 ? p.tabSize : DEFAULT_EDITOR_PREFERENCES.tabSize,
    wordWrap: p.wordWrap === "on" || p.wordWrap === "off" ? p.wordWrap : DEFAULT_EDITOR_PREFERENCES.wordWrap,
    minimap: typeof p.minimap === "boolean" ? p.minimap : DEFAULT_EDITOR_PREFERENCES.minimap,
    theme:
      p.theme === "vs-dark" || p.theme === "monokai" || p.theme === "github-dark"
        ? p.theme
        : DEFAULT_EDITOR_PREFERENCES.theme,
  };
}
