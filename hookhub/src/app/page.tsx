"use client";

import { useState } from "react";
import { hooks, type Category } from "@/data/hooks";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import HookCard from "@/components/HookCard";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const filtered =
    activeCategory === null
      ? hooks
      : hooks.filter((h) => h.category === activeCategory);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((hook) => (
            <HookCard key={hook.id} hook={hook} />
          ))}
        </div>
      </main>
    </div>
  );
}
