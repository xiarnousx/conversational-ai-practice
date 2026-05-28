'use client';

import { useEffect, useRef } from 'react';

export default function HeroChaosCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ICON_SIZE = 50;
    const REPULSION_RADIUS = 110;
    const REPULSION_STRENGTH = 0.35;
    const MAX_SPEED = 3.5;
    const MIN_SPEED = 0.4;
    const FRICTION = 0.992;

    const elements = Array.from(container.querySelectorAll<HTMLElement>('[data-chaos-icon]'));
    if (!elements.length) return;

    const w = container.offsetWidth;
    const h = container.offsetHeight;
    const pad = ICON_SIZE / 2;

    const states = elements.map((el) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = MIN_SPEED + Math.random() * 1.5;
      return {
        el,
        x: pad + Math.random() * (w - ICON_SIZE - pad),
        y: pad + Math.random() * (h - ICON_SIZE - pad),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 0.7,
        scale: 0.92 + Math.random() * 0.16,
        scaleDir: Math.random() > 0.5 ? 1 : -1,
      };
    });

    let mouseX = -9999;
    let mouseY = -9999;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    let rafId: number;

    const tick = () => {
      const mxBound = container.offsetWidth - ICON_SIZE;
      const myBound = container.offsetHeight - ICON_SIZE;

      for (const s of states) {
        const cx = s.x + ICON_SIZE / 2;
        const cy = s.y + ICON_SIZE / 2;
        const dx = cx - mouseX;
        const dy = cy - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPULSION_RADIUS && dist > 1) {
          const force = ((REPULSION_RADIUS - dist) / REPULSION_RADIUS) * REPULSION_STRENGTH;
          s.vx += (dx / dist) * force;
          s.vy += (dy / dist) * force;
        }

        s.vx *= FRICTION;
        s.vy *= FRICTION;

        const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        if (speed > MAX_SPEED) {
          s.vx = (s.vx / speed) * MAX_SPEED;
          s.vy = (s.vy / speed) * MAX_SPEED;
        }
        if (speed < MIN_SPEED * 0.5) {
          const a = Math.random() * Math.PI * 2;
          s.vx += Math.cos(a) * 0.25;
          s.vy += Math.sin(a) * 0.25;
        }

        s.x += s.vx;
        s.y += s.vy;

        if (s.x <= 0) { s.x = 0; s.vx = Math.abs(s.vx); }
        if (s.x >= mxBound) { s.x = mxBound; s.vx = -Math.abs(s.vx); }
        if (s.y <= 0) { s.y = 0; s.vy = Math.abs(s.vy); }
        if (s.y >= myBound) { s.y = myBound; s.vy = -Math.abs(s.vy); }

        s.rotation += s.rotSpeed;
        s.scale += s.scaleDir * 0.0025;
        if (s.scale > 1.08) s.scaleDir = -1;
        if (s.scale < 0.92) s.scaleDir = 1;

        s.el.style.left = `${s.x}px`;
        s.el.style.top = `${s.y}px`;
        s.el.style.transform = `rotate(${s.rotation}deg) scale(${s.scale})`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const iconClass = 'absolute w-[50px] h-[50px] bg-[#1a1d2a] border border-[#1e2235] rounded-[13px] flex items-center justify-center p-[11px] cursor-default select-none will-change-transform';

  return (
    <div ref={containerRef} className="absolute inset-0">
      {/* Notion */}
      <div data-chaos-icon="" className={iconClass}>
        <svg viewBox="0 0 120 126" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.6927 21.9927C24.5836 25.1418 26.0982 24.9127 33.3818 24.3982L100.338 20.3418C101.854 20.3418 100.595 18.8273 99.8473 18.5709L88.1927 10.3491C85.9236 8.57818 82.9327 6.55273 77.2945 7.07273L12.9527 11.8964C10.6836 12.1527 10.1691 13.4109 11.1727 14.4145L20.6927 21.9927Z" fill="white"/>
          <path d="M24.5836 36.3709V107.629C24.5836 111.52 26.6091 112.778 31.0982 112.52L104.48 108.129C108.969 107.871 109.484 105.1 109.484 101.967V31.2236C109.484 28.0745 108.226 26.3036 105.44 26.5600L28.7309 31.2236C25.6873 31.48 24.5836 33.2509 24.5836 36.3709Z" fill="#191919"/>
          <path d="M89.4509 40.2618C89.9654 42.5309 89.4509 44.8 87.1818 45.0564L83.8036 45.5709V93.7418C80.9418 95.2564 78.1636 96.0000 75.9018 96.0000C72.2691 96.0000 71.2655 94.9964 68.7455 92.4764L48.7455 61.2109V90.9782L54.9527 92.2364C54.9527 92.2364 54.9527 96.0000 49.4909 96.0000L34.8582 96.7636C34.3436 95.7600 34.8582 93.2400 36.6291 92.7255L40.7818 91.6364V49.2218L34.8582 48.7782C34.3436 46.5091 35.6018 43.2436 38.8673 43.0873L54.6909 42.0873L75.6436 73.5636V46.0218L70.5018 45.5709C69.9873 42.7927 71.9127 40.7709 74.8691 40.5236L89.4509 40.2618Z" fill="white"/>
        </svg>
      </div>

      {/* GitHub */}
      <div data-chaos-icon="" className={iconClass}>
        <svg viewBox="0 0 24 24" fill="white">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>
      </div>

      {/* Slack */}
      <div data-chaos-icon="" className={iconClass}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#e01e5a"/>
        </svg>
      </div>

      {/* VS Code */}
      <div data-chaos-icon="" className={iconClass}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <mask id="vscodemask">
            <path fill="white" d="M70.912 4.819L38.462 33.709 17.357 17.958 7.911 23.476v53.048l9.446 5.518 21.105-15.751 32.45 28.89L92.089 89.03V10.97z"/>
          </mask>
          <path fill="#0065A9" d="M92.089 10.97L70.912 4.819 38.462 33.709 17.357 17.958 7.911 23.476v53.048l9.446 5.518 21.105-15.751 32.45 28.89L92.089 89.03z"/>
          <path fill="#007ACC" mask="url(#vscodemask)" d="M7.911 76.524l9.446 5.518 21.105-15.751 32.45 28.89L92.089 89.03V10.97L7.911 76.524z"/>
          <path fill="#1F9CF0" mask="url(#vscodemask)" d="M70.912 4.819L38.462 33.709 17.357 17.958l-9.446 5.518 32.551 26.524L92.089 10.97z"/>
        </svg>
      </div>

      {/* Globe */}
      <div data-chaos-icon="" className={iconClass}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      </div>

      {/* Terminal */}
      <div data-chaos-icon="" className={iconClass}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="M8 9l3 3-3 3M13 15h3"/>
        </svg>
      </div>

      {/* File */}
      <div data-chaos-icon="" className={iconClass}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      </div>

      {/* Bookmark */}
      <div data-chaos-icon="" className={iconClass}>
        <svg viewBox="0 0 24 24" fill="#f59e0b">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
    </div>
  );
}
