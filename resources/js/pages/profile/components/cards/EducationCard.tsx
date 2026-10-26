import React from 'react';
import {
    GraduationCap,
    School,
    Calendar,
    Award,
    Edit3,
    Plus,
    BookOpen,
    CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { UserEducationItem } from '@/types/profile';

interface EducationCardProps {
    educations: UserEducationItem[];
    onEdit: () => void;
}

export function EducationCard({
    educations = [],
    onEdit,
}: EducationCardProps) {
    return (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs transition-all dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between">
            <div className="space-y-4">
                {/* Header with Title and Action Button */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 border border-indigo-100/80 dark:border-indigo-900/50 shadow-2xs">
                            <GraduationCap className="size-4.5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                    Riwayat Pendidikan
                                </h3>
                                <Badge
                                    variant="secondary"
                                    className="text-[11px] font-semibold py-0 px-2 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40"
                                >
                                    {educations.length} Riwayat
                                </Badge>
                            </div>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                Jenjang studi formal & kualifikasi akademis
                            </p>
                        </div>
                    </div>
                    {educations.length > 0 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onEdit}
                            className="text-xs text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/40 gap-1.5 h-8 font-medium rounded-xl"
                        >
                            <Edit3 className="size-3.5" />
                            <span>Kelola Pendidikan</span>
                        </Button>
                    )}
                </div>

                {/* Content: List or Empty State */}
                {educations.length === 0 ? (
                    <div className="py-10 px-4 text-center rounded-2xl border-2 border-dashed border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/30">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-400 mb-3">
                            <GraduationCap className="size-6" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                            Belum Ada Riwayat Pendidikan
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto mt-1 mb-4">
                            Cantumkan perguruan tinggi, sekolah, atau program studi terakhir Anda untuk memperkuat profil CV.
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onEdit}
                            className="rounded-xl text-xs gap-1.5 border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950/50 font-semibold shadow-2xs"
                        >
                            <Plus className="size-3.5" />
                            <span>Tambah Pendidikan</span>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3 pt-1">
                        {educations.map((edu, idx) => {
                            const isLatest = idx === 0;
                            const isPresent =
                                !edu.end_date ||
                                edu.end_date.toLowerCase() === 'sekarang' ||
                                edu.end_date.toLowerCase() === 'saat ini';

                            return (
                                <div
                                    key={edu.id || idx}
                                    className="group relative rounded-xl border border-neutral-200/80 bg-neutral-50/40 p-4 transition-all duration-200 hover:border-indigo-300 hover:bg-white hover:shadow-xs dark:border-neutral-800 dark:bg-neutral-850/40 dark:hover:border-indigo-800/80 dark:hover:bg-neutral-850 space-y-2.5"
                                >
                                    {/* Top Row: Institution + Degree + Period Badge */}
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                        <div className="flex items-start gap-3">
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-2xs border border-neutral-200/60 dark:bg-neutral-800 dark:text-indigo-400 dark:border-neutral-700/60">
                                                <School className="size-4.5" />
                                            </div>
                                            <div className="space-y-0.5 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 leading-snug">
                                                        {edu.institution}
                                                    </h4>
                                                    {isLatest && (
                                                        <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                                                            <CheckCircle2 className="size-2.5" />
                                                            Pendidikan Terakhir
                                                        </span>
                                                    )}
                                                    {isPresent && !isLatest && (
                                                        <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                                            Sedang Studi
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 flex-wrap">
                                                    <span>{edu.degree}</span>
                                                    {edu.major && (
                                                        <>
                                                            <span className="text-neutral-300 dark:text-neutral-600">•</span>
                                                            <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                                                                {edu.major}
                                                            </span>
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Period & GPA */}
                                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0 pl-12 sm:pl-0">
                                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400 bg-white/80 dark:bg-neutral-800/80 px-2.5 py-1 rounded-lg border border-neutral-200/60 dark:border-neutral-700/60">
                                                <Calendar className="size-3 text-neutral-400" />
                                                <span>
                                                    {edu.start_date || '-'} —{' '}
                                                    {isPresent ? (
                                                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                            Sekarang
                                                        </span>
                                                    ) : (
                                                        edu.end_date
                                                    )}
                                                </span>
                                            </div>
                                            {edu.gpa && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[10px] font-bold bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40"
                                                >
                                                    <Award className="size-2.5 mr-1 text-amber-500" />
                                                    IPK: {edu.gpa}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description / Activities */}
                                    {edu.description && (
                                        <div className="pt-1.5 pl-12 sm:pl-12">
                                            <div className="rounded-lg bg-white/70 p-2.5 text-xs text-neutral-600 dark:bg-neutral-800/50 dark:text-neutral-300 leading-relaxed border border-neutral-100 dark:border-neutral-800 whitespace-pre-line">
                                                {edu.description}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
