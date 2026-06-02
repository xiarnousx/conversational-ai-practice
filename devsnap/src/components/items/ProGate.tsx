"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { File, Image, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const FEATURE_META: Record<
  string,
  { icon: React.ReactNode; title: string; description: string; perks: string[] }
> = {
  file: {
    icon: <File className="h-10 w-10 text-muted-foreground/50" />,
    title: "File uploads are a Pro feature",
    description: "Store and manage any file — PDFs, templates, configs, ZIPs — all in one place.",
    perks: [
      "Upload any file type up to 10 MB",
      "Instant download from anywhere",
      "Organized alongside your snippets and notes",
      "Unlimited storage on Pro",
    ],
  },
  image: {
    icon: <Image className="h-10 w-10 text-muted-foreground/50" />,
    title: "Image storage is a Pro feature",
    description:
      "Keep screenshots, diagrams, mockups and design assets right next to your code.",
    perks: [
      "Upload images up to 5 MB each",
      "Gallery view with instant preview",
      "Searchable by title and tags",
      "Unlimited images on Pro",
    ],
  },
};

export default function ProGate({ typeName }: { typeName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const meta = FEATURE_META[typeName];

  async function handleCheckout(plan: "monthly" | "yearly") {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        toast.error(data.error ?? "Failed to start checkout");
        return;
      }
      router.push(data.url);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!meta) return null;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-muted/30">
        {meta.icon}
      </div>

      <Badge className="mb-4 bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] uppercase tracking-wide">
        Pro Feature
      </Badge>

      <h2 className="text-xl font-semibold text-foreground mb-2">{meta.title}</h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{meta.description}</p>

      <ul className="mb-8 space-y-2 text-left">
        {meta.perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-3.5 w-3.5 shrink-0 text-amber-400" />
            {perk}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={() => handleCheckout("monthly")} disabled={loading}>
          <Zap className="h-3.5 w-3.5 mr-1.5" />
          {loading ? "Loading…" : "Upgrade Monthly — $8/mo"}
        </Button>
        <Button variant="outline" onClick={() => handleCheckout("yearly")} disabled={loading}>
          {loading ? "Loading…" : "Upgrade Yearly — $72/yr"}
        </Button>
      </div>
    </div>
  );
}
