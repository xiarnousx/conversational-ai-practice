import React from "react";
import { CATEGORY_LABELS, type Category } from "@/data/hooks";
/// <reference types="react/jsx-runtime" />

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

interface CategoryFilterProps {
  active: Category | null;
  onChange: (category: Category | null) => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps): React.ReactElement {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          active === null
            ? "bg-zinc-900 text-white"
            : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-100"
        }`}
      >
        All
      </button>
      {ALL_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(active === cat ? null : cat)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            active === cat
              ? "bg-zinc-900 text-white"
              : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-100"
          }`}
        >
          {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  );
}
