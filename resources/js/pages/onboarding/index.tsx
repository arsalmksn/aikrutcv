import { Head, router } from '@inertiajs/react';
import React from 'react';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
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
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 flex flex-col justify-center items-center p-4">
            <Head title="Pilih Peminatan & Inisialisasi Data Master" />

            <OnboardingModal
                isOpen={true}
                onClose={() => router.visit('/dashboard')}
                savedPeminatan={existingData?.saved_peminatan || []}
                careerCategories={careerCategories}
            />
        </div>
    );
}
