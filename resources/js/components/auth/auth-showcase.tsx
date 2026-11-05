import { Link } from '@inertiajs/react';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';

export default function AuthShowcase() {
    return (
        <div className="relative flex h-full flex-col justify-between overflow-hidden p-8 sm:p-10 select-none">
            {/* Top Brand Logo */}
            <div className="relative z-10">
                <Link href={home()} className="inline-flex items-center gap-2.5 group">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-white p-0.5 shadow-xs ring-1 ring-neutral-200/80 transition-transform group-hover:scale-105">
                        <AppLogoIcon className="size-full object-contain" />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-[#172554]">
                        Aikrut CV
                    </span>
                </Link>

                {/* Main Headline */}
                <div className="mt-6">
                    <h1 className="text-2xl font-black tracking-tight text-[#172554] sm:text-3xl lg:text-[28px] leading-[1.25]">
                        Bangun CV <span className="text-[#5025D1]">Terbaikmu</span>
                        <br />
                        untuk Karir Impian
                    </h1>
                    <p className="mt-2.5 max-w-xs text-xs sm:text-sm leading-relaxed text-[#64748B] font-normal">
                        Buat, sesuaikan, dan optimalkan resume berstandar ATS dengan rekomendasi AI cerdas.
                    </p>
                </div>
            </div>

            {/* Visual 3D Overlapping Template Showcase */}
            <div className="relative my-4 flex items-center justify-center min-h-[300px]">
                {/* Organic Golden/Amber Background Shape Behind Cards */}
                <div className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 w-48 h-36 rounded-[50px] bg-amber-300/35 rotate-12 blur-xl" />
                <div className="pointer-events-none absolute -bottom-4 left-1/4 w-36 h-28 rounded-full bg-violet-200/40 blur-xl" />

                {/* Card Stack Container */}
                <div className="relative w-full max-w-[340px] h-[270px]">
                    {/* 1. Left Card (Sophia G. - Clean Minimalist) */}
                    <div
                        className="absolute -left-3 top-5 w-[160px] rounded-xl border border-neutral-200/80 bg-white p-3 shadow-lg shadow-neutral-900/10 transition-transform duration-300 hover:rotate-[-10deg]"
                        style={{
                            transform: 'rotate(-12deg)',
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
                            <div className="text-[7.5px] font-bold text-neutral-700">Tentang Saya</div>
                            <div className="space-y-1">
                                <div className="h-1 w-full rounded-full bg-neutral-200" />
                                <div className="h-1 w-4/5 rounded-full bg-neutral-200" />
                            </div>

                            <div className="pt-1 text-[7.5px] font-bold text-neutral-700">Keahlian</div>
                            <div className="flex flex-wrap gap-1">
                                <span className="rounded bg-neutral-100 px-1 py-0.5 text-[6.5px] text-neutral-600">UI/UX</span>
                                <span className="rounded bg-neutral-100 px-1 py-0.5 text-[6.5px] text-neutral-600">Figma</span>
                            </div>

                            <div className="pt-1 text-[7.5px] font-bold text-neutral-700">Pengalaman</div>
                            <div className="space-y-1 pl-2 border-l border-neutral-200">
                                <div className="h-1 w-3/4 rounded-full bg-neutral-300" />
                                <div className="h-1 w-1/2 rounded-full bg-neutral-200" />
                            </div>
                        </div>
                    </div>

                    {/* 2. Right Card (Rizky Pratama - Dark Modern Elegance) */}
                    <div
                        className="absolute right-0 top-3 w-[160px] rounded-xl border border-neutral-800 bg-[#141518] p-3 text-white shadow-xl shadow-neutral-900/20 transition-transform duration-300 hover:rotate-[6deg]"
                        style={{
                            transform: 'rotate(8deg)',
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
                            <div className="text-[7.5px] font-bold text-neutral-300">Ringkasan</div>
                            <div className="space-y-1">
                                <div className="h-1 w-full rounded-full bg-neutral-700" />
                                <div className="h-1 w-3/4 rounded-full bg-neutral-700" />
                            </div>

                            <div className="pt-1 text-[7.5px] font-bold text-neutral-300">Keahlian</div>
                            <div className="flex flex-wrap gap-1">
                                <span className="rounded bg-neutral-800 px-1 py-0.5 text-[6.5px] text-neutral-300">Python</span>
                                <span className="rounded bg-neutral-800 px-1 py-0.5 text-[6.5px] text-neutral-300">SQL</span>
                            </div>

                            <div className="pt-1 text-[7.5px] font-bold text-neutral-300">Pengalaman</div>
                            <div className="space-y-1 pl-2 border-l border-amber-500/50">
                                <div className="h-1 w-3/4 rounded-full bg-neutral-600" />
                                <div className="h-1 w-1/2 rounded-full bg-neutral-700" />
                            </div>
                        </div>
                    </div>

                    {/* 3. Middle Forefront Card (Alex Pratama - Full Stack Dev, Modern Minimalist) */}
                    <div
                        className="absolute left-[46%] -translate-x-1/2 -top-2 w-[196px] rounded-xl border border-neutral-200/90 bg-white overflow-hidden shadow-2xl shadow-indigo-950/20 transition-transform duration-300 hover:rotate-[-1deg] hover:scale-[1.02]"
                        style={{
                            transform: 'translateX(-50%) rotate(-3deg)',
                            zIndex: 25,
                        }}
                    >
                        {/* Top Accent Bar with ATS Score Badge */}
                        <div className="bg-[#FAF7F2] border-b border-neutral-100 px-2.5 py-1.5 flex items-center justify-between">
                            <span className="text-[7.5px] font-bold text-[#5025D1]">
                                Modern Minimalist
                            </span>
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[7px] font-extrabold text-emerald-700 border border-emerald-200/80">
                                <Sparkles className="size-2 text-emerald-600" />
                                <span>ATS 98%</span>
                            </span>
                        </div>

                        <div className="flex">
                            {/* Left dark sidebar inside Alex's CV */}
                            <div className="w-[66px] shrink-0 bg-[#1E2333] p-2 text-white flex flex-col justify-between">
                                <div>
                                    <div className="size-8 rounded-lg bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center text-[10px] font-black text-white shadow-xs">
                                        AP
                                    </div>
                                    <div className="mt-1.5 text-[8.5px] font-bold leading-tight truncate">
                                        Alex Pratama
                                    </div>
                                    <div className="text-[6.5px] text-violet-300 truncate">
                                        Full Stack Dev
                                    </div>
                                </div>

                                <div className="space-y-1 pt-2">
                                    <div className="text-[6px] font-semibold text-neutral-400 uppercase tracking-wider">
                                        Skills
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="rounded bg-white/10 px-1 py-0.5 text-[6px] text-neutral-200">React</span>
                                        <span className="rounded bg-white/10 px-1 py-0.5 text-[6px] text-neutral-200">Node.js</span>
                                        <span className="rounded bg-white/10 px-1 py-0.5 text-[6px] text-neutral-200">TypeScript</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right white content */}
                            <div className="flex-1 p-2.5 bg-white">
                                <div className="space-y-1.5">
                                    <div>
                                        <div className="text-[7.5px] font-bold text-[#172554]">Ringkasan</div>
                                        <div className="mt-0.5 space-y-0.5">
                                            <div className="h-1 w-full rounded-full bg-neutral-200" />
                                            <div className="h-1 w-4/5 rounded-full bg-neutral-200" />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[7.5px] font-bold text-[#172554]">Pengalaman</div>
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
                                        <div className="text-[7.5px] font-bold text-[#172554]">Pendidikan</div>
                                        <div className="mt-0.5 h-1 w-3/4 rounded-full bg-neutral-200" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Trust Badges */}
            <div className="relative z-10 flex flex-wrap items-center gap-2 pt-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>98% Lolos Seleksi ATS</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-800">
                    <ShieldCheck className="size-3.5 text-violet-600" />
                    <span>Format Terverifikasi HR</span>
                </div>
            </div>
        </div>
    );
}
