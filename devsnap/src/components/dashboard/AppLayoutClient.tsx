"use client";

import { useState } from "react";
import TopBar from "@/components/dashboard/TopBar";
import Sidebar from "@/components/dashboard/Sidebar";
import { ItemDrawerProvider } from "@/components/item-drawer";
import type { SidebarItemType } from "@/lib/db/items";
import type { SidebarCollection } from "@/lib/db/collections";

interface SidebarUser {
  name?: string | null
  email?: string | null
  image?: string | null
}

interface AppLayoutClientProps {
  children: React.ReactNode;
  itemTypes: SidebarItemType[];
  collections: SidebarCollection[];
  user: SidebarUser;
}

export default function AppLayoutClient({
  children,
  itemTypes,
  collections,
  user,
}: AppLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

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
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-auto p-6">
          <ItemDrawerProvider>{children}</ItemDrawerProvider>
        </main>
      </div>
    </div>
  );
}
