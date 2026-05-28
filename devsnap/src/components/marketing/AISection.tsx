export default function AISection() {
  return (
    <section className="py-28 border-t border-[#1e2235]" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.04) 50%, transparent 100%)' }}>
      <div className="max-w-[1100px] mx-auto px-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[72px] items-center">
          {/* Left: text */}
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[11px] font-bold px-3 py-1 rounded-full mb-5 uppercase tracking-[0.8px]">
              ✦ Pro Feature
            </div>
            <h2 className="text-[clamp(1.75rem,3vw,2.4rem)] font-extrabold tracking-[-1px] mb-4 leading-[1.2] text-[#e2e8f0]">
              AI Superpowers for<br />Your Knowledge Base
            </h2>
            <p className="text-[#7a8499] text-[1.0625rem] mb-8 leading-[1.65]">
              Let AI do the heavy lifting — organize, summarize, and enhance your saved knowledge automatically.
            </p>
            <ul className="flex flex-col gap-[13px]">
              {[
                'Auto-tagging based on content',
                'AI-generated summaries',
                'Explain code in plain English',
                'Prompt optimization suggestions',
                'Smart search with semantic matching',
              ].map((item) => (
                <li key={item} className="flex items-center gap-[10px] text-[0.9375rem] text-[#7a8499]">
                  <span className="w-[18px] h-[18px] rounded-full bg-green-500/10 flex items-center justify-center text-green-400 font-bold text-[0.875rem] flex-shrink-0">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: code editor mockup */}
          <div className="rounded-xl overflow-hidden border border-[#2a2a2a] shadow-[0_24px_64px_rgba(0,0,0,0.5)] font-mono" style={{ background: '#1e1e1e' }}>
            {/* Titlebar */}
            <div className="flex items-center gap-[10px] px-[14px] py-[10px] border-b border-[#3a3a3a]" style={{ background: '#2d2d2d' }}>
              <div className="flex gap-[6px] items-center">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-[12px] text-[#888] tracking-[0.2px]">useDebounce.ts</span>
            </div>

            {/* Code body */}
            <div className="px-4 py-[18px]">
              <pre className="text-[12px] leading-[1.85] whitespace-pre-wrap">
                <span style={{ color: '#c678dd' }}>import</span>
                <span style={{ color: '#abb2bf' }}>{' { useState, useEffect } '}</span>
                <span style={{ color: '#c678dd' }}>from</span>
                <span style={{ color: '#98c379' }}>{" 'react'"}</span>
                {'\n\n'}
                <span style={{ color: '#61afef' }}>export function</span>
                <span style={{ color: '#e5c07b' }}>{' useDebounce'}</span>
                <span style={{ color: '#abb2bf' }}>{'<T>('}</span>
                {'\n  '}
                <span style={{ color: '#abb2bf' }}>{'value: T,'}</span>
                {'\n  '}
                <span style={{ color: '#abb2bf' }}>{'delay: '}</span>
                <span style={{ color: '#61afef' }}>number</span>
                {'\n'}
                <span style={{ color: '#abb2bf' }}>{'): T {'}</span>
                {'\n  '}
                <span style={{ color: '#c678dd' }}>const</span>
                <span style={{ color: '#abb2bf' }}>{' [debounced, setDebounced] ='}</span>
                {'\n    '}
                <span style={{ color: '#e5c07b' }}>useState</span>
                <span style={{ color: '#abb2bf' }}>{'<T>(value)'}</span>
                {'\n\n  '}
                <span style={{ color: '#e5c07b' }}>useEffect</span>
                <span style={{ color: '#abb2bf' }}>{'(() => {'}</span>
                {'\n    '}
                <span style={{ color: '#c678dd' }}>const</span>
                <span style={{ color: '#abb2bf' }}>{' t = '}</span>
                <span style={{ color: '#e5c07b' }}>setTimeout</span>
                <span style={{ color: '#abb2bf' }}>{'(() =>'}</span>
                {'\n      '}
                <span style={{ color: '#e5c07b' }}>setDebounced</span>
                <span style={{ color: '#abb2bf' }}>{'(value), delay)'}</span>
                {'\n    '}
                <span style={{ color: '#c678dd' }}>return</span>
                <span style={{ color: '#abb2bf' }}>{' () => '}</span>
                <span style={{ color: '#e5c07b' }}>clearTimeout</span>
                <span style={{ color: '#abb2bf' }}>{'(t)'}</span>
                {'\n  '}
                <span style={{ color: '#abb2bf' }}>{'}, [value, delay])'}</span>
                {'\n\n  '}
                <span style={{ color: '#c678dd' }}>return</span>
                <span style={{ color: '#abb2bf' }}>{' debounced'}</span>
                {'\n'}
                <span style={{ color: '#abb2bf' }}>{'}'}</span>
              </pre>
            </div>

            {/* AI tags */}
            <div className="px-4 pb-[14px] pt-3 border-t border-[#2a2a2a]" style={{ background: '#181818' }}>
              <div className="flex items-center gap-[5px] text-[10px] text-amber-400 font-bold mb-[9px] uppercase tracking-[0.8px]">
                <svg viewBox="0 0 16 16" fill="#f59e0b" width="12" height="12">
                  <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/>
                </svg>
                AI Generated Tags
              </div>
              <div className="flex flex-wrap gap-[6px]">
                {['react', 'hooks', 'typescript', 'performance', 'debounce', 'custom-hook'].map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-500/[0.12] text-blue-400 border border-blue-500/25 text-[11px] px-[9px] py-[2px] rounded-[5px] font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
