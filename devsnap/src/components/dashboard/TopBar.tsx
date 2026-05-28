"use client";

import { Input } from "@/components/ui/input";
import { Menu, Search, Star } from "lucide-react";
import NextLink from "next/link";
import { NewItemDialog } from "@/components/item-create";
import { NewCollectionDialog } from "@/components/collection-create";

interface TopBarProps {
  onMenuClick?: () => void;
  pickerCollections: { id: string; name: string }[];
  onSearchClick?: () => void;
}

export default function TopBar({ onMenuClick, pickerCollections, onSearchClick }: TopBarProps) {
  return (
    <header className="relative flex h-14 items-center border-b border-border bg-background px-4">
      {/* Hamburger — mobile only */}
      <button
        className="md:hidden flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Logo — mobile only (sidebar is hidden on mobile) */}
      <NextLink
        href="/dashboard"
        className="md:hidden flex items-center gap-1.5 ml-2 text-foreground font-bold text-[15px] tracking-tight shrink-0"
      >
        <span className="text-lg leading-none">⚡</span>DevStash
      </NextLink>

      {/* Search input — desktop only, absolutely centred */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        <div className="flex h-full items-center justify-center">
          <div className="relative w-full max-w-sm pointer-events-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              readOnly
              placeholder="Search..."
              className="pl-9 bg-muted border-0 focus-visible:ring-1 cursor-pointer"
              onClick={onSearchClick}
            />
          </div>
        </div>
      </div>

      {/* Right-side actions */}
      <div className="ml-auto flex items-center gap-1 md:gap-2">
        {/* Search icon — mobile only */}
        <button
          className="md:hidden flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={onSearchClick}
          title="Search"
        >
          <Search className="h-4 w-4" />
        </button>

        <NextLink
          href="/favorites"
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-amber-400 hover:bg-muted transition-colors"
          title="Favorites"
        >
          <Star className="h-4 w-4" />
        </NextLink>

        <NewCollectionDialog />
        <NewItemDialog collections={pickerCollections} />
      </div>
    </header>
  );
}
