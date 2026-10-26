import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import {
    Sparkles,
    Briefcase,
    GraduationCap,
    Layers,
    TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { dashboard } from '@/routes';
import type { UserProfileData } from '@/types/profile';
import { ProfileOverviewCard } from './components/ProfileOverviewCard';
import { ProfileEditModal } from './components/ProfileEditModal';
import { CvImportModal } from './components/CvImportModal';
import { SummaryPreferencesCard } from './components/cards/SummaryPreferencesCard';
import { ExperienceCard } from './components/cards/ExperienceCard';
import { EducationCard } from './components/cards/EducationCard';
import { OrganizationCard } from './components/cards/OrganizationCard';
import { SkillsCertificatesCard } from './components/cards/SkillsCertificatesCard';
import { ResumePortfolioCard } from './components/cards/ResumePortfolioCard';
import { JobRecommendationsSection } from './components/JobRecommendationsSection';
import { ProfileCompletenessDrawer } from './components/ProfileCompletenessDrawer';

interface ProfileIndexProps {
    initialProfile: UserProfileData;
}

type ProfileTabKey = 'career' | 'education' | 'skills' | 'jobs';

const SECTION_TO_TAB_MAP: Record<string, ProfileTabKey> = {
    profile: 'career',
    summary: 'career',
    preferences: 'career',
    experiences: 'career',
    educations: 'education',
    organizations: 'education',
    skills: 'skills',
    certifications: 'skills',
    awards: 'skills',
    resumes: 'skills',
    portfolio: 'skills',
};

function getCsrfToken(): string {
    const metaTag = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (metaTag) return metaTag;

    const match = document.cookie.match(new RegExp('(^|;\\s*)XSRF-TOKEN=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : '';
}

export default function ProfileIndex({ initialProfile }: ProfileIndexProps) {
    const [profile, setProfile] = useState<UserProfileData>(initialProfile);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);
    const [drawerTab, setDrawerTab] = useState<'completeness' | 'ai-score'>('completeness');
    const [editSection, setEditSection] = useState<string>('profile');
    const [isWizard, setIsWizard] = useState(false);

    const [activeTab, setActiveTab] = useState<ProfileTabKey>(() => {
        if (typeof window !== 'undefined') {
            const param = new URLSearchParams(window.location.search).get('tab');
            if (
                param === 'career' ||
                param === 'education' ||
                param === 'skills' ||
                param === 'jobs'
            ) {
                return param;
            }
        }
        return 'career';
    });

    const handleTabChange = (newTab: ProfileTabKey) => {
        setActiveTab(newTab);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', newTab);
            window.history.replaceState({}, '', url.toString());
        }
    };

    const handleOpenDrawer = (tab: 'completeness' | 'ai-score' = 'completeness') => {
        setDrawerTab(tab);
        setIsAssistantOpen(true);
    };

    const handleOpenSectionEdit = (section: string) => {
        const targetTab = SECTION_TO_TAB_MAP[section];
        if (targetTab && targetTab !== activeTab) {
            handleTabChange(targetTab);
        }
        setIsWizard(false);
        setEditSection(section);
        setIsModalOpen(true);
    };

    const handleOpenWizard = () => {
        setIsWizard(true);
        setEditSection('profile');
        setIsModalOpen(true);
    };

    /**
     * Partial update per section to PATCH /api/v1/profile
     */
    const handleSaveSection = async (
        section: string,
        payload: Partial<UserProfileData>
    ): Promise<boolean> => {
        try {
            const token = getCsrfToken();
            const response = await fetch('/api/v1/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-XSRF-TOKEN': token,
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    section,
                    ...payload,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                const message =
                    result.message || 'Gagal menyimpan perubahan. Periksa input formulir.';
                toast.error(message);
                return false;
            }

            if (result.data) {
                setProfile(result.data);
                toast.success(result.message || 'Seksi profil berhasil diperbarui.');
            }

            return true;
        } catch {
            toast.error('Terjadi kesalahan jaringan saat menyimpan data.');
            return false;
        }
    };

    /**
     * Upload resume or attachment file to POST /api/v1/profile/upload
     */
    const handleUploadFile = async (
        file: File,
        type: 'resume' | 'attachment',
        title?: string
    ) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        if (title) formData.append('title', title);

        try {
            const token = getCsrfToken();
            const response = await fetch('/api/v1/profile/upload', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-XSRF-TOKEN': token,
                },
                credentials: 'same-origin',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                const message = result.message || 'Gagal mengunggah berkas.';
                toast.error(message);
                return null;
            }

            toast.success(result.message || 'Berkas berhasil diunggah.');
            return result.data;
        } catch {
            toast.error('Terjadi kesalahan jaringan saat mengunggah.');
            return null;
        }
    };

    /**
     * Delete an item (resume/attachment/experience, etc.)
     */
    const handleDeleteItem = async (
        type: 'resume' | 'attachment',
        id: number
    ): Promise<boolean> => {
        try {
            const token = getCsrfToken();
            const response = await fetch(`/api/v1/profile/items/${type}/${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-XSRF-TOKEN': token,
                },
                credentials: 'same-origin',
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || 'Gagal menghapus item.');
                return false;
            }

            toast.success(result.message || 'Item berhasil dihapus.');
            return true;
        } catch {
            toast.error('Terjadi kesalahan jaringan saat menghapus.');
            return false;
        }
    };

    const tabs = [
        {
            id: 'career' as const,
            label: 'Karier & Pengalaman',
            icon: Briefcase,
            badge: profile.experiences?.length ?? 0,
        },
        {
            id: 'education' as const,
            label: 'Pendidikan & Aktivitas',
            icon: GraduationCap,
            badge:
                (profile.educations?.length ?? 0) +
                (profile.organizations?.length ?? 0),
        },
        {
            id: 'skills' as const,
            label: 'Keahlian & Portofolio',
            icon: Layers,
            badge:
                (profile.tools?.length ?? 0) +
                (profile.certifications?.length ?? 0) +
                (profile.resumes?.length ?? 0),
        },
        {
            id: 'jobs' as const,
            label: 'Rekomendasi Loker AI',
            icon: TrendingUp,
            badge: profile.job_recommendations?.recommendations?.length
                ? `${profile.job_recommendations.recommendations.length} Posisi`
                : 'AI Match',
        },
    ];

    return (
        <>
            <Head title="Overview Profil & Riwayat Profesional" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 sm:p-6 max-w-6xl mx-auto w-full">
                {/* Header Profile Overview Card with streamlined actions */}
                <ProfileOverviewCard
                    profile={profile}
                    onOpenWizard={handleOpenWizard}
                    onEditSection={handleOpenSectionEdit}
                    onOpenImportCv={() => setIsImportModalOpen(true)}
                    onOpenCompleteness={(tab) => handleOpenDrawer(tab || 'completeness')}
                    onProfileUpdated={(updatedProfile) => setProfile(updatedProfile)}
                />

                {/* Segmented Pill Tab Navigation Bar */}
                <div className="flex items-center justify-start overflow-x-auto no-scrollbar border-b border-neutral-200/80 dark:border-neutral-800 pb-2">
                    <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-neutral-100/90 dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-700/60 shadow-2xs">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`group relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none whitespace-nowrap ${
                                        isActive
                                            ? 'bg-white text-sky-600 shadow-xs dark:bg-neutral-900 dark:text-sky-400 font-bold'
                                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/60'
                                    }`}
                                >
                                    <Icon
                                        className={`size-4 transition-colors ${
                                            isActive
                                                ? 'text-sky-600 dark:text-sky-400'
                                                : 'text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-500'
                                        }`}
                                    />
                                    <span>{tab.label}</span>
                                    {tab.badge !== undefined && (
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-bold transition-colors ${
                                                isActive
                                                    ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300'
                                                    : 'bg-neutral-200/70 text-neutral-600 dark:bg-neutral-700/60 dark:text-neutral-300'
                                            }`}
                                        >
                                            {tab.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Active Tab Content Area */}
                <div className="w-full transition-all duration-200">
                    {activeTab === 'career' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            <div className="lg:col-span-5 flex flex-col gap-6">
                                <SummaryPreferencesCard
                                    profile={profile}
                                    onEdit={() => handleOpenSectionEdit('summary')}
                                />
                            </div>
                            <div className="lg:col-span-7 flex flex-col gap-6">
                                <ExperienceCard
                                    experiences={profile.experiences ?? []}
                                    totalExperience={profile.total_experience ?? '0 thn'}
                                    onEdit={() => handleOpenSectionEdit('experiences')}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'education' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                            <EducationCard
                                educations={profile.educations ?? []}
                                onEdit={() => handleOpenSectionEdit('educations')}
                            />
                            <OrganizationCard
                                organizations={profile.organizations ?? []}
                                onEdit={() => handleOpenSectionEdit('organizations')}
                            />
                        </div>
                    )}

                    {activeTab === 'skills' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                            <SkillsCertificatesCard
                                tools={profile.tools ?? []}
                                certifications={profile.certifications ?? []}
                                awards={profile.awards ?? []}
                                onEdit={() => handleOpenSectionEdit('skills')}
                            />
                            <ResumePortfolioCard
                                portfolioLink={profile.portfolio_link ?? ''}
                                resumes={profile.resumes ?? []}
                                attachments={profile.attachments ?? []}
                                onEdit={() => handleOpenSectionEdit('resumes')}
                            />
                        </div>
                    )}

                    {activeTab === 'jobs' && (
                        <div className="w-full">
                            <JobRecommendationsSection
                                profile={profile}
                                onProfileUpdated={(updatedProfile) => setProfile(updatedProfile)}
                            />
                        </div>
                    )}
                </div>

                {/* Bottom Helper Info */}
                <div className="flex items-center gap-2 text-xs text-neutral-400 justify-center pb-4 pt-2">
                    <Sparkles className="size-3.5 text-sky-500" />
                    <span>
                        Setiap seksi tersimpan sebagai <strong>Single Source of Truth</strong> untuk pembuatan CV otomatis dan profil profesional.
                    </span>
                </div>
            </div>

            {/* Modal Edit Dialog */}
            <ProfileEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialSection={editSection}
                isWizardMode={isWizard}
                profile={profile}
                onSaveSection={handleSaveSection}
                onUploadFile={handleUploadFile}
                onDeleteItem={handleDeleteItem}
            />

            {/* Modal Import CV dengan AI Enhance */}
            <CvImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onSuccess={(updatedProfile) => setProfile(updatedProfile)}
            />

            {/* Slide-over Kelengkapan Profil & AI Scoring Drawer */}
            <ProfileCompletenessDrawer
                profile={profile}
                isOpen={isAssistantOpen}
                onClose={() => setIsAssistantOpen(false)}
                onOpen={(tab) => handleOpenDrawer(tab || 'completeness')}
                initialTab={drawerTab}
                onNavigateSection={(section) => handleOpenSectionEdit(section)}
                onProfileUpdated={(updatedProfile) => setProfile(updatedProfile)}
            />
        </>
    );
}

ProfileIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Profil Saya',
            href: '/profile',
        },
    ],
};
