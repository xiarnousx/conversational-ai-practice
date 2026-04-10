import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import DeleteAccountButton from "@/components/profile/DeleteAccountButton";

async function getProfileData(userId: string) {
  const [user, totalItems, totalCollections, itemTypeCounts] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        password: true,
        createdAt: true,
      },
    }),
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
    prisma.item.groupBy({
      by: ["typeId"],
      where: { userId },
      _count: { _all: true },
    }),
  ]);

  // Fetch item type names for the grouped counts
  const typeIds = itemTypeCounts.map((g) => g.typeId);
  const itemTypes = typeIds.length
    ? await prisma.itemType.findMany({
        where: { id: { in: typeIds } },
        select: { id: true, name: true, color: true },
      })
    : [];

  const typeCountMap = new Map(itemTypes.map((t) => [t.id, t]));
  const breakdown = itemTypeCounts
    .map((g) => ({
      ...typeCountMap.get(g.typeId)!,
      count: g._count._all,
    }))
    .filter((b) => b.id)
    .sort((a, b) => b.count - a.count);

  return { user, totalItems, totalCollections, breakdown };
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const { user, totalItems, totalCollections, breakdown } = await getProfileData(
    session.user.id
  );

  const isEmailUser = !!user.password;
  const memberSince = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(user.createdAt);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* User info */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <UserAvatar
              name={user.name ?? user.email}
              image={user.image}
              className="h-16 w-16 text-lg"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-foreground truncate">
                {user.name ?? "No name set"}
              </h1>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Member since {memberSince}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Usage
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md bg-muted/40 p-4">
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {totalItems}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Total items</p>
            </div>
            <div className="rounded-md bg-muted/40 p-4">
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {totalCollections}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Collections</p>
            </div>
          </div>

          {breakdown.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                By type
              </p>
              <div className="space-y-1.5">
                {breakdown.map((b) => (
                  <div key={b.id} className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: b.color ?? "#888" }}
                    />
                    <span className="flex-1 text-sm text-foreground">{b.name}</span>
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {b.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Account actions */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Account
          </h2>

          {isEmailUser && <ChangePasswordForm />}

          <div className={isEmailUser ? "pt-4 border-t border-border" : undefined}>
            <DeleteAccountButton />
          </div>
        </div>
      </div>
    </div>
  );
}
