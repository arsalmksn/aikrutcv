import { Head, router } from '@inertiajs/react';
import { Compass, Sparkles } from 'lucide-react';
import React from 'react';
import { UserOnboardingWizard } from '@/components/onboarding/UserOnboardingWizard';
import type { CareerCategoryItem } from '@/data/career-categories';

interface ExistingData {
    has_existing_cv: boolean;
    latest_cv_title: string | null;
    experiences: Array<{
        company: string;
        position: string;
        location?: string | null;
        period?: string | null;
    }>;
    educations: Array<{
        institution: string;
        degree: string;
        location?: string | null;
    }>;
    tools: string[];
    summary: string | null;
    saved_peminatan: string[];
    saved_career_level: string | null;
    ai_onboarding_context: any | null;
}

interface OnboardingProps {
    user: {
        id: number;
        name: string;
        email: string;
        onboarding_completed_at: string | null;
    };
    existingData: ExistingData;
    careerCategories: CareerCategoryItem[];
    careerLevels?: string[];
}

export default function OnboardingIndex({
    existingData,
    careerCategories,
}: OnboardingProps) {
    return (
        <div className="min-h-screen bg-neutral-50/70 dark:bg-neutral-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
            <Head title="Onboarding Karier & Data Master" />

            {/* Top Brand & Context Header */}
            <header className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6 pt-2">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-2xl bg-linear-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                        <Sparkles className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <span>AikrutCV</span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                                Onboarding
                            </span>
                        </h1>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Konfigurasi Peminatan Karier & Inisialisasi Data Master Profil
                        </p>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400 font-medium">
                    <Compass className="size-4 text-blue-500" />
                    <span>Panduan Pintar AI</span>
                </div>
            </header>

            {/* Native Full-Page Wizard Container */}
            <main className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-center">
                <UserOnboardingWizard
                    careerCategories={careerCategories}
                    savedPeminatan={existingData?.saved_peminatan || []}
                    onClose={() => router.visit('/dashboard')}
                    isModal={false}
                />
            </main>

            {/* Footer note */}
            <footer className="max-w-5xl mx-auto w-full text-center pt-6 text-[11px] text-neutral-400">
                AikrutCV &bull; Sistem Pembuatan CV dan Optimalisasi Profil Karier Berbasis AI
            </footer>
        </div>
    );
}
