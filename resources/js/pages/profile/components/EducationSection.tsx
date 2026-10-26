import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
    GraduationCap,
    School,
    BookOpen,
    Calendar,
    Award,
    Plus,
    Trash2,
    CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AiInlineEnhanceButton } from '@/components/ai/AiInlineEnhanceButton';
import type { UserEducationItem, UserProfileData, ProfileSectionRef } from '@/types/profile';

interface EducationSectionProps {
    profile: UserProfileData;
    onSaveSection: (section: string, payload: Partial<UserProfileData>) => Promise<boolean>;
}

const DEGREE_OPTIONS = [
    'SMA / SMK Sederajat',
    'Diploma 3 (D3)',
    'Diploma 4 (D4)',
    'Sarjana 1 (S1)',
    'Magister / Master (S2)',
    'Doktor (S3)',
    'Bootcamp / Non-Formal',
];

export const EducationSection = forwardRef<ProfileSectionRef, EducationSectionProps>(
    function EducationSection({ profile, onSaveSection }, ref) {
        const [educations, setEducations] = useState<UserEducationItem[]>(
            profile.educations?.length ? profile.educations : []
        );

        const [errors, setErrors] = useState<Record<string, string>>({});

        const handleAddEducation = () => {
            setEducations((prev) => [
                ...prev,
                {
                    institution: '',
                    degree: 'Sarjana 1 (S1)',
                    major: '',
                    start_date: '',
                    end_date: '',
                    gpa: '',
                    description: '',
                    sort_order: prev.length,
                },
            ]);
        };

        const handleRemoveEducation = (index: number) => {
            setEducations((prev) => prev.filter((_, i) => i !== index));
        };

        const handleFieldChange = (
            index: number,
            field: keyof UserEducationItem,
            value: unknown
        ) => {
            setEducations((prev) => {
                const next = [...prev];
                next[index] = { ...next[index], [field]: value };
                return next;
            });
        };

        const handleToggleCurrentStudy = (index: number, isCurrentlyStudying: boolean) => {
            setEducations((prev) => {
                const next = [...prev];
                next[index] = {
                    ...next[index],
                    end_date: isCurrentlyStudying ? 'Sekarang' : '',
                };
                return next;
            });
        };

        const validate = (): boolean => {
            const newErrors: Record<string, string> = {};

            educations.forEach((edu, idx) => {
                if (!edu.institution?.trim()) {
                    newErrors[`institution_${idx}`] = 'Nama institusi / universitas wajib diisi.';
                }
                if (!edu.degree?.trim()) {
                    newErrors[`degree_${idx}`] = 'Jenjang pendidikan wajib dipilih.';
                }
                if (edu.start_date && !/^\d{4}(-\d{2})?$/.test(edu.start_date.trim())) {
                    newErrors[`start_date_${idx}`] = 'Gunakan format tahun (YYYY) atau tahun-bulan (YYYY-MM).';
                }
                const isPresent =
                    !edu.end_date ||
                    edu.end_date.toLowerCase() === 'sekarang' ||
                    edu.end_date.toLowerCase() === 'saat ini';

                if (edu.end_date && !isPresent && !/^\d{4}(-\d{2})?$/.test(edu.end_date.trim())) {
                    newErrors[`end_date_${idx}`] = 'Gunakan format tahun (YYYY) atau tahun-bulan (YYYY-MM).';
                }
            });

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        const handleSave = async (): Promise<boolean> => {
            if (!validate()) return false;

            const sanitized = educations.map((edu, idx) => ({
                ...edu,
                sort_order: idx,
                description: typeof edu.description === 'string' ? edu.description.trim() : null,
            }));

            return await onSaveSection('educations', {
                educations: sanitized,
            });
        };

        useImperativeHandle(ref, () => ({
            save: handleSave,
        }));

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            await handleSave();
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between gap-4 pb-1">
                    <div>
                        <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                            Daftar Riwayat Pendidikan ({educations.length})
                        </span>
                    </div>
                </div>

                {educations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-12 text-center dark:border-neutral-800">
                        <div className="rounded-full bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                            <GraduationCap className="size-6" />
                        </div>
                        <h3 className="mt-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                            Belum Ada Riwayat Pendidikan
                        </h3>
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                            Tambahkan riwayat studi perguruan tinggi atau sekolah menengah Anda.
                        </p>
                        <Button
                            type="button"
                            onClick={handleAddEducation}
                            className="mt-4 gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs cursor-pointer"
                        >
                            <Plus className="size-3.5" />
                            Tambah Pendidikan Sekarang
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {educations.map((edu, idx) => {
                            const isPresent =
                                edu.end_date?.toLowerCase() === 'sekarang' ||
                                edu.end_date?.toLowerCase() === 'saat ini';

                            return (
                                <div
                                    key={idx}
                                    className="relative rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs transition-all dark:border-neutral-800 dark:bg-neutral-900/60 space-y-4.5"
                                >
                                    {/* Card Header & Delete Button */}
                                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                                        <div className="flex items-center gap-2.5">
                                            <span className="flex size-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                                {idx + 1}
                                            </span>
                                            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                                {edu.institution
                                                    ? `${edu.degree || 'Studi'} — ${edu.institution}`
                                                    : `Entri Pendidikan #${idx + 1}`}
                                            </span>
                                            {idx === 0 && (
                                                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900">
                                                    Pendidikan Terakhir
                                                </span>
                                            )}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveEducation(idx)}
                                            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40 cursor-pointer h-8 px-2.5 rounded-lg"
                                        >
                                            <Trash2 className="size-3.5" />
                                            <span className="hidden sm:inline text-xs ml-1">Hapus</span>
                                        </Button>
                                    </div>

                                    {/* Row 1: Institusi, Jenjang, Jurusan */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                                        {/* Institution */}
                                        <div className="space-y-1.5 sm:col-span-5">
                                            <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                <School className="size-3.5 text-indigo-500" />
                                                Nama Institusi / Kampus / Sekolah *
                                            </Label>
                                            <Input
                                                value={edu.institution}
                                                onChange={(e) =>
                                                    handleFieldChange(idx, 'institution', e.target.value)
                                                }
                                                placeholder="Contoh: Universitas Indonesia"
                                                className="rounded-xl text-xs sm:text-sm"
                                            />
                                            {errors[`institution_${idx}`] && (
                                                <p className="text-xs text-rose-500">
                                                    {errors[`institution_${idx}`]}
                                                </p>
                                            )}
                                        </div>

                                        {/* Degree */}
                                        <div className="space-y-1.5 sm:col-span-3">
                                            <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                <GraduationCap className="size-3.5 text-indigo-500" />
                                                Jenjang Studi *
                                            </Label>
                                            <select
                                                value={edu.degree}
                                                onChange={(e) =>
                                                    handleFieldChange(idx, 'degree', e.target.value)
                                                }
                                                className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-xs sm:text-sm shadow-xs transition-colors dark:bg-neutral-900"
                                            >
                                                {DEGREE_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt}>
                                                        {opt}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Major */}
                                        <div className="space-y-1.5 sm:col-span-4">
                                            <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                <BookOpen className="size-3.5 text-indigo-500" />
                                                Jurusan / Program Studi
                                            </Label>
                                            <Input
                                                value={edu.major}
                                                onChange={(e) =>
                                                    handleFieldChange(idx, 'major', e.target.value)
                                                }
                                                placeholder="Contoh: Teknik Informatika"
                                                className="rounded-xl text-xs sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Row 2: Periode & GPA with Checkbox */}
                                    <div className="rounded-xl bg-neutral-50/70 dark:bg-neutral-850/50 p-3.5 border border-neutral-100 dark:border-neutral-800 space-y-3">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                            {/* Start Date */}
                                            <div className="space-y-1.5">
                                                <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                    <Calendar className="size-3.5 text-neutral-400" />
                                                    Tahun / Periode Mulai
                                                </Label>
                                                <Input
                                                    value={edu.start_date}
                                                    onChange={(e) =>
                                                        handleFieldChange(idx, 'start_date', e.target.value)
                                                    }
                                                    placeholder="Contoh: 2020 atau 2020-08"
                                                    className="rounded-xl bg-white dark:bg-neutral-900 font-mono text-xs sm:text-sm"
                                                />
                                                {errors[`start_date_${idx}`] && (
                                                    <p className="text-xs text-rose-500">
                                                        {errors[`start_date_${idx}`]}
                                                    </p>
                                                )}
                                            </div>

                                            {/* End Date */}
                                            <div className="space-y-1.5">
                                                <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                    <Calendar className="size-3.5 text-neutral-400" />
                                                    Tahun / Periode Lulus
                                                </Label>
                                                <Input
                                                    value={isPresent ? 'Sekarang' : edu.end_date}
                                                    disabled={isPresent}
                                                    onChange={(e) =>
                                                        handleFieldChange(idx, 'end_date', e.target.value)
                                                    }
                                                    placeholder="Contoh: 2024 atau 2024-07"
                                                    className={`rounded-xl font-mono text-xs sm:text-sm ${
                                                        isPresent
                                                            ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-semibold'
                                                            : 'bg-white dark:bg-neutral-900'
                                                    }`}
                                                />
                                                {errors[`end_date_${idx}`] && (
                                                    <p className="text-xs text-rose-500">
                                                        {errors[`end_date_${idx}`]}
                                                    </p>
                                                )}
                                            </div>

                                            {/* GPA */}
                                            <div className="space-y-1.5">
                                                <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                    <Award className="size-3.5 text-amber-500" />
                                                    Nilai Akhir / IPK (GPA)
                                                </Label>
                                                <Input
                                                    value={edu.gpa}
                                                    onChange={(e) =>
                                                        handleFieldChange(idx, 'gpa', e.target.value)
                                                    }
                                                    placeholder="Contoh: 3.85 / 4.00"
                                                    className="rounded-xl bg-white dark:bg-neutral-900 text-xs sm:text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Checkbox Masih Studi */}
                                        <div className="flex items-center gap-2 pt-1 border-t border-neutral-200/50 dark:border-neutral-800">
                                            <input
                                                id={`is_current_edu_${idx}`}
                                                type="checkbox"
                                                checked={isPresent}
                                                onChange={(e) =>
                                                    handleToggleCurrentStudy(idx, e.target.checked)
                                                }
                                                className="size-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                            />
                                            <label
                                                htmlFor={`is_current_edu_${idx}`}
                                                className="text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer select-none"
                                            >
                                                Saat ini saya masih menempuh studi di institusi ini
                                            </label>
                                        </div>
                                    </div>

                                    {/* Row 3: Deskripsi & Prestasi Akademis (Single Textarea + AI Enhance) */}
                                    <div className="space-y-2 pt-1">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                Aktivitas Kampus, Prestasi, atau Judul Tugas Akhir (Opsional)
                                            </Label>
                                            <AiInlineEnhanceButton
                                                type="education"
                                                currentText={edu.description || ''}
                                                context={{
                                                    institution: edu.institution,
                                                    degree: edu.degree,
                                                    field_of_study: edu.major,
                                                    major: edu.major,
                                                    gpa: edu.gpa,
                                                }}
                                                onApply={(enhancedText) =>
                                                    handleFieldChange(idx, 'description', enhancedText)
                                                }
                                            />
                                        </div>

                                        <textarea
                                            rows={3}
                                            value={edu.description || ''}
                                            onChange={(e) =>
                                                handleFieldChange(idx, 'description', e.target.value)
                                            }
                                            placeholder="Tuliskan catatan prestasi akademik, fokus riset, judul skripsi, atau aktivitas kepanitiaan kampus..."
                                            className="flex w-full rounded-xl border border-input bg-transparent px-3 py-2 text-xs sm:text-sm leading-relaxed shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none dark:bg-neutral-900"
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        <div className="pt-2 flex justify-center">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddEducation}
                                className="w-full sm:w-auto rounded-xl border-dashed gap-2 text-xs font-semibold hover:border-sky-500 hover:text-sky-600 py-3 cursor-pointer"
                            >
                                <Plus className="size-4" />
                                Tambah Riwayat Pendidikan Lainnya
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        );
    }
);
