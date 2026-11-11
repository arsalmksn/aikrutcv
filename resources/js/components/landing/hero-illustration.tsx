import React from 'react';
import { HeroResumeAvatar } from './hero-avatars';

export function HeroIllustration() {
    return (
        <div className="relative mx-auto flex h-[480px] w-full max-w-[540px] items-center justify-center select-none sm:h-[560px] lg:h-[620px] lg:max-w-none">
            {/* Background 3D Yellow Ribbon (Back segment - loops behind the cards) */}
            <svg
                viewBox="0 0 600 520"
                className="pointer-events-none absolute inset-0 size-full overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="orbitalRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFE066" />
                        <stop offset="35%" stopColor="#FFB800" />
                        <stop offset="70%" stopColor="#FFA000" />
                        <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                    <filter id="ribbonGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#FFB800" floodOpacity="0.38" />
                    </filter>
                </defs>

                {/* Full continuous 3D loop behind */}
                <path
                    d="M 450 145 C 535 180, 565 255, 540 335 C 515 410, 430 455, 310 460 C 190 465, 100 435, 75 380 C 50 325, 65 255, 115 195 C 170 135, 275 105, 385 115 C 418 118, 438 132, 450 145 Z"
                    stroke="url(#orbitalRibbonGrad)"
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#ribbonGlow)"
                />
            </svg>

            {/* Back Resume Card (Deep Royal Purple, tilted left -12deg) */}
            <div
                className="absolute top-[8%] left-[6%] sm:left-[10%] h-[370px] w-[260px] sm:h-[440px] sm:w-[300px] -rotate-12 rounded-2xl bg-[#281566] p-5 text-white/90 shadow-2xl shadow-indigo-950/30 border border-purple-500/20 overflow-hidden z-10 transition-transform duration-500 hover:-rotate-10"
                style={{
                    boxShadow: '0 25px 50px -12px rgba(40, 21, 102, 0.45)',
                }}
            >
                {/* Simulated Dark Card Content */}
                <div className="flex items-center gap-3 border-b border-purple-400/20 pb-4">
                    <div className="size-10 rounded-full bg-purple-900 border border-purple-400/40 flex items-center justify-center overflow-hidden shrink-0">
                        {/* Mini vector avatar */}
                        <div className="size-8 rounded-full bg-[#3B1D8C] flex items-center justify-center">
                            <span className="text-xs font-bold text-purple-200">AC</span>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <div className="h-2 w-24 rounded-full bg-purple-200/80" />
                        <div className="h-1.5 w-16 rounded-full bg-purple-400/40" />
                    </div>
                </div>

                {/* Simulated 2-column layout on back card */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="space-y-2.5">
                        <div className="h-1.5 w-14 rounded-full bg-purple-300/70" />
                        <div className="space-y-1">
                            <div className="h-1 w-full rounded-full bg-purple-400/30" />
                            <div className="h-1 w-5/6 rounded-full bg-purple-400/30" />
                            <div className="h-1 w-4/6 rounded-full bg-purple-400/30" />
                        </div>

                        <div className="h-1.5 w-16 rounded-full bg-purple-300/70 pt-2" />
                        <div className="space-y-1">
                            <div className="h-1 w-full rounded-full bg-purple-400/30" />
                            <div className="h-1 w-3/4 rounded-full bg-purple-400/30" />
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <div className="h-1.5 w-12 rounded-full bg-purple-300/70" />
                        <div className="space-y-1">
                            <div className="h-1 w-full rounded-full bg-purple-400/30" />
                            <div className="h-1 w-4/5 rounded-full bg-purple-400/30" />
                        </div>

                        <div className="h-1.5 w-14 rounded-full bg-purple-300/70 pt-2" />
                        <div className="space-y-1">
                            <div className="h-1 w-full rounded-full bg-purple-400/30" />
                            <div className="h-1 w-2/3 rounded-full bg-purple-400/30" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Front 3D Ribbon segment (Sweeps in front of the dark card's lower left corner) */}
            <svg
                viewBox="0 0 600 520"
                className="pointer-events-none absolute inset-0 size-full overflow-visible z-15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Arc looping across bottom left in front of the back card */}
                <path
                    d="M 310 460 C 190 465, 100 435, 75 380 C 50 325, 65 255, 115 195"
                    stroke="url(#orbitalRibbonGrad)"
                    strokeWidth="11"
                    strokeLinecap="round"
                    filter="url(#ribbonGlow)"
                />
            </svg>

            {/* Main Front Resume Card (Crisp White, slight tilt +2deg) */}
            <div
                className="relative z-20 top-[2%] left-[12%] sm:left-[16%] h-[410px] w-[280px] sm:h-[480px] sm:w-[330px] rotate-[2deg] rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-100/90 transition-transform duration-500 hover:rotate-0"
                style={{
                    boxShadow: '0 25px 60px -15px rgba(20, 20, 60, 0.16)',
                }}
            >
                {/* Soft purple glow underneath the white card */}
                <div className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 h-10 w-4/5 rounded-full bg-[#5025D1]/30 blur-2xl" />

                {/* Profile Header */}
                <div className="flex flex-col items-center text-center">
                    {/* Smiling male professional avatar */}
                    <HeroResumeAvatar className="size-16 sm:size-20" />

                    <h3 className="mt-2.5 text-sm sm:text-base font-bold tracking-tight text-[#0B0F3B]">
                        Create My Resume
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                        Developer & Designer
                    </p>
                </div>

                {/* Subtle Divider */}
                <div className="my-3 sm:my-4 border-b border-slate-100" />

                {/* 2-Column Clean Resume Layout */}
                <div className="grid grid-cols-2 gap-3.5 sm:gap-4 text-left">
                    {/* Left Column */}
                    <div className="space-y-3">
                        {/* Section 1 */}
                        <div>
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-700">
                                Recent Role
                            </span>
                            <div className="mt-1.5 space-y-1">
                                <div className="h-1.5 w-11/12 rounded-full bg-slate-300" />
                                <div className="h-1.5 w-full rounded-full bg-slate-200" />
                                <div className="h-1.5 w-4/5 rounded-full bg-slate-200" />
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div>
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-700">
                                Past Role
                            </span>
                            <div className="mt-1.5 space-y-1">
                                <div className="h-1.5 w-full rounded-full bg-slate-300" />
                                <div className="h-1.5 w-5/6 rounded-full bg-slate-200" />
                                <div className="h-1.5 w-3/4 rounded-full bg-slate-200" />
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div>
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-700">
                                Past Role
                            </span>
                            <div className="mt-1.5 space-y-1">
                                <div className="h-1.5 w-4/5 rounded-full bg-slate-300" />
                                <div className="h-1.5 w-full rounded-full bg-slate-200" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                        {/* Section 1 */}
                        <div>
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-700">
                                Focus
                            </span>
                            <div className="mt-1.5 space-y-1">
                                <div className="h-1.5 w-full rounded-full bg-slate-300" />
                                <div className="h-1.5 w-11/12 rounded-full bg-slate-200" />
                                <div className="h-1.5 w-4/5 rounded-full bg-slate-200" />
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div>
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-700">
                                Summary
                            </span>
                            <div className="mt-1.5 space-y-1">
                                <div className="h-1.5 w-full rounded-full bg-slate-300" />
                                <div className="h-1.5 w-4/5 rounded-full bg-slate-200" />
                                <div className="h-1.5 w-5/6 rounded-full bg-slate-200" />
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div>
                            <div className="mt-1.5 space-y-1">
                                <div className="h-1.5 w-full rounded-full bg-slate-200" />
                                <div className="h-1.5 w-3/4 rounded-full bg-slate-200" />
                                <div className="h-1.5 w-2/3 rounded-full bg-slate-200" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Card: Portfolio / Briefcase (Top Right) */}
            <div
                className="absolute top-[4%] sm:top-[6%] right-[2%] sm:right-[6%] z-30 size-14 sm:size-16 rounded-2xl bg-white p-3 shadow-lg border border-slate-100 flex items-center justify-center rotate-[4deg] transition-all hover:scale-105"
                style={{
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
                }}
            >
                {/* 3D Purple Briefcase with Gold Clasp */}
                <svg viewBox="0 0 40 40" className="size-8 sm:size-9" fill="none">
                    <path
                        d="M15 13C15 11 16.8 9.5 19 9.5H21C23.2 9.5 25 11 25 13V15H15V13Z"
                        fill="#3D18A8"
                    />
                    <rect x="7" y="14" width="26" height="19" rx="4" fill="#5025D1" />
                    <path
                        d="M7 16L18 22.5C19.2 23.2 20.8 23.2 22 22.5L33 16V18C33 19 32 20 31 20.5L22 24.5C20.8 25.2 19.2 25.2 18 24.5L9 20.5C8 20 7 19 7 18V16Z"
                        fill="#3E1AA5"
                    />
                    <rect x="18" y="21" width="4" height="4.5" rx="1" fill="#FFB800" />
                    <rect x="18" y="21" width="4" height="1.5" rx="0.5" fill="#FFE27A" />
                </svg>
            </div>

            {/* Floating Card: Sparkle / AI Star (Bottom Left) */}
            <div
                className="absolute bottom-[10%] sm:bottom-[12%] left-[2%] sm:left-[6%] z-30 size-12 sm:size-14 rounded-2xl bg-white p-2.5 shadow-lg border border-slate-100 flex items-center justify-center -rotate-[8deg] transition-all hover:scale-105"
                style={{
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                }}
            >
                <svg viewBox="0 0 24 24" className="size-6 sm:size-7 text-[#5025D1]" fill="currentColor">
                    <path d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z" />
                </svg>
            </div>

            {/* Floating Card: Checklist (Bottom Right) */}
            <div
                className="absolute -bottom-3 sm:-bottom-4 right-[0%] sm:right-[4%] z-30 min-w-[185px] sm:min-w-[205px] rounded-2xl bg-white p-4 sm:p-5 shadow-xl border border-slate-100/90 transition-all hover:scale-102"
                style={{
                    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.08)',
                }}
            >
                <div className="space-y-2.5">
                    {/* Item 1 */}
                    <div className="flex items-center gap-2.5">
                        <div className="size-5 rounded-full bg-[#FFB800] text-white flex items-center justify-center shrink-0 shadow-xs">
                            <svg viewBox="0 0 16 16" className="size-3 stroke-white stroke-[2.5]" fill="none">
                                <path d="M3.5 8.5L6.5 11.5L12.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-[#0B0F3B]">
                            ATS Friendly
                        </span>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center gap-2.5">
                        <div className="size-5 rounded-full bg-[#FFB800] text-white flex items-center justify-center shrink-0 shadow-xs">
                            <svg viewBox="0 0 16 16" className="size-3 stroke-white stroke-[2.5]" fill="none">
                                <path d="M3.5 8.5L6.5 11.5L12.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-[#0B0F3B]">
                            Modern Template
                        </span>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-center gap-2.5">
                        <div className="size-5 rounded-full bg-[#FFB800] text-white flex items-center justify-center shrink-0 shadow-xs">
                            <svg viewBox="0 0 16 16" className="size-3 stroke-white stroke-[2.5]" fill="none">
                                <path d="M3.5 8.5L6.5 11.5L12.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-[#0B0F3B]">
                            Instant Download
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

