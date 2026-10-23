import { Link } from '@inertiajs/react';
import { home } from '@/routes';

export default function AuthShowcase() {
    return (
        <div className="relative flex h-full flex-col justify-between overflow-hidden p-8 sm:p-10 select-none">
            {/* Top Brand Logo */}
            <div className="relative z-10">
                <Link href={home()} className="inline-flex flex-col group">
                    <span className="text-2xl font-black tracking-tight text-neutral-900 group-hover:text-neutral-800 transition-colors">
                        Aikrut
                    </span>
                    <span className="-mt-1 text-xs font-semibold tracking-wide text-violet-600">
                        cvbuilder
                    </span>
                </Link>

                {/* Main Headline */}
                <div className="mt-7">
                    <h1 className="text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl lg:text-[31px] leading-[1.25]">
                        Build Your{' '}
                        <span className="text-violet-600">Best CV</span>
                        <br />
                        for a Brighter Future
                    </h1>
                    <p className="mt-3 max-w-xs text-xs sm:text-sm leading-relaxed text-neutral-500 font-normal">
                        Create, customize, and showcase your professional profile with ease.
                    </p>
                </div>
            </div>

            {/* Visual 3D Overlapping Template Showcase */}
            <div className="relative mt-6 mb-2 flex items-center justify-center min-h-[310px]">
                {/* Organic Golden/Amber Background Shape Behind Cards */}
                <div className="pointer-events-none absolute top-1/2 right-1 -translate-y-1/2 w-48 h-36 rounded-[50px] bg-amber-300/40 rotate-12 blur-[1px]" />
                <div className="pointer-events-none absolute -bottom-4 left-1/4 w-36 h-28 rounded-full bg-amber-200/50 blur-xl" />

                {/* Card Stack Container */}
                <div className="relative w-full max-w-[350px] h-[280px]">
                    {/* 1. Left Card (Sophia G. - Clean Minimalist) */}
                    <div
                        className="absolute -left-4 top-5 w-[165px] rounded-xl border border-neutral-200/80 bg-white p-3 shadow-lg shadow-neutral-900/10 transition-transform duration-300 hover:rotate-[-10deg]"
                        style={{
                            transform: 'rotate(-14deg)',
                            zIndex: 10,
                        }}
                    >
                        {/* Header with avatar & name */}
                        <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                            <div className="size-7 shrink-0 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                                SG
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-[10px] font-bold text-neutral-800 leading-tight truncate">
                                    Sophia G.
                                </div>
                                <div className="text-[7.5px] text-neutral-500 truncate">
                                    Product Designer
                                </div>
                            </div>
                        </div>

                        {/* Mini body lines */}
                        <div className="mt-2 space-y-1.5">
                            <div className="text-[7.5px] font-bold text-neutral-700">About Me</div>
                            <div className="space-y-1">
                                <div className="h-1 w-full rounded-full bg-neutral-200" />
                                <div className="h-1 w-4/5 rounded-full bg-neutral-200" />
                            </div>

                            <div className="pt-1 text-[7.5px] font-bold text-neutral-700">Skills</div>
                            <div className="flex flex-wrap gap-1">
                                <span className="rounded bg-neutral-100 px-1 py-0.5 text-[6.5px] text-neutral-600">UI/UX</span>
                                <span className="rounded bg-neutral-100 px-1 py-0.5 text-[6.5px] text-neutral-600">Figma</span>
                            </div>

                            <div className="pt-1 text-[7.5px] font-bold text-neutral-700">Experience</div>
                            <div className="space-y-1 pl-2 border-l border-neutral-200">
                                <div className="h-1 w-3/4 rounded-full bg-neutral-300" />
                                <div className="h-1 w-1/2 rounded-full bg-neutral-200" />
                            </div>
                        </div>
                    </div>

                    {/* 3. Right Card (Rizky Pratama - Dark Modern Elegance) */}
                    <div
                        className="absolute right-0 top-3 w-[165px] rounded-xl border border-neutral-800 bg-[#141518] p-3 text-white shadow-xl shadow-neutral-900/20 transition-transform duration-300 hover:rotate-[6deg]"
                        style={{
                            transform: 'rotate(9deg)',
                            zIndex: 15,
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
                            <div className="size-7 shrink-0 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                                RP
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-[10px] font-bold text-white leading-tight truncate">
                                    Rizky Pratama
                                </div>
                                <div className="text-[7.5px] text-amber-400/90 truncate">
                                    Data Analyst
                                </div>
                            </div>
                        </div>

                        {/* Mini body */}
                        <div className="mt-2 space-y-1.5">
                            <div className="text-[7.5px] font-bold text-neutral-300">About Me</div>
                            <div className="space-y-1">
                                <div className="h-1 w-full rounded-full bg-neutral-700" />
                                <div className="h-1 w-3/4 rounded-full bg-neutral-700" />
                            </div>

                            <div className="pt-1 text-[7.5px] font-bold text-neutral-300">Skills</div>
                            <div className="flex flex-wrap gap-1">
                                <span className="rounded bg-neutral-800 px-1 py-0.5 text-[6.5px] text-neutral-300">Python</span>
                                <span className="rounded bg-neutral-800 px-1 py-0.5 text-[6.5px] text-neutral-300">SQL</span>
                            </div>

                            <div className="pt-1 text-[7.5px] font-bold text-neutral-300">Experience</div>
                            <div className="space-y-1 pl-2 border-l border-amber-500/50">
                                <div className="h-1 w-3/4 rounded-full bg-neutral-600" />
                                <div className="h-1 w-1/2 rounded-full bg-neutral-700" />
                            </div>
                        </div>
                    </div>

                    {/* 2. Middle Forefront Card (Daniel Carter - Software Engineer, 2-Column Split) */}
                    <div
                        className="absolute left-[45%] -translate-x-1/2 -top-2 w-[190px] rounded-xl border border-neutral-200/90 bg-white overflow-hidden shadow-2xl shadow-indigo-950/20 transition-transform duration-300 hover:rotate-[-1deg] hover:scale-[1.02]"
                        style={{
                            transform: 'translateX(-50%) rotate(-3.5deg)',
                            zIndex: 25,
                        }}
                    >
                        <div className="flex">
                            {/* Left dark sidebar inside Daniel's CV */}
                            <div className="w-[62px] shrink-0 bg-[#1E2333] p-2 text-white flex flex-col justify-between">
                                <div>
                                    <div className="size-8 rounded-lg bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center text-[10px] font-black text-white shadow-xs">
                                        DC
                                    </div>
                                    <div className="mt-1.5 text-[8.5px] font-bold leading-tight truncate">
                                        Daniel C.
                                    </div>
                                    <div className="text-[6.5px] text-violet-300 truncate">
                                        Software Eng.
                                    </div>
                                </div>

                                <div className="space-y-1 pt-2">
                                    <div className="text-[6px] font-semibold text-neutral-400 uppercase tracking-wider">
                                        Skills
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="rounded bg-white/10 px-1 py-0.5 text-[6px] text-neutral-200">React</span>
                                        <span className="rounded bg-white/10 px-1 py-0.5 text-[6px] text-neutral-200">Node</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right white content */}
                            <div className="flex-1 p-2.5">
                                <div className="space-y-2">
                                    <div>
                                        <div className="text-[7.5px] font-bold text-neutral-800">Profile</div>
                                        <div className="mt-0.5 space-y-0.5">
                                            <div className="h-1 w-full rounded-full bg-neutral-200" />
                                            <div className="h-1 w-4/5 rounded-full bg-neutral-200" />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[7.5px] font-bold text-neutral-800">Experience</div>
                                        <div className="mt-0.5 space-y-1 pl-1.5 border-l border-violet-500">
                                            <div>
                                                <div className="h-1 w-full rounded-full bg-neutral-700" />
                                                <div className="mt-0.5 h-0.5 w-2/3 rounded-full bg-neutral-300" />
                                            </div>
                                            <div>
                                                <div className="h-1 w-4/5 rounded-full bg-neutral-600" />
                                                <div className="mt-0.5 h-0.5 w-1/2 rounded-full bg-neutral-300" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[7.5px] font-bold text-neutral-800">Education</div>
                                        <div className="mt-0.5 h-1 w-3/4 rounded-full bg-neutral-200" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Handwritten Note with Curved Arrow pointing to the CV stack */}
            <div className="relative z-10 flex items-start justify-start pt-1 pl-2">
                <div className="flex items-center gap-1.5 text-violet-600">
                    <span
                        className="text-xs font-semibold tracking-wide italic"
                        style={{ fontFamily: 'ui-sans-serif, cursive, sans-serif' }}
                    >
                        Choose from modern templates
                    </span>
                    <svg
                        className="size-6 -rotate-12 transition-transform hover:scale-110"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M 4 19 C 10 20, 16 16, 18 7" />
                        <polyline points="13 6 18 6 19 11" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
