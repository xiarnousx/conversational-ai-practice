"use client";

import { Input } from "@/components/ui/input";
import { Menu, Search } from "lucide-react";
import { NewItemDialog } from "@/components/item-create";

interface TopBarProps {
  onMenuClick?: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4">
      <button
        className="md:hidden flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          className="pl-9 bg-muted border-0 focus-visible:ring-1"
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <NewItemDialog />
      </div>
    </header>
  );
}
