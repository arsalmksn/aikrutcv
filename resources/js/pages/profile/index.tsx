import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';
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

    const handleOpenDrawer = (tab: 'completeness' | 'ai-score' = 'completeness') => {
        setDrawerTab(tab);
        setIsAssistantOpen(true);
    };

    const handleOpenSectionEdit = (section: string) => {
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

    return (
        <>
            <Head title="Overview Profile & Riwayat Karier" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 sm:p-6 max-w-6xl mx-auto w-full">
                {/* Header Profile Overview Card */}
                <ProfileOverviewCard
                    profile={profile}
                    onOpenWizard={handleOpenWizard}
                    onEditSection={handleOpenSectionEdit}
                    onOpenImportCv={() => setIsImportModalOpen(true)}
                    onOpenCompleteness={(tab) => handleOpenDrawer(tab || 'completeness')}
                />

                {/* Seksi Rekomendasi Lowongan Kerja AI */}
                <JobRecommendationsSection
                    profile={profile}
                    onProfileUpdated={(updatedProfile) => setProfile(updatedProfile)}
                />

                {/* Bento Grid: Overview Mode Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Left Column */}
                    <div className="flex flex-col gap-6">
                        <SummaryPreferencesCard
                            profile={profile}
                            onEdit={() => handleOpenSectionEdit('summary')}
                        />
                        <ExperienceCard
                            experiences={profile.experiences ?? []}
                            totalExperience={profile.total_experience ?? '0 thn'}
                            onEdit={() => handleOpenSectionEdit('experiences')}
                        />
                        <SkillsCertificatesCard
                            tools={profile.tools ?? []}
                            certifications={profile.certifications ?? []}
                            awards={profile.awards ?? []}
                            onEdit={() => handleOpenSectionEdit('skills')}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6">
                        <EducationCard
                            educations={profile.educations ?? []}
                            onEdit={() => handleOpenSectionEdit('educations')}
                        />
                        <OrganizationCard
                            organizations={profile.organizations ?? []}
                            onEdit={() => handleOpenSectionEdit('organizations')}
                        />
                        <ResumePortfolioCard
                            portfolioLink={profile.portfolio_link ?? ''}
                            resumes={profile.resumes ?? []}
                            attachments={profile.attachments ?? []}
                            onEdit={() => handleOpenSectionEdit('resumes')}
                        />
                    </div>
                </div>

                {/* Bottom Helper Info */}
                <div className="flex items-center gap-2 text-xs text-neutral-400 justify-center pb-4">
                    <Sparkles className="size-3.5 text-sky-500" />
                    <span>
                        Setiap seksi tersimpan sebagai <strong>Single Source of Truth</strong> untuk render CV otomatis dan profil publik.
                    </span>
                </div>
            </div>

            {/* Modal & Wizard Edit Dialog */}
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
