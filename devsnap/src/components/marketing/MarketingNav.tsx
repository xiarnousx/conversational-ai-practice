'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0a0c14]/90 backdrop-blur-xl border-b border-[#1e2235]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-285 mx-auto px-7 h-16 flex items-center gap-9">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-[#e2e8f0] shrink-0 no-underline">
          <span className="text-lg">⚡</span>
          <span className="font-bold text-[17px] tracking-tight">DevStash</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-7">
          <a href="#features" className="text-[#7a8499] hover:text-[#e2e8f0] text-sm font-medium transition-colors duration-200">
            Features
          </a>
          <a href="#pricing" className="text-[#7a8499] hover:text-[#e2e8f0] text-sm font-medium transition-colors duration-200">
            Pricing
          </a>
        </div>

        {/* Desktop actions */}
        <div className="ml-auto hidden md:flex items-center gap-2">
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center text-sm font-medium px-4 py-2.25 rounded-lg text-[#7a8499] hover:text-[#e2e8f0] hover:bg-white/5 transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center text-sm font-semibold px-5 py-2.25 rounded-lg bg-linear-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90 transition-all"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="ml-auto md:hidden">
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center p-2 text-[#e2e8f0] hover:bg-white/5 rounded-lg transition-colors">
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-[#0a0c14] border-[#1e2235]">
              <div className="flex flex-col gap-0 px-4 pt-6">
                <a href="#features" className="text-[#7a8499] hover:text-[#e2e8f0] py-2 text-sm font-medium border-b border-[#1e2235] transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-[#7a8499] hover:text-[#e2e8f0] py-2 text-sm font-medium border-b border-[#1e2235] transition-colors">
                  Pricing
                </a>
                <Link href="/sign-in" className="text-[#7a8499] hover:text-[#e2e8f0] py-2 text-sm font-medium border-b border-[#1e2235] transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="mt-4 inline-flex items-center justify-center px-5 py-2 rounded-lg bg-linear-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold hover:opacity-90 transition-all w-fit"
                >
                  Get Started
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
