import { auth } from "@/auth";

type AuthGuard =
  | { ok: true; userId: string }
  | { ok: false; error: "Unauthorized" };

export async function requireUserId(): Promise<AuthGuard> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  return { ok: true, userId: session.user.id };
}
