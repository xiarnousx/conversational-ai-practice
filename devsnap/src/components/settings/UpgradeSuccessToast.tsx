"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function UpgradeSuccessToast() {
  useEffect(() => {
    toast.success("Welcome to DevStash Pro! Your account has been upgraded.");
  }, []);

  return null;
}
