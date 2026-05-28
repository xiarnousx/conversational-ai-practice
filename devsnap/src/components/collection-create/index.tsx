"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderPlus } from "lucide-react";
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
import { createCollection } from "@/actions/collections";

const INITIAL_FORM = { name: "", description: "" };

export function NewCollectionDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  function handleOpen() {
    setForm(INITIAL_FORM);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setForm(INITIAL_FORM);
  }

  function handleOpenChange(next: boolean) {
    if (!next) handleClose();
    else handleOpen();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const result = await createCollection({
      name: form.name,
      description: form.description || null,
    });

    setSaving(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Collection created");
    handleClose();
    router.refresh();
  }

  const canSubmit = !!form.name.trim() && !saving;

  return (
    <>
      <Button size="sm" variant="outline" onClick={handleOpen} title="New Collection">
        <FolderPlus className="h-4 w-4 md:mr-1" />
        <span className="hidden md:inline">New Collection</span>
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>New Collection</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="new-collection-name">Name *</Label>
              <Input
                id="new-collection-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Collection name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="new-collection-description">Description</Label>
              <Textarea
                id="new-collection-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Optional description"
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={saving}>
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
