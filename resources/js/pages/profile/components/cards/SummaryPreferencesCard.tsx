import React from 'react';
import { Target, Briefcase, DollarSign, Edit3, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { UserProfileData } from '@/types/profile';

interface SummaryPreferencesCardProps {
    profile: UserProfileData;
    onEdit: () => void;
}

export function SummaryPreferencesCard({
    profile,
    onEdit,
}: SummaryPreferencesCardProps) {
    const salary = profile.expected_monthly_salary;
    const salaryFormatted = (() => {
        if (!salary) return null;
        if (salary.range_text && salary.range_text.trim()) {
            return salary.range_text.trim();
        }
        if (salary.amount && Number(salary.amount) > 0) {
            return Number(salary.amount).toLocaleString('id-ID');
        }
        return null;
    })();

    return (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs transition-all dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between">
            <div className="space-y-4">
                {/* Header with Title and Edit Button */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                            <Target className="size-4" />
                        </div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                            Ringkasan & Preferensi Karier
                        </h3>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        className="text-xs text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/40 gap-1.5 h-8 font-medium"
                    >
                        <Edit3 className="size-3.5" />
                        <span>Edit Preferensi</span>
                    </Button>
                </div>

                {/* About Me snippet */}
                <div>
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                        Tentang Saya
                    </h4>
                    {profile.about_me ? (
                        <div className="relative rounded-xl bg-neutral-50/70 p-3.5 text-xs sm:text-sm text-neutral-700 leading-relaxed dark:bg-neutral-800/40 dark:text-neutral-300">
                            <Quote className="size-3.5 text-neutral-400 absolute top-2.5 right-2.5 opacity-40" />
                            <p className="whitespace-pre-line">{profile.about_me}</p>
                        </div>
                    ) : (
                        <p className="text-xs text-neutral-400 italic">
                            Belum ada ringkasan profesional. Klik 'Edit' untuk menambahkan.
                        </p>
                    )}
                </div>

                {/* Field of Interest */}
                <div>
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                        Bidang Minat Pekerjaan
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                        {profile.field_of_interest?.length ? (
                            profile.field_of_interest.map((interest) => (
                                <Badge
                                    key={interest}
                                    variant="secondary"
                                    className="rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 text-xs font-medium"
                                >
                                    {interest}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-xs text-neutral-400 italic">
                                Belum ada bidang minat ditentukan.
                            </span>
                        )}
                    </div>
                </div>

                {/* Employment Type & Salary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-800/30">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
                            <Briefcase className="size-3.5 text-indigo-500" />
                            <span>Tipe Pekerjaan</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {profile.employment_type?.length ? (
                                profile.employment_type.map((type) => (
                                    <span
                                        key={type}
                                        className="text-xs font-semibold text-neutral-800 dark:text-neutral-200"
                                    >
                                        {type}
                                        <span className="text-neutral-300 dark:text-neutral-600 last:hidden mr-1">
                                            ,
                                        </span>
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-neutral-400">Tidak ada</span>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-800/30">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
                            <DollarSign className="size-3.5 text-emerald-500" />
                            <span>Ekspektasi Gaji</span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100">
                            {salaryFormatted ? (
                                salaryFormatted
                            ) : (
                                <span className="font-normal text-neutral-400">Belum ditentukan</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
