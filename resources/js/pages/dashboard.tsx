import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, FileText, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import type { CareerCategoryItem } from '@/data/career-categories';
import { dashboard } from '@/routes';

interface DashboardProps {
    hasCompletedOnboarding?: boolean;
    savedPeminatan?: string[];
    careerCategories?: CareerCategoryItem[];
}

export default function Dashboard({
    hasCompletedOnboarding,
    savedPeminatan = [],
    careerCategories,
}: DashboardProps) {
    const { auth } = usePage().props as any;

    const userNeedsOnboarding =
        hasCompletedOnboarding === false ||
        (auth?.user && !auth.user.onboarding_completed_at);

    const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(Boolean(userNeedsOnboarding));
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* CV Builder Hero Card */}
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-sky-500 to-blue-600 p-6 text-white shadow-md sm:p-8">
                    <div className="relative z-10 max-w-xl space-y-3">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-xs">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>CV Builder & ATS Reviewer</span>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Buat CV Profesional Anda Sekarang
                        </h2>
                        <p className="text-sm leading-relaxed text-sky-100">
                            Gunakan editor interaktif dengan pratinjau real-time
                            untuk menyusun resume berstandar ATS yang memikat
                            perekrut.
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/cv/templates"
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-sky-600 shadow-xs transition-all hover:bg-sky-50 hover:shadow-md active:scale-95"
                            >
                                <FileText className="h-4 w-4" />
                                <span>Buat CV</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
            </div>

            {/* 2-Step Onboarding Modal for New Accounts */}
            <OnboardingModal
                isOpen={showOnboardingModal}
                onClose={() => setShowOnboardingModal(false)}
                savedPeminatan={savedPeminatan}
                careerCategories={careerCategories}
            />
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
