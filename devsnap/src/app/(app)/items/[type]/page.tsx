import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getItemsByType } from "@/lib/db/items";
import ItemRow from "@/components/dashboard/ItemRow";

function slugToTypeName(slug: string): string {
  return slug.endsWith("s") ? slug.slice(0, -1) : slug;
}

function slugToLabel(slug: string): string {
  const name = slugToTypeName(slug);
  return name.charAt(0).toUpperCase() + name.slice(1) + "s";
}

export default async function ItemsTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const { type } = await params;
  const typeName = slugToTypeName(type);
  const items = await getItemsByType(session.user.id, typeName);
  const label = slugToLabel(type);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{label}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">No {label.toLowerCase()} yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {items.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
