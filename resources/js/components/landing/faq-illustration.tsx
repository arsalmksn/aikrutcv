import React from 'react';

export function FaqIllustration() {
    return (
        <div className="relative mx-auto flex h-[420px] w-full max-w-[460px] items-center justify-center select-none sm:h-[480px]">
            {/* Ambient golden halo glow behind */}
            <div className="pointer-events-none absolute -top-4 -left-4 h-64 w-64 rounded-full bg-gradient-to-br from-amber-300/35 via-yellow-200/20 to-transparent blur-3xl" />

            {/* Joyful yellow energetic dashes above document */}
            <div className="pointer-events-none absolute top-10 right-20 flex items-center gap-1.5 text-[#FFB800] z-0">
                <span className="block h-3.5 w-1 -rotate-25 rounded-full bg-[#FFB800]" />
                <span className="block h-4 w-1.5 -rotate-5 rounded-full bg-[#FFB800] -mt-1" />
                <span className="block h-3.5 w-1 rotate-20 rounded-full bg-[#FFB800]" />
            </div>

            {/* 3D Yellow Orbital Ribbon (Loops around the document) */}
            <svg
                viewBox="0 0 500 460"
                className="pointer-events-none absolute inset-0 size-full overflow-visible z-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="faqOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFE066" />
                        <stop offset="35%" stopColor="#FFB800" />
                        <stop offset="70%" stopColor="#FFA000" />
                        <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                    <filter id="faqRibbonGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#FFB800" floodOpacity="0.38" />
                    </filter>
                </defs>

                {/* Continuous 3D Loop */}
                <path
                    d="M 390 140 C 470 180, 480 260, 440 330 C 400 390, 310 430, 200 420 C 100 410, 40 350, 45 280 C 50 210, 110 150, 200 120 C 270 100, 340 115, 390 140 Z"
                    stroke="url(#faqOrbitGrad)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    filter="url(#faqRibbonGlow)"
                />
            </svg>

            {/* Main Document Mockup (Tilted ~ 8deg) */}
            <div
                className="relative z-10 top-[2%] left-[-2%] h-[320px] w-[230px] sm:h-[370px] sm:w-[270px] rotate-[8deg] rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-100 transition-transform duration-500 hover:rotate-6"
                style={{
                    boxShadow: '0 25px 60px -15px rgba(20, 20, 60, 0.16)',
                }}
            >
                {/* Purple soft glow underneath the document */}
                <div className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 h-10 w-4/5 rounded-full bg-[#5025D1]/30 blur-2xl" />

                {/* Document Content */}
                <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
                    {/* Professional Avatar in circle */}
                    <div className="size-11 sm:size-12 rounded-full bg-[#5025D1] p-0.5 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                        <svg viewBox="0 0 40 40" className="size-full" fill="none">
                            <circle cx="20" cy="20" r="20" fill="#EDE9FE" />
                            {/* Head & shoulders */}
                            <path d="M10 38 C11 29 15 25 20 25 C25 25 29 29 30 38 Z" fill="#5025D1" />
                            <circle cx="20" cy="17" r="6" fill="#5025D1" />
                        </svg>
                    </div>

                    <div className="space-y-1.5 flex-1">
                        <div className="h-2 w-3/4 rounded-full bg-slate-200" />
                        <div className="h-1.5 w-1/2 rounded-full bg-slate-100" />
                    </div>
                </div>

                {/* Simulated text lines */}
                <div className="mt-4 space-y-2.5">
                    <div className="h-1.5 w-full rounded-full bg-slate-200/90" />
                    <div className="h-1.5 w-11/12 rounded-full bg-slate-100" />
                    <div className="h-1.5 w-4/5 rounded-full bg-slate-100" />
                </div>

                <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4">
                    <div className="h-1.5 w-1/3 rounded-full bg-slate-300" />
                    <div className="space-y-1.5">
                        <div className="h-1.5 w-full rounded-full bg-slate-100" />
                        <div className="h-1.5 w-5/6 rounded-full bg-slate-100" />
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    <div className="h-1.5 w-1/4 rounded-full bg-slate-300" />
                    <div className="h-1.5 w-2/3 rounded-full bg-slate-100" />
                </div>
            </div>

            {/* Front 3D Ribbon segment (Sweeps in front of the bottom left of the document) */}
            <svg
                viewBox="0 0 500 460"
                className="pointer-events-none absolute inset-0 size-full overflow-visible z-15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M 200 420 C 100 410, 40 350, 45 280 C 50 210, 110 150, 200 120"
                    stroke="url(#faqOrbitGrad)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    filter="url(#faqRibbonGlow)"
                />
            </svg>

            {/* Floating 3D Question Bubble (Top Left) */}
            <div
                className="absolute top-[8%] left-[2%] sm:left-[6%] z-30 size-20 sm:size-24 rounded-3xl bg-white p-3.5 shadow-2xl border border-slate-100/90 flex items-center justify-center -rotate-6 transition-transform duration-300 hover:scale-105"
                style={{
                    boxShadow: '0 18px 45px rgba(80, 37, 209, 0.16)',
                }}
            >
                <div className="relative flex items-center justify-center">
                    <span className="text-4xl sm:text-5xl font-black text-[#5025D1] drop-shadow-xs">
                        ?
                    </span>
                    {/* Tail pointer */}
                    <div className="absolute -bottom-4 -right-1 size-3 bg-white rotate-45 border-r border-b border-slate-100/90" />
                </div>
            </div>

            {/* Floating 3D Purple Chat Bubble (Bottom Right) */}
            <div
                className="absolute bottom-[16%] right-[6%] sm:right-[10%] z-30 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#5B2DEE] via-[#5025D1] to-[#481BD6] shadow-xl flex items-center justify-center rotate-3 transition-transform duration-300 hover:scale-105"
                style={{
                    boxShadow: '0 14px 35px rgba(80, 37, 209, 0.35)',
                }}
            >
                <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-white" />
                    <span className="size-2 rounded-full bg-white" />
                    <span className="size-2 rounded-full bg-white" />
                </div>
                {/* Bubble tail pointer */}
                <div className="absolute -bottom-1.5 left-4 size-3 bg-[#5025D1] rotate-45" />
            </div>
        </div>
    );
}

