"use client";

import {
  FileText,
  FileCode,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  File,
  Download,
} from "lucide-react";
import { useItemDrawer } from "@/components/item-drawer";
import { ItemCardData } from "@/lib/db/items";

function getFileIcon(fileName: string | null) {
  const ext = fileName?.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"].includes(ext))
    return <FileImage className="h-5 w-5 shrink-0 text-blue-400" />;
  if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext))
    return <FileVideo className="h-5 w-5 shrink-0 text-purple-400" />;
  if (["mp3", "wav", "ogg", "flac", "aac"].includes(ext))
    return <FileAudio className="h-5 w-5 shrink-0 text-green-400" />;
  if (["zip", "tar", "gz", "rar", "7z"].includes(ext))
    return <FileArchive className="h-5 w-5 shrink-0 text-yellow-400" />;
  if (["ts", "tsx", "js", "jsx", "py", "rs", "go", "java", "cs", "cpp", "c", "rb", "php"].includes(ext))
    return <FileCode className="h-5 w-5 shrink-0 text-orange-400" />;
  if (["txt", "md", "pdf", "doc", "docx", "csv", "json", "yaml", "yml", "xml"].includes(ext))
    return <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />;
  return <File className="h-5 w-5 shrink-0 text-muted-foreground" />;
}

function formatFileSize(bytes: number | null): string {
  if (bytes === null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface FileListRowProps {
  item: ItemCardData;
}

export default function FileListRow({ item }: FileListRowProps) {
  const { openDrawer } = useItemDrawer();

  return (
    <div
      onClick={() => openDrawer(item.id)}
      className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-accent"
    >
      {getFileIcon(item.fileName)}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
        <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground sm:flex-nowrap">
          {item.fileName && (
            <span className="truncate">{item.fileName}</span>
          )}
          <span className="shrink-0">{formatFileSize(item.fileSize)}</span>
          <span className="shrink-0">{formatDate(item.createdAt)}</span>
        </div>
      </div>

      <a
        href={`/api/download/${item.id}`}
        download
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title="Download"
      >
        <Download className="h-4 w-4" />
      </a>
    </div>
  );
}
