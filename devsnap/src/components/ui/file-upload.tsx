"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  url: string;
  fileName: string;
  fileSize: number;
}

interface FileUploadProps {
  accept: "image" | "file";
  value?: UploadedFile | null;
  onChange?: (file: UploadedFile | null) => void;
}

const IMAGE_ACCEPT = ".png,.jpg,.jpeg,.gif,.webp,.svg";
const FILE_ACCEPT = ".pdf,.txt,.md,.json,.yaml,.yml,.xml,.csv,.toml,.ini";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({ accept, value, onChange }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);

      const localPreview = accept === "image" ? URL.createObjectURL(file) : null;
      if (localPreview) setPreviewObjectUrl(localPreview);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      setUploading(false);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError((body as { error?: string }).error ?? "Upload failed");
        if (localPreview) { URL.revokeObjectURL(localPreview); setPreviewObjectUrl(null); }
        return;
      }

      const data = (await res.json()) as UploadedFile;
      onChange?.(data);
    },
    [accept, onChange]
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  function handleClear() {
    onChange?.(null);
    setError(null);
    if (previewObjectUrl) { URL.revokeObjectURL(previewObjectUrl); setPreviewObjectUrl(null); }
  }

  const acceptAttr = accept === "image" ? IMAGE_ACCEPT : FILE_ACCEPT;
  const Icon = accept === "image" ? ImageIcon : FileText;

  if (value) {
    const isImage = accept === "image";
    return (
      <div className="rounded-lg border border-border bg-muted/40 p-3">
        {isImage && previewObjectUrl ? (
          <div className="relative mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewObjectUrl}
              alt={value.fileName}
              className="max-h-48 w-full rounded object-contain"
            />
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <Icon className="size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{value.fileName}</p>
            <p className="text-xs text-muted-foreground">{formatBytes(value.fileSize)}</p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="rounded p-1 text-muted-foreground hover:text-foreground"
            aria-label="Remove file"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        disabled={uploading}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 text-sm transition-colors",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/40",
          uploading && "cursor-not-allowed opacity-60"
        )}
      >
        <Upload className="size-6 text-muted-foreground" />
        {uploading ? (
          <span className="text-muted-foreground">Uploading…</span>
        ) : (
          <>
            <span className="font-medium">Click or drag to upload</span>
            <span className="text-xs text-muted-foreground">
              {accept === "image"
                ? "PNG, JPG, GIF, WEBP, SVG — max 5 MB"
                : "PDF, TXT, MD, JSON, YAML, XML, CSV, TOML — max 10 MB"}
            </span>
          </>
        )}
      </button>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
