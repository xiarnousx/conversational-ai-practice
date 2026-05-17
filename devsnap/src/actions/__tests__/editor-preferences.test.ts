import { describe, it, expect } from "vitest";
import { editorPreferencesSchema } from "@/lib/validations/editor-preferences";
import {
  parseEditorPreferences,
  DEFAULT_EDITOR_PREFERENCES,
} from "@/types/editor-preferences";

// ── editorPreferencesSchema ────────────────────────────────────────────────

describe("editorPreferencesSchema", () => {
  const valid = {
    fontSize: 14,
    tabSize: 2,
    wordWrap: "on" as const,
    minimap: false,
    theme: "vs-dark" as const,
  };

  it("accepts a fully valid payload", () => {
    expect(editorPreferencesSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts tabSize 4", () => {
    expect(editorPreferencesSchema.safeParse({ ...valid, tabSize: 4 }).success).toBe(true);
  });

  it("rejects tabSize 3", () => {
    const result = editorPreferencesSchema.safeParse({ ...valid, tabSize: 3 });
    expect(result.success).toBe(false);
  });

  it("rejects fontSize below 10", () => {
    const result = editorPreferencesSchema.safeParse({ ...valid, fontSize: 9 });
    expect(result.success).toBe(false);
  });

  it("rejects fontSize above 24", () => {
    const result = editorPreferencesSchema.safeParse({ ...valid, fontSize: 25 });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown wordWrap value", () => {
    const result = editorPreferencesSchema.safeParse({ ...valid, wordWrap: "auto" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown theme", () => {
    const result = editorPreferencesSchema.safeParse({ ...valid, theme: "light" });
    expect(result.success).toBe(false);
  });

  it("accepts all valid themes", () => {
    const themes = ["vs-dark", "monokai", "github-dark"] as const;
    for (const theme of themes) {
      expect(editorPreferencesSchema.safeParse({ ...valid, theme }).success).toBe(true);
    }
  });

  it("rejects non-boolean minimap", () => {
    const result = editorPreferencesSchema.safeParse({ ...valid, minimap: "yes" });
    expect(result.success).toBe(false);
  });
});

// ── parseEditorPreferences ─────────────────────────────────────────────────

describe("parseEditorPreferences", () => {
  it("returns defaults when passed null", () => {
    expect(parseEditorPreferences(null)).toEqual(DEFAULT_EDITOR_PREFERENCES);
  });

  it("returns defaults when passed undefined", () => {
    expect(parseEditorPreferences(undefined)).toEqual(DEFAULT_EDITOR_PREFERENCES);
  });

  it("returns defaults when passed a non-object", () => {
    expect(parseEditorPreferences("string")).toEqual(DEFAULT_EDITOR_PREFERENCES);
    expect(parseEditorPreferences(42)).toEqual(DEFAULT_EDITOR_PREFERENCES);
  });

  it("returns defaults when passed an empty object", () => {
    expect(parseEditorPreferences({})).toEqual(DEFAULT_EDITOR_PREFERENCES);
  });

  it("parses a fully valid preferences object", () => {
    const input = {
      fontSize: 16,
      tabSize: 4,
      wordWrap: "off",
      minimap: true,
      theme: "monokai",
    };
    expect(parseEditorPreferences(input)).toEqual({
      fontSize: 16,
      tabSize: 4,
      wordWrap: "off",
      minimap: true,
      theme: "monokai",
    });
  });

  it("falls back to default fontSize when invalid", () => {
    const result = parseEditorPreferences({ fontSize: "big" });
    expect(result.fontSize).toBe(DEFAULT_EDITOR_PREFERENCES.fontSize);
  });

  it("falls back to default tabSize when value is not 2 or 4", () => {
    const result = parseEditorPreferences({ tabSize: 3 });
    expect(result.tabSize).toBe(DEFAULT_EDITOR_PREFERENCES.tabSize);
  });

  it("falls back to default wordWrap for unknown value", () => {
    const result = parseEditorPreferences({ wordWrap: "auto" });
    expect(result.wordWrap).toBe(DEFAULT_EDITOR_PREFERENCES.wordWrap);
  });

  it("falls back to default theme for unknown value", () => {
    const result = parseEditorPreferences({ theme: "dracula" });
    expect(result.theme).toBe(DEFAULT_EDITOR_PREFERENCES.theme);
  });

  it("falls back to default minimap when not boolean", () => {
    const result = parseEditorPreferences({ minimap: "yes" });
    expect(result.minimap).toBe(DEFAULT_EDITOR_PREFERENCES.minimap);
  });

  it("accepts tabSize 2 and 4 but not others", () => {
    expect(parseEditorPreferences({ tabSize: 2 }).tabSize).toBe(2);
    expect(parseEditorPreferences({ tabSize: 4 }).tabSize).toBe(4);
    expect(parseEditorPreferences({ tabSize: 8 }).tabSize).toBe(DEFAULT_EDITOR_PREFERENCES.tabSize);
  });

  it("accepts all valid themes", () => {
    expect(parseEditorPreferences({ theme: "vs-dark" }).theme).toBe("vs-dark");
    expect(parseEditorPreferences({ theme: "monokai" }).theme).toBe("monokai");
    expect(parseEditorPreferences({ theme: "github-dark" }).theme).toBe("github-dark");
  });
});
