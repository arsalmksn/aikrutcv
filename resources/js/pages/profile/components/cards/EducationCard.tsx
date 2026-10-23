import React from 'react';
import { GraduationCap, School, Calendar, Award, Edit3, Plus } from 'lucide-react';
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
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                            <GraduationCap className="size-4" />
                        </div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <span>Riwayat Pendidikan</span>
                            <Badge variant="secondary" className="text-[11px] font-normal py-0">
                                {educations.length} Riwayat
                            </Badge>
                        </h3>
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

                {/* Content */}
                {educations.length === 0 ? (
                    <div className="py-8 text-center rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
                        <p className="text-xs text-neutral-400 mb-2">
                            Belum ada riwayat pendidikan yang dicatat.
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onEdit}
                            className="rounded-xl text-xs gap-1.5"
                        >
                            <Plus className="size-3.5" />
                            Tambah Pendidikan
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4 pt-1">
                        {educations.map((edu, idx) => (
                            <div
                                key={edu.id || idx}
                                className="relative pl-5 border-l-2 border-indigo-500/30 dark:border-indigo-500/20 space-y-1.5"
                            >
                                <div className="absolute -left-1.5 top-1 size-3 rounded-full border-2 border-white bg-indigo-500 dark:border-neutral-900" />

                                <div className="flex flex-wrap items-center justify-between gap-1">
                                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                        {edu.institution}
                                    </h4>
                                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                                        <Calendar className="size-3 text-neutral-400" />
                                        <span>
                                            {edu.start_date || '-'} s/d {edu.end_date || 'Sekarang'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                        {edu.degree}
                                    </span>
                                    {edu.major && (
                                        <>
                                            <span className="text-neutral-300">•</span>
                                            <span>{edu.major}</span>
                                        </>
                                    )}
                                    {edu.gpa && (
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 ml-auto"
                                        >
                                            <Award className="size-2.5 mr-1" />
                                            IPK: {edu.gpa}
                                        </Badge>
                                    )}
                                </div>

                                {edu.description && (
                                    <div className="pt-1 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                                        {edu.description}
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
