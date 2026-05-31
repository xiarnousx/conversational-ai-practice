"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Zap } from "lucide-react";

interface BillingSectionProps {
  isPro: boolean;
  hasSubscription: boolean;
}

export default function BillingSection({ isPro, hasSubscription }: BillingSectionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  async function handlePortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        toast.error(data.error ?? "Failed to open billing portal");
        return;
      }
      router.push(data.url);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (isPro) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-medium">DevStash Pro</span>
          <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] uppercase tracking-wide">
            Active
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Unlimited items, collections, file uploads, AI features, and custom item types.
        </p>
        {hasSubscription && (
          <Button variant="outline" size="sm" onClick={handlePortal} disabled={loading}>
            {loading ? "Loading…" : "Manage Subscription"}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        You&apos;re on the free plan — 50 items · 3 collections · image uploads only.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => handleCheckout("monthly")}
          disabled={loading}
        >
          <Zap className="h-3.5 w-3.5 mr-1.5" />
          {loading ? "Loading…" : "Upgrade Monthly — $8/mo"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleCheckout("yearly")}
          disabled={loading}
        >
          {loading ? "Loading…" : "Upgrade Yearly — $72/yr"}
        </Button>
      </div>
    </div>
  );
}
