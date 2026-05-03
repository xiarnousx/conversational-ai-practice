"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { createItem } from "@/actions/items";

const ITEM_TYPES = ["snippet", "prompt", "command", "note", "link"] as const;
type ItemTypeName = (typeof ITEM_TYPES)[number];

const CONTENT_TYPES = new Set<ItemTypeName>(["snippet", "prompt", "command", "note"]);
const LANGUAGE_TYPES = new Set<ItemTypeName>(["snippet", "command"]);

const INITIAL_FORM = {
  title: "",
  description: "",
  content: "",
  language: "",
  url: "",
  tags: "",
};

export function NewItemDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ItemTypeName>("snippet");
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const showContent = CONTENT_TYPES.has(type);
  const showLanguage = LANGUAGE_TYPES.has(type);
  const isLink = type === "link";

  function reset() {
    setType("snippet");
    setForm(INITIAL_FORM);
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    setOpen(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const result = await createItem({
      title: form.title,
      typeName: type,
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

    toast.success("Item created");
    setOpen(false);
    reset();
    router.refresh();
  }

  const canSubmit =
    !!form.title.trim() && (!isLink || !!form.url.trim()) && !saving;

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-1" />
        New Item
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>New Item</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type selector */}
            <div className="space-y-1.5">
              <Label>Type</Label>
              <div className="flex flex-wrap gap-1.5">
                {ITEM_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                      type === t
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="new-item-title">Title *</Label>
              <Input
                id="new-item-title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Item title"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="new-item-description">Description</Label>
              <Textarea
                id="new-item-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Optional description"
                rows={2}
              />
            </div>

            {/* Content */}
            {showContent && (
              <div className="space-y-1.5">
                <Label htmlFor="new-item-content">Content</Label>
                <Textarea
                  id="new-item-content"
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="Content"
                  rows={6}
                  className="font-mono text-xs"
                />
              </div>
            )}

            {/* Language */}
            {showLanguage && (
              <div className="space-y-1.5">
                <Label htmlFor="new-item-language">Language</Label>
                <Input
                  id="new-item-language"
                  value={form.language}
                  onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
                  placeholder="e.g. typescript"
                />
              </div>
            )}

            {/* URL */}
            {isLink && (
              <div className="space-y-1.5">
                <Label htmlFor="new-item-url">URL *</Label>
                <Input
                  id="new-item-url"
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  placeholder="https://…"
                  required
                />
              </div>
            )}

            {/* Tags */}
            <div className="space-y-1.5">
              <Label htmlFor="new-item-tags">Tags</Label>
              <Input
                id="new-item-tags"
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder="react, typescript, hooks"
              />
              <p className="text-xs text-muted-foreground">Comma-separated</p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!canSubmit}>
                {saving ? "Creating…" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
