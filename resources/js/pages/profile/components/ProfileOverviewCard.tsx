import React from 'react';
import { Link } from '@inertiajs/react';
import {
    Briefcase,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    User as UserIcon,
    FileText,
    CheckCircle2,
    Calendar,
    Sparkles,
    FileDown,
    Linkedin,
    UploadCloud,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { UserProfileData } from '@/types/profile';

interface ProfileOverviewCardProps {
    profile: UserProfileData;
    onOpenWizard: () => void;
    onEditSection: (section: string) => void;
    onOpenImportCv?: () => void;
}

export function ProfileOverviewCard({
    profile,
    onOpenWizard,
    onEditSection,
    onOpenImportCv,
}: ProfileOverviewCardProps) {
    const completeness = profile.completeness?.percentage ?? 0;
    const completedSections = profile.completeness?.completed_sections ?? {};

    // Get initials for avatar
    const initials = (profile.full_name || 'U')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('');

    return (
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs transition-all dark:border-neutral-800 dark:bg-neutral-900">
            {/* Top decorative gradient banner */}
            <div className="h-28 w-full bg-linear-to-r from-sky-500 via-indigo-500 to-purple-600 sm:h-32">
                <div className="flex h-full items-center justify-end px-6 opacity-20">
                    <Sparkles className="size-20 text-white" />
                </div>
            </div>

            <div className="relative px-5 pb-6 sm:px-8">
                {/* Avatar and Primary Info */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between -mt-12 sm:-mt-14 mb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                        <div className="flex size-24 sm:size-28 items-center justify-center rounded-2xl border-4 border-white bg-linear-to-br from-sky-600 to-indigo-700 text-2xl font-bold text-white shadow-md dark:border-neutral-900">
                            {initials || <UserIcon className="size-10 text-white" />}
                        </div>
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl dark:text-neutral-50">
                                    {profile.full_name || 'Pengguna Tanpa Nama'}
                                </h1>
                                {completeness >= 80 && (
                                    <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:bg-emerald-500/20 dark:text-emerald-300">
                                        <CheckCircle2 className="mr-1 size-3.5" />
                                        Profil Lengkap
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                {profile.field_of_interest?.length
                                    ? profile.field_of_interest.join(' • ')
                                    : 'Master Profile & Single Source of Truth CV'}
                            </p>
                        </div>
                    </div>

                    {/* Actions and Completeness */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3 sm:self-end">
                        {onOpenImportCv && (
                            <Button
                                type="button"
                                onClick={onOpenImportCv}
                                className="rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white px-3.5 py-2 text-xs sm:text-sm font-semibold shadow-md shadow-sky-500/20 gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
                            >
                                <UploadCloud className="size-4" />
                                <span>Import CV</span>
                            </Button>
                        )}

                        <Button
                            type="button"
                            onClick={onOpenWizard}
                            variant="outline"
                            className="rounded-xl border-sky-200 bg-sky-50/70 hover:bg-sky-100 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300 gap-1.5 text-xs sm:text-sm font-semibold shadow-xs"
                        >
                            <Sparkles className="size-4" />
                            <span>Edit Profil (Wizard)</span>
                        </Button>

                        <Link
                            href="/cv/templates?source=profile"
                            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 text-xs sm:text-sm font-semibold shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-95"
                        >
                            <FileDown className="size-4" />
                            <span>Export PDF / Buat CV</span>
                        </Link>

                        <div className="flex flex-col gap-1.5 sm:items-end min-w-[160px] sm:min-w-[180px]">
                            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                                <span>Kelengkapan</span>
                                <span className="text-sky-600 dark:text-sky-400 font-bold">{completeness}%</span>
                            </div>
                            <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                <div
                                    className="h-full rounded-full bg-linear-to-r from-sky-500 to-indigo-600 transition-all duration-500"
                                    style={{ width: `${completeness}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Info & Contacts Grid */}
                <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 border-t border-neutral-100 pt-4 text-xs text-neutral-600 sm:text-sm dark:border-neutral-800 dark:text-neutral-400">
                    {profile.email && (
                        <div className="flex items-center gap-1.5">
                            <Mail className="size-4 text-neutral-400" />
                            <span>{profile.email}</span>
                        </div>
                    )}
                    {profile.whatsapp_number && (
                        <div className="flex items-center gap-1.5">
                            <Phone className="size-4 text-emerald-500" />
                            <a
                                href={`https://wa.me/${profile.whatsapp_number.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                            >
                                {profile.whatsapp_number}
                            </a>
                        </div>
                    )}
                    {profile.location && (
                        <div className="flex items-center gap-1.5">
                            <MapPin className="size-4 text-rose-500" />
                            <span>{profile.location}</span>
                        </div>
                    )}
                    {(profile.age || profile.gender) && (
                        <div className="flex items-center gap-1.5">
                            <Calendar className="size-4 text-neutral-400" />
                            <span>
                                {[
                                    profile.age ? `${profile.age} tahun` : null,
                                    profile.gender || null,
                                ]
                                    .filter(Boolean)
                                    .join(', ')}
                            </span>
                        </div>
                    )}
                    {profile.linkedin_url && (
                        <div className="flex items-center gap-1.5">
                            <Linkedin className="size-4 text-sky-600" />
                            <a
                                href={profile.linkedin_url.startsWith('http') ? profile.linkedin_url : `https://${profile.linkedin_url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-sky-600 hover:underline dark:text-sky-400"
                            >
                                LinkedIn
                            </a>
                        </div>
                    )}
                </div>

                {/* Key Summary Cards: Experience, Latest Education, Files */}
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {/* Total Experience Card */}
                    <div className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/70 p-3.5 transition-colors hover:border-neutral-200 dark:border-neutral-800/80 dark:bg-neutral-800/40">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
                            <Briefcase className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Total Pengalaman Kerja</p>
                            <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                {profile.total_experience || 'Belum ada data'}
                            </p>
                        </div>
                    </div>

                    {/* Latest Education Card */}
                    <div className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/70 p-3.5 transition-colors hover:border-neutral-200 dark:border-neutral-800/80 dark:bg-neutral-800/40">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                            <GraduationCap className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Pendidikan Terakhir</p>
                            <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                {profile.latest_education
                                    ? `${profile.latest_education.degree} ${profile.latest_education.institution}`
                                    : 'Belum ada data'}
                            </p>
                        </div>
                    </div>

                    {/* Uploaded Files Count Card */}
                    <div className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/70 p-3.5 transition-colors hover:border-neutral-200 dark:border-neutral-800/80 dark:bg-neutral-800/40">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                            <FileText className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Berkas Terlampir</p>
                            <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                {profile.resumes?.length || 0} Resume • {profile.attachments?.length || 0} Portofolio
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section Completeness Chips */}
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    {[
                        { id: 'profile', label: 'Identitas', done: completedSections.profile },
                        { id: 'summary', label: 'Ringkasan', done: completedSections.summary },
                        { id: 'preferences', label: 'Preferensi Kerja', done: completedSections.preferences },
                        { id: 'experiences', label: 'Pengalaman', done: completedSections.experiences },
                        { id: 'educations', label: 'Pendidikan', done: completedSections.educations },
                        { id: 'skills', label: 'Keahlian/Tools', done: completedSections.skills },
                    ].map((sec) => (
                        <button
                            key={sec.id}
                            type="button"
                            onClick={() => onEditSection(sec.id)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                                sec.done
                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
                            }`}
                        >
                            <span
                                className={`size-1.5 rounded-full ${
                                    sec.done ? 'bg-emerald-500' : 'bg-neutral-400'
                                }`}
                            />
                            {sec.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
