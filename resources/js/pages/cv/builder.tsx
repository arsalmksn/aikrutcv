import React, { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { WizardStepper, type StepId } from '@/components/cv/wizard-stepper';
import { ContactStep } from '@/components/cv/steps/contact-step';
import { ExperienceStep } from '@/components/cv/steps/experience-step';
import { EducationStep } from '@/components/cv/steps/education-step';
import { SkillsStep } from '@/components/cv/steps/skills-step';
import { CvLivePreview } from '@/components/cv/cv-live-preview';
import type {
    CvContactData,
    CvData,
    CvEducationData,
    CvExperienceData,
    CvSkillData,
} from '@/types/cv';

interface BuilderProps {
    cv: CvData;
}

export default function CvBuilderPage({ cv }: BuilderProps) {
    const [currentStep, setCurrentStep] = useState<StepId>('contact');
    const [activeTabMobile, setActiveTabMobile] = useState<
        'editor' | 'preview'
    >('editor');

    // Contact state
    const [contact, setContact] = useState<CvContactData>(() => ({
        first_name: cv.contact?.first_name || '',
        last_name: cv.contact?.last_name || '',
        desired_job_title: cv.contact?.desired_job_title || '',
        phone: cv.contact?.phone || '+62',
        email: cv.contact?.email || '',
        address: cv.contact?.address || '',
        city: cv.contact?.city || '',
        linkedin_url: cv.contact?.linkedin_url || '',
        website_url: cv.contact?.website_url || '',
    }));

    // Experiences state
    const [experiences, setExperiences] = useState<CvExperienceData[]>(() => {
        if (cv.experiences && cv.experiences.length > 0) {
            return cv.experiences;
        }
        return [
            {
                position: 'RPL',
                company_name: 'UDB',
                city: 'Surakarta',
                start_date: '02/2026',
                end_date: '',
                is_current: false,
                description:
                    '• Membantu laporan keuangan bulanan dan entri data\n• Mengawasi anggaran tim dan melaporkan masalah',
                sort_order: 0,
            },
        ];
    });

    // Educations state
    const [educations, setEducations] = useState<CvEducationData[]>(() => {
        if (cv.educations && cv.educations.length > 0) {
            return cv.educations;
        }
        return [
            {
                institution_name: 'Universitas Indonesia',
                degree: 'Sarjana di Keuangan dan Perbankan',
                field_of_study: 'Keuangan dan Perbankan',
                city: 'Jakarta',
                start_date: '',
                end_date: '',
                is_current: false,
                description: 'Lulus dengan predikat cumlaude, IPK 3.85 (2022)',
                sort_order: 0,
            },
        ];
    });

    // Skills state
    const [skills, setSkills] = useState<CvSkillData[]>(() => {
        if (cv.skills && cv.skills.length > 0) {
            return cv.skills;
        }
        return [
            {
                name: 'Office 365',
                level: null,
                sort_order: 0,
            },
        ];
    });

    const [showSkillsLevel, setShowSkillsLevel] = useState<boolean>(() => {
        return cv.skills ? cv.skills.some((s) => Boolean(s.level)) : false;
    });

    const [isSaving, setIsSaving] = useState(false);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialMount = useRef(true);
    const saveExperienceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialExperienceMount = useRef(true);
    const saveEducationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialEducationMount = useRef(true);
    const saveSkillTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialSkillMount = useRef(true);

    // Auto-save logic
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        setIsSaving(true);

        saveTimeoutRef.current = setTimeout(async () => {
            try {
                const csrfToken =
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '';

                await fetch(`/cv/${cv.id}/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify(contact),
                });
            } catch (err) {
                console.error('Auto-save error:', err);
            } finally {
                setIsSaving(false);
            }
        }, 800);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [contact, cv.id]);

    // Auto-save logic for experiences
    useEffect(() => {
        if (isInitialExperienceMount.current) {
            isInitialExperienceMount.current = false;
            return;
        }

        if (saveExperienceTimeoutRef.current) {
            clearTimeout(saveExperienceTimeoutRef.current);
        }

        setIsSaving(true);

        saveExperienceTimeoutRef.current = setTimeout(async () => {
            try {
                const csrfToken =
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '';

                await fetch(`/cv/${cv.id}/experiences`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify({ experiences }),
                });
            } catch (err) {
                console.error('Auto-save experiences error:', err);
            } finally {
                setIsSaving(false);
            }
        }, 800);

        return () => {
            if (saveExperienceTimeoutRef.current) {
                clearTimeout(saveExperienceTimeoutRef.current);
            }
        };
    }, [experiences, cv.id]);

    // Auto-save logic for educations
    useEffect(() => {
        if (isInitialEducationMount.current) {
            isInitialEducationMount.current = false;
            return;
        }

        if (saveEducationTimeoutRef.current) {
            clearTimeout(saveEducationTimeoutRef.current);
        }

        setIsSaving(true);

        saveEducationTimeoutRef.current = setTimeout(async () => {
            try {
                const csrfToken =
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '';

                await fetch(`/cv/${cv.id}/educations`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify({ educations }),
                });
            } catch (err) {
                console.error('Auto-save educations error:', err);
            } finally {
                setIsSaving(false);
            }
        }, 800);

        return () => {
            if (saveEducationTimeoutRef.current) {
                clearTimeout(saveEducationTimeoutRef.current);
            }
        };
    }, [educations, cv.id]);

    // Auto-save logic for skills
    useEffect(() => {
        if (isInitialSkillMount.current) {
            isInitialSkillMount.current = false;
            return;
        }

        if (saveSkillTimeoutRef.current) {
            clearTimeout(saveSkillTimeoutRef.current);
        }

        setIsSaving(true);

        saveSkillTimeoutRef.current = setTimeout(async () => {
            try {
                const csrfToken =
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '';

                await fetch(`/cv/${cv.id}/skills`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify({ skills }),
                });
            } catch (err) {
                console.error('Auto-save skills error:', err);
            } finally {
                setIsSaving(false);
            }
        }, 800);

        return () => {
            if (saveSkillTimeoutRef.current) {
                clearTimeout(saveSkillTimeoutRef.current);
            }
        };
    }, [skills, cv.id]);

    const handleContactChange = (field: keyof CvContactData, value: string) => {
        setContact((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleNextFromContact = () => {
        setCurrentStep('experience');
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
            <Head title="CV Builder - Aikrut CV" />

            {/* Top Bar Navigation */}
            <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Dashboard</span>
                        </Link>
                        <div className="hidden h-4 w-px bg-slate-200 sm:block" />
                        <span className="hidden text-xs font-semibold text-slate-700 sm:inline-block">
                            {cv.title || 'Curriculum Vitae'}
                        </span>
                    </div>

                    {/* Mobile Switcher Tab (Editor vs Preview) */}
                    <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 lg:hidden">
                        <button
                            type="button"
                            onClick={() => setActiveTabMobile('editor')}
                            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                                activeTabMobile === 'editor'
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Editor
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTabMobile('preview')}
                            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                                activeTabMobile === 'preview'
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Live Preview
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden text-xs text-slate-400 sm:flex sm:items-center sm:gap-1.5">
                            {isSaving ? (
                                <>
                                    <span className="h-2 w-2 animate-ping rounded-full bg-amber-400" />
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                    <span>Tersimpan</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Wizard Stepper Header */}
                <WizardStepper
                    currentStep={currentStep}
                    onStepChange={setCurrentStep}
                />
            </header>

            {/* Main Content Area */}
            <main className="flex flex-1 overflow-hidden">
                <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-row">
                    {/* Left Column: Form Section */}
                    <section
                        className={`flex-1 overflow-y-auto p-4 sm:p-8 lg:max-w-xl xl:max-w-2xl ${
                            activeTabMobile === 'preview'
                                ? 'hidden lg:block'
                                : 'block'
                        }`}
                    >
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
                            {currentStep === 'contact' && (
                                <ContactStep
                                    data={contact}
                                    onChange={handleContactChange}
                                    onNext={handleNextFromContact}
                                    isSaving={isSaving}
                                />
                            )}

                            {currentStep === 'experience' && (
                                <ExperienceStep
                                    experiences={experiences}
                                    onChange={setExperiences}
                                    onBack={() => setCurrentStep('contact')}
                                    onNext={() => setCurrentStep('education')}
                                    isSaving={isSaving}
                                />
                            )}

                            {currentStep === 'education' && (
                                <EducationStep
                                    educations={educations}
                                    onChange={setEducations}
                                    onBack={() => setCurrentStep('experience')}
                                    onNext={() => setCurrentStep('skills')}
                                    isSaving={isSaving}
                                />
                            )}

                            {currentStep === 'skills' && (
                                <SkillsStep
                                    skills={skills}
                                    onChange={setSkills}
                                    onBack={() => setCurrentStep('education')}
                                    onNext={() => setCurrentStep('summary')}
                                    desiredJobTitle={contact.desired_job_title}
                                    isSaving={isSaving}
                                    showLevel={showSkillsLevel}
                                    onToggleShowLevel={setShowSkillsLevel}
                                />
                            )}

                            {currentStep === 'summary' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                                            Ringkasan Profesional
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Tulis ringkasan singkat yang menarik
                                            tentang profil Anda.
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                                        <p className="text-sm font-medium">
                                            Tahap Ringkasan
                                        </p>
                                    </div>
                                    <div className="flex justify-between pt-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCurrentStep('skills')
                                            }
                                            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                            ← Keahlian
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCurrentStep('finalize')
                                            }
                                            className="rounded-lg bg-sky-500 px-5 py-2 text-xs font-semibold text-white hover:bg-sky-600"
                                        >
                                            Berikutnya: Finalisasi →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 'finalize' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                                            Finalisasi & Unduh
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Periksa kembali CV Anda dan unduh
                                            dokumen siap pakai.
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center text-emerald-800">
                                        <Sparkles className="mx-auto h-8 w-8 text-emerald-600" />
                                        <p className="mt-2 text-base font-semibold">
                                            CV Anda Siap Digunakan!
                                        </p>
                                        <p className="mt-1 text-xs text-emerald-700">
                                            Semua data kontak dan riwayat telah
                                            diperbarui secara real-time.
                                        </p>
                                    </div>
                                    <div className="flex justify-start pt-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCurrentStep('contact')
                                            }
                                            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                            ← Edit Kontak Kembali
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Right Column: Live Preview Section */}
                    <section
                        className={`flex-1 bg-slate-100/60 p-4 sm:p-6 lg:p-8 ${
                            activeTabMobile === 'editor'
                                ? 'hidden lg:flex'
                                : 'flex'
                        }`}
                    >
                        <CvLivePreview
                            contact={contact}
                            experiences={experiences}
                            educations={educations}
                            skills={skills}
                            showSkillsLevel={showSkillsLevel}
                        />
                    </section>
                </div>
            </main>
        </div>
    );
}
