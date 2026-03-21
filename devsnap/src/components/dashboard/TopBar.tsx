import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Plus, Search } from "lucide-react";

interface TopBarProps {
  onMenuClick?: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4">
      {/* Mobile menu button */}
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
        <Button variant="outline" size="sm" className="hidden sm:flex">
          New Collection
        </Button>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          New Item
        </Button>
      </div>
    </header>
  );
}
