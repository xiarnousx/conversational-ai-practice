"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  ChevronRight,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import type { SidebarItemType } from "@/lib/db/items";
import type { SidebarCollection } from "@/lib/db/collections";

interface SidebarUser {
  name?: string | null
  email?: string | null
  image?: string | null
}

const PRO_TYPES = new Set(["file", "image"]);

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

interface SidebarContentProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  itemTypes: SidebarItemType[];
  collections: SidebarCollection[];
  user: SidebarUser;
}

function SidebarContent({ collapsed = false, onToggleCollapse, itemTypes, collections, user }: SidebarContentProps) {
  const [typesOpen, setTypesOpen] = useState(true);
  const [collectionsOpen, setCollectionsOpen] = useState(true);
  const router = useRouter();

  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = collections.filter((c) => !c.isFavorite);

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
              {itemTypes.map((type) => {
                const Icon = iconMap[type.icon.toLowerCase()] ?? File;
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
                          {PRO_TYPES.has(type.name.toLowerCase()) && (
                            <Badge
                              variant="outline"
                              className="text-[9px] font-semibold uppercase tracking-wide px-1 py-0 h-4 border-sidebar-foreground/20 text-sidebar-foreground/40 leading-none"
                            >
                              Pro
                            </Badge>
                          )}
                          <span className="text-xs text-sidebar-foreground/40 tabular-nums">
                            {type.itemCount}
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
                            <span
                              className="h-3.5 w-3.5 shrink-0 rounded-full"
                              style={{ backgroundColor: col.dominantColor }}
                            />
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

                {/* View all collections */}
                <Link
                  href="/collections"
                  className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-xs text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                >
                  View all collections
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* User area */}
      <div className={cn(
        "border-t border-sidebar-border p-3",
        collapsed ? "flex justify-center" : "block"
      )}>
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(
            "flex items-center gap-2.5 w-full rounded-md hover:bg-sidebar-accent transition-colors p-1.5 text-left",
            collapsed && "justify-center p-1"
          )}>
            <UserAvatar name={user.name} image={user.image} />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight truncate">{user.name ?? "User"}</p>
                <p className="text-xs text-sidebar-foreground/50 truncate">{user.email}</p>
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align={collapsed ? "center" : "end"} className="w-48">
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
  itemTypes: SidebarItemType[];
  collections: SidebarCollection[];
  user: SidebarUser;
}

export default function Sidebar({ mobileOpen, onMobileClose, itemTypes, collections, user }: SidebarProps) {
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
          itemTypes={itemTypes}
          collections={collections}
          user={user}
        />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={(open) => !open && onMobileClose()}>
        <SheetContent side="left" className="w-60 p-0 border-r border-border bg-sidebar">
          <SidebarContent itemTypes={itemTypes} collections={collections} user={user} />
        </SheetContent>
      </Sheet>
    </>
  );
}
