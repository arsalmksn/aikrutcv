import React, { useState } from 'react';
import {
    GraduationCap,
    School,
    BookOpen,
    Calendar,
    Award,
    Plus,
    Save,
    Check,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UserEducationItem, UserProfileData } from '@/types/profile';

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

export function EducationSection({
    profile,
    onSaveSection,
}: EducationSectionProps) {
    const [educations, setEducations] = useState<UserEducationItem[]>(
        profile.educations?.length ? profile.educations : []
    );

    const [saving, setSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
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

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        educations.forEach((edu, idx) => {
            if (!edu.institution?.trim()) {
                newErrors[`institution_${idx}`] = 'Nama institusi / universitas wajib diisi.';
            }
            if (!edu.degree?.trim()) {
                newErrors[`degree_${idx}`] = 'Jenjang pendidikan wajib dipilih.';
            }
            if (edu.start_date && !/^\d{4}(-\d{2})?$/.test(edu.start_date)) {
                newErrors[`start_date_${idx}`] = 'Format tahun atau bulan (YYYY atau YYYY-MM).';
            }
            if (edu.end_date && !/^\d{4}(-\d{2})?$/.test(edu.end_date)) {
                newErrors[`end_date_${idx}`] = 'Format tahun atau bulan (YYYY atau YYYY-MM).';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSaving(true);
        setSavedSuccess(false);

        const sanitized = educations.map((edu, idx) => ({
            ...edu,
            sort_order: idx,
        }));

        const success = await onSaveSection('educations', {
            educations: sanitized,
        });

        setSaving(false);
        if (success) {
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4 dark:border-neutral-800">
                <div>
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        Riwayat Pendidikan
                    </h2>
                    <p className="text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
                        Data pendidikan formal maupun non-formal. Pendidikan teratas otomatis dijadikan sebagai kartu <span className="font-semibold text-neutral-800 dark:text-neutral-200">Latest Education</span> di profil.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddEducation}
                        className="rounded-xl border-dashed gap-1.5"
                    >
                        <Plus className="size-4" />
                        Tambah Pendidikan
                    </Button>
                    <Button
                        type="submit"
                        disabled={saving}
                        className="bg-sky-600 hover:bg-sky-700 text-white gap-2 font-medium shadow-xs"
                    >
                        {saving ? (
                            <>Menyimpan...</>
                        ) : savedSuccess ? (
                            <>
                                <Check className="size-4 text-white" />
                                Tersimpan
                            </>
                        ) : (
                            <>
                                <Save className="size-4" />
                                Simpan Pendidikan
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {educations.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-12 text-center dark:border-neutral-800">
                    <div className="rounded-full bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                        <GraduationCap className="size-6" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Belum ada riwayat pendidikan
                    </h3>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        Tambahkan riwayat studi perguruan tinggi atau sekolah menengah Anda.
                    </p>
                    <Button
                        type="button"
                        onClick={handleAddEducation}
                        className="mt-4 gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs"
                    >
                        <Plus className="size-3.5" />
                        Tambah Pendidikan Sekarang
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {educations.map((edu, idx) => (
                        <div
                            key={idx}
                            className="relative rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs transition-all dark:border-neutral-800 dark:bg-neutral-900/60 space-y-4"
                        >
                            {/* Card Header & Delete Button */}
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                                <div className="flex items-center gap-2">
                                    <span className="flex size-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                        {idx + 1}
                                    </span>
                                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                        {edu.institution
                                            ? `${edu.degree || 'Studi'} - ${edu.institution}`
                                            : `Entri Pendidikan #${idx + 1}`}
                                    </span>
                                    {idx === 0 && (
                                        <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                                            Pendidikan Terakhir
                                        </span>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveEducation(idx)}
                                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40"
                                >
                                    <Trash2 className="size-4" />
                                    <span className="hidden sm:inline text-xs">Hapus</span>
                                </Button>
                            </div>

                            {/* Inputs Grid */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                {/* Institution */}
                                <div className="space-y-1.5 md:col-span-2">
                                    <Label className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                        <School className="size-3 text-neutral-400" />
                                        Nama Institusi / Universitas / Sekolah *
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
                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                        <GraduationCap className="size-3 text-neutral-400" />
                                        Jenjang Pendidikan *
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
                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                        <BookOpen className="size-3 text-neutral-400" />
                                        Jurusan / Program Studi
                                    </Label>
                                    <Input
                                        value={edu.major}
                                        onChange={(e) =>
                                            handleFieldChange(idx, 'major', e.target.value)
                                        }
                                        placeholder="Contoh: Teknik Informatika / Ilmu Komputer"
                                        className="rounded-xl text-xs sm:text-sm"
                                    />
                                </div>

                                {/* Start Date / Year */}
                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                        <Calendar className="size-3 text-neutral-400" />
                                        Tahun / Bulan Mulai
                                    </Label>
                                    <Input
                                        value={edu.start_date}
                                        onChange={(e) =>
                                            handleFieldChange(idx, 'start_date', e.target.value)
                                        }
                                        placeholder="Contoh: 2020 atau 2020-08"
                                        className="rounded-xl font-mono text-xs sm:text-sm"
                                    />
                                    {errors[`start_date_${idx}`] && (
                                        <p className="text-xs text-rose-500">
                                            {errors[`start_date_${idx}`]}
                                        </p>
                                    )}
                                </div>

                                {/* End Date / Year */}
                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                        <Calendar className="size-3 text-neutral-400" />
                                        Tahun / Bulan Lulus
                                    </Label>
                                    <Input
                                        value={edu.end_date}
                                        onChange={(e) =>
                                            handleFieldChange(idx, 'end_date', e.target.value)
                                        }
                                        placeholder="Kosongkan jika sedang studi"
                                        className="rounded-xl font-mono text-xs sm:text-sm"
                                    />
                                    {errors[`end_date_${idx}`] && (
                                        <p className="text-xs text-rose-500">
                                            {errors[`end_date_${idx}`]}
                                        </p>
                                    )}
                                </div>

                                {/* GPA */}
                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                        <Award className="size-3 text-amber-500" />
                                        IPK / Nilai Akhir (Opsional)
                                    </Label>
                                    <Input
                                        value={edu.gpa}
                                        onChange={(e) =>
                                            handleFieldChange(idx, 'gpa', e.target.value)
                                        }
                                        placeholder="Contoh: 3.82 / 4.00"
                                        className="rounded-xl text-xs sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </form>
    );
}
