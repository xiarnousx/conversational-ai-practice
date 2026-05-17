"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateEditorPreferences } from "@/actions/editor-preferences";
import {
  type EditorPreferences,
} from "@/types/editor-preferences";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Props {
  initialPrefs: EditorPreferences;
}

export default function EditorPreferencesForm({ initialPrefs }: Props) {
  const [prefs, setPrefs] = useState<EditorPreferences>(initialPrefs);
  const [, startTransition] = useTransition();

  function handleChange<K extends keyof EditorPreferences>(key: K, value: EditorPreferences[K]) {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    startTransition(async () => {
      const result = await updateEditorPreferences(next);
      if (result.success) {
        toast.success("Editor preference saved");
      } else {
        toast.error(result.error ?? "Failed to save preference");
        setPrefs(prefs);
      }
    });
  }

  return (
    <div className="space-y-5">
      {/* Font size */}
      <div className="flex items-center justify-between gap-4">
        <Label className="text-sm text-foreground">Font Size</Label>
        <Select
          value={String(prefs.fontSize)}
          onValueChange={(v) => handleChange("fontSize", Number(v))}
        >
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[12, 13, 14, 15, 16, 18, 20].map((s) => (
              <SelectItem key={s} value={String(s)}>
                {s}px
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tab size */}
      <div className="flex items-center justify-between gap-4">
        <Label className="text-sm text-foreground">Tab Size</Label>
        <Select
          value={String(prefs.tabSize)}
          onValueChange={(v) => handleChange("tabSize", (Number(v) === 4 ? 4 : 2) as 2 | 4)}
        >
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 spaces</SelectItem>
            <SelectItem value="4">4 spaces</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Theme */}
      <div className="flex items-center justify-between gap-4">
        <Label className="text-sm text-foreground">Theme</Label>
        <Select
          value={prefs.theme}
          onValueChange={(v) =>
            handleChange("theme", v as EditorPreferences["theme"])
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vs-dark">VS Dark</SelectItem>
            <SelectItem value="monokai">Monokai</SelectItem>
            <SelectItem value="github-dark">GitHub Dark</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Word wrap */}
      <div className="flex items-center justify-between gap-4">
        <Label className="text-sm text-foreground">Word Wrap</Label>
        <Switch
          checked={prefs.wordWrap === "on"}
          onCheckedChange={(checked) =>
            handleChange("wordWrap", checked ? "on" : "off")
          }
        />
      </div>

      {/* Minimap */}
      <div className="flex items-center justify-between gap-4">
        <Label className="text-sm text-foreground">Minimap</Label>
        <Switch
          checked={prefs.minimap}
          onCheckedChange={(checked) => handleChange("minimap", checked)}
        />
      </div>
    </div>
  );
}
