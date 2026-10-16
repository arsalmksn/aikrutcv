import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    Bot,
    Briefcase,
    CheckCircle2,
    ChevronRight,
    Download,
    Eye,
    FileCheck,
    FileText,
    HelpCircle,
    LayoutTemplate,
    Menu,
    Rocket,
    Shield,
    ShieldCheck,
    Sparkles,
    Star,
    Users,
    X,
    Zap,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';

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
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const templates = [
        {
            id: 1,
            name: 'Modern Tech ATS',
            tag: 'Paling Populer',
            category: 'Modern',
            score: '98%',
            desc: 'Didesain khusus untuk talenta digital, software engineer, dan startup tech.',
            accent: 'from-blue-600 to-indigo-600',
        },
        {
            id: 2,
            name: 'Classic Corporate',
            tag: 'Rekomendasi HRD',
            category: 'Klasik',
            score: '96%',
            desc: 'Format bersih dan terstruktur untuk perbankan, BUMN, dan korporasi multinasional.',
            accent: 'from-slate-700 to-neutral-900',
        },
        {
            id: 3,
            name: 'Creative Professional',
            tag: 'Desain Elegan',
            category: 'Kreatif',
            score: '94%',
            desc: 'Pilihan tepat bagi praktisi marketing, product manager, dan creative strategist.',
            accent: 'from-violet-600 to-purple-600',
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
            q: 'Apa itu format CV berstandar ATS?',
            a: 'ATS (Applicant Tracking System) adalah perangkat lunak yang dipakai perusahaan untuk memindai resume secara otomatis. Format kami memastikan tata letak dan teks dapat dibaca sempurna tanpa terpotong atau rusak.',
        },
        {
            q: 'Bagaimana AI membantu meningkatkan kualitas CV saya?',
            a: 'Asisten AI Aikrut membantu menyusun bullet point pengalaman berorientasi hasil, memilih kata kerja aksi (action verbs), dan merangkum profil profesional Anda agar memikat perekrut dalam hitungan detik.',
        },
        {
            q: 'Apakah saya bisa mengubah template kapan saja?',
            a: 'Ya, seluruh data riwayat karier Anda tersimpan rapi dan dapat dialihkan ke template lain kapan pun tanpa perlu mengetik ulang.',
        },
        {
            q: 'Apakah layanan pembuatan CV ini berbayar?',
            a: 'Anda dapat mendaftar, membuat resume, dan mengunduh format PDF secara gratis untuk memulai langkah karier Anda.',
        },
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFC] text-neutral-900 transition-colors selection:bg-blue-600 selection:text-white dark:bg-[#090A0F] dark:text-neutral-100">
            <Head title="Aikrut CV - Buat CV Berstandar ATS & Lolos Skrining Kerja dengan AI" />

            {/* Landing Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-neutral-200/70 bg-white/80 backdrop-blur-md transition-colors dark:border-neutral-800/80 dark:bg-[#090A0F]/80">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2.5 focus:outline-none">
                        <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                            <AppLogoIcon className="size-5 fill-current" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            Aikrut<span className="text-blue-600">CV</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden items-center gap-8 md:flex">
                        <a
                            href="#fitur"
                            className="text-sm font-medium text-neutral-600 transition-colors hover:text-blue-600 dark:text-neutral-300 dark:hover:text-blue-400"
                        >
                            Fitur AI
                        </a>
                        <a
                            href="#template"
                            className="text-sm font-medium text-neutral-600 transition-colors hover:text-blue-600 dark:text-neutral-300 dark:hover:text-blue-400"
                        >
                            Pilihan Template
                        </a>
                        <a
                            href="#cara-kerja"
                            className="text-sm font-medium text-neutral-600 transition-colors hover:text-blue-600 dark:text-neutral-300 dark:hover:text-blue-400"
                        >
                            Cara Kerja
                        </a>
                        <a
                            href="#faq"
                            className="text-sm font-medium text-neutral-600 transition-colors hover:text-blue-600 dark:text-neutral-300 dark:hover:text-blue-400"
                        >
                            FAQ
                        </a>
                    </nav>

                    {/* Right CTA */}
                    <div className="hidden items-center gap-3 md:flex">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95"
                            >
                                <Briefcase className="size-4" />
                                <span>Buka Dashboard</span>
                                <ArrowRight className="size-4" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="rounded-xl px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:opacity-95 hover:shadow-lg active:scale-95"
                                >
                                    <Sparkles className="size-4" />
                                    <span>Buat CV Gratis</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 md:hidden dark:text-neutral-300 dark:hover:bg-neutral-800"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                    </button>
                </div>

                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div className="border-b border-neutral-200 bg-white px-4 pt-2 pb-6 md:hidden dark:border-neutral-800 dark:bg-[#090A0F]">
                        <nav className="flex flex-col space-y-3 py-3">
                            <a
                                href="#fitur"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                            >
                                Fitur AI
                            </a>
                            <a
                                href="#template"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                            >
                                Pilihan Template
                            </a>
                            <a
                                href="#cara-kerja"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                            >
                                Cara Kerja
                            </a>
                            <a
                                href="#faq"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                            >
                                FAQ
                            </a>
                        </nav>
                        <div className="mt-4 flex flex-col gap-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-xs"
                                >
                                    <Briefcase className="size-4" />
                                    <span>Buka Dashboard</span>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="flex items-center justify-center rounded-xl border border-neutral-300 py-2 text-sm font-semibold text-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25"
                                    >
                                        <Sparkles className="size-4" />
                                        <span>Buat CV Gratis</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 lg:pt-24 lg:pb-32">
                {/* Glow Background Gradients */}
                <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl dark:from-blue-600/15 dark:to-indigo-600/15" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center text-center">
                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-xs backdrop-blur-xs transition hover:border-blue-500/40 dark:border-blue-400/20 dark:bg-blue-950/40 dark:text-blue-300">
                            <Sparkles className="size-3.5 text-blue-600 dark:text-blue-400" />
                            <span>AI Resume Builder & ATS Scanner Cerdas #1</span>
                            <span className="rounded-full bg-blue-600 px-1.5 py-0.2 text-[10px] text-white">Baru</span>
                        </div>

                        {/* Title */}
                        <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            Buat CV Berstandar ATS &{' '}
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                Lolos Skrining Kerja
                            </span>{' '}
                            dengan AI
                        </h1>

                        {/* Subtitle */}
                        <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400">
                            Susun resume profesional yang memikat HRD dalam hitungan menit. Dilengkapi optimasi kata kunci ATS, bantuan penulisan profil AI terintegrasi, dan unduhan PDF instan.
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
                            <Link
                                href={auth.user ? dashboard() : register()}
                                className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-102 hover:shadow-xl hover:shadow-blue-500/30 active:scale-98 sm:w-auto"
                            >
                                <Rocket className="size-5" />
                                <span>Buat CV Saya Sekarang</span>
                                <ArrowRight className="size-5" />
                            </Link>
                            <a
                                href="#template"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white/80 px-6 py-3.5 text-base font-semibold text-neutral-800 shadow-xs backdrop-blur-xs transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-neutral-200 dark:hover:bg-neutral-800 sm:w-auto"
                            >
                                <LayoutTemplate className="size-5" />
                                <span>Lihat Pilihan Template</span>
                            </a>
                        </div>

                        {/* Social Proof Badges */}
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="size-4 text-emerald-500" />
                                <span>100% Format Terbaca ATS</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="size-4 text-emerald-500" />
                                <span>Koreksi & Ringkasan Berbasis AI</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="size-4 text-emerald-500" />
                                <span>Ekspor PDF Siap Kirim</span>
                            </div>
                        </div>

                        {/* Interactive Hero Visual Mockup */}
                        <div className="relative mt-12 w-full max-w-4xl">
                            <div className="relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-2xl transition dark:border-neutral-800 dark:bg-neutral-900">
                                {/* Window Control Bar */}
                                <div className="flex items-center justify-between border-b border-neutral-200/80 bg-neutral-100/70 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950/60">
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-red-400" />
                                        <div className="size-3 rounded-full bg-amber-400" />
                                        <div className="size-3 rounded-full bg-emerald-400" />
                                        <span className="ml-2 text-xs font-medium text-neutral-500">
                                            preview_resume_ats.pdf
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                            <ShieldCheck className="size-3.5" />
                                            ATS Score: 98/100
                                        </span>
                                    </div>
                                </div>

                                {/* Mockup Resume Content */}
                                <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-3 sm:p-8">
                                    {/* Left summary */}
                                    <div className="space-y-4 border-b border-neutral-200 pb-6 sm:border-r sm:border-b-0 sm:pr-6 sm:pb-0 dark:border-neutral-800">
                                        <div className="size-16 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md">
                                            <div className="flex size-full items-center justify-center rounded-[10px] bg-white font-bold text-blue-600 dark:bg-neutral-900">
                                                AC
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-neutral-900 dark:text-white">
                                                Alex Cipta Pratama
                                            </h4>
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                                Senior Software Engineer
                                            </p>
                                        </div>
                                        <div className="space-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                                            <div>Jakarta, Indonesia</div>
                                            <div>alex.cipta@example.com</div>
                                            <div>linkedin.com/in/alexcipta</div>
                                        </div>
                                        <div className="rounded-xl border border-blue-500/20 bg-blue-50/50 p-3 text-left dark:bg-blue-950/20">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400">
                                                <Bot className="size-3.5" />
                                                <span>AI Feedback:</span>
                                            </div>
                                            <p className="mt-1 text-[11px] leading-relaxed text-blue-600/90 dark:text-blue-300/80">
                                                Kata kunci teknis & metrik pencapaian sangat relevan dengan lowongan target.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right experience preview */}
                                    <div className="space-y-4 text-left sm:col-span-2">
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                                                Ringkasan Profesional
                                            </div>
                                            <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                                                Software engineer berpengalaman 5+ tahun dalam arsitektur microservices dan performa web skala tinggi. Berhasil memimpin inisiatif efisiensi sistem hingga 35%.
                                            </p>
                                        </div>

                                        <div className="border-t border-neutral-100 pt-3 dark:border-neutral-800">
                                            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                                                Pengalaman Kerja Terakhir
                                            </div>
                                            <div className="mt-2 space-y-1">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="font-semibold text-neutral-900 dark:text-white">
                                                        Tech Lead - PT Solusi Digital Nusantara
                                                    </span>
                                                    <span className="text-[11px] text-neutral-500">2022 - Sekarang</span>
                                                </div>
                                                <ul className="list-inside list-disc space-y-1 text-[11px] text-neutral-600 dark:text-neutral-400">
                                                    <li>Mengorkestrasi migrasi cloud yang menghemat biaya operasional $45k/tahun.</li>
                                                    <li>Membangun pipeline CI/CD otomatis dengan tingkat keberhasilan build 99.8%.</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="border-t border-neutral-100 pt-3 dark:border-neutral-800">
                                            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                                                Keahlian Utama
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {['React', 'TypeScript', 'Node.js', 'System Architecture', 'PostgreSQL', 'Docker'].map((s) => (
                                                    <span key={s} className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="border-y border-neutral-200/80 bg-white/50 py-10 backdrop-blur-xs dark:border-neutral-800/80 dark:bg-neutral-900/40">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        {stats.map((item, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
                                    {item.number}
                                </div>
                                <div className="mt-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="fitur" className="py-20 sm:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Fitur Cerdas
                        </span>
                        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                            Semua yang Anda Butuhkan untuk Memikat HRD
                        </h2>
                        <p className="mt-3 max-w-xl text-neutral-600 mx-auto text-sm sm:text-base dark:text-neutral-400">
                            Teknologi pintar kami memastikan setiap kalimat dalam resume Anda memiliki dampak maksimal.
                        </p>
                    </div>

                    <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <FeatureCard
                            icon={Bot}
                            title="AI Enhancer Otomatis"
                            description="Tulis deskripsi kerja dan ringkasan karier berkualitas tinggi dengan rekomendasi kalimat otomatis berbasis AI."
                            badge="Canggih"
                            gradient="bg-gradient-to-tr from-blue-600 to-indigo-600"
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="100% Lolos ATS"
                            description="Layout resume teruji mematuhi parser ATS global seperti Workday, Taleo, Greenhouse, dan Lever."
                            badge="Teruji"
                            gradient="bg-gradient-to-tr from-emerald-600 to-teal-600"
                        />
                        <FeatureCard
                            icon={Eye}
                            title="Live Real-Time Preview"
                            description="Lihat tampilan hasil resume Anda langsung diperbarui saat Anda mengetik dan menyesuaikan detail."
                            gradient="bg-gradient-to-tr from-violet-600 to-purple-600"
                        />
                        <FeatureCard
                            icon={Download}
                            title="Ekspor PDF Presisi"
                            description="Unduh hasil resume dalam format PDF vektor tajam yang sempurna untuk dicetak maupun dikirim digital."
                            gradient="bg-gradient-to-tr from-amber-600 to-orange-600"
                        />
                    </div>
                </div>
            </section>

            {/* Templates Showcase Section */}
            <section id="template" className="border-t border-neutral-200/80 bg-neutral-100/50 py-20 dark:border-neutral-800/80 dark:bg-neutral-950/40 sm:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                Desain Eksklusif
                            </span>
                            <h2 className="mt-1 text-3xl font-extrabold tracking-tight">
                                Pilihan Template Berstandar ATS
                            </h2>
                            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                                Setiap template dirancang khusus oleh praktisi rekrutmen profesional.
                            </p>
                        </div>
                        <Link
                            href="/cv/templates"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                            <span>Lihat Semua Template</span>
                            <ChevronRight className="size-4" />
                        </Link>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                        {templates.map((tpl) => (
                            <div
                                key={tpl.id}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
                            >
                                {/* Template Preview Header Box */}
                                <div className={`relative h-48 w-full bg-gradient-to-tr ${tpl.accent} p-6 text-white`}>
                                    <span className="inline-flex rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-xs">
                                        {tpl.tag}
                                    </span>
                                    <div className="mt-8">
                                        <div className="text-lg font-bold">{tpl.name}</div>
                                        <div className="mt-1 text-xs text-white/80">Kategori: {tpl.category}</div>
                                    </div>
                                    <div className="absolute right-4 bottom-4 rounded-lg bg-black/30 px-2.5 py-1 text-xs font-bold backdrop-blur-xs">
                                        ATS: {tpl.score}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="flex flex-1 flex-col justify-between p-6">
                                    <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                                        {tpl.desc}
                                    </p>
                                    <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                        <Link
                                            href={`/cv/options?template_id=${tpl.id}`}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-2.5 text-xs font-bold text-white transition hover:bg-neutral-800 active:scale-95 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                                        >
                                            <FileText className="size-4" />
                                            <span>Gunakan Template Ini</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section id="cara-kerja" className="py-20 sm:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Proses Cepat
                        </span>
                        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                            3 Langkah Sederhana Menuju CV Impian
                        </h2>
                    </div>

                    <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                        {steps.map((st, i) => (
                            <div
                                key={i}
                                className="relative rounded-2xl border border-neutral-200/80 bg-white/80 p-8 shadow-xs backdrop-blur-xs dark:border-neutral-800/80 dark:bg-neutral-900/60"
                            >
                                <div className="text-3xl font-black text-blue-600/30 dark:text-blue-400/30">
                                    {st.number}
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-neutral-900 dark:text-white">
                                    {st.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                                    {st.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="border-t border-neutral-200/80 bg-neutral-50/60 py-20 dark:border-neutral-800/80 dark:bg-neutral-950/60 sm:py-24">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Pertanyaan Populer
                        </span>
                        <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
                            Pertanyaan yang Sering Diajukan
                        </h2>
                    </div>

                    <div className="mt-12 space-y-4">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
                            >
                                <h4 className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
                                    <HelpCircle className="size-4.5 text-blue-600 shrink-0" />
                                    <span>{faq.q}</span>
                                </h4>
                                <p className="mt-2.5 pl-6.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-6 py-12 text-center text-white shadow-2xl sm:px-12 sm:py-16">
                        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Siap Lolos Skrining dan Raih Pekerjaan Impian Anda?
                            </h2>
                            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                                Bergabunglah bersama puluhan ribu pencari kerja sukses lainnya yang telah meningkatkan peluang panggilan interview.
                            </p>
                            <div className="pt-4">
                                <Link
                                    href={auth.user ? dashboard() : register()}
                                    className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-blue-600 shadow-md transition-all hover:bg-blue-50 hover:shadow-xl active:scale-95"
                                >
                                    <span>Mulai Buat CV Gratis Sekarang</span>
                                    <ArrowRight className="size-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-neutral-200/80 bg-white py-12 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-[#090A0F] dark:text-neutral-400">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="flex aspect-square size-7 items-center justify-center rounded-lg bg-blue-600 text-white">
                            <AppLogoIcon className="size-4 fill-current" />
                        </div>
                        <span className="text-sm font-bold text-neutral-900 dark:text-white">
                            Aikrut CV
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="#fitur" className="hover:text-neutral-900 dark:hover:text-white">
                            Fitur
                        </a>
                        <a href="#template" className="hover:text-neutral-900 dark:hover:text-white">
                            Template
                        </a>
                        <a href="#cara-kerja" className="hover:text-neutral-900 dark:hover:text-white">
                            Cara Kerja
                        </a>
                    </div>

                    <div>
                        © {new Date().getFullYear()} Aikrut CV. Hak cipta dilindungi.
                    </div>
                </div>
            </footer>
        </div>
    );
}
