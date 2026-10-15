import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Brain,
    Briefcase,
    Building2,
    Check,
    CheckCircle2,
    Code,
    DollarSign,
    FileText,
    FileCheck,
    GraduationCap,
    Lightbulb,
    Loader2,
    Lock,
    Palette,
    Plus,
    Sparkles,
    TrendingUp,
    UploadCloud,
    Users,
    Wand2,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CvImportModal } from '@/pages/profile/components/CvImportModal';
import type { UserProfileData } from '@/types/profile';

interface CareerCategory {
    id: string;
    title: string;
    description: string;
    icon: string;
    roles: string[];
    popular_skills: string[];
}

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
    careerCategories: CareerCategory[];
    careerLevels: string[];
}

interface AiBlueprint {
    ai_profile_summary: string;
    target_roles: string[];
    recommended_skills: string[];
    quick_action_steps: string[];
    tailored_tone?: string;
    career_level?: string;
    readiness_note?: string;
}

export default function OnboardingIndex({
    user,
    existingData,
    careerCategories,
    careerLevels,
}: OnboardingProps) {
    const [step, setStep] = useState<number>(1);

    // Step 1 States
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<string[]>(
        existingData.saved_peminatan.length > 0 ? existingData.saved_peminatan : []
    );
    const [customRoleInput, setCustomRoleInput] = useState<string>('');
    const [selectedLevel, setSelectedLevel] = useState<string>(
        existingData.saved_career_level || careerLevels[0]
    );

    // Step 2 States (Existing Data & Skills)
    const [useExistingData, setUseExistingData] = useState<boolean>(true);
    const [selectedSkills, setSelectedSkills] = useState<string[]>(
        existingData.tools.length > 0 ? existingData.tools : []
    );
    const [customSkillInput, setCustomSkillInput] = useState<string>('');

    // Step 3 States (AI Generation & Data Sourcing)
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [aiBlueprint, setAiBlueprint] = useState<AiBlueprint | null>(
        existingData.ai_onboarding_context || null
    );
    const [dataSourceOption, setDataSourceOption] = useState<'onboarding' | 'cv_import'>('onboarding');
    const [isCvModalOpen, setIsCvModalOpen] = useState<boolean>(false);
    const [isCvImported, setIsCvImported] = useState<boolean>(false);
    const [, setImportedProfileData] = useState<UserProfileData | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Category Icon Mapper
    const renderCategoryIcon = (iconName: string) => {
        const props = { className: 'h-6 w-6 text-primary' };
        switch (iconName) {
            case 'Code':
                return <Code {...props} />;
            case 'Brain':
                return <Brain {...props} />;
            case 'Palette':
                return <Palette {...props} />;
            case 'Briefcase':
                return <Briefcase {...props} />;
            case 'TrendingUp':
                return <TrendingUp {...props} />;
            case 'DollarSign':
                return <DollarSign {...props} />;
            case 'Users':
                return <Users {...props} />;
            default:
                return <Sparkles {...props} />;
        }
    };

    // Toggle Role selection
    const toggleRole = (role: string) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter((r) => r !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    // Add Custom Role
    const addCustomRole = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = customRoleInput.trim();
        if (trimmed && !selectedRoles.includes(trimmed)) {
            setSelectedRoles([...selectedRoles, trimmed]);
            setCustomRoleInput('');
        }
    };

    // Toggle Skill selection
    const toggleSkill = (skill: string) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter((s) => s !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    // Add Custom Skill
    const addCustomSkill = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = customSkillInput.trim();
        if (trimmed && !selectedSkills.includes(trimmed)) {
            setSelectedSkills([...selectedSkills, trimmed]);
            setCustomSkillInput('');
        }
    };

    // Generate AI Career Blueprint
    const handleGenerateBlueprint = async () => {
        if (selectedRoles.length === 0) {
            setErrorMsg('Silakan pilih minimal 1 peminatan atau target peran kerja.');
            return;
        }

        setErrorMsg(null);
        setIsGenerating(true);

        try {
            const response = await fetch('/onboarding/blueprint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
                            ?.content || '',
                },
                body: JSON.stringify({
                    field_of_interest: selectedRoles,
                    career_level: selectedLevel,
                    use_existing_data: useExistingData,
                    existing_data: {
                        experiences: existingData.experiences,
                        educations: existingData.educations,
                        tools: selectedSkills,
                        summary: existingData.summary,
                    },
                }),
            });

            const result = await response.json();
            if (result.status === 'success' && result.data) {
                setAiBlueprint(result.data);
                setStep(3);
            } else {
                setErrorMsg(result.message || 'Gagal menghasilkan blueprint AI.');
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'Terjadi kesalahan koneksi AI.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Final Save & Complete Onboarding
    const handleComplete = (targetDestination: 'dashboard' | 'cv' = 'dashboard') => {
        if (dataSourceOption === 'cv_import' && !isCvImported) {
            setErrorMsg(
                'Anda memilih opsi "Import Berkas CV Langsung". Silakan klik tombol "Unggah & Ekstrak Berkas CV" terlebih dahulu, atau alihkan ke opsi "Gunakan Data Onboarding AI".'
            );
            return;
        }

        setIsSaving(true);
        setErrorMsg(null);

        router.post(
            '/onboarding/complete',
            {
                field_of_interest: selectedRoles,
                career_level: selectedLevel,
                profile_data_source: dataSourceOption,
                sync_existing_cv: useExistingData && existingData.has_existing_cv,
                selected_skills: selectedSkills,
                ai_blueprint: aiBlueprint,
            },
            {
                onSuccess: () => {
                    if (targetDestination === 'cv') {
                        router.visit('/cv/templates');
                    } else {
                        router.visit('/dashboard');
                    }
                },
                onError: (errors) => {
                    setIsSaving(false);
                    setErrorMsg(Object.values(errors)[0] as string);
                },
            }
        );
    };

    // Skip Onboarding
    const handleSkip = () => {
        router.post('/onboarding/skip');
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col justify-between">
            <Head title="Pilih Peminatan & Inisialisasi AI Karier" />

            {/* Top Navigation Bar */}
            <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-30 px-4 py-3">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-linear-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-sm">
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <span className="font-bold tracking-tight text-lg">AiKrut CV</span>
                        <Badge variant="secondary" className="text-xs bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                            AI Onboarding
                        </Badge>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSkip}
                            className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                        >
                            Lewati untuk sekarang
                        </Button>
                    </div>
                </div>
            </header>

            {/* Progress Stepper */}
            <div className="max-w-3xl mx-auto w-full pt-8 px-4">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-neutral-200 dark:bg-neutral-800 z-0" />
                    {[
                        { num: 1, label: 'Peminatan & Karier' },
                        { num: 2, label: 'Data Existing & Keahlian' },
                        { num: 3, label: 'Aktivasi AI Blueprint' },
                    ].map((s) => (
                        <div key={s.num} className="relative z-10 flex flex-col items-center">
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                                    step >= s.num
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-4 ring-blue-100 dark:ring-blue-950/50'
                                        : 'bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-400'
                                }`}
                            >
                                {step > s.num ? <Check className="h-4 w-4" /> : s.num}
                            </div>
                            <span
                                className={`text-[11px] font-medium mt-1.5 hidden sm:block ${
                                    step >= s.num
                                        ? 'text-blue-600 dark:text-blue-400 font-semibold'
                                        : 'text-neutral-400'
                                }`}
                            >
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Body */}
            <main className="max-w-3xl mx-auto w-full flex-1 py-8 px-4">
                {errorMsg && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
                        <X className="h-4 w-4 shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* STEP 1: PEMINATAN & JENJANG KARIER */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                Halo, {user.name}! Pilih Peminatan Karier Anda
                            </h1>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
                                AI Agent kami memerlukan referensi minat dan spesialisasi awal untuk
                                menyesuaikan rekomendasi kata kunci ATS, optimasi CV, dan saran karier Anda.
                            </p>
                        </div>

                        {/* Jenjang Pengalaman (Career Level) */}
                        <Card className="border-neutral-200 dark:border-neutral-800 shadow-xs">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                    Jenjang Pengalaman Saat Ini
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                    {careerLevels.map((lvl) => {
                                        const isSelected = selectedLevel === lvl;
                                        return (
                                            <button
                                                key={lvl}
                                                type="button"
                                                onClick={() => setSelectedLevel(lvl)}
                                                className={`text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                                                    isSelected
                                                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-xs ring-1 ring-blue-500'
                                                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{lvl}</span>
                                                    {isSelected && <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Kategori Peminatan Utama */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                    Kategori Peminatan Industri & Bidang
                                </label>
                                <span className="text-xs text-neutral-400">Pilih satu atau beberapa</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {careerCategories.map((cat) => {
                                    const isCatActive = selectedCategories.includes(cat.id);
                                    return (
                                        <div
                                            key={cat.id}
                                            onClick={() => {
                                                if (isCatActive) {
                                                    setSelectedCategories(selectedCategories.filter((id) => id !== cat.id));
                                                } else {
                                                    setSelectedCategories([...selectedCategories, cat.id]);
                                                }
                                            }}
                                            className={`cursor-pointer p-4 rounded-xl border transition-all text-left ${
                                                isCatActive
                                                    ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 ring-1 ring-blue-500/50'
                                                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0">
                                                    {renderCategoryIcon(cat.icon)}
                                                </div>
                                                <div className="space-y-1 flex-1 min-w-0">
                                                    <h3 className="font-semibold text-sm leading-tight text-neutral-900 dark:text-neutral-100">
                                                        {cat.title}
                                                    </h3>
                                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                                                        {cat.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Sub roles chips */}
                                            <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex flex-wrap gap-1.5">
                                                {cat.roles.slice(0, 4).map((role) => {
                                                    const isRoleActive = selectedRoles.includes(role);
                                                    return (
                                                        <button
                                                            key={role}
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleRole(role);
                                                            }}
                                                            className={`text-[11px] px-2.5 py-1 rounded-full transition-all ${
                                                                isRoleActive
                                                                    ? 'bg-blue-600 text-white font-medium shadow-xs'
                                                                    : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                                                            }`}
                                                        >
                                                            {role}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Selected Roles Bar & Custom Input */}
                        <Card className="border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold flex items-center justify-between">
                                    <span>Peminatan Terpilih ({selectedRoles.length})</span>
                                    <span className="text-xs font-normal text-neutral-400">
                                        Ini akan menjadi referensi utama AI
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {selectedRoles.length === 0 ? (
                                    <p className="text-xs text-neutral-400 italic">
                                        Belum ada peran yang dipilih. Klik chip peran di atas atau ketik peran impian Anda di bawah.
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRoles.map((role) => (
                                            <Badge
                                                key={role}
                                                className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 text-xs gap-1.5 shadow-xs"
                                            >
                                                <span>{role}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleRole(role)}
                                                    className="hover:bg-blue-800 rounded-full p-0.5"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                <form onSubmit={addCustomRole} className="flex gap-2 pt-2">
                                    <Input
                                        placeholder="Ketik peran spesifik lainnya (contoh: Golang Engineer, Cloud Architect)..."
                                        value={customRoleInput}
                                        onChange={(e) => setCustomRoleInput(e.target.value)}
                                        className="text-xs h-9"
                                    />
                                    <Button type="submit" size="sm" variant="secondary" className="h-9 text-xs gap-1 shrink-0">
                                        <Plus className="h-3.5 w-3.5" />
                                        <span>Tambah</span>
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={() => {
                                    if (selectedRoles.length === 0) {
                                        setErrorMsg('Silakan pilih minimal 1 peminatan peran karier.');
                                        return;
                                    }
                                    setErrorMsg(null);
                                    setStep(2);
                                }}
                                disabled={selectedRoles.length === 0}
                                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/20"
                            >
                                <span>Lanjutkan ke Data Existing & Skill</span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 2: DATA EXISTING & SKILLS */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                Integrasi Data Existing & Keahlian
                            </h1>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
                                AI Agent akan menyelaraskan data riwayat yang sudah ada di akun Anda dengan peminatan yang dipilih.
                            </p>
                        </div>

                        {/* Existing Data Notification Card */}
                        {existingData.has_existing_cv || existingData.experiences.length > 0 ? (
                            <div className="rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-linear-to-r from-sky-50/60 via-blue-50/40 to-indigo-50/60 dark:from-sky-950/30 dark:via-blue-950/20 dark:to-indigo-950/30 p-5 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2.5 text-sky-800 dark:text-sky-300 font-semibold text-sm">
                                        <Sparkles className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                                        <span>Data Riwayat Karier Ditemukan di Akun Anda!</span>
                                    </div>
                                    <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={useExistingData}
                                            onChange={(e) => setUseExistingData(e.target.checked)}
                                            className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                                        />
                                        <span className="font-medium text-neutral-700 dark:text-neutral-300">
                                            Gunakan data ini untuk AI
                                        </span>
                                    </label>
                                </div>

                                {useExistingData && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                        {existingData.experiences.length > 0 && (
                                            <div className="p-3 rounded-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/60 dark:border-neutral-800/60 space-y-2">
                                                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                                                    <Building2 className="h-3.5 w-3.5" />
                                                    <span>Pengalaman Terdeteksi</span>
                                                </div>
                                                <div className="space-y-1">
                                                    {existingData.experiences.slice(0, 2).map((exp, idx) => (
                                                        <div key={idx} className="text-xs">
                                                            <span className="font-medium text-neutral-800 dark:text-neutral-200">{exp.position}</span>
                                                            <span className="text-neutral-400"> di {exp.company}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {existingData.educations.length > 0 && (
                                            <div className="p-3 rounded-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/60 dark:border-neutral-800/60 space-y-2">
                                                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                                                    <GraduationCap className="h-3.5 w-3.5" />
                                                    <span>Pendidikan Terdeteksi</span>
                                                </div>
                                                <div className="space-y-1">
                                                    {existingData.educations.slice(0, 2).map((edu, idx) => (
                                                        <div key={idx} className="text-xs">
                                                            <span className="font-medium text-neutral-800 dark:text-neutral-200">{edu.degree}</span>
                                                            <span className="text-neutral-400"> - {edu.institution}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 text-center space-y-2">
                                <FileText className="h-8 w-8 text-neutral-400 mx-auto" />
                                <h3 className="font-semibold text-sm">Akun Baru Terdeteksi</h3>
                                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                                    Belum ada CV tersimpan di akun Anda. AI Agent akan membuat fondasi profil baru berdasarkan peminatan yang Anda pilih.
                                </p>
                            </div>
                        )}

                        {/* Keahlian & Tools Prioritas */}
                        <Card className="border-neutral-200 dark:border-neutral-800">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold flex items-center justify-between">
                                    <span>Keahlian & Tools Teknis</span>
                                    <span className="text-xs font-normal text-neutral-400">
                                        Pilih keahlian yang Anda kuasai
                                    </span>
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Keahlian ini akan langsung diperhitungkan oleh sistem ATS dan analisis AI.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Popular suggestions from chosen categories */}
                                <div className="space-y-1.5">
                                    <span className="text-[11px] font-medium text-neutral-500">
                                        Rekomendasi untuk peminatan Anda:
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {Array.from(
                                            new Set(
                                                careerCategories
                                                    .filter((c) => selectedCategories.includes(c.id) || selectedCategories.length === 0)
                                                    .flatMap((c) => c.popular_skills)
                                            )
                                        )
                                            .slice(0, 15)
                                            .map((skill) => {
                                                const isSkillActive = selectedSkills.includes(skill);
                                                return (
                                                    <button
                                                        key={skill}
                                                        type="button"
                                                        onClick={() => toggleSkill(skill)}
                                                        className={`text-xs px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                                                            isSkillActive
                                                                ? 'bg-blue-600 text-white font-medium shadow-xs'
                                                                : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                                                        }`}
                                                    >
                                                        {isSkillActive && <Check className="h-3 w-3" />}
                                                        <span>{skill}</span>
                                                    </button>
                                                );
                                            })}
                                    </div>
                                </div>

                                {/* Custom Skill Input */}
                                <form onSubmit={addCustomSkill} className="flex gap-2 pt-2">
                                    <Input
                                        placeholder="Ketik keahlian spesifik lainnya (contoh: Tailwind CSS, Next.js, Docker)..."
                                        value={customSkillInput}
                                        onChange={(e) => setCustomSkillInput(e.target.value)}
                                        className="text-xs h-9"
                                    />
                                    <Button type="submit" size="sm" variant="secondary" className="h-9 text-xs gap-1 shrink-0">
                                        <Plus className="h-3.5 w-3.5" />
                                        <span>Tambah Skill</span>
                                    </Button>
                                </form>

                                {/* Selected Skills Preview */}
                                {selectedSkills.length > 0 && (
                                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                                        <div className="flex items-center justify-between text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                                            <span>Keahlian Terpilih ({selectedSkills.length})</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedSkills.map((sk) => (
                                                <Badge
                                                    key={sk}
                                                    variant="secondary"
                                                    className="px-2.5 py-0.5 text-xs gap-1"
                                                >
                                                    <span>{sk}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSkill(sk)}
                                                        className="hover:text-red-500 rounded-full"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setStep(1)}
                                className="text-xs gap-1.5 rounded-xl"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                <span>Kembali</span>
                            </Button>

                            <Button
                                onClick={handleGenerateBlueprint}
                                disabled={isGenerating}
                                className="bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/20 gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>AI Menyintesis Data...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4" />
                                        <span>Inisialisasi AI Agent Karier</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 3: AKTIVASI AI BLUEPRINT HASIL SINTESIS */}
                {step === 3 && aiBlueprint && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>AI Agent Berhasil Dikonfigurasi</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                Blueprint Karier AI Anda Siap!
                            </h1>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
                                Berikut adalah ringkasan strategi profil profesional yang disintesis oleh AI Career Agent berdasarkan peminatan dan data riwayat Anda.
                            </p>
                        </div>

                        {/* AI Summary Card */}
                        <div className="relative overflow-hidden rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-linear-to-br from-white via-blue-50/30 to-indigo-50/40 dark:from-neutral-900 dark:via-blue-950/20 dark:to-indigo-950/20 p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                    <Wand2 className="h-4 w-4" />
                                    <span>AI Professional Value Proposition</span>
                                </div>
                                <Badge variant="outline" className="text-[11px] border-blue-300 text-blue-700 dark:text-blue-300">
                                    {aiBlueprint.career_level || selectedLevel}
                                </Badge>
                            </div>

                            <p className="text-sm sm:text-base leading-relaxed text-neutral-800 dark:text-neutral-200 font-medium italic">
                                "{aiBlueprint.ai_profile_summary}"
                            </p>

                            {aiBlueprint.readiness_note && (
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-200/60 dark:border-neutral-800/60 pt-3">
                                    💡 {aiBlueprint.readiness_note}
                                </p>
                            )}
                        </div>

                        {/* Target Roles & Recommended Skills Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card className="border-neutral-200 dark:border-neutral-800">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                                        <Briefcase className="h-3.5 w-3.5 text-blue-500" />
                                        <span>Target Peran Utama</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-1.5">
                                        {aiBlueprint.target_roles.map((r, i) => (
                                            <Badge
                                                key={i}
                                                className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs py-1"
                                            >
                                                {r}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-neutral-200 dark:border-neutral-800">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                                        <Code className="h-3.5 w-3.5 text-indigo-500" />
                                        <span>Keahlian & Tools Prioritas</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-1.5">
                                        {aiBlueprint.recommended_skills.map((sk, i) => (
                                            <Badge
                                                key={i}
                                                variant="secondary"
                                                className="text-xs py-1"
                                            >
                                                {sk}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* 3 Quick Action Steps */}
                        {aiBlueprint.quick_action_steps && aiBlueprint.quick_action_steps.length > 0 && (
                            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                                        <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                                        <span>3 Rekomendasi Aksi Awal untuk CV Anda</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {aiBlueprint.quick_action_steps.map((stepText, idx) => (
                                        <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                                            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                                                {idx + 1}
                                            </span>
                                            <span className="leading-relaxed">{stepText}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* PEMILIHAN SUMBER DATA PROFIL UTAMA (ONE-TIME SOURCING) */}
                        <div className="space-y-3 pt-2">
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                                    <span>Pilih Sumber Data Profil Utama Anda</span>
                                </h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    Pilihlah salah satu metode pengisian profil. Karena sistem menganut prinsip satu sumber kebenaran, pilihan ini akan mengunci profil Anda (tombol impor CV di halaman profil akan disembunyikan permanen).
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* OPSI 1: AMBIL DARI ONBOARDING AI */}
                                <div
                                    onClick={() => setDataSourceOption('onboarding')}
                                    className={`cursor-pointer p-4 rounded-2xl border transition-all space-y-2.5 ${
                                        dataSourceOption === 'onboarding'
                                            ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-blue-500/40 shadow-xs'
                                            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400">
                                                <Sparkles className="h-4 w-4" />
                                            </div>
                                            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                                Gunakan Data Onboarding AI
                                            </span>
                                        </div>
                                        {dataSourceOption === 'onboarding' && (
                                            <Badge className="bg-blue-600 text-white text-[10px] px-2 py-0.5">
                                                Terpilih
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                        Profil utama Anda akan diisi dari peminatan, keahlian, dan ringkasan profesional yang disintesis AI ini.
                                    </p>
                                    <div className="pt-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                                        <Check className="h-3.5 w-3.5" />
                                        <span>Profil tersusun instan tanpa perlu unggah berkas</span>
                                    </div>
                                </div>

                                {/* OPSI 2: IMPORT BERKAS CV LANGSUNG */}
                                <div
                                    onClick={() => setDataSourceOption('cv_import')}
                                    className={`cursor-pointer p-4 rounded-2xl border transition-all space-y-2.5 ${
                                        dataSourceOption === 'cv_import'
                                            ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/40 shadow-xs'
                                            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400">
                                                <UploadCloud className="h-4 w-4" />
                                            </div>
                                            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                                Import Berkas CV Langsung
                                            </span>
                                        </div>
                                        {dataSourceOption === 'cv_import' && (
                                            <Badge className="bg-indigo-600 text-white text-[10px] px-2 py-0.5">
                                                Terpilih
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                        Unggah berkas CV Anda (PDF/DOCX) sekarang untuk diekstrak otomatis oleh AI ke dalam profil utama.
                                    </p>

                                    <div className="pt-1">
                                        {isCvImported ? (
                                            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                                                <FileCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                                                <span>Berkas CV Berhasil Diekstrak & Diterapkan!</span>
                                            </div>
                                        ) : (
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDataSourceOption('cv_import');
                                                    setIsCvModalOpen(true);
                                                }}
                                                className="w-full text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-1.5 shadow-sm"
                                            >
                                                <UploadCloud className="h-3.5 w-3.5" />
                                                <span>Unggah & Ekstrak Berkas CV</span>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CvImportModal Integration */}
                        <CvImportModal
                            isOpen={isCvModalOpen}
                            onClose={() => setIsCvModalOpen(false)}
                            onSuccess={(updatedProfile) => {
                                setIsCvImported(true);
                                setDataSourceOption('cv_import');
                                setImportedProfileData(updatedProfile);
                                setIsCvModalOpen(false);
                                if (updatedProfile.tools && updatedProfile.tools.length > 0) {
                                    setSelectedSkills(updatedProfile.tools);
                                }
                                if (updatedProfile.field_of_interest && updatedProfile.field_of_interest.length > 0) {
                                    setSelectedRoles(updatedProfile.field_of_interest);
                                }
                            }}
                        />

                        {/* Action CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setStep(2)}
                                className="w-full sm:w-auto text-xs gap-1.5 rounded-xl"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                <span>Ubah Preferensi</span>
                            </Button>

                            <div className="flex items-center gap-2.5 w-full sm:w-auto">
                                <Button
                                    variant="secondary"
                                    onClick={() => handleComplete('cv')}
                                    disabled={isSaving}
                                    className="flex-1 sm:flex-none text-xs rounded-xl"
                                >
                                    <span>Mulai Buat CV</span>
                                </Button>

                                <Button
                                    onClick={() => handleComplete('dashboard')}
                                    disabled={isSaving}
                                    className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/20 gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Menyimpan...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Selesai & Ke Dashboard</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Simple Footer */}
            <footer className="border-t border-neutral-200 dark:border-neutral-800 py-4 text-center text-xs text-neutral-400">
                <span>AiKrut CV &mdash; Platform Pembuat & Peninjau CV ATS Berbasis AI</span>
            </footer>
        </div>
    );
}
