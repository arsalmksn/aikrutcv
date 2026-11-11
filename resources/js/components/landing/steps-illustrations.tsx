import React from 'react';

/**
 * Step 1: Daftar atau Masuk Illustration
 * Window card with profile avatar, simulated lines, and floating gold + badge.
 */
export function StepIllustration1() {
    return (
        <div className="relative flex h-28 w-36 items-center justify-center select-none">
            {/* Window Card */}
            <div className="relative h-24 w-32 rounded-2xl bg-white shadow-md border border-slate-100/90 overflow-hidden flex flex-col">
                {/* Purple Window Title Bar */}
                <div className="h-4.5 bg-gradient-to-r from-[#5B2DEE] to-[#481BD6] px-2 flex items-center gap-1">
                    <span className="size-1 rounded-full bg-white/70" />
                    <span className="size-1 rounded-full bg-white/70" />
                    <span className="size-1 rounded-full bg-white/70" />
                </div>

                {/* Content */}
                <div className="flex-1 p-2.5 flex items-center gap-2">
                    {/* User profile avatar */}
                    <div className="size-8 rounded-full bg-purple-100 flex items-center justify-center text-[#5025D1] shrink-0">
                        <svg viewBox="0 0 24 24" className="size-5 fill-current" fill="currentColor">
                            <path d="M12 2C9.24 2 7 4.24 7 7C7 9.76 9.24 12 12 12C14.76 12 17 9.76 17 7C17 4.24 14.76 2 12 2ZM12 14C8.67 14 2 15.67 2 19V21H22V19C22 15.67 15.33 14 12 14Z" />
                        </svg>
                    </div>

                    {/* Simulated text lines */}
                    <div className="space-y-1.5 flex-1">
                        <div className="h-1.5 w-full rounded-full bg-slate-200" />
                        <div className="h-1.5 w-3/4 rounded-full bg-slate-100" />
                        <div className="h-1.5 w-1/2 rounded-full bg-slate-100" />
                    </div>
                </div>
            </div>

            {/* Floating Golden + Badge */}
            <div
                className="absolute -bottom-1 -right-1 size-7 rounded-full bg-[#FFB800] text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white z-10"
                style={{
                    boxShadow: '0 4px 10px rgba(255, 184, 0, 0.4)',
                }}
            >
                +
            </div>
        </div>
    );
}

/**
 * Step 2: Pilih Template Illustration
 * 3 Stacked resume templates (dark, light, white with avatar) + yellow dashes.
 */
export function StepIllustration2() {
    return (
        <div className="relative flex h-28 w-36 items-center justify-center select-none">
            {/* Joyful yellow dashes top right */}
            <div className="pointer-events-none absolute -top-1 -right-1 flex items-center gap-1 text-[#FFB800] z-20">
                <span className="block h-2.5 w-0.5 -rotate-25 rounded-full bg-[#FFB800]" />
                <span className="block h-3 w-1 -rotate-5 rounded-full bg-[#FFB800] -mt-0.5" />
                <span className="block h-2.5 w-0.5 rotate-20 rounded-full bg-[#FFB800]" />
            </div>

            {/* Back Card Left (Dark Purple, -14deg) */}
            <div className="absolute top-2 left-3 h-22 w-16 -rotate-14 rounded-xl bg-[#281566] border border-purple-400/20 shadow-sm p-1.5 flex flex-col justify-between">
                <div className="size-3.5 rounded-full bg-purple-400/40" />
                <div className="space-y-1">
                    <div className="h-1 w-full rounded-full bg-purple-400/30" />
                    <div className="h-1 w-2/3 rounded-full bg-purple-400/30" />
                </div>
            </div>

            {/* Back Card Right (Light, +12deg) */}
            <div className="absolute top-2 right-4 h-22 w-16 rotate-12 rounded-xl bg-purple-50/80 border border-purple-200/50 shadow-sm p-1.5 flex flex-col justify-between">
                <div className="size-3.5 rounded-full bg-purple-200" />
                <div className="space-y-1">
                    <div className="h-1 w-full rounded-full bg-purple-200/60" />
                    <div className="h-1 w-3/4 rounded-full bg-purple-200/60" />
                </div>
            </div>

            {/* Front Card Center (Crisp White, -2deg) */}
            <div className="relative z-10 h-23 w-18 -rotate-2 rounded-xl bg-white shadow-md border border-slate-100 p-2 flex flex-col">
                <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
                    <div className="size-4 rounded-full bg-[#5025D1] flex items-center justify-center">
                        <span className="text-[7px] font-bold text-white">AC</span>
                    </div>
                    <div className="h-1 w-6 rounded-full bg-slate-200" />
                </div>
                <div className="mt-1.5 space-y-1 flex-1">
                    <div className="h-1 w-full rounded-full bg-slate-200" />
                    <div className="h-1 w-5/6 rounded-full bg-slate-100" />
                    <div className="h-1 w-4/6 rounded-full bg-slate-100" />
                    <div className="h-1 w-full rounded-full bg-slate-100" />
                </div>
            </div>
        </div>
    );
}

/**
 * Step 3: Sesuaikan dengan AI Illustration
 * Window mockup with highlighted bar, purple cursor pointer, and golden magic wand with stars.
 */
export function StepIllustration3() {
    return (
        <div className="relative flex h-28 w-36 items-center justify-center select-none">
            {/* Window Mockup */}
            <div className="relative h-24 w-32 rounded-2xl bg-white shadow-md border border-slate-100/90 overflow-hidden flex flex-col">
                {/* Purple Title Bar */}
                <div className="h-4.5 bg-gradient-to-r from-[#5B2DEE] to-[#481BD6] px-2 flex items-center gap-1">
                    <span className="size-1 rounded-full bg-white/70" />
                    <span className="size-1 rounded-full bg-white/70" />
                    <span className="size-1 rounded-full bg-white/70" />
                </div>

                {/* Content */}
                <div className="flex-1 p-2.5 space-y-2">
                    <div className="h-1.5 w-11/12 rounded-full bg-slate-200" />
                    {/* Active highlight bar */}
                    <div className="h-2.5 w-full rounded-md bg-[#5025D1]/15 border border-[#5025D1]/40" />
                    <div className="h-1.5 w-4/5 rounded-full bg-slate-100" />
                </div>
            </div>

            {/* Purple Click Cursor Pointer */}
            <div className="absolute bottom-5 right-5 z-20">
                <svg viewBox="0 0 24 24" className="size-6 text-[#5025D1] drop-shadow-md" fill="currentColor">
                    <path
                        d="M3 2L3 20L8 15L13 22L16 20L11 13L18 13L3 2Z"
                        stroke="white"
                        strokeWidth="1.5"
                    />
                </svg>
            </div>

            {/* Golden Magic Wand with Sparkles */}
            <div className="absolute -top-1.5 right-1 z-20 flex items-center">
                {/* Sparkle 1 */}
                <svg viewBox="0 0 16 16" className="size-3 text-[#FFB800] -mr-1" fill="currentColor">
                    <path d="M8 0L9.5 5.5L15 7L9.5 8.5L8 14L6.5 8.5L1 7L6.5 5.5L8 0Z" />
                </svg>
                {/* Wand */}
                <svg viewBox="0 0 28 28" className="size-7 drop-shadow-md" fill="none">
                    <path
                        d="M6 22L18 10C18.6 9.4 19.5 9.4 20.1 10C20.7 10.6 20.7 11.5 20.1 12.1L8.1 24.1C7.5 24.7 6.6 24.7 6 24.1C5.4 23.5 5.4 22.6 6 22Z"
                        fill="#FFB800"
                    />
                    <path
                        d="M17 11L18 10C18.6 9.4 19.5 9.4 20.1 10C20.7 10.6 20.7 11.5 20.1 12.1L19.1 13.1L17 11Z"
                        fill="#FFE580"
                    />
                </svg>
                {/* Sparkle 2 */}
                <svg viewBox="0 0 16 16" className="size-2.5 text-[#FFB800] -ml-1 mt-3" fill="currentColor">
                    <path d="M8 0L9.5 5.5L15 7L9.5 8.5L8 14L6.5 8.5L1 7L6.5 5.5L8 0Z" />
                </svg>
            </div>
        </div>
    );
}

/**
 * Step 4: Download & Lamar Illustration
 * Stacked CV document with "CV" purple badge, simulated lines, yellow dashes, and floating download badge.
 */
export function StepIllustration4() {
    return (
        <div className="relative flex h-28 w-36 items-center justify-center select-none">
            {/* Joyful yellow dashes top right */}
            <div className="pointer-events-none absolute -top-1 -right-1 flex items-center gap-1 text-[#FFB800] z-20">
                <span className="block h-2.5 w-0.5 -rotate-25 rounded-full bg-[#FFB800]" />
                <span className="block h-3 w-1 -rotate-5 rounded-full bg-[#FFB800] -mt-0.5" />
                <span className="block h-2.5 w-0.5 rotate-20 rounded-full bg-[#FFB800]" />
            </div>

            {/* Back sheet accent */}
            <div className="absolute top-3 left-4 h-23 w-22 rounded-2xl bg-purple-100/60 border border-purple-200/40 rotate-6" />

            {/* Front Document Sheet */}
            <div className="relative z-10 h-24 w-23 rounded-2xl bg-white shadow-md border border-slate-100/90 p-2.5 flex flex-col justify-between">
                <div>
                    {/* CV Badge */}
                    <div className="inline-flex items-center justify-center rounded-md bg-[#5025D1] px-2 py-0.5 text-[9px] font-black text-white tracking-wide">
                        CV
                    </div>

                    {/* Simulated document lines */}
                    <div className="mt-2 space-y-1.5">
                        <div className="h-1.5 w-full rounded-full bg-slate-200" />
                        <div className="h-1.5 w-5/6 rounded-full bg-slate-100" />
                        <div className="h-1.5 w-4/6 rounded-full bg-slate-100" />
                        <div className="h-1.5 w-3/4 rounded-full bg-slate-100" />
                    </div>
                </div>
            </div>

            {/* Floating Purple Download Badge (Bottom Right) */}
            <div
                className="absolute -bottom-1 -right-1 size-8 rounded-2xl bg-[#5025D1] text-white flex items-center justify-center shadow-lg border-2 border-white z-20"
                style={{
                    boxShadow: '0 4px 12px rgba(80, 37, 209, 0.4)',
                }}
            >
                <svg viewBox="0 0 20 20" className="size-4.5 stroke-white stroke-[2.2]" fill="none">
                    <path d="M10 3V13M10 13L6.5 9.5M10 13L13.5 9.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 16H16" strokeLinecap="round" />
                </svg>
            </div>
        </div>
    );
}

