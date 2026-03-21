import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default function TopBar() {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          className="pl-9 bg-muted border-0 focus-visible:ring-1"
        />
      </div>
      <div className="ml-auto">
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          New Item
        </Button>
      </div>
    </header>
  );
}
