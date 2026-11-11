import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    Bot,
    Briefcase,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    Clock,
    Download,
    Eye,
    FileCheck,
    FileText,
    Flame,
    GraduationCap,
    Headphones,
    HelpCircle,
    LayoutDashboard,
    LayoutGrid,
    LayoutTemplate,
    LogOut,
    Menu,
    MessageSquare,
    Palette,
    Play,
    Rocket,
    Settings,
    Shield,
    ShieldCheck,
    Sparkles,
    Star,
    Sun,
    User as UserIcon,
    Users,
    Wand2,
    X,
    Zap,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { CvCardLivePreview } from '@/components/cv/cv-live-preview';
import { HeroIllustration } from '@/components/landing/hero-illustration';
import { AiFeatureIllustration } from '@/components/landing/ai-feature-illustration';
import { FaqIllustration } from '@/components/landing/faq-illustration';
import {
    StepIllustration1,
    StepIllustration2,
    StepIllustration3,
    StepIllustration4,
} from '@/components/landing/steps-illustrations';
import {
    SocialProofAvatar1,
    SocialProofAvatar2,
    SocialProofAvatar3,
    SocialProofAvatar4,
} from '@/components/landing/hero-avatars';
import { useAppearance } from '@/hooks/use-appearance';
import { dashboard, login, logout, register } from '@/routes';
import type { User } from '@/types';

interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    badge?: string;
    gradient: string;
}

function FeatureCard({ icon: Icon, title, description, badge, gradient }: FeatureCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/70 p-6 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl dark:border-neutral-800/80 dark:bg-neutral-900/60 dark:hover:border-neutral-700">
            <div className={`mb-4 inline-flex size-12 items-center justify-center rounded-xl ${gradient} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="size-6" />
            </div>
            {badge && (
                <span className="absolute top-6 right-6 inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                    {badge}
                </span>
            )}
            <h3 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {description}
            </p>
        </div>
    );
}

export default function Welcome() {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [activeCategory, setActiveCategory] = useState<'semua' | 'profesional' | 'modern' | 'kreatif'>('semua');
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const showcaseTemplates = [
        {
            id: 1,
            name: 'Alex Pratama',
            role: 'Full Stack Developer',
            previewType: 'hendra' as const,
            tag: 'Popular',
            isPopular: true,
            score: '98% ATS',
        },
        {
            id: 2,
            name: 'Rizky Saputra',
            role: 'Software Engineer',
            previewType: 'ayu' as const,
            tag: 'Rekomendasi',
            score: '96% ATS',
        },
        {
            id: 1,
            name: 'Dimas Arya',
            role: 'Data Analyst',
            previewType: 'hendra' as const,
            tag: 'Modern',
            score: '98% ATS',
        },
        {
            id: 2,
            name: 'Fajar Maulana',
            role: 'UI/UX Designer',
            previewType: 'ayu' as const,
            tag: 'Kreatif',
            score: '96% ATS',
        },
        {
            id: 1,
            name: 'Bagas Prasetya',
            role: 'Frontend Developer',
            previewType: 'hendra' as const,
            tag: 'ATS Hero',
            score: '98% ATS',
        },
        {
            id: 2,
            name: 'Andika Putra',
            role: 'Product Manager',
            previewType: 'ayu' as const,
            tag: 'Profesional',
            score: '96% ATS',
        },
    ];

    const templates = [
        {
            id: 1,
            name: 'Modern Minimalist',
            previewType: 'hendra' as const,
            tag: 'Paling Populer',
            category: 'Modern ATS',
            score: '98% ATS',
            desc: 'Format 1 kolom modern dengan tata letak bersih dan proporsional, dioptimalkan untuk talenta profesional dan digital.',
        },
        {
            id: 2,
            name: 'Classic Professional',
            previewType: 'ayu' as const,
            tag: 'Rekomendasi HRD',
            category: 'Klasik ATS',
            score: '96% ATS',
            desc: 'Format terstruktur berstandar korporasi global, perbankan, instansi BUMN, dan firma hukum terkemuka.',
        },
    ];

    const stats = [
        { number: '98%', label: 'Tingkat Lolos Skrining ATS' },
        { number: '50.000+', label: 'CV Telah Dibuat' },
        { number: '4.9/5', label: 'Kepuasan Pencari Kerja' },
        { number: '< 5 Mnt', label: 'Waktu Pembuatan Rata-rata' },
    ];

    const steps = [
        {
            number: '01',
            title: 'Pilih Template Berstandar ATS',
            desc: 'Pilih dari ragam template teruji yang ramah sistem pelacak pelamar kerja global.',
        },
        {
            number: '02',
            title: 'Optimasi Profil dengan AI',
            desc: 'Tulis deskripsi pengalaman dan rangkuman karier yang memikat dengan bantuan kecerdasan buatan.',
        },
        {
            number: '03',
            title: 'Pratinjau & Unduh PDF Instan',
            desc: 'Dapatkan dokumen resume berkualitas cetak tinggi yang siap Anda kirimkan ke HRD impian.',
        },
    ];

    const faqs = [
        {
            q: 'Apa itu Aikrut?',
            a: 'Aikrut adalah platform AI untuk membuat CV profesional dengan mudah, cepat, dan gratis. Anda bisa memilih template, mendapatkan saran AI, dan mengunduh CV Anda dalam format PDF.',
        },
        {
            q: 'Apakah Aikrut gratis?',
            a: 'Ya, Aikrut menyediakan fitur dasar pembuatan CV dan unduhan format PDF secara gratis untuk membantu Anda memulai langkah karier tanpa biaya berlangganan.',
        },
        {
            q: 'Bagaimana cara menggunakan Aikrut?',
            a: 'Cukup buat akun, pilih template yang sesuai, lengkapi data riwayat karier atau gunakan bantuan AI untuk menghasilkan ringkasan otomatis, lalu unduh resume Anda.',
        },
        {
            q: 'Apakah CV yang dibuat bisa lolos ATS?',
            a: 'Ya, seluruh template Aikrut dirancang dan diuji dengan standar parser ATS global agar format teks dan strukturnya dapat dibaca dengan akurat oleh sistem perusahaan.',
        },
        {
            q: 'Format file apa yang didukung?',
            a: 'Saat ini Aikrut mendukung ekspor dokumen ke format PDF beresolusi tinggi yang siap cetak maupun dikirim secara digital kepada rekruter.',
        },
    ];

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#0B0F3B] transition-colors selection:bg-[#5025D1] selection:text-white dark:bg-[#0B1120] dark:text-neutral-100">
            <Head title="Aikrut CV - Buat CV Berstandar ATS & Lolos Skrining Kerja dengan AI" />

            {/* Landing Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-[#E8E4DC]/80 bg-[#FAF7F2]/80 backdrop-blur-md transition-colors dark:border-neutral-800/80 dark:bg-[#0B1120]/80">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2.5 focus:outline-none">
                        <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-white p-0.5 shadow-xs ring-1 ring-neutral-200/80 dark:bg-white dark:ring-neutral-700">
                            <AppLogoIcon className="size-full object-contain" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-[#0B0F3B] dark:text-white">
                            Aikrut
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden items-center gap-8 md:flex">
                        <a
                            href="#fitur"
                            className="relative pb-1 text-sm font-semibold text-[#0B0F3B] transition-colors dark:text-white"
                        >
                            Fitur AI
                            <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#5025D1]" />
                        </a>
                        <a
                            href="#template"
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-[#5025D1] dark:text-neutral-300 dark:hover:text-purple-400"
                        >
                            Pilihan Template
                        </a>
                        <a
                            href="#cara-kerja"
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-[#5025D1] dark:text-neutral-300 dark:hover:text-purple-400"
                        >
                            Cara Kerja
                        </a>
                        <a
                            href="#faq"
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-[#5025D1] dark:text-neutral-300 dark:hover:text-purple-400"
                        >
                            FAQ
                        </a>
                    </nav>

                    {/* Right Controls: Theme Toggle & Sign In */}
                    <div className="hidden items-center gap-4 md:flex">
                        <button
                            type="button"
                            onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                            className="rounded-full p-2 text-slate-700 transition-colors hover:bg-black/5 hover:text-[#5025D1] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-purple-300 cursor-pointer"
                            aria-label="Toggle theme"
                            title={resolvedAppearance === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            <Sun className="size-5" />
                        </button>

                        <Link
                            href={auth.user ? dashboard() : login()}
                            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#5B2DEE] via-[#5025D1] to-[#481BD6] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#5025D1]/25 transition-all hover:brightness-105 active:scale-95 cursor-pointer"
                        >
                            <span>{auth.user ? 'Dashboard' : 'Sign In'}</span>
                            <span className="text-base font-normal">→</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            type="button"
                            onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                            className="p-2 text-slate-700 dark:text-slate-300"
                            aria-label="Toggle theme"
                        >
                            <Sun className="size-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div className="border-b border-[#E8E4DC] bg-[#FAF7F2] px-4 pt-2 pb-6 md:hidden dark:border-neutral-800 dark:bg-[#0B1120]">
                        <nav className="flex flex-col space-y-3 py-3">
                            <a
                                href="#fitur"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm font-semibold text-[#5025D1] transition"
                            >
                                Fitur AI
                            </a>
                            <a
                                href="#template"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm font-medium text-slate-700 transition hover:text-[#5025D1] dark:text-neutral-300"
                            >
                                Pilihan Template
                            </a>
                            <a
                                href="#cara-kerja"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm font-medium text-slate-700 transition hover:text-[#5025D1] dark:text-neutral-300"
                            >
                                Cara Kerja
                            </a>
                            <a
                                href="#faq"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm font-medium text-slate-700 transition hover:text-[#5025D1] dark:text-neutral-300"
                            >
                                FAQ
                            </a>
                        </nav>
                        <div className="mt-4 border-t border-[#E8E4DC] pt-4 dark:border-neutral-800">
                            {auth.user ? (
                                <div className="flex flex-col gap-2">
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5B2DEE] via-[#5025D1] to-[#481BD6] py-3 text-sm font-semibold text-white shadow-md shadow-[#5025D1]/25 active:scale-95"
                                    >
                                        <Briefcase className="size-4" />
                                        <span>Ke Dashboard</span>
                                        <ArrowRight className="size-4" />
                                    </Link>
                                    <Link
                                        href={logout()}
                                        as="button"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 rounded-full border border-neutral-300 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-neutral-700 dark:text-red-400 dark:hover:bg-red-950/30 cursor-pointer"
                                    >
                                        <LogOut className="size-4" />
                                        <span>Keluar (Logout)</span>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Link
                                        href={login()}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-center rounded-full border border-neutral-300 py-2.5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={register()}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#5B2DEE] via-[#5025D1] to-[#481BD6] py-3 text-sm font-semibold text-white shadow-md shadow-[#5025D1]/25"
                                    >
                                        <span>Sign In →</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section matching exact reference design */}
            <section className="relative overflow-hidden pt-8 pb-20 sm:pt-14 sm:pb-28 lg:pt-16 lg:pb-32">
                {/* Background Lavender/Purple concentric circles in bottom-left */}
                <div className="pointer-events-none absolute -bottom-48 -left-48 h-[520px] w-[520px] rounded-full bg-[#DDD6FE]/40 blur-3xl dark:bg-[#5B21B6]/15" />
                <div className="pointer-events-none absolute -bottom-28 -left-28 h-[380px] w-[380px] rounded-full bg-[#C4B5FD]/45 blur-2xl dark:bg-[#6D28D9]/20" />
                <div className="pointer-events-none absolute -bottom-10 -left-10 h-[240px] w-[240px] rounded-full bg-[#A78BFA]/50 blur-xl dark:bg-[#7C3AED]/25" />

                {/* Warm golden ambient glow on top right */}
                <div className="pointer-events-none absolute top-12 right-0 h-[560px] w-[560px] rounded-full bg-gradient-to-br from-amber-300/35 via-yellow-200/20 to-transparent blur-3xl dark:from-amber-500/10 dark:to-transparent" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
                        {/* Left Column: Typography & CTAs */}
                        <div className="flex flex-col text-left lg:col-span-6 xl:col-span-6">
                            {/* Heading */}
                            <h1 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[64px] font-extrabold tracking-tight text-[#0B0F3B] dark:text-white leading-[1.14]">
                                The Resume to get
                                <br />
                                your{' '}
                                <span className="relative inline-block text-[#FFB800]">
                                    Dream Job
                                    {/* Curved golden underline swoosh */}
                                    <svg
                                        className="pointer-events-none absolute -bottom-3 sm:-bottom-4 left-[-8%] w-[116%] h-4 sm:h-5 text-[#FFB800] overflow-visible"
                                        viewBox="0 0 320 20"
                                        fill="none"
                                    >
                                        <path
                                            d="M 4 5 Q 160 22 316 4"
                                            stroke="url(#goldenSwoop)"
                                            strokeWidth="5"
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient id="goldenSwoop" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#FFC837" stopOpacity="0.4" />
                                                <stop offset="25%" stopColor="#FFB800" />
                                                <stop offset="85%" stopColor="#FFB800" />
                                                <stop offset="100%" stopColor="#FFA000" stopOpacity="0.3" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </span>
                            </h1>

                            {/* Subtitle */}
                            <div className="mt-6 sm:mt-7 text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                                <p>Create an impressive resume in minutes.</p>
                                <p>Free to download.</p>
                            </div>

                            {/* CTAs */}
                            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
                                <Link
                                    href={
                                        auth.user
                                            ? '/cv/templates'
                                            : `/login?redirect=${encodeURIComponent('/cv/templates')}`
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5B2DEE] via-[#5025D1] to-[#481BD6] px-8 py-3.5 sm:py-4 text-base font-bold text-white shadow-lg shadow-[#5025D1]/30 hover:shadow-xl hover:shadow-[#5025D1]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                                >
                                    <span>Create My Resume</span>
                                    <span className="text-lg">→</span>
                                </Link>

                                <a
                                    href="#demo"
                                    className="inline-flex items-center justify-center gap-2.5 rounded-full bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-700 px-7 py-3.5 sm:py-4 text-base font-semibold text-[#0B0F3B] dark:text-white shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-neutral-600 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                                >
                                    <div className="flex size-6 items-center justify-center rounded-full bg-[#5025D1] text-white">
                                        <Play className="size-3 fill-current ml-0.5" />
                                    </div>
                                    <span>Watch Demo</span>
                                </a>
                            </div>

                            {/* Social Proof Badges */}
                            <div className="mt-10 sm:mt-12 flex items-center gap-3.5">
                                <div className="flex -space-x-2.5 overflow-hidden p-0.5">
                                    <SocialProofAvatar1 />
                                    <SocialProofAvatar2 />
                                    <SocialProofAvatar3 />
                                    <SocialProofAvatar4 />
                                </div>
                                <span className="text-sm font-semibold text-[#0B0F3B] dark:text-slate-200">
                                    Trusted by 1.5M+ job seekers worldwide
                                </span>
                            </div>
                        </div>

                        {/* Right Column: Hero Visual Mockup */}
                        <div className="lg:col-span-6 xl:col-span-6">
                            <HeroIllustration />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar (Refactored to match Aikrut brand theme) */}
            <section className="relative z-20 -mt-4 sm:-mt-8 mb-4 sm:mb-8">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-neutral-900/90 border border-[#E8E4DC] dark:border-neutral-800 shadow-xl shadow-purple-950/5 backdrop-blur-md p-6 sm:p-8">
                        {/* Soft corner decorative ambient glow */}
                        <div className="pointer-events-none absolute -top-12 -left-12 size-36 rounded-full bg-[#DDD6FE]/40 blur-2xl dark:bg-[#7C3AED]/15" />
                        <div className="pointer-events-none absolute -bottom-12 -right-12 size-36 rounded-full bg-amber-200/40 blur-2xl dark:bg-amber-500/10" />

                        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-neutral-800">
                            {/* Stat 1 */}
                            <div className="flex flex-col items-center text-center p-2">
                                <div className="flex size-11 items-center justify-center rounded-2xl bg-purple-100/80 text-[#5025D1] shadow-xs mb-3 dark:bg-purple-950/60 dark:text-purple-300">
                                    <ShieldCheck className="size-5.5" />
                                </div>
                                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B0F3B] dark:text-white">
                                    98%
                                </div>
                                <div className="mt-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Tingkat Lolos Skrining ATS
                                </div>
                            </div>

                            {/* Stat 2 */}
                            <div className="flex flex-col items-center text-center p-2 pt-6 sm:pt-2">
                                <div className="flex size-11 items-center justify-center rounded-2xl bg-purple-100/80 text-[#5025D1] shadow-xs mb-3 dark:bg-purple-950/60 dark:text-purple-300">
                                    <FileText className="size-5.5" />
                                </div>
                                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#5025D1] dark:text-purple-400">
                                    50.000+
                                </div>
                                <div className="mt-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                                    CV Telah Dibuat
                                </div>
                            </div>

                            {/* Stat 3 */}
                            <div className="flex flex-col items-center text-center p-2 pt-6 sm:pt-2">
                                <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-100/80 text-[#FFB800] shadow-xs mb-3 dark:bg-amber-950/60">
                                    <Star className="size-5.5 fill-[#FFB800]" />
                                </div>
                                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B0F3B] dark:text-white">
                                    4.9/5
                                </div>
                                <div className="mt-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Kepuasan Pencari Kerja
                                </div>
                            </div>

                            {/* Stat 4 */}
                            <div className="flex flex-col items-center text-center p-2 pt-6 sm:pt-2">
                                <div className="flex size-11 items-center justify-center rounded-2xl bg-purple-100/80 text-[#5025D1] shadow-xs mb-3 dark:bg-purple-950/60 dark:text-purple-300">
                                    <Clock className="size-5.5" />
                                </div>
                                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B0F3B] dark:text-white">
                                    &lt; 5 Mnt
                                </div>
                                <div className="mt-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Waktu Pembuatan Rata-rata
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section (AI Writing Assistant matching reference) */}
            <section id="fitur" className="relative overflow-hidden py-20 sm:py-28">
                {/* Background Lavender/Purple concentric circles in bottom-right */}
                <div className="pointer-events-none absolute -bottom-48 -right-48 h-[520px] w-[520px] rounded-full bg-[#DDD6FE]/40 blur-3xl dark:bg-[#5B21B6]/15" />
                <div className="pointer-events-none absolute -bottom-28 -right-28 h-[380px] w-[380px] rounded-full bg-[#C4B5FD]/45 blur-2xl dark:bg-[#6D28D9]/20" />
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-[240px] w-[240px] rounded-full bg-[#A78BFA]/50 blur-xl dark:bg-[#7C3AED]/25" />

                {/* Warm golden ambient glow on top left */}
                <div className="pointer-events-none absolute top-12 left-0 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-amber-300/30 via-yellow-200/15 to-transparent blur-3xl dark:from-amber-500/10 dark:to-transparent" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
                        {/* Left Column: AI Mockup Illustration */}
                        <div className="lg:col-span-6 xl:col-span-6">
                            <AiFeatureIllustration />
                        </div>

                        {/* Right Column: Content & Features */}
                        <div className="flex flex-col text-left lg:col-span-6 xl:col-span-6">
                            {/* Pill Badge */}
                            <div>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/80 px-3.5 py-1.5 text-xs font-bold text-[#5025D1] dark:bg-purple-950/60 dark:text-purple-300">
                                    <Sparkles className="size-3.5 fill-current" />
                                    <span>AI Writing Assistant</span>
                                </span>
                            </div>

                            {/* Heading */}
                            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0B0F3B] dark:text-white leading-[1.15]">
                                Optimalkan CV Anda
                                <br />
                                dengan Bantuan{' '}
                                <span className="relative inline-block text-[#FFB800]">
                                    AI
                                    {/* Curved golden underline swoosh */}
                                    <svg
                                        className="pointer-events-none absolute -bottom-2 sm:-bottom-3 left-[-20%] w-[140%] h-3.5 sm:h-4 text-[#FFB800] overflow-visible"
                                        viewBox="0 0 120 14"
                                        fill="none"
                                    >
                                        <path
                                            d="M 2 4 Q 60 14 118 3"
                                            stroke="url(#goldenSwoopAi)"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient id="goldenSwoopAi" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#FFC837" stopOpacity="0.4" />
                                                <stop offset="30%" stopColor="#FFB800" />
                                                <stop offset="80%" stopColor="#FFB800" />
                                                <stop offset="100%" stopColor="#FFA000" stopOpacity="0.3" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </span>
                            </h2>

                            {/* Subtitle */}
                            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-xl">
                                Dapatkan saran cerdas untuk meningkatkan kualitas CV Anda, mulai dari perbaikan kalimat hingga rekomendasi skill yang relevan.
                            </p>

                            {/* 2x2 Feature Grid */}
                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                                {/* Feature 1 */}
                                <div className="flex items-start gap-3.5">
                                    <div className="flex size-11 items-center justify-center rounded-2xl bg-purple-100/70 text-[#5025D1] shadow-xs shrink-0 dark:bg-purple-950/60 dark:text-purple-300">
                                        <Wand2 className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm sm:text-base font-bold text-[#0B0F3B] dark:text-white">
                                            Improve Sentence
                                        </h4>
                                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                            Perbaiki tulisan Anda
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 2 */}
                                <div className="flex items-start gap-3.5">
                                    <div className="flex size-11 items-center justify-center rounded-2xl bg-purple-100/70 text-[#5025D1] shadow-xs shrink-0 dark:bg-purple-950/60 dark:text-purple-300">
                                        <UserIcon className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm sm:text-base font-bold text-[#0B0F3B] dark:text-white">
                                            Skill Recommendation
                                        </h4>
                                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                            Temukan skill yang relevan
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 3 */}
                                <div className="flex items-start gap-3.5">
                                    <div className="flex size-11 items-center justify-center rounded-2xl bg-purple-100/70 text-[#5025D1] shadow-xs shrink-0 dark:bg-purple-950/60 dark:text-purple-300">
                                        <FileText className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm sm:text-base font-bold text-[#0B0F3B] dark:text-white">
                                            Job Matching
                                        </h4>
                                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                            Sesuaikan dengan posisi pekerjaan
                                        </p>
                                    </div>
                                </div>

                                {/* Feature 4 */}
                                <div className="flex items-start gap-3.5">
                                    <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-xs shrink-0 dark:bg-emerald-950/50 dark:text-emerald-400">
                                        <CheckCircle2 className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm sm:text-base font-bold text-[#0B0F3B] dark:text-white">
                                            Grammar Check
                                        </h4>
                                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                            Pastikan CV bebas kesalahan
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="mt-8">
                                <Link
                                    href={auth.user ? dashboard() : login()}
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5B2DEE] via-[#5025D1] to-[#481BD6] px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-[#5025D1]/30 hover:shadow-xl hover:shadow-[#5025D1]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                                >
                                    <span>Mulai Menggunakan AI</span>
                                    <span className="text-lg">→</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Templates Showcase Section matching reference design */}
            <section id="template" className="relative overflow-hidden py-20 sm:py-28">
                {/* Background Warm Golden ambient glow */}
                <div className="pointer-events-none absolute -bottom-36 -left-36 h-[480px] w-[480px] rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-500/10" />
                <div className="pointer-events-none absolute top-0 right-0 h-[450px] w-[450px] rounded-full bg-yellow-200/20 blur-3xl dark:bg-yellow-500/10" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Top Category Filter Tabs Bar */}
                    <div className="flex justify-start sm:justify-end mb-8 sm:mb-10">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                            <button
                                type="button"
                                onClick={() => setActiveCategory('semua')}
                                className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-bold transition-all cursor-pointer ${
                                    activeCategory === 'semua'
                                        ? 'bg-[#5025D1] text-white shadow-md shadow-[#5025D1]/25'
                                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 dark:bg-neutral-900 dark:border-neutral-700 dark:text-slate-200'
                                }`}
                            >
                                <LayoutGrid className="size-4" />
                                <span>Semua</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveCategory('profesional')}
                                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
                                    activeCategory === 'profesional'
                                        ? 'bg-[#5025D1] text-white shadow-md shadow-[#5025D1]/25'
                                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 dark:bg-neutral-900 dark:border-neutral-700 dark:text-slate-200'
                                }`}
                            >
                                <Briefcase className="size-4" />
                                <span>Profesional</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveCategory('modern')}
                                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
                                    activeCategory === 'modern'
                                        ? 'bg-[#5025D1] text-white shadow-md shadow-[#5025D1]/25'
                                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 dark:bg-neutral-900 dark:border-neutral-700 dark:text-slate-200'
                                }`}
                            >
                                <GraduationCap className="size-4" />
                                <span>Modern</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveCategory('kreatif')}
                                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
                                    activeCategory === 'kreatif'
                                        ? 'bg-[#5025D1] text-white shadow-md shadow-[#5025D1]/25'
                                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 dark:bg-neutral-900 dark:border-neutral-700 dark:text-slate-200'
                                }`}
                            >
                                <Star className="size-4" />
                                <span>Kreatif</span>
                            </button>

                            <button
                                type="button"
                                className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300 transition-all dark:bg-neutral-900 dark:border-neutral-700 dark:text-slate-200 cursor-pointer"
                            >
                                <span>Lainnya</span>
                                <ChevronDown className="size-3.5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
                        {/* Left Column: Heading & Value Proposition */}
                        <div className="flex flex-col text-left lg:col-span-4 xl:col-span-4">
                            {/* Pill Badge with Joyful energy dashes */}
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/80 px-3.5 py-1.5 text-xs font-bold text-[#5025D1] dark:bg-purple-950/60 dark:text-purple-300">
                                    <LayoutGrid className="size-3.5" />
                                    <span>Professional Templates</span>
                                </span>

                                <div className="flex items-center gap-1 text-[#FFB800]">
                                    <span className="block h-3 w-1 -rotate-25 rounded-full bg-[#FFB800]" />
                                    <span className="block h-3.5 w-1.5 -rotate-5 rounded-full bg-[#FFB800] -mt-0.5" />
                                    <span className="block h-3 w-1 rotate-20 rounded-full bg-[#FFB800]" />
                                </div>
                            </div>

                            {/* Heading */}
                            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0B0F3B] dark:text-white leading-[1.14]">
                                Pilih Template
                                <br />
                                CV{' '}
                                <span className="relative inline-block text-[#FFB800]">
                                    Favorit Anda
                                    {/* Curved golden underline swoosh */}
                                    <svg
                                        className="pointer-events-none absolute -bottom-2 sm:-bottom-3 left-[-10%] w-[120%] h-3.5 sm:h-4 text-[#FFB800] overflow-visible"
                                        viewBox="0 0 240 16"
                                        fill="none"
                                    >
                                        <path
                                            d="M 4 5 Q 120 16 236 4"
                                            stroke="url(#goldenSwoopTpl)"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient id="goldenSwoopTpl" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#FFC837" stopOpacity="0.4" />
                                                <stop offset="25%" stopColor="#FFB800" />
                                                <stop offset="80%" stopColor="#FFB800" />
                                                <stop offset="100%" stopColor="#FFA000" stopOpacity="0.3" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </span>
                            </h2>

                            {/* Subtitle */}
                            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-sm">
                                Gunakan berbagai template profesional yang dirancang untuk membuat CV Anda lebih menonjol.
                            </p>

                            {/* Feature List */}
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-2xl bg-purple-100/70 text-[#5025D1] shadow-xs shrink-0 dark:bg-purple-950/60 dark:text-purple-300">
                                        {/* Diamond / Gem */}
                                        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M6 3h12l4 6-10 12L2 9z" />
                                            <path d="M11 3 L8 9 L12 21 L16 9 L13 3" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-bold text-[#0B0F3B] dark:text-white">
                                        Desain Modern &amp; Profesional
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-2xl bg-purple-100/70 text-[#5025D1] shadow-xs shrink-0 dark:bg-purple-950/60 dark:text-purple-300">
                                        <Zap className="size-5 fill-current" />
                                    </div>
                                    <span className="text-sm font-bold text-[#0B0F3B] dark:text-white">
                                        100% ATS-Friendly
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-2xl bg-purple-100/70 text-[#5025D1] shadow-xs shrink-0 dark:bg-purple-950/60 dark:text-purple-300">
                                        <Palette className="size-5" />
                                    </div>
                                    <span className="text-sm font-bold text-[#0B0F3B] dark:text-white">
                                        Bisa Disesuaikan Sesuai Gaya Anda
                                    </span>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="mt-8 sm:mt-10">
                                <Link
                                    href={
                                        auth.user
                                            ? '/cv/templates'
                                            : `/login?redirect=${encodeURIComponent('/cv/templates')}`
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5B2DEE] via-[#5025D1] to-[#481BD6] px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-[#5025D1]/30 hover:shadow-xl hover:shadow-[#5025D1]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                                >
                                    <span>Mulai Membuat CV</span>
                                    <span className="text-lg">→</span>
                                </Link>
                            </div>
                        </div>

                        {/* Right Area: 6 Template Cards in 3x2 Grid */}
                        <div className="relative lg:col-span-8 xl:col-span-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {showcaseTemplates.map((tpl, idx) => (
                                    <div
                                        key={idx}
                                        className={`group relative flex flex-col rounded-2xl bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                                            tpl.isPopular
                                                ? 'ring-2 ring-[#5025D1] border border-[#5025D1]'
                                                : 'border border-slate-200/90'
                                        }`}
                                    >
                                        {/* Floating Popular Badge on Card 1 */}
                                        {tpl.isPopular && (
                                            <div className="absolute top-2.5 right-2.5 z-20 inline-flex items-center gap-1 rounded-full bg-[#5025D1] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md shadow-[#5025D1]/30">
                                                <Flame className="size-3 fill-current" />
                                                <span>Popular</span>
                                            </div>
                                        )}

                                        {/* Floating Checkmark Circle on Card 1 */}
                                        {tpl.isPopular && (
                                            <div className="absolute bottom-2.5 right-2.5 z-20 flex size-6 items-center justify-center rounded-full bg-[#5025D1] text-white shadow-md">
                                                <Check className="size-3 stroke-[3]" />
                                            </div>
                                        )}

                                        {/* Live Preview Container with scaled down template */}
                                        <div className="relative aspect-[1/1.22] w-full overflow-hidden bg-white">
                                            <div className="pointer-events-none origin-top scale-[0.62] sm:scale-[0.68] p-3 -mt-1 select-none">
                                                <CvCardLivePreview templateType={tpl.previewType} data={null} />
                                            </div>
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-[#0B0F3B]/55 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center p-4 text-center z-30">
                                            <span className="text-white font-bold text-sm drop-shadow-sm">
                                                {tpl.name}
                                            </span>
                                            <span className="text-white/80 text-[11px] mb-3">
                                                {tpl.role}
                                            </span>
                                            <Link
                                                href={
                                                    auth.user
                                                        ? `/cv/options?template_id=${tpl.id}`
                                                        : `/login?redirect=${encodeURIComponent(`/cv/options?template_id=${tpl.id}`)}`
                                                }
                                                className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#5025D1] font-bold text-xs px-4 py-2 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                            >
                                                <span>Gunakan Template</span>
                                                <ArrowRight className="size-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Floating Carousel Next Button on Right Side */}
                            <Link
                                href="/cv/templates"
                                className="hidden xl:flex absolute -right-5 top-1/2 -translate-y-1/2 size-11 items-center justify-center rounded-full bg-white shadow-xl border border-slate-200/90 text-[#5025D1] hover:scale-110 hover:shadow-2xl transition-all z-20 cursor-pointer"
                                title="Lihat semua template"
                            >
                                <ChevronRight className="size-5 stroke-[2.5]" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section matching reference design */}
            <section id="cara-kerja" className="relative overflow-hidden py-20 sm:py-28">
                {/* Background Lavender/Purple concentric circles in bottom-left */}
                <div className="pointer-events-none absolute -bottom-48 -left-48 h-[520px] w-[520px] rounded-full bg-[#DDD6FE]/35 blur-3xl dark:bg-[#5B21B6]/15" />
                {/* Warm golden ambient glow on top right */}
                <div className="pointer-events-none absolute top-0 right-0 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-amber-300/25 via-yellow-200/15 to-transparent blur-3xl dark:from-amber-500/10 dark:to-transparent" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center">
                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/80 px-4 py-1.5 text-xs font-bold text-[#5025D1] dark:bg-purple-950/60 dark:text-purple-300">
                            <Zap className="size-3.5 fill-current" />
                            <span>Cara Kerja</span>
                        </div>

                        {/* Heading with Joyful energy dashes and golden swoop */}
                        <div className="relative mt-4 flex items-center justify-center">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0B0F3B] dark:text-white leading-[1.14]">
                                Mulai Buat CV Impianmu
                                <br />
                                dalam{' '}
                                <span className="relative inline-block text-[#FFB800]">
                                    4 Langkah Mudah
                                    {/* Curved golden underline swoosh */}
                                    <svg
                                        className="pointer-events-none absolute -bottom-2 sm:-bottom-3 left-[-10%] w-[120%] h-3.5 sm:h-4 text-[#FFB800] overflow-visible"
                                        viewBox="0 0 240 16"
                                        fill="none"
                                    >
                                        <path
                                            d="M 4 5 Q 120 16 236 4"
                                            stroke="url(#goldenSwoopSteps)"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient id="goldenSwoopSteps" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#FFC837" stopOpacity="0.4" />
                                                <stop offset="25%" stopColor="#FFB800" />
                                                <stop offset="80%" stopColor="#FFB800" />
                                                <stop offset="100%" stopColor="#FFA000" stopOpacity="0.3" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </span>
                            </h2>

                            {/* Joyful yellow energetic dashes */}
                            <div className="hidden sm:flex absolute -right-12 top-4 items-center gap-1 text-[#FFB800]">
                                <span className="block h-3.5 w-1 -rotate-25 rounded-full bg-[#FFB800]" />
                                <span className="block h-4 w-1.5 -rotate-5 rounded-full bg-[#FFB800] -mt-0.5" />
                                <span className="block h-3.5 w-1 rotate-20 rounded-full bg-[#FFB800]" />
                            </div>
                        </div>

                        {/* Subtitle */}
                        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl">
                            Proses cepat, hasil maksimal. Siap dalam hitungan menit!
                        </p>
                    </div>

                    {/* 4 Steps Process Cards (Horizontal Flow) */}
                    <div className="mt-14 sm:mt-16 relative">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                            {/* Card 1 */}
                            <div className="group relative flex flex-col items-center rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 p-6 pt-7 text-center shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <StepIllustration1 />

                                {/* Step Number Badge */}
                                <div className="mt-4 flex size-7 items-center justify-center rounded-full bg-[#5025D1] text-xs font-bold text-white shadow-md">
                                    1
                                </div>

                                <h3 className="mt-3 text-base font-bold text-[#0B0F3B] dark:text-white">
                                    Daftar atau Masuk
                                </h3>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Buat akun atau masuk ke akun Anda.
                                </p>
                            </div>

                            {/* Arrow 1 -> 2 (Desktop only) */}
                            <div className="hidden lg:flex absolute top-1/2 left-[23.5%] -translate-x-1/2 -translate-y-1/2 z-20 size-7 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950/70 text-[#5025D1] dark:text-purple-300 text-xs font-bold shadow-xs">
                                →
                            </div>

                            {/* Card 2 */}
                            <div className="group relative flex flex-col items-center rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 p-6 pt-7 text-center shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <StepIllustration2 />

                                {/* Step Number Badge */}
                                <div className="mt-4 flex size-7 items-center justify-center rounded-full bg-[#5025D1] text-xs font-bold text-white shadow-md">
                                    2
                                </div>

                                <h3 className="mt-3 text-base font-bold text-[#0B0F3B] dark:text-white">
                                    Pilih Template
                                </h3>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Temukan template CV profesional favorit Anda.
                                </p>
                            </div>

                            {/* Arrow 2 -> 3 (Desktop only) */}
                            <div className="hidden lg:flex absolute top-1/2 left-[49.5%] -translate-x-1/2 -translate-y-1/2 z-20 size-7 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950/70 text-[#5025D1] dark:text-purple-300 text-xs font-bold shadow-xs">
                                →
                            </div>

                            {/* Card 3 */}
                            <div className="group relative flex flex-col items-center rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 p-6 pt-7 text-center shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <StepIllustration3 />

                                {/* Step Number Badge */}
                                <div className="mt-4 flex size-7 items-center justify-center rounded-full bg-[#5025D1] text-xs font-bold text-white shadow-md">
                                    3
                                </div>

                                <h3 className="mt-3 text-base font-bold text-[#0B0F3B] dark:text-white">
                                    Sesuaikan dengan AI
                                </h3>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Dapatkan saran cerdas untuk meningkatkan CV Anda.
                                </p>
                            </div>

                            {/* Arrow 3 -> 4 (Desktop only) */}
                            <div className="hidden lg:flex absolute top-1/2 left-[75.5%] -translate-x-1/2 -translate-y-1/2 z-20 size-7 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950/70 text-[#5025D1] dark:text-purple-300 text-xs font-bold shadow-xs">
                                →
                            </div>

                            {/* Card 4 */}
                            <div className="group relative flex flex-col items-center rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 p-6 pt-7 text-center shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <StepIllustration4 />

                                {/* Step Number Badge */}
                                <div className="mt-4 flex size-7 items-center justify-center rounded-full bg-[#5025D1] text-xs font-bold text-white shadow-md">
                                    4
                                </div>

                                <h3 className="mt-3 text-base font-bold text-[#0B0F3B] dark:text-white">
                                    Download &amp; Lamar
                                </h3>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Unduh CV Anda dan mulai melamar pekerjaan.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA Button */}
                    <div className="mt-12 sm:mt-14 flex justify-center">
                        <Link
                            href={
                                auth.user
                                    ? '/cv/templates'
                                    : `/login?redirect=${encodeURIComponent('/cv/templates')}`
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5B2DEE] via-[#5025D1] to-[#481BD6] px-9 py-3.5 text-base font-bold text-white shadow-lg shadow-[#5025D1]/30 hover:shadow-xl hover:shadow-[#5025D1]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                        >
                            <span>Mulai Sekarang</span>
                            <span className="text-lg">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ Section matching reference design */}
            <section id="faq" className="relative overflow-hidden py-20 sm:py-28">
                {/* Background Lavender/Purple concentric circles in bottom-left and bottom-right */}
                <div className="pointer-events-none absolute -bottom-48 -left-48 h-[520px] w-[520px] rounded-full bg-[#DDD6FE]/35 blur-3xl dark:bg-[#5B21B6]/15" />
                <div className="pointer-events-none absolute -bottom-48 -right-48 h-[520px] w-[520px] rounded-full bg-[#DDD6FE]/35 blur-3xl dark:bg-[#5B21B6]/15" />
                <div className="pointer-events-none absolute top-12 right-0 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-amber-300/25 via-yellow-200/15 to-transparent blur-3xl dark:from-amber-500/10 dark:to-transparent" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center">
                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/80 px-4 py-1.5 text-xs font-bold text-[#5025D1] dark:bg-purple-950/60 dark:text-purple-300">
                            <span className="flex size-4 items-center justify-center rounded-full bg-[#5025D1] text-[10px] text-white font-bold">?</span>
                            <span>Pusat Bantuan</span>
                        </div>

                        {/* Heading with Joyful energy dashes and golden swoop */}
                        <div className="relative mt-4 flex items-center justify-center">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0B0F3B] dark:text-white">
                                Frequently Asked{' '}
                                <span className="relative inline-block text-[#FFB800]">
                                    Questions
                                    {/* Curved golden underline swoosh */}
                                    <svg
                                        className="pointer-events-none absolute -bottom-2 sm:-bottom-3 left-[-10%] w-[120%] h-3.5 sm:h-4 text-[#FFB800] overflow-visible"
                                        viewBox="0 0 200 16"
                                        fill="none"
                                    >
                                        <path
                                            d="M 4 5 Q 100 16 196 4"
                                            stroke="url(#goldenSwoopFaq)"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient id="goldenSwoopFaq" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#FFC837" stopOpacity="0.4" />
                                                <stop offset="25%" stopColor="#FFB800" />
                                                <stop offset="80%" stopColor="#FFB800" />
                                                <stop offset="100%" stopColor="#FFA000" stopOpacity="0.3" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </span>
                            </h2>

                            {/* Joyful yellow energetic dashes */}
                            <div className="hidden sm:flex absolute -right-12 top-0 items-center gap-1 text-[#FFB800]">
                                <span className="block h-3.5 w-1 -rotate-25 rounded-full bg-[#FFB800]" />
                                <span className="block h-4 w-1.5 -rotate-5 rounded-full bg-[#FFB800] -mt-0.5" />
                                <span className="block h-3.5 w-1 rotate-20 rounded-full bg-[#FFB800]" />
                            </div>
                        </div>

                        {/* Subtitle */}
                        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl">
                            Temukan jawaban atas pertanyaan yang sering diajukan di sini.
                        </p>
                    </div>

                    {/* Main Two-Column Layout */}
                    <div className="mt-14 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
                        {/* Left Column: 3D Illustration */}
                        <div className="lg:col-span-5 xl:col-span-5">
                            <FaqIllustration />
                        </div>

                        {/* Right Column: Accordion of 5 Questions */}
                        <div className="space-y-3.5 lg:col-span-7 xl:col-span-7">
                            {faqs.map((faq, i) => {
                                const isOpen = openFaq === i;
                                return (
                                    <div
                                        key={i}
                                        className="rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 shadow-xs overflow-hidden transition-all duration-200"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaq(isOpen ? null : i)}
                                            className="flex w-full items-center justify-between p-4.5 sm:p-5 text-left transition-colors hover:bg-slate-50/50 dark:hover:bg-neutral-800/50 cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#5025D1] text-xs font-bold text-white shadow-xs">
                                                    Q
                                                </div>
                                                <span className="text-sm sm:text-base font-bold text-[#0B0F3B] dark:text-white">
                                                    {faq.q}
                                                </span>
                                            </div>
                                            <div className="text-[#5025D1] dark:text-purple-400">
                                                {isOpen ? (
                                                    <ChevronUp className="size-5" />
                                                ) : (
                                                    <ChevronDown className="size-5" />
                                                )}
                                            </div>
                                        </button>

                                        {isOpen && (
                                            <div className="px-4.5 sm:px-5 pb-5 pt-1 border-t border-slate-100 dark:border-neutral-800/80">
                                                <p className="pl-9 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                                    {faq.a}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bottom Support Banner Card */}
                    <div className="relative mt-16 overflow-hidden rounded-3xl bg-white/90 dark:bg-neutral-900/90 border border-purple-200/70 dark:border-purple-900/40 p-6 sm:p-8 shadow-xs backdrop-blur-md">
                        {/* Decorative lavender corner curves inside card */}
                        <div className="pointer-events-none absolute -bottom-10 -left-10 size-32 rounded-full bg-[#DDD6FE]/50 blur-xl dark:bg-[#7C3AED]/20" />
                        <div className="pointer-events-none absolute -bottom-10 -right-10 size-32 rounded-full bg-[#DDD6FE]/50 blur-xl dark:bg-[#7C3AED]/20" />

                        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                            {/* Left Content */}
                            <div className="flex items-center gap-4 text-center sm:text-left">
                                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-purple-100/80 text-[#5025D1] shadow-xs dark:bg-purple-950/60 dark:text-purple-300">
                                    <Headphones className="size-7" />
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-[#0B0F3B] dark:text-white">
                                        Masih punya pertanyaan?
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                        Hubungi tim kami untuk bantuan lebih lanjut.
                                    </p>
                                </div>
                            </div>

                            {/* Right Action Button with yellow dashes */}
                            <div className="relative flex items-center">
                                {/* Small energetic yellow dashes */}
                                <div className="pointer-events-none absolute -top-3.5 right-6 flex items-center gap-1 text-[#FFB800]">
                                    <span className="block h-2.5 w-0.5 -rotate-25 rounded-full bg-[#FFB800]" />
                                    <span className="block h-3 w-1 -rotate-5 rounded-full bg-[#FFB800] -mt-0.5" />
                                    <span className="block h-2.5 w-0.5 rotate-20 rounded-full bg-[#FFB800]" />
                                </div>

                                <a
                                    href="https://wa.me/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5B2DEE] via-[#5025D1] to-[#481BD6] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#5025D1]/30 hover:shadow-xl hover:shadow-[#5025D1]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                                >
                                    <MessageSquare className="size-4" />
                                    <span>Hubungi Kami</span>
                                    <span className="text-base font-normal">→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Banner (Refactored to match Aikrut brand theme) */}
            <section className="relative py-16 sm:py-24 overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#5B2DEE] via-[#5025D1] to-[#3B12B0] px-6 py-14 text-center text-white shadow-2xl shadow-[#5025D1]/30 sm:px-12 sm:py-20">
                        {/* Golden warm ambient glow in top-right */}
                        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-br from-[#FFC329]/40 via-[#FFB800]/25 to-transparent blur-3xl" />
                        {/* Soft white/purple ambient glow in bottom-left */}
                        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

                        {/* Subtle decorative orbital ring SVG */}
                        <svg
                            className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 text-white/5 overflow-visible"
                            viewBox="0 0 400 400"
                            fill="none"
                        >
                            <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
                            <circle cx="200" cy="200" r="130" stroke="currentColor" strokeWidth="1.5" />
                        </svg>

                        {/* Floating glassmorphic badges on desktop */}
                        <div className="hidden lg:flex absolute left-10 top-1/2 -translate-y-1/2 size-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl text-[#FFB800] -rotate-6">
                            <Wand2 className="size-8" />
                        </div>
                        <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 size-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl text-white rotate-6">
                            <FileCheck className="size-8 text-[#FFB800]" />
                        </div>

                        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                            {/* Top Pill Badge */}
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/25 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-sm shadow-xs">
                                <Sparkles className="size-3.5 fill-current text-[#FFB800]" />
                                <span>Mulai Gratis Hari Ini</span>
                            </div>

                            {/* Heading with Golden Swoop */}
                            <div className="relative mt-5">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.18] text-white">
                                    Siap Lolos Skrining dan Raih
                                    <br />
                                    <span className="relative inline-block text-[#FFB800]">
                                        Pekerjaan Impian Anda?
                                        {/* Golden swoosh curve */}
                                        <svg
                                            className="pointer-events-none absolute -bottom-2 sm:-bottom-3 left-[-5%] w-[110%] h-3.5 sm:h-4 text-[#FFB800] overflow-visible"
                                            viewBox="0 0 220 14"
                                            fill="none"
                                        >
                                            <path
                                                d="M 4 4 Q 110 14 216 4"
                                                stroke="url(#goldenSwoopCta)"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                            />
                                            <defs>
                                                <linearGradient id="goldenSwoopCta" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#FFC837" stopOpacity="0.4" />
                                                    <stop offset="25%" stopColor="#FFB800" />
                                                    <stop offset="80%" stopColor="#FFB800" />
                                                    <stop offset="100%" stopColor="#FFA000" stopOpacity="0.3" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </span>
                                </h2>

                                {/* Energetic yellow dashes */}
                                <div className="hidden sm:flex absolute -right-10 top-0 items-center gap-1 text-[#FFB800]">
                                    <span className="block h-3 w-1 -rotate-25 rounded-full bg-[#FFB800]" />
                                    <span className="block h-3.5 w-1.5 -rotate-5 rounded-full bg-[#FFB800] -mt-0.5" />
                                    <span className="block h-3 w-1 rotate-20 rounded-full bg-[#FFB800]" />
                                </div>
                            </div>

                            {/* Subtitle */}
                            <p className="mt-5 text-sm sm:text-base text-purple-100 leading-relaxed max-w-xl">
                                Bergabunglah bersama puluhan ribu pencari kerja sukses lainnya yang telah meningkatkan peluang panggilan interview.
                            </p>

                            {/* Action Button */}
                            <div className="mt-8">
                                <Link
                                    href={
                                        auth.user
                                            ? '/cv/templates'
                                            : `/login?redirect=${encodeURIComponent('/cv/templates')}`
                                    }
                                    className="inline-flex items-center gap-2.5 rounded-full bg-white px-9 py-4 text-base font-extrabold text-[#5025D1] shadow-xl hover:shadow-2xl hover:bg-purple-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                >
                                    <span>Mulai Buat CV Gratis Sekarang</span>
                                    <ArrowRight className="size-5 stroke-[2.5]" />
                                </Link>
                            </div>

                            {/* Trust checkpoints */}
                            <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-purple-200/90 font-medium">
                                <span className="flex items-center gap-1.5">
                                    <Check className="size-3.5 text-[#FFB800] stroke-[3]" />
                                    <span>Tanpa kartu kredit</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Check className="size-3.5 text-[#FFB800] stroke-[3]" />
                                    <span>Selesai dalam 5 menit</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Check className="size-3.5 text-[#FFB800] stroke-[3]" />
                                    <span>100% Standar ATS</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer (Refactored to match Aikrut brand theme) */}
            <footer className="border-t border-[#E8E4DC] bg-[#FAF7F2] py-12 text-xs text-slate-500 dark:border-neutral-800 dark:bg-[#0B1120] dark:text-slate-400">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2.5 focus:outline-none">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-white p-0.5 shadow-xs ring-1 ring-[#E8E4DC] dark:bg-neutral-900 dark:ring-neutral-700">
                            <AppLogoIcon className="size-full object-contain" />
                        </div>
                        <span className="text-lg font-black tracking-tight text-[#0B0F3B] dark:text-white">
                            Aikrut
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 font-semibold">
                        <a href="#fitur" className="text-slate-600 hover:text-[#5025D1] transition-colors dark:text-slate-300 dark:hover:text-purple-400">
                            Fitur AI
                        </a>
                        <a href="#template" className="text-slate-600 hover:text-[#5025D1] transition-colors dark:text-slate-300 dark:hover:text-purple-400">
                            Pilihan Template
                        </a>
                        <a href="#cara-kerja" className="text-slate-600 hover:text-[#5025D1] transition-colors dark:text-slate-300 dark:hover:text-purple-400">
                            Cara Kerja
                        </a>
                        <a href="#faq" className="text-slate-600 hover:text-[#5025D1] transition-colors dark:text-slate-300 dark:hover:text-purple-400">
                            FAQ
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="text-center sm:text-right text-slate-400 dark:text-slate-500 font-medium">
                        © {new Date().getFullYear()} Aikrut CV. Hak cipta dilindungi.
                    </div>
                </div>
            </footer>
        </div>
    );
}
