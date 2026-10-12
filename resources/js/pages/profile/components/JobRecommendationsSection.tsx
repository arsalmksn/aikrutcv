import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Briefcase,
    Sparkles,
    RefreshCw,
    ExternalLink,
    CheckCircle2,
    TrendingUp,
    Zap,
    FileText,
    DollarSign,
    MapPin,
    Layers,
    Lightbulb,
    ArrowUpRight,
    Search,
    ChevronDown,
    Building2,
    Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type {
    UserProfileData,
    JobRecommendationItem,
    JobRecommendationsData,
} from '@/types/profile';

interface JobRecommendationsSectionProps {
    profile: UserProfileData;
    onProfileUpdated: (updatedProfile: UserProfileData) => void;
}

function getCsrfToken(): string {
    const metaTag = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (metaTag) return metaTag;

    const match = document.cookie.match(new RegExp('(^|;\\s*)XSRF-TOKEN=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : '';
}

export function JobRecommendationsSection({
    profile,
    onProfileUpdated,
}: JobRecommendationsSectionProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [creatingCvForJob, setCreatingCvForJob] = useState<string | null>(null);
    const [careerLevel, setCareerLevel] = useState<string>('all');
    const [workMode, setWorkMode] = useState<string>('all');

    const jobData: JobRecommendationsData | null = profile.job_recommendations ?? null;
    const recommendations: JobRecommendationItem[] = jobData?.recommendations ?? [];
    const updatedAt = profile.job_recommendations_updated_at;

    // Prefill data diagnostics for candidate context
    const hasAboutMe = Boolean(profile.about_me && profile.about_me.trim().length > 0);
    const experienceCount = profile.experiences?.length ?? 0;
    const skillsCount = profile.tools?.length ?? 0;

    /**
     * Trigger AI recommendation matching
     */
    const handleGenerateRecommendations = async () => {
        setIsLoading(true);
        try {
            const token = getCsrfToken();
            const response = await fetch('/api/v1/profile/recommend-jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-XSRF-TOKEN': token,
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    career_level: careerLevel,
                    work_mode: workMode,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                const message =
                    result.message || 'Gagal memuat rekomendasi lowongan. Silakan coba lagi.';
                toast.error(message);
                return;
            }

            if (result.data?.profile) {
                onProfileUpdated(result.data.profile);
                toast.success('Rekomendasi lowongan kerja berhasil diperbarui!');
            }
        } catch {
            toast.error('Terjadi gangguan jaringan saat menghubungi AI.');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Create tailored CV for the selected job title
     */
    const handleCreateCvForJob = async (jobTitle: string) => {
        setCreatingCvForJob(jobTitle);
        try {
            const token = getCsrfToken();
            const response = await fetch('/cv/create-from-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-XSRF-TOKEN': token,
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    target_job_title: jobTitle,
                }),
            });

            const result = await response.json();

            if (!response.ok || result.status !== 'success') {
                toast.error(result.message || 'Gagal membuat CV untuk posisi ini.');
                return;
            }

            toast.success(`CV khusus "${jobTitle}" berhasil dibuat! Mengalihkan ke editor...`);

            if (result.builder_url) {
                router.visit(result.builder_url);
            } else if (result.cv_id) {
                router.visit(`/cv/${result.cv_id}/builder`);
            }
        } catch {
            toast.error('Gagal menghubungkan ke server.');
        } finally {
            setCreatingCvForJob(null);
        }
    };

    const getScoreBadgeColor = (score: number) => {
        if (score >= 90) {
            return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
        }
        if (score >= 80) {
            return 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30';
        }
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30';
    };

    return (
        <section
            aria-label="Rekomendasi Lowongan Kerja"
            className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/95 p-5 shadow-sm transition-all duration-300 hover:shadow-md dark:border-neutral-800/80 dark:bg-neutral-900/90 sm:p-6"
        >
            {/* Top decorative gradient bar */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500" />

            {/* Header & Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-purple-500/20 text-sky-600 dark:text-sky-400 shadow-inner">
                        <Sparkles className="size-5 animate-pulse" />
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 sm:text-xl">
                                Rekomendasi Lowongan Kerja Sesuai Profil
                            </h2>
                            <Badge
                                variant="outline"
                                className="border-sky-500/30 bg-sky-50 text-[10px] font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"
                            >
                                AI Career Matcher
                            </Badge>
                        </div>
                        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 sm:text-sm">
                            Dicocokkan otomatis dari <strong>ringkasan diri</strong>,{' '}
                            <strong>pengalaman kerja</strong>, dan <strong>keahlian</strong> Anda.
                        </p>
                    </div>
                </div>

                {/* Action button */}
                <div className="flex flex-wrap items-center gap-2 sm:self-center">
                    {updatedAt && (
                        <span className="text-[11px] text-neutral-400 dark:text-neutral-500 hidden md:inline">
                            Diperbarui: {updatedAt}
                        </span>
                    )}
                    <Button
                        onClick={handleGenerateRecommendations}
                        disabled={isLoading}
                        size="sm"
                        className="gap-2 bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-sm hover:from-sky-500 hover:to-indigo-500 disabled:opacity-60"
                    >
                        <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>{recommendations.length > 0 ? 'Analisis Ulang' : 'Cari Rekomendasi'}</span>
                    </Button>
                </div>
            </div>

            {/* Filter Chips Bar */}
            <div className="mt-4 flex flex-wrap items-center gap-3 border-y border-neutral-100 py-3 dark:border-neutral-800/80">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                    <Layers className="size-3.5" />
                    Filter Target:
                </span>

                {/* Career Level Filter */}
                <div className="flex flex-wrap items-center gap-1.5">
                    {[
                        { label: 'Semua Level', value: 'all' },
                        { label: 'Junior', value: 'Junior' },
                        { label: 'Mid-Level', value: 'Mid-Level' },
                        { label: 'Senior', value: 'Senior' },
                    ].map((lvl) => (
                        <button
                            key={lvl.value}
                            type="button"
                            onClick={() => setCareerLevel(lvl.value)}
                            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                                careerLevel === lvl.value
                                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                            }`}
                        >
                            {lvl.label}
                        </button>
                    ))}
                </div>

                <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700 hidden sm:block" />

                {/* Work Mode Filter */}
                <div className="flex flex-wrap items-center gap-1.5">
                    {[
                        { label: 'Semua Tipe', value: 'all' },
                        { label: 'Remote', value: 'Remote' },
                        { label: 'Hybrid', value: 'Hybrid' },
                        { label: 'Onsite', value: 'Onsite' },
                    ].map((mode) => (
                        <button
                            key={mode.value}
                            type="button"
                            onClick={() => setWorkMode(mode.value)}
                            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                                workMode === mode.value
                                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                            }`}
                        >
                            {mode.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* AI Profile Insight Callout */}
            {jobData?.profile_summary_insight && !isLoading && (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50/70 p-3.5 text-xs text-sky-900 dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-200">
                    <Lightbulb className="size-4 shrink-0 text-sky-600 dark:text-sky-400 mt-0.5" />
                    <div>
                        <span className="font-semibold text-sky-950 dark:text-sky-100">
                            Wawasan Karier AI:{' '}
                        </span>
                        <span>{jobData.profile_summary_insight}</span>
                    </div>
                </div>
            )}

            {/* Loading State Skeleton */}
            {isLoading && (
                <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-sky-300/60 bg-sky-50/30 py-12 dark:border-sky-800/60 dark:bg-sky-950/10">
                    <div className="relative mb-3">
                        <div className="size-12 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600 dark:border-sky-900 dark:border-t-sky-400" />
                        <Sparkles className="absolute inset-0 m-auto size-5 text-sky-600 dark:text-sky-400 animate-pulse" />
                    </div>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                        AI sedang menganalisis profil dan mencocokkan lowongan...
                    </p>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 max-w-sm text-center">
                        Memeriksa ringkasan tentang saya, riwayat {experienceCount} pengalaman kerja, dan{' '}
                        {skillsCount} keahlian untuk posisi terbaik.
                    </p>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && recommendations.length === 0 && (
                <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/60 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
                    <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
                        <TrendingUp className="size-7" />
                    </div>
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                        Belum Ada Rekomendasi Lowongan
                    </h3>
                    <p className="mt-1.5 max-w-md text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        Dapatkan rekomendasi peran kerja yang paling sesuai dengan riwayat profil Anda.
                        AI akan membaca kualifikasi Anda dan mencocokkannya dengan kebutuhan industri saat ini.
                    </p>

                    {/* Profile Pre-fill Diagnostics */}
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                        <Badge
                            variant="secondary"
                            className={`gap-1 text-[11px] ${
                                hasAboutMe
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                        >
                            <CheckCircle2 className="size-3" />
                            Ringkasan: {hasAboutMe ? 'Sudah Terisi' : 'Belum Ada'}
                        </Badge>
                        <Badge
                            variant="secondary"
                            className={`gap-1 text-[11px] ${
                                experienceCount > 0
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                        >
                            <CheckCircle2 className="size-3" />
                            Pengalaman: {experienceCount} Riwayat
                        </Badge>
                        <Badge
                            variant="secondary"
                            className={`gap-1 text-[11px] ${
                                skillsCount > 0
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                        >
                            <CheckCircle2 className="size-3" />
                            Keahlian: {skillsCount} Tools/Skill
                        </Badge>
                    </div>

                    <Button
                        onClick={handleGenerateRecommendations}
                        className="mt-5 gap-2 bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md hover:from-sky-500 hover:to-indigo-500"
                    >
                        <Sparkles className="size-4" />
                        <span>Analisis & Rekomendasikan Sekarang</span>
                    </Button>
                </div>
            )}

            {/* Recommendations Grid */}
            {!isLoading && recommendations.length > 0 && (
                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {recommendations.map((item, index) => {
                        const isGeneratingCv = creatingCvForJob === item.job_title;

                        return (
                            <div
                                key={`${item.job_title}-${index}`}
                                className="group relative flex flex-col justify-between rounded-xl border border-neutral-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/90 dark:hover:border-sky-700/60"
                            >
                                {/* Top Header: Job Title & Match Score */}
                                <div>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 font-medium">
                                                <Briefcase className="size-3.5 shrink-0" />
                                                <span>Pilihan Rekomendasi #{index + 1}</span>
                                            </div>
                                            <h3 className="mt-1 text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                                {item.job_title}
                                            </h3>
                                        </div>

                                        {/* Match Score Badge */}
                                        <div
                                            className={`flex flex-col items-end rounded-lg border px-2.5 py-1 text-right ${getScoreBadgeColor(
                                                item.match_score
                                            )}`}
                                        >
                                            <span className="text-base font-extrabold leading-none">
                                                {item.match_score}%
                                            </span>
                                            <span className="text-[10px] font-medium leading-tight opacity-90">
                                                {item.match_level || 'Cocok'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Attribute Badges */}
                                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                                        {item.career_level && (
                                            <Badge
                                                variant="secondary"
                                                className="text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                                            >
                                                {item.career_level}
                                            </Badge>
                                        )}
                                        {item.work_mode && (
                                            <Badge
                                                variant="secondary"
                                                className="text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                                            >
                                                {item.work_mode}
                                            </Badge>
                                        )}
                                        {item.salary_estimate && (
                                            <Badge
                                                variant="outline"
                                                className="text-[11px] font-medium border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30"
                                            >
                                                <DollarSign className="size-3 -ml-0.5 inline" />
                                                {item.salary_estimate}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Match Reason */}
                                    <div className="mt-3.5 rounded-lg bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300">
                                        <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1 flex items-center gap-1.5">
                                            <CheckCircle2 className="size-3.5 text-emerald-500" />
                                            Alasan Kecocokan Profil:
                                        </p>
                                        <p>{item.match_reason}</p>
                                    </div>

                                    {/* Matched Skills */}
                                    {item.matched_skills && item.matched_skills.length > 0 && (
                                        <div className="mt-3">
                                            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                                                Skill yang Sudah Cocok:
                                            </span>
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {item.matched_skills.map((skill, sIdx) => (
                                                    <span
                                                        key={sIdx}
                                                        className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300"
                                                    >
                                                        <CheckCircle2 className="size-2.5 text-emerald-600 dark:text-emerald-400" />
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Skills to Highlight / Gap */}
                                    {item.skills_to_highlight && item.skills_to_highlight.length > 0 && (
                                        <div className="mt-2.5">
                                            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                                                Disarankan Ditonjolkan / Dipelajari:
                                            </span>
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {item.skills_to_highlight.map((skill, sIdx) => (
                                                    <span
                                                        key={sIdx}
                                                        className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:text-purple-300"
                                                    >
                                                        <Zap className="size-2.5 text-purple-600 dark:text-purple-400" />
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Bottom Actions & Direct Portal Links */}
                                <div className="mt-5 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                                    {/* Multi-portal Search Buttons */}
                                    <div className="mb-3">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1.5">
                                            Cari Lowongan Langsung:
                                        </span>
                                        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                                            {item.search_links?.linkedin && (
                                                <a
                                                    href={item.search_links.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1.5 text-[11px] font-medium text-neutral-700 transition hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                                    title="Cari di LinkedIn Jobs"
                                                >
                                                    <span>LinkedIn</span>
                                                    <ArrowUpRight className="size-3" />
                                                </a>
                                            )}
                                            {item.search_links?.jobstreet && (
                                                <a
                                                    href={item.search_links.jobstreet}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1.5 text-[11px] font-medium text-neutral-700 transition hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                                    title="Cari di Jobstreet Indonesia"
                                                >
                                                    <span>Jobstreet</span>
                                                    <ArrowUpRight className="size-3" />
                                                </a>
                                            )}
                                            {item.search_links?.glints && (
                                                <a
                                                    href={item.search_links.glints}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1.5 text-[11px] font-medium text-neutral-700 transition hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                                    title="Cari di Glints"
                                                >
                                                    <span>Glints</span>
                                                    <ArrowUpRight className="size-3" />
                                                </a>
                                            )}
                                            {item.search_links?.kalibrr && (
                                                <a
                                                    href={item.search_links.kalibrr}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1.5 text-[11px] font-medium text-neutral-700 transition hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                                    title="Cari di Kalibrr"
                                                >
                                                    <span>Kalibrr</span>
                                                    <ArrowUpRight className="size-3" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Button: Create CV tailored for this position */}
                                    <Button
                                        onClick={() => handleCreateCvForJob(item.job_title)}
                                        disabled={isGeneratingCv}
                                        variant="default"
                                        size="sm"
                                        className="w-full gap-2 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 font-medium text-xs shadow-xs"
                                    >
                                        {isGeneratingCv ? (
                                            <>
                                                <Loader2 className="size-3.5 animate-spin" />
                                                <span>Menyiapkan CV Baru...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FileText className="size-3.5" />
                                                <span>Buat CV untuk Posisi Ini</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
