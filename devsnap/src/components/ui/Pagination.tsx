import NextLink from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  basePath: string;
}

function pageUrl(basePath: string, page: number) {
  return `${basePath}?page=${page}`;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export default function Pagination({ page, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-1">
      {page > 1 ? (
        <NextLink
          href={pageUrl(basePath, page - 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent transition-colors"
        >
          <ChevronLeft className="size-4" />
        </NextLink>
      ) : (
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border opacity-40 cursor-not-allowed">
          <ChevronLeft className="size-4" />
        </span>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-muted-foreground text-sm">
            …
          </span>
        ) : (
          <NextLink
            key={p}
            href={pageUrl(basePath, p)}
            className={cn(
              "inline-flex h-8 min-w-8 px-2 items-center justify-center rounded-md border text-sm transition-colors",
              p === page
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:bg-accent"
            )}
          >
            {p}
          </NextLink>
        )
      )}

      {page < totalPages ? (
        <NextLink
          href={pageUrl(basePath, page + 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent transition-colors"
        >
          <ChevronRight className="size-4" />
        </NextLink>
      ) : (
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border opacity-40 cursor-not-allowed">
          <ChevronRight className="size-4" />
        </span>
      )}
    </div>
  );
}
