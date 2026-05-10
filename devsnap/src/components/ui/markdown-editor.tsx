"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

export function MarkdownEditor({
  value,
  readOnly = false,
  onChange,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">(readOnly ? "preview" : "write");
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="overflow-hidden rounded-md border border-border">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#1e1e1e] px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>

        <div className="flex items-center gap-3">
          {!readOnly && (
            <div className="flex items-center gap-0.5 text-xs">
              <button
                type="button"
                onClick={() => setTab("write")}
                className={`rounded px-1.5 py-0.5 transition-colors ${
                  tab === "write" ? "text-white/90" : "text-white/40 hover:text-white/70"
                }`}
              >
                Write
              </button>
              <span className="text-white/20">|</span>
              <button
                type="button"
                onClick={() => setTab("preview")}
                className={`rounded px-1.5 py-0.5 transition-colors ${
                  tab === "preview" ? "text-white/90" : "text-white/40 hover:text-white/70"
                }`}
              >
                Preview
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={handleCopy}
            title="Copy"
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

      {/* Body */}
      <div className="bg-[#2d2d2d]">
        {!readOnly && tab === "write" ? (
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="Write markdown…"
            className="w-full resize-none bg-transparent p-3 text-sm text-white/90 placeholder:text-white/30 focus:outline-none"
            style={{ minHeight: 200, maxHeight: 400, overflowY: "auto", fieldSizing: "content" } as React.CSSProperties}
          />
        ) : (
          <div
            className="markdown-preview overflow-y-auto p-3"
            style={{ minHeight: 200, maxHeight: 400 }}
          >
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className="text-sm italic text-white/30">No content</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
