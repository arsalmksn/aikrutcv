import React, { useState } from 'react';
import {
    Briefcase,
    Building2,
    Calendar,
    Check,
    MapPin,
    Plus,
    Save,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AiInlineEnhanceButton } from '@/components/ai/AiInlineEnhanceButton';
import type { UserExperienceItem, UserProfileData } from '@/types/profile';

interface ExperienceSectionProps {
    profile: UserProfileData;
    onSaveSection: (section: string, payload: Partial<UserProfileData>) => Promise<boolean>;
}

export function ExperienceSection({
    profile,
    onSaveSection,
}: ExperienceSectionProps) {
    const [experiences, setExperiences] = useState<UserExperienceItem[]>(() => {
        return (profile.experiences || []).map((exp) => ({
            ...exp,
            description: Array.isArray(exp.description)
                ? exp.description.join('\n')
                : (exp.description || ''),
        }));
    });

    const [saving, setSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleAddExperience = () => {
        setExperiences((prev) => [
            ...prev,
            {
                company: '',
                position: '',
                location: '',
                start_date: '',
                end_date: '',
                is_current: false,
                description: '',
                sort_order: prev.length,
            },
        ]);
    };

    const handleRemoveExperience = (index: number) => {
        setExperiences((prev) => prev.filter((_, i) => i !== index));
    };

    const handleFieldChange = (
        index: number,
        field: keyof UserExperienceItem,
        value: unknown
    ) => {
        setExperiences((prev) => {
            const next = [...prev];
            const item = { ...next[index], [field]: value };

            if (field === 'is_current' && value === true) {
                item.end_date = '';
            }

            next[index] = item;
            return next;
        });
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        experiences.forEach((exp, idx) => {
            if (!exp.company?.trim()) {
                newErrors[`company_${idx}`] = 'Nama perusahaan wajib diisi.';
            }
            if (!exp.position?.trim()) {
                newErrors[`position_${idx}`] = 'Posisi / jabatan wajib diisi.';
            }
            if (!exp.start_date || !/^\d{4}-\d{2}$/.test(exp.start_date)) {
                newErrors[`start_date_${idx}`] = 'Format tanggal mulai harus YYYY-MM.';
            }
            if (
                !exp.is_current &&
                exp.end_date &&
                !/^\d{4}-\d{2}$/.test(exp.end_date)
            ) {
                newErrors[`end_date_${idx}`] = 'Format tanggal selesai harus YYYY-MM.';
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

        // Sanitize experiences descriptions
        const sanitized = experiences.map((exp, idx) => ({
            ...exp,
            sort_order: idx,
            description: typeof exp.description === 'string' ? exp.description.trim() : null,
        }));

        const success = await onSaveSection('experiences', {
            experiences: sanitized,
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
                        Riwayat Pengalaman Kerja
                    </h2>
                    <p className="text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
                        Catat seluruh riwayat karier profesional Anda. Tanggal diisi dengan format <span className="font-mono text-neutral-700 dark:text-neutral-300">YYYY-MM</span>.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddExperience}
                        className="rounded-xl border-dashed gap-1.5"
                    >
                        <Plus className="size-4" />
                        Tambah Posisi
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
                                Simpan Riwayat
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {experiences.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-12 text-center dark:border-neutral-800">
                    <div className="rounded-full bg-sky-50 p-3 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                        <Briefcase className="size-6" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Belum ada pengalaman kerja
                    </h3>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        Tambahkan riwayat magang, freelance, atau pekerjaan tetap Anda.
                    </p>
                    <Button
                        type="button"
                        onClick={handleAddExperience}
                        className="mt-4 gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs"
                    >
                        <Plus className="size-3.5" />
                        Tambah Pengalaman Sekarang
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {experiences.map((exp, idx) => (
                        <div
                            key={idx}
                            className="relative rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs transition-all dark:border-neutral-800 dark:bg-neutral-900/60 space-y-4"
                        >
                            {/* Card Header & Delete Button */}
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                                <div className="flex items-center gap-2">
                                    <span className="flex size-6 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                                        {idx + 1}
                                    </span>
                                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                        {exp.position || exp.company
                                            ? `${exp.position || 'Posisi'} at ${exp.company || 'Perusahaan'}`
                                            : `Entri Pengalaman #${idx + 1}`}
                                    </span>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveExperience(idx)}
                                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40"
                                >
                                    <Trash2 className="size-4" />
                                    <span className="hidden sm:inline text-xs">Hapus</span>
                                </Button>
                            </div>

                            {/* Inputs Grid */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                {/* Position */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                        Posisi / Jabatan *
                                    </Label>
                                    <Input
                                        value={exp.position}
                                        onChange={(e) =>
                                            handleFieldChange(idx, 'position', e.target.value)
                                        }
                                        placeholder="Contoh: Senior Frontend Developer"
                                        className="rounded-xl text-xs sm:text-sm"
                                    />
                                    {errors[`position_${idx}`] && (
                                        <p className="text-xs text-rose-500">
                                            {errors[`position_${idx}`]}
                                        </p>
                                    )}
                                </div>

                                {/* Company */}
                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                        <Building2 className="size-3 text-neutral-400" />
                                        Nama Perusahaan / Organisasi *
                                    </Label>
                                    <Input
                                        value={exp.company}
                                        onChange={(e) =>
                                            handleFieldChange(idx, 'company', e.target.value)
                                        }
                                        placeholder="Contoh: PT Teknologi Bangsa"
                                        className="rounded-xl text-xs sm:text-sm"
                                    />
                                    {errors[`company_${idx}`] && (
                                        <p className="text-xs text-rose-500">
                                            {errors[`company_${idx}`]}
                                        </p>
                                    )}
                                </div>

                                {/* Location */}
                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                        <MapPin className="size-3 text-rose-500" />
                                        Lokasi Kerja (Opsional)
                                    </Label>
                                    <Input
                                        value={exp.location || ''}
                                        onChange={(e) =>
                                            handleFieldChange(idx, 'location', e.target.value)
                                        }
                                        placeholder="Contoh: Jakarta (Remote)"
                                        className="rounded-xl text-xs sm:text-sm"
                                    />
                                </div>

                                {/* Start Date */}
                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                        <Calendar className="size-3 text-neutral-400" />
                                        Bulan Mulai (YYYY-MM) *
                                    </Label>
                                    <Input
                                        type="text"
                                        maxLength={7}
                                        value={exp.start_date}
                                        onChange={(e) =>
                                            handleFieldChange(idx, 'start_date', e.target.value)
                                        }
                                        placeholder="2022-01"
                                        className="rounded-xl font-mono text-xs sm:text-sm"
                                    />
                                    {errors[`start_date_${idx}`] && (
                                        <p className="text-xs text-rose-500">
                                            {errors[`start_date_${idx}`]}
                                        </p>
                                    )}
                                </div>

                                {/* End Date */}
                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                        <Calendar className="size-3 text-neutral-400" />
                                        Bulan Selesai (YYYY-MM)
                                    </Label>
                                    <Input
                                        type="text"
                                        maxLength={7}
                                        disabled={exp.is_current}
                                        value={exp.is_current ? 'Sekarang' : exp.end_date || ''}
                                        onChange={(e) =>
                                            handleFieldChange(idx, 'end_date', e.target.value)
                                        }
                                        placeholder="2024-06"
                                        className="rounded-xl font-mono text-xs sm:text-sm disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
                                    />
                                    {errors[`end_date_${idx}`] && (
                                        <p className="text-xs text-rose-500">
                                            {errors[`end_date_${idx}`]}
                                        </p>
                                    )}
                                </div>

                                {/* Is Current Checkbox */}
                                <div className="flex items-end pb-2">
                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                        <Checkbox
                                            checked={exp.is_current}
                                            onCheckedChange={(checked) =>
                                                handleFieldChange(idx, 'is_current', Boolean(checked))
                                            }
                                        />
                                        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                            Masih aktif bekerja di sini
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Deskripsi & Pencapaian Pekerjaan (Single Textarea + AI Enhance) */}
                            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                        Deskripsi & Pencapaian Pekerjaan (Opsional)
                                    </Label>
                                    <AiInlineEnhanceButton
                                        type="experience"
                                        currentText={typeof exp.description === 'string' ? exp.description : ''}
                                        context={{
                                            company: exp.company,
                                            position: exp.position,
                                            location: exp.location,
                                        }}
                                        onApply={(enhancedText) =>
                                            handleFieldChange(idx, 'description', enhancedText)
                                        }
                                    />
                                </div>

                                <textarea
                                    rows={4}
                                    value={typeof exp.description === 'string' ? exp.description : ''}
                                    onChange={(e) =>
                                        handleFieldChange(idx, 'description', e.target.value)
                                    }
                                    placeholder="Tuliskan ringkasan tanggung jawab utama atau pencapaian kerja Anda di posisi ini (Anda juga dapat mengklik tombol Sempurnakan dengan AI di atas)..."
                                    className="flex w-full rounded-xl border border-input bg-transparent px-3 py-2 text-xs sm:text-sm leading-relaxed shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none dark:bg-neutral-900"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </form>
    );
}
