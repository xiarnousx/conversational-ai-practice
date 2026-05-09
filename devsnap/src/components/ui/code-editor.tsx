"use client";

import { useRef, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { Check, Copy } from "lucide-react";

interface CodeEditorProps {
  value: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

export function CodeEditor({
  value,
  language = "plaintext",
  readOnly = false,
  onChange,
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [height, setHeight] = useState(200);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;
    const updateHeight = () => {
      const contentHeight = Math.min(Math.max(editor.getContentHeight(), 200), 400);
      setHeight(contentHeight);
      editor.layout();
    };
    editor.onDidContentSizeChange(updateHeight);
    updateHeight();
  };

  function handleCopy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const displayLanguage = language && language !== "plaintext" ? language : null;

  return (
    <div className="overflow-hidden rounded-md border border-border">
      {/* macOS-style header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#1e1e1e] px-3 py-2">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>

        {/* Language + copy */}
        <div className="flex items-center gap-2">
          {displayLanguage && (
            <span className="text-xs text-white/40 lowercase">{displayLanguage}</span>
          )}
          <button
            type="button"
            onClick={handleCopy}
            title="Copy code"
            className="flex items-center text-white/40 transition-colors hover:text-white/80"
          >
            {copied ? (
              <Check className="size-3.5 text-green-400" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div style={{ height }}>
        <Editor
          value={value}
          language={language || "plaintext"}
          theme="vs-dark"
          onMount={handleMount}
          onChange={(val) => onChange?.(val ?? "")}
          options={{
            readOnly,
            domReadOnly: readOnly,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 12,
            lineNumbers: "on",
            folding: false,
            wordWrap: "on",
            automaticLayout: true,
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
              useShadows: false,
            },
            overviewRulerBorder: false,
            overviewRulerLanes: 0,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: readOnly ? "none" : "line",
          }}
        />
      </div>
    </div>
  );
}
