import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

/**
 * Technical approach for this variation:
 *
 * Instead of inlining two near-identical `Link`/`<a>` blocks with hand-written
 * Tailwind strings, the CTAs are modeled as *data* (a typed `CtaSpec[]`) and
 * rendered through a single `<CtaButton>` subcomponent. Visual variants
 * ("primary" | "secondary") are resolved by a small hand-rolled `cva`-style
 * style resolver (`ctaVariants`) — no external dependency, just a typed
 * lookup table — so adding/reordering/relabeling a CTA never touches JSX,
 * only the data array below.
 */

// ---------------------------------------------------------------------------
// Style resolver (hand-rolled cva-lite: a typed variant -> className map)
// ---------------------------------------------------------------------------

type CtaVariant = "primary" | "secondary";

const ctaBaseClass =
  "rounded-full px-6 py-2.5 text-sm font-semibold transition-colors";

const ctaVariantClass: Record<CtaVariant, string> = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-800",
  secondary: "bg-white text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-100",
};

function ctaVariants(variant: CtaVariant): string {
  return `${ctaBaseClass} ${ctaVariantClass[variant]}`;
}

// ---------------------------------------------------------------------------
// CTA data model
// ---------------------------------------------------------------------------

type CtaSpec =
  | {
      kind: "internal";
      href: string;
      label: string;
      variant: CtaVariant;
    }
  | {
      kind: "external";
      href: string;
      label: string;
      variant: CtaVariant;
    };

const heroCtas: readonly CtaSpec[] = [
  {
    kind: "internal",
    href: "/browse",
    label: "Browse hooks",
    variant: "primary",
  },
  {
    kind: "external",
    href: "https://github.com/anthropics/claude-code-hooks-examples",
    label: "View examples on GitHub",
    variant: "secondary",
  },
];

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

function CtaButton({ cta }: { cta: CtaSpec }) {
  const className = ctaVariants(cta.variant);

  if (cta.kind === "internal") {
    return (
      <Link href={cta.href} className={className}>
        {cta.label}
      </Link>
    );
  }

  const externalProps: AnchorHTMLAttributes<HTMLAnchorElement> = {
    target: "_blank",
    rel: "noopener noreferrer",
  };

  return (
    <a href={cta.href} className={className} {...externalProps}>
      {cta.label}
    </a>
  );
}

function CtaGroup({ ctas }: { ctas: readonly CtaSpec[] }) {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      {ctas.map((cta) => (
        <CtaButton key={cta.href} cta={cta} />
      ))}
    </div>
  );
}

function HeroHeading({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
      {children}
    </h1>
  );
}

function HeroSubheading({ hookCount }: { hookCount: number }) {
  return (
    <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
      A curated directory of {hookCount} hooks for security, code quality,
      session management, notifications, logging, and workflow automation —
      ready to drop into your project.
    </p>
  );
}

// ---------------------------------------------------------------------------
// Hero (server component, data-driven CTAs)
// ---------------------------------------------------------------------------

export default function Hero({ hookCount }: { hookCount: number }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 text-center">
      <HeroHeading>Discover open-source hooks for Claude Code</HeroHeading>
      <HeroSubheading hookCount={hookCount} />
      <CtaGroup ctas={heroCtas} />
    </section>
  );
}
