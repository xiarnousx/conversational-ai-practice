import { CSSProperties } from 'react';

const features = [
  {
    accent: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
    title: 'Code Snippets',
    description: 'Save reusable code with syntax highlighting for 50+ languages.',
    icon: (
      <svg viewBox="0 0 24 24" fill="#3b82f6" className="w-[22px] h-[22px]">
        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
      </svg>
    ),
  },
  {
    accent: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    title: 'AI Prompts',
    description: 'Store and organize your best prompts for ChatGPT, Claude, and more.',
    icon: (
      <svg viewBox="0 0 24 24" fill="#f59e0b" className="w-[22px] h-[22px]">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
      </svg>
    ),
  },
  {
    accent: '#6366f1',
    bg: 'rgba(99,102,241,0.12)',
    title: 'Instant Search',
    description: 'Find anything in milliseconds with full-text search across all your items.',
    icon: (
      <svg viewBox="0 0 24 24" fill="#6366f1" className="w-[22px] h-[22px]">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    ),
  },
  {
    accent: '#06b6d4',
    bg: 'rgba(6,182,212,0.12)',
    title: 'Commands',
    description: 'Never forget a shell command, git alias, or CLI trick again.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M8 9l3 3-3 3M13 15h3"/>
      </svg>
    ),
  },
  {
    accent: '#64748b',
    bg: 'rgba(100,116,139,0.12)',
    title: 'Files & Docs',
    description: 'Upload and organize templates, PDFs, context files, and documents.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    accent: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    title: 'Collections',
    description: 'Group related items across types into searchable collections.',
    icon: (
      <svg viewBox="0 0 24 24" fill="#22c55e" className="w-[22px] h-[22px]">
        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-28 border-t border-[#1e2235]">
      <div className="max-w-[1100px] mx-auto px-7">
        <div className="text-center mb-14">
          <h2 className="text-[clamp(1.9rem,3.5vw,2.6rem)] font-extrabold tracking-[-1.2px] mb-3 text-[#e2e8f0]">
            Everything a developer needs
          </h2>
          <p className="text-[#7a8499] text-[1.0625rem] max-w-[480px] mx-auto">
            Seven built-in item types, built for the way developers actually work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
          {features.map(({ accent, bg, title, description, icon }) => (
            <div
              key={title}
              className="feature-card bg-[#12151f] border border-[#1e2235] rounded-xl p-[26px] transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              style={{ '--feature-accent': accent } as CSSProperties}
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                style={{ background: bg }}
              >
                {icon}
              </div>
              <h3 className="text-[0.9375rem] font-semibold mb-2 tracking-[-0.2px] text-[#e2e8f0]">
                {title}
              </h3>
              <p className="text-[0.85rem] text-[#7a8499] leading-[1.55]">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
