'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  const proPrice = isYearly ? '$72' : '$8';
  const proPeriod = isYearly ? '/year' : '/month';
  const proDescription = isYearly ? '$6 / mo · Save $24 yearly' : 'Billed monthly';

  return (
    <section id="pricing" className="py-28 border-t border-[#1e2235]">
      <div className="max-w-[1100px] mx-auto px-7">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-[clamp(1.9rem,3.5vw,2.6rem)] font-extrabold tracking-[-1.2px] mb-3 text-[#e2e8f0]">
            Simple, transparent pricing
          </h2>
          <p className="text-[#7a8499] text-[1.0625rem] max-w-[480px] mx-auto">
            Start for free. Upgrade when you need more.
          </p>

          {/* Toggle */}
          <div className="flex items-center gap-3 justify-center mt-6">
            <span className={`text-sm font-medium transition-colors duration-200 ${!isYearly ? 'text-[#e2e8f0]' : 'text-[#7a8499]'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly((v) => !v)}
              aria-pressed={isYearly}
              className={`relative w-11 h-6 rounded-full border cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 flex-shrink-0 ${
                isYearly
                  ? 'bg-indigo-500/25 border-indigo-500/50'
                  : 'bg-[#1a1d2a] border-[#2e3450]'
              }`}
            >
              <span
                className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full transition-all duration-200 ${
                  isYearly ? 'translate-x-5 bg-indigo-400' : 'translate-x-0 bg-[#7a8499]'
                }`}
              />
            </button>
            <span className={`text-sm font-medium transition-colors duration-200 ${isYearly ? 'text-[#e2e8f0]' : 'text-[#7a8499]'}`}>
              Yearly{' '}
              <span className="bg-green-500/[0.12] text-green-400 text-[10px] px-[7px] py-[2px] rounded font-bold ml-1 align-middle">
                Save 25%
              </span>
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[680px] mx-auto">
          {/* Free */}
          <div className="bg-[#12151f] border border-[#1e2235] rounded-xl p-8 relative">
            <div className="text-[11px] font-bold text-[#7a8499] uppercase tracking-[1.5px] mb-4">Free</div>
            <div className="mb-[6px]">
              <span className="text-5xl font-extrabold tracking-[-2px] leading-none text-[#e2e8f0]">$0</span>
              <span className="text-base text-[#7a8499] ml-[2px]">/month</span>
            </div>
            <div className="text-[0.8125rem] text-[#3d4460] mb-6 h-[18px]">Perfect for getting started</div>
            <ul className="flex flex-col gap-[10px] mb-7">
              {['Up to 50 items', 'Up to 3 collections', 'Basic full-text search', 'Image uploads', 'Dark mode'].map((f) => (
                <li key={f} className="text-[0.875rem] text-[#7a8499] pl-5 relative">
                  <span className="absolute left-0 top-[1px] text-green-400 font-bold text-[11px]">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="flex items-center justify-center w-full px-5 py-[10px] rounded-lg border border-[#2e3450] text-[#e2e8f0] text-sm font-semibold hover:bg-white/[0.03] hover:border-[#7a8499] transition-all"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-gradient-to-br from-[#12151f] to-[rgba(99,102,241,0.06)] border border-indigo-500/35 rounded-xl p-8 relative">
            <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[11px] font-bold px-4 py-1 rounded-full whitespace-nowrap tracking-[0.3px]">
              Most Popular
            </div>
            <div className="text-[11px] font-bold text-[#7a8499] uppercase tracking-[1.5px] mb-4">Pro</div>
            <div className="mb-[6px]">
              <span className="text-5xl font-extrabold tracking-[-2px] leading-none text-[#e2e8f0] transition-all duration-200">
                {proPrice}
              </span>
              <span className="text-base text-[#7a8499] ml-[2px] transition-all duration-200">{proPeriod}</span>
            </div>
            <div className="text-[0.8125rem] text-[#3d4460] mb-6 h-[18px] transition-all duration-200">{proDescription}</div>
            <ul className="flex flex-col gap-[10px] mb-7">
              {[
                'Unlimited items',
                'Unlimited collections',
                'AI features (auto-tag, summarize)',
                'File uploads',
                'Custom item types',
                'Export (JSON / ZIP)',
                'Priority support',
              ].map((f) => (
                <li key={f} className="text-[0.875rem] text-[#7a8499] pl-5 relative">
                  <span className="absolute left-0 top-[1px] text-green-400 font-bold text-[11px]">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register?plan=pro"
              className="flex items-center justify-center w-full px-5 py-[10px] rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold hover:opacity-90 transition-all"
            >
              Start Pro Trial
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
