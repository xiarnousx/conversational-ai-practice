import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import DeleteAccountButton from "@/components/profile/DeleteAccountButton";

async function getIsEmailUser(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { password: true },
  });
  return !!user.password;
}

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const isEmailUser = await getIsEmailUser(session.user.id);

  return (
    <div className="min-h-screen bg-background">
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
        <div>
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account settings</p>
        </div>

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
