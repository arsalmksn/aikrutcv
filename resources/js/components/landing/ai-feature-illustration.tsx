import React from 'react';
import { Check, Edit3, LayoutGrid, Sparkles, Wand2, Zap } from 'lucide-react';

export function AiFeatureIllustration() {
    return (
        <div className="relative mx-auto flex h-[460px] w-full max-w-[500px] items-center justify-center select-none sm:h-[520px] lg:h-[560px]">
            {/* Ambient golden halo behind card */}
            <div className="pointer-events-none absolute -top-4 left-6 h-56 w-56 rounded-full bg-gradient-to-br from-amber-300/40 via-yellow-200/20 to-transparent blur-2xl" />

            {/* Joyful yellow energetic dashes above the card */}
            <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-6 flex items-center gap-1.5 text-[#FFB800] z-0">
                <span className="block h-3.5 w-1 -rotate-25 rounded-full bg-[#FFB800]" />
                <span className="block h-4 w-1.5 -rotate-5 rounded-full bg-[#FFB800] -mt-1" />
                <span className="block h-3.5 w-1 rotate-20 rounded-full bg-[#FFB800]" />
            </div>

            {/* Purple backing outline / curved loop accent */}
            <svg
                viewBox="0 0 500 460"
                className="pointer-events-none absolute inset-0 size-full overflow-visible z-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M 60 280 C 10 240, 20 160, 80 140 C 140 120, 200 130, 240 100 C 270 80, 260 30, 310 20 C 370 10, 420 50, 450 110 C 480 170, 490 280, 440 350 C 400 400, 320 420, 240 430"
                    stroke="#8B5CF6"
                    strokeWidth="2.5"
                    strokeDasharray="6 8"
                    strokeOpacity="0.4"
                    strokeLinecap="round"
                />
            </svg>

            {/* Backing tilted purple card accent */}
            <div
                className="absolute top-[10%] left-[4%] h-[320px] w-[380px] sm:h-[360px] sm:w-[420px] -rotate-6 rounded-[28px] bg-gradient-to-br from-[#7C3AED]/25 via-[#6D28D9]/15 to-transparent blur-xs z-10 pointer-events-none"
            />

            {/* Floating Badge 1: Magic Wand (Top Left) */}
            <div
                className="absolute top-[4%] left-[2%] sm:left-[4%] z-30 size-14 sm:size-16 rounded-2xl bg-white p-3 shadow-xl border border-slate-100 flex items-center justify-center -rotate-[8deg] transition-all hover:scale-105"
                style={{
                    boxShadow: '0 14px 35px rgba(80, 37, 209, 0.12)',
                }}
            >
                {/* 3D Purple Magic Wand with Sparkles */}
                <svg viewBox="0 0 36 36" className="size-8 sm:size-9" fill="none">
                    {/* Sparkle 1 */}
                    <path
                        d="M10 8C10 9.5 8.5 10 8 10C8.5 10 10 10.5 10 12C10 10.5 11.5 10 12 10C11.5 10 10 9.5 10 8Z"
                        fill="#5025D1"
                    />
                    {/* Sparkle 2 */}
                    <path
                        d="M26 10C26 11.2 24.8 11.6 24.4 11.6C24.8 11.6 26 12 26 13.2C26 12 27.2 11.6 27.6 11.6C27.2 11.6 26 11.2 26 10Z"
                        fill="#5025D1"
                    />
                    {/* Wand stick */}
                    <path
                        d="M11 25L24 12C24.8 11.2 26 11.2 26.8 12C27.6 12.8 27.6 14 26.8 14.8L13.8 27.8C13 28.6 11.8 28.6 11 27.8C10.2 27 10.2 25.8 11 25Z"
                        fill="#5025D1"
                    />
                    {/* Wand glowing tip */}
                    <path
                        d="M23 13L24 12C24.8 11.2 26 11.2 26.8 12C27.6 12.8 27.6 14 26.8 14.8L25.8 15.8L23 13Z"
                        fill="#7C3AED"
                    />
                </svg>
            </div>

            {/* Main Interactive AI Writing Assistant Card (White) */}
            <div
                className="relative z-20 top-[2%] left-[4%] sm:left-[6%] w-[330px] sm:w-[410px] -rotate-2 rounded-[28px] bg-white p-5 sm:p-6 shadow-2xl border border-slate-100/90 transition-transform duration-500 hover:rotate-0"
                style={{
                    boxShadow: '0 25px 60px -15px rgba(20, 20, 60, 0.16)',
                }}
            >
                {/* Header: Title + Powered by AI Pill */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="size-4.5 text-[#5025D1] fill-current" fill="currentColor">
                            <path d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z" />
                        </svg>
                        <h3 className="font-bold text-sm sm:text-base text-[#0B0F3B]">
                            AI Writing Assistant
                        </h3>
                    </div>

                    <div className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200/70 px-2.5 py-0.5 text-[10px] font-semibold text-[#5025D1]">
                        <Zap className="size-3 fill-current" />
                        <span>Powered by AI</span>
                    </div>
                </div>

                {/* Section 1: Professional Summary with simulated text */}
                <div className="mt-4 rounded-2xl bg-slate-50/90 p-3.5 sm:p-4 border border-slate-100">
                    <div className="flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" className="size-3 text-[#5025D1] fill-current">
                            <path d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z" />
                        </svg>
                        <span className="text-xs font-bold text-slate-800">
                            Professional Summary
                        </span>
                    </div>

                    <div className="mt-2.5 space-y-1.5">
                        <div className="h-1.5 w-full rounded-full bg-slate-200" />
                        <div className="h-1.5 w-11/12 rounded-full bg-slate-200/80" />
                        <div className="h-1.5 w-4/5 rounded-full bg-slate-200/70" />
                    </div>
                </div>

                {/* Section 2: Suggested Improvement Box */}
                <div className="mt-3.5 rounded-2xl bg-gradient-to-r from-purple-50/90 via-indigo-50/60 to-purple-50/90 p-3.5 sm:p-4 border border-purple-200/80 shadow-xs">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                            <svg viewBox="0 0 24 24" className="size-3.5 text-[#5025D1] fill-current">
                                <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z" />
                            </svg>
                            <span className="text-xs font-bold text-[#5025D1]">
                                Suggested Improvement
                            </span>
                        </div>

                        <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#5B2DEE] to-[#481BD6] px-3 py-1 text-[10px] sm:text-[11px] font-bold text-white shadow-xs shadow-purple-600/30 hover:brightness-105 transition-all cursor-pointer shrink-0"
                        >
                            <span>Use Suggestion</span>
                            <span>→</span>
                        </button>
                    </div>

                    <div className="mt-2.5 space-y-1.5">
                        <div className="h-1.5 w-4/5 rounded-full bg-purple-300/80" />
                        <div className="h-1.5 w-3/5 rounded-full bg-purple-200/70" />
                    </div>
                </div>

                {/* Section 3: Action Buttons Bar */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200/90 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
                    >
                        <Edit3 className="size-2.5 text-purple-600" />
                        <span>Improve Sentence</span>
                    </button>

                    <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200/90 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
                    >
                        <LayoutGrid className="size-2.5 text-purple-600" />
                        <span>Add Skills</span>
                    </button>

                    <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200/90 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
                    >
                        <Check className="size-2.5 text-emerald-600 stroke-[3]" />
                        <span>Check Grammar</span>
                    </button>
                </div>
            </div>

            {/* Floating Badge 2: Document / Checklist (Bottom Right) */}
            <div
                className="absolute bottom-[8%] right-[2%] sm:right-[4%] z-30 size-14 sm:size-16 rounded-2xl bg-white p-3 shadow-xl border border-slate-100 flex items-center justify-center rotate-[8deg] transition-all hover:scale-105"
                style={{
                    boxShadow: '0 14px 35px rgba(80, 37, 209, 0.12)',
                }}
            >
                {/* Purple Document Icon with list/bullets */}
                <svg viewBox="0 0 32 32" className="size-7 sm:size-8" fill="none">
                    <rect x="6" y="4" width="20" height="24" rx="4" fill="#5025D1" />
                    {/* Document lines and check/bullets */}
                    <circle cx="11" cy="11" r="1.5" fill="#FFFFFF" />
                    <rect x="15" y="10" width="7" height="2" rx="1" fill="#FFFFFF" />

                    <circle cx="11" cy="16" r="1.5" fill="#FFFFFF" />
                    <rect x="15" y="15" width="7" height="2" rx="1" fill="#FFFFFF" />

                    <circle cx="11" cy="21" r="1.5" fill="#FFFFFF" />
                    <rect x="15" y="20" width="7" height="2" rx="1" fill="#FFFFFF" />
                </svg>
            </div>
        </div>
    );
}

