import TopBar from "@/components/dashboard/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar placeholder */}
      <aside className="w-60 shrink-0 border-r border-border bg-sidebar flex items-start justify-center pt-8">
        <h2 className="text-sidebar-foreground font-semibold">Sidebar</h2>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
