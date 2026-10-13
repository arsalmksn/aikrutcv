import React, { useState } from 'react';
import {
    X,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    TrendingUp,
    Award,
    Briefcase,
    GraduationCap,
    FileText,
    Wrench,
    User,
    Compass,
    RotateCw,
    Loader2,
    Check,
    Lightbulb,
    ShieldCheck,
    ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { UserProfileData } from '@/types/profile';

interface ProfileCompletenessDrawerProps {
    profile: UserProfileData;
    isOpen: boolean;
    onClose: () => void;
    onOpen: (tab?: 'completeness' | 'ai-score') => void;
    onNavigateSection: (section: string) => void;
    onProfileUpdated: (updatedProfile: UserProfileData) => void;
    initialTab?: 'completeness' | 'ai-score';
}

function getCsrfToken(): string {
    const metaTag = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (metaTag) return metaTag;

    const match = document.cookie.match(new RegExp('(^|;\\s*)XSRF-TOKEN=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : '';
}

export function ProfileCompletenessDrawer({
    profile,
    isOpen,
    onClose,
    onOpen,
    onNavigateSection,
    onProfileUpdated,
    initialTab = 'completeness',
}: ProfileCompletenessDrawerProps) {
    const [activeTab, setActiveTab] = useState<'completeness' | 'ai-score'>(initialTab);
    const [isScoringLoading, setIsScoringLoading] = useState(false);

    // Sync active tab if initialTab changes
    React.useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);

    const completeness = profile.completeness?.percentage ?? 0;
    const completedSections = profile.completeness?.completed_sections ?? {
        profile: false,
        summary: false,
        preferences: false,
        skills: false,
        experiences: false,
        educations: false,
        resumes: false,
    };

    const checklistSections = [
        {
            id: 'profile',
            title: 'Identitas Diri & Kontak',
            description: 'Nama lengkap, nomor WhatsApp aktif, dan domisili kota.',
            isCompleted: Boolean(completedSections.profile),
            icon: User,
        },
        {
            id: 'summary',
            title: 'Ringkasan Profesional (Tentang Saya)',
            description: 'Value proposition, fokus keahlian, dan ringkasan karier.',
            isCompleted: Boolean(completedSections.summary),
            icon: FileText,
        },
        {
            id: 'preferences',
            title: 'Minat & Preferensi Karier',
            description: 'Bidang industri yang dituju dan tipe pekerjaan yang diinginkan.',
            isCompleted: Boolean(completedSections.preferences),
            icon: Compass,
        },
        {
            id: 'experiences',
            title: 'Riwayat Pengalaman Kerja',
            description: 'Pengalaman kerja dengan pencapaian dan deskripsi tanggung jawab.',
            isCompleted: Boolean(completedSections.experiences),
            icon: Briefcase,
        },
        {
            id: 'educations',
            title: 'Riwayat Pendidikan',
            description: 'Institusi pendidikan, jenjang, jurusan, dan periode studi.',
            isCompleted: Boolean(completedSections.educations),
            icon: GraduationCap,
        },
        {
            id: 'skills',
            title: 'Keahlian & Perangkat (Tools)',
            description: 'Daftar software, bahasa pemrograman, atau keterampilan teknis.',
            isCompleted: Boolean(completedSections.skills),
            icon: Wrench,
        },
        {
            id: 'resumes',
            title: 'Berkas Resume & Portofolio',
            description: 'Lampiran file PDF resume atau karya portofolio pendukung.',
            isCompleted: Boolean(completedSections.resumes),
            icon: Award,
        },
    ];

    const completedCount = checklistSections.filter((s) => s.isCompleted).length;
    const totalCount = checklistSections.length;
    // Gunakan completeness dari profile langsung agar persentase identik dengan Card
    const displayPercentage = completeness;

    const aiScoring = profile.ai_scoring;
    const overallAiScore = aiScoring?.overall_score ?? null;

    const handleCalculateAiScore = async () => {
        setIsScoringLoading(true);
        try {
            const token = getCsrfToken();
            const response = await fetch('/api/v1/profile/ai-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-XSRF-TOKEN': token,
                },
                credentials: 'same-origin',
            });

            const result = await response.json();

            if (!response.ok) {
                const message =
                    result.message || 'Gagal mengevaluasi skor profil. Silakan coba lagi.';
                toast.error(message);
                return;
            }

            if (result.data?.profile) {
                onProfileUpdated(result.data.profile);
                toast.success('Audit dan penilaian profil AI berhasil diperbarui!');
                setActiveTab('ai-score');
            }
        } catch {
            toast.error('Terjadi gangguan jaringan saat menghubungi layanan AI.');
        } finally {
            setIsScoringLoading(false);
        }
    };

    const handleNavigate = (sectionId: string) => {
        onClose();
        onNavigateSection(sectionId);
    };

    // Color helpers for scores
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
        if (score >= 60) return 'text-amber-500 dark:text-amber-400';
        return 'text-rose-500 dark:text-rose-400';
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-emerald-500';
        if (score >= 60) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    return (
        <>
            {/* Floating Trigger Pill (Bottom-Right) */}
            {!isOpen && (
                <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onOpen('completeness')}
                        className="group flex items-center gap-3 rounded-full border border-neutral-200/90 bg-white/95 p-1.5 pr-4 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-sky-400 hover:shadow-2xl dark:border-neutral-800 dark:bg-neutral-900/95"
                    >
                        {/* Circular Progress Badge */}
                        <div className="relative flex size-9 items-center justify-center rounded-full bg-linear-to-tr from-sky-500 to-indigo-600 text-white shadow-xs">
                            <span className="text-[11px] font-bold tracking-tight">
                                {displayPercentage}%
                            </span>
                        </div>

                        <div className="flex flex-col text-left">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-100">
                                    Kelengkapan Profil
                                </span>
                                {displayPercentage >= 80 ? (
                                    <CheckCircle2 className="size-3 text-emerald-500" />
                                ) : (
                                    <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                                )}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                                {overallAiScore !== null ? (
                                    <span className="font-semibold text-sky-600 dark:text-sky-400">
                                        Skor AI: {overallAiScore}%
                                    </span>
                                ) : (
                                    <span>{completedCount}/{totalCount} Seksi Lengkap</span>
                                )}
                            </div>
                        </div>
                    </button>
                </div>
            )}

            {/* Backdrop Overlay */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
                />
            )}

            {/* Slide-over Right Drawer Panel */}
            <aside
                className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] sm:max-w-[480px] flex-col bg-white text-neutral-900 shadow-2xl transition-transform duration-300 ease-in-out dark:bg-neutral-950 dark:text-neutral-100 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Drawer Header */}
                <div className="flex flex-col border-b border-neutral-200/80 px-5 pt-4 pb-3 dark:border-neutral-800/80">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
                                <Sparkles className="size-4.5" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                    Kelengkapan & Skor Profil
                                </h2>
                                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                    Optimalisasi Single Source of Truth Karier
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                            aria-label="Tutup Panel"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    {/* Dual Tab Switcher */}
                    <div className="mt-3.5 flex rounded-xl bg-neutral-100 p-1 dark:bg-neutral-900">
                        <button
                            type="button"
                            onClick={() => setActiveTab('completeness')}
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all ${
                                activeTab === 'completeness'
                                    ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-neutral-100'
                                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
                            }`}
                        >
                            <CheckCircle2 className="size-3.5 text-sky-500" />
                            <span>Kelengkapan ({displayPercentage}%)</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('ai-score')}
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all ${
                                activeTab === 'ai-score'
                                    ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-neutral-100'
                                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
                            }`}
                        >
                            <Sparkles className="size-3.5 text-indigo-500" />
                            <span>Skor AI {overallAiScore !== null ? `(${overallAiScore}%)` : '✨'}</span>
                        </button>
                    </div>
                </div>

                {/* Drawer Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {/* TAB 1: KELENGKAPAN PROFIL */}
                    {activeTab === 'completeness' && (
                        <div className="space-y-5">
                            {/* Overall Completeness Card */}
                            <div className="rounded-2xl border border-sky-100 bg-linear-to-br from-sky-50/70 via-indigo-50/30 to-purple-50/40 p-4.5 dark:border-sky-950/60 dark:bg-neutral-900/80">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                                        Progres Kelengkapan Profil
                                    </span>
                                    <span className="text-base font-extrabold text-sky-600 dark:text-sky-400">
                                        {displayPercentage}%
                                    </span>
                                </div>

                                <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-neutral-200/80 dark:bg-neutral-800">
                                    <div
                                        className="h-full rounded-full bg-linear-to-r from-sky-500 via-indigo-500 to-purple-600 transition-all duration-500"
                                        style={{ width: `${displayPercentage}%` }}
                                    />
                                </div>

                                <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                    {displayPercentage >= 90
                                        ? '🎉 Profil Anda luar biasa lengkap! Seluruh data siap dirender otomatis ke dalam CV ATS dan memikat HRD.'
                                        : displayPercentage >= 70
                                        ? '👍 Profil Anda sudah cukup solid. Lengkapi beberapa seksi lagi agar rekomendasi lowongan dan skor AI makin presisi.'
                                        : '💡 Profil yang lengkap meningkatkan kemungkinan lolos seleksi berkas hingga 3x lipat. Isi seksi di bawah ini.'}
                                </p>
                            </div>

                            {/* Section Checklist */}
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                    <span>Checklist Seksi Profil</span>
                                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                                        {completedCount} dari {totalCount} terisi
                                    </span>
                                </div>

                                <div className="divide-y divide-neutral-100 rounded-2xl border border-neutral-200/80 bg-white overflow-hidden dark:divide-neutral-800/80 dark:border-neutral-800 dark:bg-neutral-900/60">
                                    {checklistSections.map((sec) => {
                                        const Icon = sec.icon;
                                        return (
                                            <div
                                                key={sec.id}
                                                className="flex items-center justify-between gap-3 p-3.5 transition-colors hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40"
                                            >
                                                <div className="flex items-start gap-3 min-w-0">
                                                    <div
                                                        className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg ${
                                                            sec.isCompleted
                                                                ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                                                                : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500'
                                                        }`}
                                                    >
                                                        {sec.isCompleted ? (
                                                            <Check className="size-4 stroke-[2.5]" />
                                                        ) : (
                                                            <Icon className="size-4" />
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-1.5">
                                                            <p
                                                                className={`text-xs font-bold truncate ${
                                                                    sec.isCompleted
                                                                        ? 'text-neutral-900 dark:text-neutral-100'
                                                                        : 'text-neutral-700 dark:text-neutral-300'
                                                                }`}
                                                            >
                                                                {sec.title}
                                                            </p>
                                                        </div>
                                                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                                                            {sec.description}
                                                        </p>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => handleNavigate(sec.id)}
                                                    className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                                        sec.isCompleted
                                                            ? 'border border-neutral-200 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800'
                                                            : 'bg-sky-600 text-white hover:bg-sky-700 shadow-xs'
                                                    }`}
                                                >
                                                    {sec.isCompleted ? 'Edit' : 'Lengkapi'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Quick Action to AI Score */}
                            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-950 dark:bg-indigo-950/20">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                                            Ingin audit menyeluruh dengan AI?
                                        </p>
                                        <p className="text-[11px] text-indigo-700 dark:text-indigo-400">
                                            AI akan menganalisis kekuatan kata kerja, dampak, dan kesiapan ATS.
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => setActiveTab('ai-score')}
                                        className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0"
                                    >
                                        Buka Skor AI
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: SKOR AI & EVALUASI */}
                    {activeTab === 'ai-score' && (
                        <div className="space-y-6">
                            {/* Action Header / Re-evaluate button */}
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                        Audit Rekruter Berbasis AI
                                    </h3>
                                    {profile.ai_scoring_updated_at && (
                                        <p className="text-[10px] text-neutral-400">
                                            Terakhir dinilai: {profile.ai_scoring_updated_at}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="button"
                                    size="sm"
                                    disabled={isScoringLoading}
                                    onClick={handleCalculateAiScore}
                                    className="rounded-xl bg-linear-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-sky-500/20 gap-1.5 transition-all"
                                >
                                    {isScoringLoading ? (
                                        <>
                                            <Loader2 className="size-3.5 animate-spin" />
                                            <span>Menganalisis...</span>
                                        </>
                                    ) : (
                                        <>
                                            <RotateCw className="size-3.5" />
                                            <span>{aiScoring ? 'Hitung Ulang' : 'Nilai Sekarang'}</span>
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* State: Chưa ada skor AI */}
                            {!aiScoring && !isScoringLoading && (
                                <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center dark:border-neutral-800">
                                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
                                        <Sparkles className="size-6" />
                                    </div>
                                    <h4 className="mt-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                        Profil Belum Dinilai oleh AI
                                    </h4>
                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs mx-auto">
                                        Dapatkan skor 0-100, umpan balik komprehensif, rubrik 4 pilar, serta rekomendasi perbaikan taktis langsung dari sudut pandang Headhunter senior.
                                    </p>
                                    <Button
                                        type="button"
                                        onClick={handleCalculateAiScore}
                                        className="mt-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm"
                                    >
                                        Mulai Audit Profil AI
                                    </Button>
                                </div>
                            )}

                            {/* State: Sedang Loading Analisis */}
                            {isScoringLoading && (
                                <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-6 text-center dark:border-sky-950 dark:bg-neutral-900/60">
                                    <Loader2 className="mx-auto size-8 text-sky-600 animate-spin dark:text-sky-400" />
                                    <p className="mt-3 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                        Konsultan AI Sedang Menganalisis Profil Anda...
                                    </p>
                                    <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                                        Memeriksa kesinambungan pengalaman, kata kerja aksi, metrik dampak, dan keahlian teknis.
                                    </p>
                                </div>
                            )}

                            {/* State: Ada Skor AI */}
                            {aiScoring && (
                                <div className="space-y-5">
                                    {/* Overall Score Card */}
                                    <div className="rounded-2xl border border-neutral-200/80 bg-linear-to-br from-neutral-50 via-white to-sky-50/30 p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/70">
                                        <div className="flex items-center gap-4">
                                            {/* Big Score Gauge */}
                                            <div className="relative flex size-20 shrink-0 items-center justify-center rounded-2xl bg-white border border-neutral-200/80 shadow-xs dark:bg-neutral-800 dark:border-neutral-700">
                                                <div className="text-center">
                                                    <span className={`text-2xl font-black ${getScoreColor(aiScoring.overall_score)}`}>
                                                        {aiScoring.overall_score}
                                                    </span>
                                                    <span className="block text-[10px] font-bold text-neutral-400">
                                                        / 100
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="min-w-0">
                                                <Badge className="bg-sky-500/15 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 font-bold text-[11px]">
                                                    {aiScoring.grade}
                                                </Badge>
                                                <h4 className="mt-1.5 text-xs font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
                                                    {aiScoring.headline}
                                                </h4>
                                            </div>
                                        </div>

                                        <p className="mt-3.5 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 pt-3 dark:border-neutral-800">
                                            {aiScoring.executive_summary}
                                        </p>
                                    </div>

                                    {/* 4 Pilar Rubrik Penilaian */}
                                    {aiScoring.rubric_scores && (
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                                Rubrik Penilaian 4 Pilar
                                            </h4>

                                            <div className="grid grid-cols-1 gap-2.5">
                                                {Object.entries(aiScoring.rubric_scores).map(([key, item]) => (
                                                    <div
                                                        key={key}
                                                        className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-3 dark:border-neutral-800/80 dark:bg-neutral-900/50"
                                                    >
                                                        <div className="flex items-center justify-between text-xs font-bold">
                                                            <span className="text-neutral-800 dark:text-neutral-200">
                                                                {item.label}
                                                            </span>
                                                            <span className={getScoreColor(item.score)}>
                                                                {item.score}%
                                                            </span>
                                                        </div>

                                                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200/80 dark:bg-neutral-800">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-500 ${getScoreBg(item.score)}`}
                                                                style={{ width: `${item.score}%` }}
                                                            />
                                                        </div>

                                                        <p className="mt-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                                            {item.feedback}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Strengths & Improvements */}
                                    <div className="grid grid-cols-1 gap-4">
                                        {/* Kekuatan Profil */}
                                        {aiScoring.strengths && aiScoring.strengths.length > 0 && (
                                            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2">
                                                    <CheckCircle2 className="size-4 text-emerald-600" />
                                                    <span>Kelebihan Utama Profil</span>
                                                </div>
                                                <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                                                    {aiScoring.strengths.map((st, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-emerald-500 font-bold">•</span>
                                                            <span className="leading-snug">{st}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Area Perbaikan */}
                                        {aiScoring.improvements && aiScoring.improvements.length > 0 && (
                                            <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-950 dark:bg-amber-950/20">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 mb-2">
                                                    <Lightbulb className="size-4 text-amber-600" />
                                                    <span>Peluang Optimasi (Gap)</span>
                                                </div>
                                                <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                                                    {aiScoring.improvements.map((imp, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-amber-500 font-bold">•</span>
                                                            <span className="leading-snug">{imp}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actionable Tips */}
                                    {aiScoring.actionable_tips && aiScoring.actionable_tips.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                                Langkah Taktis Rekomendasi AI
                                            </h4>

                                            <div className="space-y-2">
                                                {aiScoring.actionable_tips.map((tip, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="rounded-xl border border-neutral-200/80 bg-white p-3.5 shadow-xs transition-colors hover:border-sky-300 dark:border-neutral-800 dark:bg-neutral-900"
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                                                    {tip.title}
                                                                </p>
                                                                <p className="mt-1 text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                                                    {tip.tip}
                                                                </p>
                                                            </div>

                                                            {tip.target_section && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleNavigate(tip.target_section!)}
                                                                    className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 hover:bg-sky-100 dark:bg-sky-950/50 dark:text-sky-300"
                                                                >
                                                                    <span>Perbaiki</span>
                                                                    <ArrowRight className="size-3" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
