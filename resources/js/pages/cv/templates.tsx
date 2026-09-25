import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Folder,
    Star,
    Palette,
    Columns2,
    Image as ImageIcon,
    Briefcase,
    ShieldCheck,
    ArrowRight,
    FileCheck2,
    CheckCircle2,
    Sparkles,
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';

interface TemplateItem {
    id: number;
    name: string;
    category?: string;
    is_active: boolean;
}

interface TemplatesPageProps {
    templates?: TemplateItem[];
}

interface CategoryTab {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isAvailable: boolean;
}

const CATEGORIES: CategoryTab[] = [
    { id: 'all', label: 'Semua Template', icon: Folder, isAvailable: true },
    { id: 'simple', label: 'Sederhana', icon: Star, isAvailable: false },
    { id: 'modern', label: 'Modern', icon: Palette, isAvailable: false },
    {
        id: 'single_column',
        label: 'Satu kolom',
        icon: Columns2,
        isAvailable: false,
    },
    {
        id: 'with_photo',
        label: 'Dengan foto',
        icon: ImageIcon,
        isAvailable: false,
    },
    {
        id: 'professional',
        label: 'Profesional',
        icon: Briefcase,
        isAvailable: false,
    },
    { id: 'ats', label: 'ATS', icon: ShieldCheck, isAvailable: true },
];

export default function CvTemplatesPage({
    templates: _templates = [],
}: TemplatesPageProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    return (
        <div className="flex min-h-screen flex-col bg-[#FDFDFD] font-sans text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
            <Head title="Pilih Template Resume - Aikrut" />

            {/* Top Navigation Bar with Stepper */}
            <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-md transition-colors dark:border-neutral-800 dark:bg-neutral-900/95">
                <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Brand Logo */}
                    <Link
                        href="/"
                        className="group flex items-center gap-2.5 focus:outline-none"
                    >
                        <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-colors group-hover:bg-blue-700">
                            <AppLogoIcon className="size-5 fill-current" />
                        </div>
                        <span className="font-sans text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            Aikrut
                        </span>
                    </Link>

                    {/* Stepper Wizard (3 Steps) */}
                    <nav
                        aria-label="Progress"
                        className="flex items-center gap-3 sm:gap-6 md:gap-8"
                    >
                        {/* Step 1: Active */}
                        <div className="flex items-center gap-2">
                            <span className="flex size-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm shadow-blue-500/30">
                                1
                            </span>
                            <span className="hidden text-sm font-semibold text-neutral-900 sm:inline dark:text-neutral-100">
                                Pilih template
                            </span>
                        </div>

                        <div className="h-px w-4 bg-neutral-200 sm:w-8 dark:bg-neutral-800" />

                        {/* Step 2: Inactive */}
                        <div className="flex items-center gap-2 opacity-60">
                            <span className="flex size-7 items-center justify-center rounded-full border border-neutral-300 bg-neutral-100 text-xs font-semibold text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                                2
                            </span>
                            <span className="hidden text-sm font-medium text-neutral-500 sm:inline dark:text-neutral-400">
                                Masukkan detail Anda
                            </span>
                        </div>

                        <div className="h-px w-4 bg-neutral-200 sm:w-8 dark:bg-neutral-800" />

                        {/* Step 3: Inactive */}
                        <div className="flex items-center gap-2 opacity-60">
                            <span className="flex size-7 items-center justify-center rounded-full border border-neutral-300 bg-neutral-100 text-xs font-semibold text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                                3
                            </span>
                            <span className="hidden text-sm font-medium text-neutral-500 sm:inline dark:text-neutral-400">
                                Unduh resume
                            </span>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                {/* Hero / Header Section */}
                <div className="mx-auto mb-10 max-w-3xl text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl dark:text-white">
                        Template resume
                    </h1>
                    <p className="mt-3 text-base font-normal text-neutral-600 sm:text-lg dark:text-neutral-400">
                        Template resume yang mudah digunakan dan siap dalam
                        hitungan menit — coba sekarang!
                    </p>
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={() => {
                                // Sediakan tombol dulu untuk integrasi rute selanjutnya
                            }}
                            className="inline-flex cursor-pointer items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline focus:outline-none dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Pilih nanti
                        </button>
                    </div>
                </div>

                {/* Filter Tabs Navigation */}
                <div className="mb-8 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-b border-neutral-200 dark:border-neutral-800">
                    <div className="mx-auto flex w-max sm:w-auto items-center justify-start sm:justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-5 pb-px px-2">
                        {CATEGORIES.map((category) => {
                            const Icon = category.icon;
                            const isSelected = selectedCategory === category.id;

                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => {
                                        if (category.isAvailable) {
                                            setSelectedCategory(category.id);
                                        }
                                    }}
                                    className={`relative flex cursor-pointer items-center gap-1.5 px-2.5 py-3 text-sm font-medium whitespace-nowrap transition-all sm:gap-2 sm:px-3 ${
                                        isSelected
                                            ? 'font-semibold text-blue-600 dark:text-blue-400'
                                            : category.isAvailable
                                              ? 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                                              : 'cursor-not-allowed text-neutral-400 opacity-80 dark:text-neutral-500'
                                    }`}
                                >
                                    <Icon
                                        className={`size-4 sm:size-4.5 ${
                                            isSelected
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : category.isAvailable
                                                  ? 'text-neutral-500'
                                                  : 'text-neutral-400 dark:text-neutral-500'
                                        }`}
                                    />
                                    <span>{category.label}</span>

                                    {!category.isAvailable && (
                                        <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                                            Segera
                                        </span>
                                    )}

                                    {/* Active Underline Indicator */}
                                    {isSelected && (
                                        <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Template Content Area: Empty State for ATS Variation */}
                <div className="flex flex-1 flex-col items-center justify-center py-6 sm:py-12">
                    <div className="w-full max-w-2xl rounded-2xl border border-neutral-200/80 bg-white p-8 text-center shadow-xs sm:p-12 dark:border-neutral-800 dark:bg-neutral-900">
                        {/* Decorative ATS Badge & Icon */}
                        <div className="mx-auto mb-6 flex aspect-square size-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-400">
                            <ShieldCheck className="size-8" />
                        </div>

                        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                            Standar ATS-Friendly
                        </div>

                        <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl dark:text-white">
                            Template ATS Sedang Disiapkan
                        </h2>

                        <p className="mx-auto mt-2.5 max-w-lg text-sm leading-relaxed text-neutral-500 sm:text-base dark:text-neutral-400">
                            Format standar ramah ATS dirancang agar 100% terbaca
                            sempurna oleh sistem pelacak pelamar kerja tanpa
                            hambatan format. Anda dapat langsung melanjutkan ke
                            tahap pengisian detail data CV Anda.
                        </p>

                        {/* Feature Badges */}
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-600 sm:gap-3 dark:text-neutral-400">
                            <span className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700/60 dark:bg-neutral-800/60">
                                <CheckCircle2 className="size-3.5 text-blue-600 dark:text-blue-400" />
                                Struktur Hirarki Terstandar
                            </span>
                            <span className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700/60 dark:bg-neutral-800/60">
                                <Sparkles className="size-3.5 text-blue-600 dark:text-blue-400" />
                                Kompatibel AI Reviewer
                            </span>
                            <span className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700/60 dark:bg-neutral-800/60">
                                <FileCheck2 className="size-3.5 text-blue-600 dark:text-blue-400" />
                                Bebas Parsing Error
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Button
                                type="button"
                                size="lg"
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-blue-700 sm:w-auto"
                                onClick={() => {
                                    // Tombol disediakan untuk diarahkan ke halaman lain nantinya
                                }}
                            >
                                <span>Lanjut Isi Detail</span>
                                <ArrowRight className="size-4" />
                            </Button>

                            <button
                                type="button"
                                className="w-full cursor-pointer px-5 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 sm:w-auto dark:text-neutral-400 dark:hover:text-neutral-200"
                                onClick={() => {
                                    // Tombol disediakan untuk diarahkan ke halaman lain nantinya
                                }}
                            >
                                Pilih nanti
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
