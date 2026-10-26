import React, { useState, useEffect, useRef } from 'react';
import {
    Award,
    Briefcase,
    FileText,
    GraduationCap,
    Sparkles,
    Target,
    User,
    Users,
    ChevronLeft,
    ChevronRight,
    Check,
    Loader2,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { UserProfileData, ProfileSectionRef } from '@/types/profile';
import { EducationSection } from './EducationSection';
import { ExperienceSection } from './ExperienceSection';
import { OrganizationSection } from './OrganizationSection';
import { PersonalIdentitySection } from './PersonalIdentitySection';
import { ResumePortfolioSection } from './ResumePortfolioSection';
import { SkillsCertificatesSection } from './SkillsCertificatesSection';
import { SummaryPreferencesSection } from './SummaryPreferencesSection';

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialSection?: string;
    isWizardMode?: boolean;
    profile: UserProfileData;
    onSaveSection: (section: string, payload: Partial<UserProfileData>) => Promise<boolean>;
    onUploadFile: (
        file: File,
        type: 'resume' | 'attachment',
        title?: string
    ) => Promise<{ id: number; file_name: string; file_url: string } | null>;
    onDeleteItem: (type: 'resume' | 'attachment', id: number) => Promise<boolean>;
}

const SECTIONS = [
    {
        id: 'profile',
        title: 'Identitas & Kontak',
        description: 'Informasi dasar nama lengkap, nomor WhatsApp, email, dan lokasi.',
        icon: User,
    },
    {
        id: 'summary',
        title: 'Ringkasan & Minat Kerja',
        description: 'Deskripsi profil profesional, preferensi tipe kerja, dan ekspektasi gaji.',
        icon: Target,
    },
    {
        id: 'experiences',
        title: 'Pengalaman Kerja',
        description: 'Riwayat pekerjaan profesional, tanggung jawab, dan pencapaian.',
        icon: Briefcase,
    },
    {
        id: 'educations',
        title: 'Riwayat Pendidikan',
        description: 'Pendidikan formal, gelar sarjana/diploma, dan catatan akademik.',
        icon: GraduationCap,
    },
    {
        id: 'organizations',
        title: 'Pengalaman Organisasi',
        description: 'Keterlibatan kepemimpinan, kepanitiaan, dan kegiatan sosial.',
        icon: Users,
    },
    {
        id: 'skills',
        title: 'Keahlian & Prestasi',
        description: 'Daftar tools teknis, sertifikasi lisensi, dan penghargaan.',
        icon: Award,
    },
    {
        id: 'resumes',
        title: 'Resume & Dokumen Portofolio',
        description: 'Tautan web portofolio dan unggahan berkas fisik PDF/DOCX.',
        icon: FileText,
    },
];

const SECTION_ID_MAP: Record<string, string> = {
    certifications: 'skills',
    portfolio: 'resumes',
    preferences: 'summary',
};

function resolveSectionId(section: string): string {
    return SECTION_ID_MAP[section] || section;
}

export function ProfileEditModal({
    isOpen,
    onClose,
    initialSection = 'profile',
    isWizardMode = false,
    profile,
    onSaveSection,
    onUploadFile,
    onDeleteItem,
}: ProfileEditModalProps) {
    const [currentSectionId, setCurrentSectionId] = useState<string>(() =>
        resolveSectionId(initialSection)
    );
    const [isSaving, setIsSaving] = useState(false);
    const sectionRef = useRef<ProfileSectionRef | null>(null);

    useEffect(() => {
        if (isOpen) {
            setCurrentSectionId(resolveSectionId(initialSection));
            setIsSaving(false);
        }
    }, [isOpen, initialSection]);

    const currentIndex = SECTIONS.findIndex((s) => s.id === currentSectionId);
    const activeSection = SECTIONS[currentIndex] || SECTIONS[0];
    const Icon = activeSection.icon;

    const handleSave = async (closeOnSuccess: boolean = false) => {
        if (!sectionRef.current) {
            if (closeOnSuccess) onClose();
            return;
        }

        setIsSaving(true);
        try {
            const success = await sectionRef.current.save();
            if (success) {
                if (closeOnSuccess || !isWizardMode || currentIndex === SECTIONS.length - 1) {
                    onClose();
                } else {
                    setCurrentSectionId(SECTIONS[currentIndex + 1].id);
                }
            }
        } catch {
            // Error handled inside section or network notification
        } finally {
            setIsSaving(false);
        }
    };

    const handleSkip = () => {
        if (currentIndex < SECTIONS.length - 1) {
            setCurrentSectionId(SECTIONS[currentIndex + 1].id);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentSectionId(SECTIONS[currentIndex - 1].id);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isSaving && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl">
                {/* Modal Header */}
                <div className="border-b border-neutral-100 dark:border-neutral-800 px-6 pt-6 pb-4 bg-neutral-50/50 dark:bg-neutral-900/50 shrink-0">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
                                <Icon className="size-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                    <span>{activeSection.title}</span>
                                    {isWizardMode && (
                                        <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                                            Langkah {currentIndex + 1} dari {SECTIONS.length}
                                        </span>
                                    )}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                    {activeSection.description}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Stepper Bar in Wizard Mode */}
                    {isWizardMode && (
                        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                            {SECTIONS.map((sec, idx) => {
                                const isCurrent = idx === currentIndex;
                                const isDone = idx < currentIndex;
                                return (
                                    <button
                                        key={sec.id}
                                        type="button"
                                        disabled={isSaving}
                                        onClick={() => setCurrentSectionId(sec.id)}
                                        className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                                            isCurrent
                                                ? 'bg-sky-600 text-white shadow-xs'
                                                : isDone
                                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                  : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
                                        }`}
                                    >
                                        {isDone ? (
                                            <Check className="size-3" />
                                        ) : (
                                            <span className="size-3 text-[10px] flex items-center justify-center font-bold">
                                                {idx + 1}
                                            </span>
                                        )}
                                        <span className="hidden sm:inline">{sec.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Modal Body: Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {currentSectionId === 'profile' && (
                        <PersonalIdentitySection
                            ref={sectionRef}
                            profile={profile}
                            onSaveSection={onSaveSection}
                        />
                    )}

                    {currentSectionId === 'summary' && (
                        <SummaryPreferencesSection
                            ref={sectionRef}
                            profile={profile}
                            onSaveSection={onSaveSection}
                        />
                    )}

                    {currentSectionId === 'experiences' && (
                        <ExperienceSection
                            ref={sectionRef}
                            profile={profile}
                            onSaveSection={onSaveSection}
                        />
                    )}

                    {currentSectionId === 'educations' && (
                        <EducationSection
                            ref={sectionRef}
                            profile={profile}
                            onSaveSection={onSaveSection}
                        />
                    )}

                    {currentSectionId === 'organizations' && (
                        <OrganizationSection
                            ref={sectionRef}
                            profile={profile}
                            onSaveSection={onSaveSection}
                        />
                    )}

                    {currentSectionId === 'skills' && (
                        <SkillsCertificatesSection
                            ref={sectionRef}
                            profile={profile}
                            onSaveSection={onSaveSection}
                        />
                    )}

                    {currentSectionId === 'resumes' && (
                        <ResumePortfolioSection
                            ref={sectionRef}
                            profile={profile}
                            onSaveSection={onSaveSection}
                            onUploadFile={onUploadFile}
                            onDeleteItem={onDeleteItem}
                        />
                    )}
                </div>

                {/* Modal Footer */}
                <div className="border-t border-neutral-100 dark:border-neutral-800 px-6 py-3.5 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-xs flex items-center justify-between shrink-0">
                    <div>
                        {isWizardMode ? (
                            currentIndex > 0 ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handlePrev}
                                    disabled={isSaving}
                                    className="rounded-xl gap-1 text-xs sm:text-sm font-medium"
                                >
                                    <ChevronLeft className="size-4" />
                                    Sebelumnya
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onClose}
                                    disabled={isSaving}
                                    className="rounded-xl text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 text-xs sm:text-sm font-medium"
                                >
                                    Batal
                                </Button>
                            )
                        ) : (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                disabled={isSaving}
                                className="rounded-xl text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 text-xs sm:text-sm font-medium"
                            >
                                Batal
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {isWizardMode ? (
                            <>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleSkip}
                                    disabled={isSaving}
                                    className="rounded-xl text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 text-xs sm:text-sm font-medium"
                                >
                                    Lewati
                                </Button>
                                {currentIndex < SECTIONS.length - 1 ? (
                                    <Button
                                        type="button"
                                        onClick={() => handleSave(false)}
                                        disabled={isSaving}
                                        className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white gap-1.5 text-xs sm:text-sm font-semibold shadow-xs"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="size-4 animate-spin" />
                                                <span>Menyimpan...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Simpan & Lanjut</span>
                                                <ChevronRight className="size-4" />
                                            </>
                                        )}
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={() => handleSave(true)}
                                        disabled={isSaving}
                                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs sm:text-sm font-semibold shadow-xs"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="size-4 animate-spin" />
                                                <span>Menyimpan...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Check className="size-4" />
                                                <span>Simpan & Selesai</span>
                                            </>
                                        )}
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Button
                                type="button"
                                onClick={() => handleSave(true)}
                                disabled={isSaving}
                                className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white gap-1.5 text-xs sm:text-sm font-semibold shadow-xs"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check className="size-4" />
                                        <span>Simpan & Selesai</span>
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

