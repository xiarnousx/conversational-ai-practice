import Link from 'next/link';
import HeroChaosCanvas from './HeroChaosCanvas';

export default function HeroSection({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center pt-[110px] pb-20 px-7 gap-[72px]">
      {/* Headline + CTAs */}
      <div className="text-center max-w-[720px]">
        <h1 className="text-[clamp(2.4rem,5.5vw,3.75rem)] font-extrabold leading-[1.12] tracking-[-2px] mb-[22px]">
          Stop Losing Your<br />
          <span className="bg-gradient-to-br from-blue-500 via-indigo-400 to-pink-500 bg-clip-text text-transparent">
            Developer Knowledge
          </span>
        </h1>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href={isSignedIn ? '/dashboard' : '/register'}
            className="inline-flex items-center justify-center text-base px-[30px] py-[13px] rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold hover:opacity-90 hover:-translate-y-px transition-all"
          >
            {isSignedIn ? 'Go to Dashboard' : 'Start for Free'}
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center text-base px-[30px] py-[13px] rounded-xl text-[#7a8499] hover:text-[#e2e8f0] hover:bg-white/5 font-medium transition-all"
          >
            See Features →
          </a>
        </div>
      </div>

      {/* Glow visual container */}
      <div
        className="relative rounded-3xl border border-white/[0.07] overflow-hidden px-12 py-10 max-w-full"
        style={{
          background: `
            radial-gradient(circle 260px at 10% 20%, rgba(59,130,246,0.16) 0%, transparent 100%),
            radial-gradient(circle 220px at 90% 80%, rgba(236,72,153,0.13) 0%, transparent 100%),
            radial-gradient(circle 180px at 88% 12%, rgba(129,140,248,0.11) 0%, transparent 100%),
            radial-gradient(circle 280px at 50% 115%, rgba(99,102,241,0.14) 0%, transparent 100%),
            #070912
          `,
          boxShadow: '0 0 0 1px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.04), 0 48px 100px rgba(0,0,0,0.55)',
        }}
      >
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />

        {/* Inner layout */}
        <div className="relative z-10 flex items-center gap-5 flex-wrap justify-center">
          {/* Chaos container */}
          <div className="relative w-[320px] h-[290px] bg-[#12151f] border border-[#1e2235] rounded-xl overflow-hidden flex-shrink-0">
            <div className="absolute top-[10px] left-1/2 -translate-x-1/2 text-[10px] font-medium text-[#3d4460] whitespace-nowrap z-[5] bg-[#12151f] px-[10px] py-[2px] rounded-full border border-[#1e2235] tracking-[0.3px]">
              Your knowledge today...
            </div>
            <HeroChaosCanvas />
          </div>

          {/* Arrow — rotated 90° on mobile (stacked layout), horizontal on md+ */}
          <div className="flex items-center justify-center shrink-0 rotate-90 animate-pulse md:rotate-0 md:animate-[arrowPulse_2.2s_ease-in-out_infinite]">
            <span className="font-mono text-[2.25rem] font-extrabold tracking-[-0.12em] leading-none bg-gradient-to-br from-blue-500 via-indigo-400 to-pink-500 bg-clip-text text-transparent">
              &gt;&gt;
            </span>
          </div>

          {/* Dashboard preview */}
          <div className="relative w-[320px] h-[290px] bg-[#12151f] border border-[#1e2235] rounded-xl overflow-hidden flex-shrink-0">
            <div className="absolute top-[10px] left-1/2 -translate-x-1/2 text-[10px] font-medium text-[#3d4460] whitespace-nowrap z-[5] bg-[#12151f] px-[10px] py-[2px] rounded-full border border-[#1e2235] tracking-[0.3px]">
              ...with DevStash
            </div>
            <div className="flex h-full pt-[34px]">
              {/* Sidebar */}
              <div className="w-[68px] border-r border-[#1e2235] px-[6px] py-2 flex flex-col items-stretch gap-[2px] flex-shrink-0">
                <div className="w-[28px] h-[28px] rounded-[7px] bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-[9px] font-extrabold text-white mx-auto mb-2 flex-shrink-0">
                  DS
                </div>
                {[
                  { label: 'Snippet', color: '#3b82f6', active: true },
                  { label: 'Prompt', color: '#f59e0b' },
                  { label: 'Command', color: '#06b6d4' },
                  { label: 'Note', color: '#22c55e' },
                  { label: 'File', color: '#64748b' },
                  { label: 'Image', color: '#ec4899' },
                  { label: 'URL', color: '#6366f1' },
                ].map(({ label, color, active }) => (
                  <div
                    key={label}
                    className="text-[9px] font-semibold px-[6px] py-[5px] rounded-[5px] whitespace-nowrap overflow-hidden text-ellipsis tracking-[0.1px]"
                    style={{
                      color,
                      opacity: active ? 1 : 0.6,
                      background: active ? 'rgba(59,130,246,0.12)' : undefined,
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 p-2 overflow-hidden">
                {/* Pinned */}
                <div className="mb-[10px]">
                  <div className="text-[8px] font-bold text-[#3d4460] uppercase tracking-[0.9px] mb-[5px]">Pinned</div>
                  <div className="grid grid-cols-2 gap-[5px]">
                    {[
                      { color: '#3b82f6', delay1: '0s', delay2: '0.2s' },
                      { color: '#f59e0b', delay1: '0.35s', delay2: '0.55s' },
                    ].map(({ color, delay1, delay2 }, i) => (
                      <div
                        key={i}
                        className="h-[46px] bg-[#1a1d2a] rounded-[6px] px-[7px] py-2 flex flex-col justify-center gap-[5px]"
                        style={{ borderTop: `3px solid ${color}` }}
                      >
                        <div className="h-[5px] w-[80%] bg-white/[0.18] rounded-[3px] animate-pulse" style={{ animationDelay: delay1 }} />
                        <div className="h-[5px] w-[52%] bg-white/[0.18] rounded-[3px] animate-pulse" style={{ animationDelay: delay2 }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Items */}
                <div>
                  <div className="text-[8px] font-bold text-[#3d4460] uppercase tracking-[0.9px] mb-[5px]">Recent Items</div>
                  <div className="flex flex-col gap-1">
                    {[
                      { color: '#06b6d4', wide: true, delay: '0s' },
                      { color: '#22c55e', wide: false, delay: '0.2s' },
                      { color: '#ec4899', wide: true, delay: '0.4s' },
                      { color: '#6366f1', wide: false, delay: '0.6s' },
                      { color: '#3b82f6', wide: true, delay: '0.8s' },
                    ].map(({ color, wide, delay }, i) => (
                      <div
                        key={i}
                        className="h-5 bg-[#1a1d2a] rounded-[4px] flex items-center px-2"
                        style={{ borderLeft: `3px solid ${color}` }}
                      >
                        <div
                          className="h-[5px] bg-white/[0.18] rounded-[3px] animate-pulse"
                          style={{ width: wide ? '72%' : '52%', animationDelay: delay }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
