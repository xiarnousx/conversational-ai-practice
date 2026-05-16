"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { updateCollection } from "@/actions/collections";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: string;
  initialName: string;
  initialDescription: string;
}

export function EditCollectionDialog({
  open,
  onOpenChange,
  collectionId,
  initialName,
  initialDescription,
}: Props) {
  const router = useRouter();
  const [form, setForm] = useState({ name: initialName, description: initialDescription });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm({ name: initialName, description: initialDescription });
  }, [open, initialName, initialDescription]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const result = await updateCollection(collectionId, {
      name: form.name,
      description: form.description || null,
    });

    setSaving(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Collection updated");
    onOpenChange(false);
    router.refresh();
  }

  const canSubmit = !!form.name.trim() && !saving;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-collection-name">Name *</Label>
            <Input
              id="edit-collection-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Collection name"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-collection-description">Description</Label>
            <Textarea
              id="edit-collection-description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
