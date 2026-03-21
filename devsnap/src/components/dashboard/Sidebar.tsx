"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Code,
  Sparkles,
  Terminal,
  FileText,
  File,
  Image as ImageIcon,
  Link as LinkIcon,
  Star,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  Settings,
  ChevronRight,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  mockItemTypes,
  mockCollections,
  mockUser,
  mockTypeCounts,
} from "@/lib/mock-data";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  code: Code,
  sparkles: Sparkles,
  terminal: Terminal,
  "file-text": FileText,
  file: File,
  image: ImageIcon,
  link: LinkIcon,
};

function getTypeSlug(name: string) {
  return name.toLowerCase() + "s";
}

function getUserInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface SidebarContentProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

function SidebarContent({ collapsed = false, onToggleCollapse }: SidebarContentProps) {
  const [typesOpen, setTypesOpen] = useState(true);
  const [collectionsOpen, setCollectionsOpen] = useState(true);

  const favoriteCollections = mockCollections.filter((c) => c.isFavorite);
  const recentCollections = mockCollections.filter((c) => !c.isFavorite);

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        {!collapsed && (
          <span className="font-bold text-base tracking-tight truncate flex-1">DevSnap</span>
        )}
        {collapsed && <span className="flex-1" />}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex h-7 w-7 items-center justify-center rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {/* Types section */}
        <div>
          <button
            onClick={() => !collapsed && setTypesOpen((o) => !o)}
            className={cn(
              "flex w-full items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors",
              collapsed && "justify-center"
            )}
          >
            {!collapsed && (
              <>
                <span className="flex-1 text-left">Types</span>
                {typesOpen ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </>
            )}
          </button>

          {(typesOpen || collapsed) && (
            <ul className="mt-1 space-y-0.5">
              {mockItemTypes.map((type) => {
                const Icon = iconMap[type.icon] ?? File;
                const count = mockTypeCounts[type.name] ?? 0;
                return (
                  <li key={type.id}>
                    <Link
                      href={`/items/${getTypeSlug(type.name)}`}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                        collapsed && "justify-center px-0"
                      )}
                      title={collapsed ? type.name : undefined}
                    >
                      <Icon
                        className="h-4 w-4 shrink-0"
                        style={{ color: type.color }}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{type.name}</span>
                          <span className="text-xs text-sidebar-foreground/40 tabular-nums">
                            {count}
                          </span>
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Divider */}
        {!collapsed && <div className="my-2 border-t border-sidebar-border" />}

        {/* Collections section */}
        {!collapsed && (
          <div>
            <button
              onClick={() => setCollectionsOpen((o) => !o)}
              className="flex w-full items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
            >
              <span className="flex-1 text-left">Collections</span>
              {collectionsOpen ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>

            {collectionsOpen && (
              <div className="mt-1 space-y-3">
                {/* Favorites */}
                {favoriteCollections.length > 0 && (
                  <div>
                    <p className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/35">
                      Favorites
                    </p>
                    <ul className="mt-0.5 space-y-0.5">
                      {favoriteCollections.map((col) => (
                        <li key={col.id}>
                          <Link
                            href={`/collections/${col.id}`}
                            className="group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                          >
                            <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
                            <span className="flex-1 truncate">{col.name}</span>
                            <span className="text-xs text-sidebar-foreground/40 tabular-nums">
                              {col.itemCount}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recent */}
                {recentCollections.length > 0 && (
                  <div>
                    <p className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/35">
                      Recent
                    </p>
                    <ul className="mt-0.5 space-y-0.5">
                      {recentCollections.map((col) => (
                        <li key={col.id}>
                          <Link
                            href={`/collections/${col.id}`}
                            className="group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                          >
                            <span className="h-3.5 w-3.5 shrink-0" />
                            <span className="flex-1 truncate">{col.name}</span>
                            <span className="text-xs text-sidebar-foreground/40 tabular-nums">
                              {col.itemCount}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* User area */}
      <div className={cn(
        "border-t border-sidebar-border p-3 flex items-center gap-2.5",
        collapsed && "justify-center"
      )}>
        <div className="h-8 w-8 shrink-0 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-xs font-semibold">
          {getUserInitials(mockUser.name)}
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight truncate">{mockUser.name}</p>
              <p className="text-xs text-sidebar-foreground/50 truncate">{mockUser.email}</p>
            </div>
            <button className="h-7 w-7 flex items-center justify-center rounded-md text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col shrink-0 border-r border-border transition-all duration-200",
          collapsed ? "w-14" : "w-60"
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={(open) => !open && onMobileClose()}>
        <SheetContent side="left" className="w-60 p-0 border-r border-border bg-sidebar">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
