"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Copy, Layers, Pencil, Pin, Star, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { updateItem } from "@/actions/items";
import type { ItemDetail } from "@/lib/db/items";

// ─── Context ────────────────────────────────────────────────────────────────

interface ItemDrawerContextValue {
  openDrawer: (id: string) => void;
}

const ItemDrawerContext = createContext<ItemDrawerContextValue | null>(null);

export function useItemDrawer() {
  const ctx = useContext(ItemDrawerContext);
  if (!ctx) throw new Error("useItemDrawer must be used within ItemDrawerProvider");
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ItemDrawerProvider({ children }: { children: ReactNode }) {
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const openDrawer = useCallback((id: string) => setOpenItemId(id), []);

  useEffect(() => {
    if (!openItemId) {
      setItem(null);
      return;
    }
    setLoading(true);
    setItem(null);
    fetch(`/api/items/${openItemId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ItemDetail | null) => setItem(data))
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [openItemId]);

  return (
    <ItemDrawerContext.Provider value={{ openDrawer }}>
      {children}
      <Sheet
        open={!!openItemId}
        onOpenChange={(open) => {
          if (!open) setOpenItemId(null);
        }}
      >
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
        >
          {loading || !item ? (
            <DrawerSkeleton />
          ) : (
            <DrawerContent item={item} onUpdate={setItem} />
          )}
        </SheetContent>
      </Sheet>
    </ItemDrawerContext.Provider>
  );
}

// ─── Drawer content ──────────────────────────────────────────────────────────

const CONTENT_TYPES = new Set(["snippet", "prompt", "command", "note"]);
const LANGUAGE_TYPES = new Set(["snippet", "command"]);
const URL_TYPES = new Set(["url", "link"]);

interface DrawerContentProps {
  item: ItemDetail;
  onUpdate: (updated: ItemDetail) => void;
}

function DrawerContent({ item, onUpdate }: DrawerContentProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const typeLower = item.typeName.toLowerCase();
  const showContent = CONTENT_TYPES.has(typeLower);
  const showLanguage = LANGUAGE_TYPES.has(typeLower);
  const showUrl = URL_TYPES.has(typeLower);

  const [form, setForm] = useState({
    title: item.title,
    description: item.description ?? "",
    content: item.content ?? "",
    language: item.language ?? "",
    url: item.url ?? "",
    tags: item.tags.join(", "),
  });

  function startEdit() {
    setForm({
      title: item.title,
      description: item.description ?? "",
      content: item.content ?? "",
      language: item.language ?? "",
      url: item.url ?? "",
      tags: item.tags.join(", "),
    });
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
  }

  async function handleSave() {
    setSaving(true);
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const result = await updateItem(item.id, {
      title: form.title,
      description: form.description || null,
      content: form.content || null,
      language: form.language || null,
      url: form.url || null,
      tags,
    });

    setSaving(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    onUpdate(result.data);
    setIsEditing(false);
    toast.success("Item saved");
    router.refresh();
  }

  function handleCopy() {
    const text = item.content ?? item.url ?? item.title;
    navigator.clipboard.writeText(text);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <>
      {/* Header */}
      <SheetHeader className="shrink-0 border-b border-border p-4 pr-12">
        {isEditing ? (
          <div className="space-y-1">
            <Label htmlFor="item-title" className="sr-only">Title</Label>
            <Input
              id="item-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Title"
              className="text-base font-semibold"
            />
          </div>
        ) : (
          <SheetTitle>{item.title}</SheetTitle>
        )}
        <div className="flex items-center gap-1.5">
          <span
            className="rounded px-1.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${item.typeColor}20`, color: item.typeColor }}
          >
            {item.typeName}
          </span>
          {!isEditing && item.language && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
              {item.language}
            </span>
          )}
        </div>
      </SheetHeader>

      {/* Action bar */}
      {isEditing ? (
        <div className="flex shrink-0 items-center gap-1.5 border-b border-border px-3 py-1.5">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving || !form.title.trim()}
          >
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button variant="ghost" size="sm" onClick={cancelEdit} disabled={saving}>
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex shrink-0 items-center gap-0.5 border-b border-border px-3 py-1.5">
          <Button
            variant="ghost"
            size="sm"
            className={item.isFavorite ? "text-yellow-400 hover:text-yellow-400" : ""}
          >
            <Star className={item.isFavorite ? "fill-yellow-400" : ""} />
            Favorite
          </Button>
          <Button variant="ghost" size="sm">
            <Pin />
            Pin
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            <Copy />
            Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={startEdit}>
            <Pencil />
            Edit
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 />
            Delete
          </Button>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
        {isEditing ? (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="item-description">Description</Label>
              <Textarea
                id="item-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Optional description"
                rows={2}
              />
            </div>

            {showContent && (
              <div className="space-y-1.5">
                <Label htmlFor="item-content">Content</Label>
                <Textarea
                  id="item-content"
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="Content"
                  rows={8}
                  className="font-mono text-xs"
                />
              </div>
            )}

            {showLanguage && (
              <div className="space-y-1.5">
                <Label htmlFor="item-language">Language</Label>
                <Input
                  id="item-language"
                  value={form.language}
                  onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
                  placeholder="e.g. typescript"
                />
              </div>
            )}

            {showUrl && (
              <div className="space-y-1.5">
                <Label htmlFor="item-url">URL</Label>
                <Input
                  id="item-url"
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  placeholder="https://…"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="item-tags">Tags</Label>
              <Input
                id="item-tags"
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder="react, typescript, hooks"
              />
              <p className="text-xs text-muted-foreground">Comma-separated</p>
            </div>

            <section>
              <SectionLabel icon={<Calendar className="size-3" />}>Details</SectionLabel>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Type</dt>
                  <dd className="text-foreground">{item.typeName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Created</dt>
                  <dd className="text-foreground">{formatDate(item.createdAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Updated</dt>
                  <dd className="text-foreground">{formatDate(item.updatedAt)}</dd>
                </div>
              </dl>
            </section>
          </>
        ) : (
          <>
            {item.description && (
              <section>
                <SectionLabel>Description</SectionLabel>
                <p className="text-sm text-foreground">{item.description}</p>
              </section>
            )}

            {item.content && (
              <section>
                <SectionLabel>Content</SectionLabel>
                <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs text-foreground whitespace-pre-wrap wrap-break-word">
                  {item.content}
                </pre>
              </section>
            )}

            {item.url && (
              <section>
                <SectionLabel>URL</SectionLabel>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-sm text-primary underline underline-offset-2"
                >
                  {item.url}
                </a>
              </section>
            )}

            {item.tags.length > 0 && (
              <section>
                <SectionLabel icon={<Tag className="size-3" />}>Tags</SectionLabel>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {item.collections.length > 0 && (
              <section>
                <SectionLabel icon={<Layers className="size-3" />}>Collections</SectionLabel>
                <div className="flex flex-wrap gap-1.5">
                  {item.collections.map((c) => (
                    <span
                      key={c.id}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section>
              <SectionLabel icon={<Calendar className="size-3" />}>Details</SectionLabel>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Created</dt>
                  <dd className="text-foreground">{formatDate(item.createdAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Updated</dt>
                  <dd className="text-foreground">{formatDate(item.updatedAt)}</dd>
                </div>
              </dl>
            </section>
          </>
        )}
      </div>
    </>
  );
}

function SectionLabel({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <h3 className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {icon}
      {children}
    </h3>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function DrawerSkeleton() {
  return (
    <>
      <div className="shrink-0 border-b border-border p-4 pr-12">
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-1/4 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-7 w-16 animate-pulse rounded bg-muted" />
        ))}
      </div>
      <div className="flex flex-col gap-6 p-4">
        <div className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          <div className="h-28 animate-pulse rounded bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-12 animate-pulse rounded bg-muted" />
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-5 w-12 animate-pulse rounded-full bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
