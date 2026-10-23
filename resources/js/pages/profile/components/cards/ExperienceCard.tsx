import React from 'react';
import { Briefcase, Building2, Calendar, MapPin, Edit3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { UserExperienceItem } from '@/types/profile';

interface ExperienceCardProps {
    experiences: UserExperienceItem[];
    totalExperience: string;
    onEdit: () => void;
}

export function ExperienceCard({
    experiences = [],
    totalExperience,
    onEdit,
}: ExperienceCardProps) {
    return (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs transition-all dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between">
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                            <Briefcase className="size-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                <span>Riwayat Pengalaman Kerja</span>
                                <Badge variant="secondary" className="text-[11px] font-normal py-0">
                                    {experiences.length} Posisi
                                </Badge>
                            </h3>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        className="text-xs text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/40 gap-1.5 h-8"
                    >
                        <Edit3 className="size-3.5" />
                        <span>Edit</span>
                    </Button>
                </div>

                {/* Subtitle with total experience */}
                <div className="text-xs text-neutral-500 flex items-center gap-1.5">
                    <span>Total Durasi Kerja:</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {totalExperience || 'Belum ada data'}
                    </span>
                </div>

                {/* Timeline content */}
                {experiences.length === 0 ? (
                    <div className="py-8 text-center rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
                        <p className="text-xs text-neutral-400 mb-2">
                            Belum ada riwayat pengalaman kerja yang dicatat.
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onEdit}
                            className="rounded-xl text-xs gap-1.5"
                        >
                            <Plus className="size-3.5" />
                            Tambah Pengalaman
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4 pt-1">
                        {experiences.map((exp, idx) => (
                            <div
                                key={exp.id || idx}
                                className="relative pl-5 border-l-2 border-sky-500/30 dark:border-sky-500/20 space-y-1.5 group"
                            >
                                {/* Bullet indicator on the line */}
                                <div className="absolute -left-1.5 top-1 size-3 rounded-full border-2 border-white bg-sky-500 dark:border-neutral-900" />

                                <div className="flex flex-wrap items-center justify-between gap-1">
                                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                        {exp.position}
                                    </h4>
                                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                                        <Calendar className="size-3 text-neutral-400" />
                                        <span>
                                            {exp.start_date} s/d{' '}
                                            {exp.is_current ? (
                                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                    Sekarang
                                                </span>
                                            ) : (
                                                exp.end_date || '-'
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-3 text-xs text-neutral-600 dark:text-neutral-400">
                                    <div className="flex items-center gap-1 font-medium">
                                        <Building2 className="size-3 text-neutral-400" />
                                        <span>{exp.company}</span>
                                    </div>
                                    {exp.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="size-3 text-rose-500/70" />
                                            <span>{exp.location}</span>
                                        </div>
                                    )}
                                </div>

                                {exp.description && (
                                    <div className="pt-1 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                                        {Array.isArray(exp.description)
                                            ? exp.description.map((line) => line.trim()).filter(Boolean).map((line) => (line.startsWith('•') ? line : `• ${line}`)).join('\n')
                                            : exp.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
