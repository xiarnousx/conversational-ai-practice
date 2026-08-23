import Link from "next/link";
import type { ComponentType } from "react";
import HeroV1 from "./variations/hero-v1";
import HeroV2 from "./variations/hero-v2";
import HeroV3 from "./variations/hero-v3";
import HeroV4 from "./variations/hero-v4";
import HeroV5 from "./variations/hero-v5";
import HeroV6 from "./variations/hero-v6";

const VARIATIONS: Record<string, ComponentType<{ hookCount: number }>> = {
  "1": HeroV1,
  "2": HeroV2,
  "3": HeroV3,
  "4": HeroV4,
  "5": HeroV5,
  "6": HeroV6,
};

export default function Hero({
  hookCount,
  variant,
}: {
  hookCount: number;
  variant?: string;
}) {
  const Variation = variant ? VARIATIONS[variant] : VARIATIONS["1"];
  
  return <Variation hookCount={hookCount} />;
}
