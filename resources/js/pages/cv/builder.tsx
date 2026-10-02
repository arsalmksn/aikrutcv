import React, { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { WizardStepper, type StepId } from '@/components/cv/wizard-stepper';
import { ContactStep } from '@/components/cv/steps/contact-step';
import { ExperienceStep } from '@/components/cv/steps/experience-step';
import { EducationStep } from '@/components/cv/steps/education-step';
import { SkillsStep } from '@/components/cv/steps/skills-step';
import { SummaryStep } from '@/components/cv/steps/summary-step';
import { CvLivePreview } from '@/components/cv/cv-live-preview';
import {
    AdditionalStep,
    type AdditionalSectionsData,
} from '@/components/cv/steps/additional-step';
import type {
    CvContactData,
    CvData,
    CvEducationData,
    CvExperienceData,
    CvSkillData,
} from '@/types/cv';

interface TemplateOption {
    id: number;
    name: string;
    category?: string;
    is_active: boolean;
}

interface BuilderProps {
    cv: CvData;
    templates?: TemplateOption[];
    isComplete?: boolean;
    completenessChecklist?: Record<string, boolean>;
}

export default function CvBuilderPage({
    cv,
    templates = [],
    isComplete = false,
}: BuilderProps) {
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

    // Summary state
    const [summary, setSummary] = useState<string>(() => {
        return (
            cv.summary?.content ||
            'Profesional berorientasi detail dengan pengalaman 3+ tahun di [bidang]. Terampil dalam [keahlian kunci]. Berusaha untuk berkontribusi pada [jenis tim/perusahaan atau tujuan].'
        );
    });

    // Additional sections state (Referensi, Bahasa, Sertifikasi, Media Sosial)
    const [additionalData, setAdditionalData] =
        useState<AdditionalSectionsData>(() => ({
            references: [],
            languages: [],
            certifications: [],
            social: {
                linkedin_url: cv.contact?.linkedin_url || '',
                website_url: cv.contact?.website_url || '',
            },
        }));

    const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const queryTplId = urlParams.get('template_id');
            if (queryTplId) {
                const parsed = parseInt(queryTplId, 10);
                if (templates.some((t) => t.id === parsed)) {
                    return parsed;
                }
            }
        }
        return cv.template_id || (templates[0]?.id ?? null);
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const queryTplId = urlParams.get('template_id');
            if (queryTplId) {
                const parsed = parseInt(queryTplId, 10);
                if (templates.some((t) => t.id === parsed) && parsed !== selectedTemplateId) {
                    handleTemplateChange(parsed);
                }
            }
        }
    }, [templates]);

    const currentSelectedTemplate =
        templates.find((t) => t.id === selectedTemplateId) || templates[0] || null;

    const handleTemplateChange = async (newTemplateId: number) => {
        setSelectedTemplateId(newTemplateId);
        try {
            const csrfToken =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content') || '';
            await fetch(`/cv/${cv.id}/finalize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    template_id: newTemplateId,
                    is_published: cv.is_published,
                    title: cv.title || 'Curriculum Vitae',
                }),
            });
        } catch (err) {
            console.error('Failed to update template', err);
        }
    };

    const handleFinalizeCv = async (
        templateId: number,
        isPublished: boolean,
        title: string,
    ) => {
        setSelectedTemplateId(templateId);
        const csrfToken =
            document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') || '';

        await fetch(`/cv/${cv.id}/finalize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
                template_id: templateId,
                is_published: isPublished,
                title,
            }),
        });
    };

    const [isSaving, setIsSaving] = useState(false);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialMount = useRef(true);
    const saveExperienceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialExperienceMount = useRef(true);
    const saveEducationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialEducationMount = useRef(true);
    const saveSkillTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialSkillMount = useRef(true);
    const saveSummaryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialSummaryMount = useRef(true);

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

    // Auto-save logic for summary
    useEffect(() => {
        if (isInitialSummaryMount.current) {
            isInitialSummaryMount.current = false;
            return;
        }

        if (saveSummaryTimeoutRef.current) {
            clearTimeout(saveSummaryTimeoutRef.current);
        }

        setIsSaving(true);

        saveSummaryTimeoutRef.current = setTimeout(async () => {
            try {
                const csrfToken =
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '';

                await fetch(`/cv/${cv.id}/summary`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify({ content: summary }),
                });
            } catch (err) {
                console.error('Auto-save summary error:', err);
            } finally {
                setIsSaving(false);
            }
        }, 800);

        return () => {
            if (saveSummaryTimeoutRef.current) {
                clearTimeout(saveSummaryTimeoutRef.current);
            }
        };
    }, [summary, cv.id]);

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
                                <SummaryStep
                                    content={summary}
                                    onChange={setSummary}
                                    onBack={() => setCurrentStep('skills')}
                                    onNext={() => setCurrentStep('finalize')}
                                    desiredJobTitle={contact.desired_job_title}
                                    isSaving={isSaving}
                                />
                            )}

                            {currentStep === 'finalize' && (
                                <AdditionalStep
                                    contact={contact}
                                    onContactChange={handleContactChange}
                                    additionalData={additionalData}
                                    onAdditionalDataChange={setAdditionalData}
                                    onBack={() => setCurrentStep('summary')}
                                    onNext={() => {}}
                                    cvId={cv.id}
                                    cvTitle={cv.title}
                                    templates={templates}
                                    selectedTemplateId={selectedTemplateId}
                                    isPublished={cv.is_published}
                                    onFinalizeCv={handleFinalizeCv}
                                    isComplete={isComplete}
                                />
                            )}
                        </div>
                    </section>

                    {/* Right Column: Live Preview Section */}
                    <section
                        className={`flex-1 flex-col bg-slate-100/60 p-4 sm:p-6 lg:p-8 ${
                            activeTabMobile === 'editor'
                                ? 'hidden lg:flex'
                                : 'flex'
                        }`}
                    >
                        {/* Preview Header Toolbar with Template Quick Switcher */}
                        <div className="mb-4 flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-xs max-w-[595px] mx-auto w-full">
                            <div className="flex items-center gap-2">
                                <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-semibold text-slate-700">Format Template ATS:</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedTemplateId || ''}
                                    onChange={(e) => handleTemplateChange(Number(e.target.value))}
                                    className="text-xs border border-slate-200 rounded-lg px-2.5 py-1 bg-slate-50 text-slate-800 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                >
                                    {templates.map((tpl) => {
                                        const isModern =
                                            tpl.category?.toLowerCase() === 'modern' ||
                                            tpl.name.toLowerCase().includes('modern');
                                        const label = isModern
                                            ? 'Modern Minimalist (ATS Sederhana - Garis Solid)'
                                            : 'Classic Professional (ATS Klasik - Garis Dotted)';

                                        return (
                                            <option key={tpl.id} value={tpl.id}>
                                                {label}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <CvLivePreview
                            contact={contact}
                            experiences={experiences}
                            educations={educations}
                            skills={skills}
                            summary={summary}
                            showSkillsLevel={showSkillsLevel}
                            additionalData={additionalData}
                            organizations={cv.organizations}
                            certifications={cv.certifications}
                            awards={cv.awards}
                            templateId={selectedTemplateId}
                            templateName={currentSelectedTemplate?.name}
                            templateCategory={currentSelectedTemplate?.category}
                        />
                    </section>
                </div>
            </main>
        </div>
    );
}
