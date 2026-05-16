"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/dashboard/TopBar";
import Sidebar from "@/components/dashboard/Sidebar";
import { ItemDrawerProvider } from "@/components/item-drawer";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import type { SidebarItemType, SearchItem } from "@/lib/db/items";
import type { SidebarCollection, SearchCollection } from "@/lib/db/collections";
import type { SidebarUser } from "@/types/user";

interface AppLayoutClientProps {
  children: React.ReactNode;
  itemTypes: SidebarItemType[];
  collections: SidebarCollection[];
  user: SidebarUser;
  searchItems: SearchItem[];
  searchCollections: SearchCollection[];
}

export default function AppLayoutClient({
  children,
  itemTypes,
  collections,
  user,
  searchItems,
  searchCollections,
}: AppLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const pickerCollections = collections.map((c) => ({ id: c.id, name: c.name }));

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        itemTypes={itemTypes}
        collections={collections}
        user={user}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          onMenuClick={() => setMobileOpen(true)}
          pickerCollections={pickerCollections}
          onSearchClick={() => setPaletteOpen(true)}
        />
        <main className="flex-1 overflow-auto p-6">
          <ItemDrawerProvider collections={pickerCollections}>
            <CommandPalette
              open={paletteOpen}
              onOpenChange={setPaletteOpen}
              searchItems={searchItems}
              searchCollections={searchCollections}
            />
            {children}
          </ItemDrawerProvider>
        </main>
      </div>
    </div>
  );
}
