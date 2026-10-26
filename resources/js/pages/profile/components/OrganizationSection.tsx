import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
    Users,
    Calendar,
    Clock,
    Plus,
    Trash2,
    PlusCircle,
    MinusCircle,
    ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UserOrganizationItem, UserProfileData, ProfileSectionRef } from '@/types/profile';

interface OrganizationSectionProps {
    profile: UserProfileData;
    onSaveSection: (section: string, payload: Partial<UserProfileData>) => Promise<boolean>;
}

export const OrganizationSection = forwardRef<ProfileSectionRef, OrganizationSectionProps>(
    function OrganizationSection({ profile, onSaveSection }, ref) {
        const [organizations, setOrganizations] = useState<UserOrganizationItem[]>(
            profile.organizations?.length ? profile.organizations : []
        );

        const [errors, setErrors] = useState<Record<string, string>>({});

        const handleAddOrganization = () => {
            setOrganizations((prev) => [
                ...prev,
                {
                    organizations_name: '',
                    role: '',
                    start_date: '',
                    end_date: '',
                    duration: '',
                    description: [''],
                    sort_order: prev.length,
                },
            ]);
        };

        const handleRemoveOrganization = (index: number) => {
            setOrganizations((prev) => prev.filter((_, i) => i !== index));
        };

        const handleFieldChange = (
            index: number,
            field: keyof UserOrganizationItem,
            value: unknown
        ) => {
            setOrganizations((prev) => {
                const next = [...prev];
                next[index] = { ...next[index], [field]: value };
                return next;
            });
        };

        const handleToggleCurrentOrg = (index: number, isCurrentlyActive: boolean) => {
            setOrganizations((prev) => {
                const next = [...prev];
                next[index] = {
                    ...next[index],
                    end_date: isCurrentlyActive ? 'Sekarang' : '',
                };
                return next;
            });
        };

        const handleAddBulletPoint = (orgIndex: number) => {
            setOrganizations((prev) => {
                const next = [...prev];
                const item = { ...next[orgIndex] };
                item.description = [...(item.description || []), ''];
                next[orgIndex] = item;
                return next;
            });
        };

        const handleRemoveBulletPoint = (orgIndex: number, bulletIndex: number) => {
            setOrganizations((prev) => {
                const next = [...prev];
                const item = { ...next[orgIndex] };
                item.description = item.description.filter((_, i) => i !== bulletIndex);
                next[orgIndex] = item;
                return next;
            });
        };

        const handleBulletPointChange = (
            orgIndex: number,
            bulletIndex: number,
            text: string
        ) => {
            setOrganizations((prev) => {
                const next = [...prev];
                const item = { ...next[orgIndex] };
                const desc = [...(item.description || [])];
                desc[bulletIndex] = text;
                item.description = desc;
                next[orgIndex] = item;
                return next;
            });
        };

        const validate = (): boolean => {
            const newErrors: Record<string, string> = {};

            organizations.forEach((org, idx) => {
                if (!org.organizations_name?.trim()) {
                    newErrors[`org_name_${idx}`] = 'Nama organisasi wajib diisi.';
                }
                if (!org.role?.trim()) {
                    newErrors[`role_${idx}`] = 'Peran / jabatan wajib diisi.';
                }
            });

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        const handleSave = async (): Promise<boolean> => {
            if (!validate()) return false;

            const sanitized = organizations.map((org, idx) => ({
                ...org,
                sort_order: idx,
                description: (org.description || []).filter((d) => typeof d === 'string' && d.trim().length > 0),
            }));

            return await onSaveSection('organizations', {
                organizations: sanitized,
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
                            Pengalaman Organisasi ({organizations.length})
                        </span>
                    </div>
                </div>

                {organizations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-12 text-center dark:border-neutral-800">
                        <div className="rounded-full bg-amber-50 p-3 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                            <Users className="size-6" />
                        </div>
                        <h3 className="mt-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                            Belum Ada Riwayat Organisasi
                        </h3>
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                            Riwayat organisasi meningkatkan nilai kepemimpinan dan kerja sama tim di mata perekrut.
                        </p>
                        <Button
                            type="button"
                            onClick={handleAddOrganization}
                            className="mt-4 gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs cursor-pointer shadow-xs"
                        >
                            <Plus className="size-3.5" />
                            Tambah Organisasi Sekarang
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {organizations.map((org, idx) => {
                            const isPresent =
                                org.end_date?.toLowerCase() === 'sekarang' ||
                                org.end_date?.toLowerCase() === 'saat ini';

                            return (
                                <div
                                    key={idx}
                                    className="relative rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs transition-all dark:border-neutral-800 dark:bg-neutral-900/60 space-y-4.5"
                                >
                                    {/* Card Header & Delete Button */}
                                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                                        <div className="flex items-center gap-2.5">
                                            <span className="flex size-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                                {idx + 1}
                                            </span>
                                            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                                {org.organizations_name || org.role
                                                    ? `${org.role || 'Peran'} — ${org.organizations_name || 'Organisasi'}`
                                                    : `Entri Organisasi #${idx + 1}`}
                                            </span>
                                            {isPresent && (
                                                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900">
                                                    Aktif
                                                </span>
                                            )}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveOrganization(idx)}
                                            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40 cursor-pointer h-8 px-2.5 rounded-lg"
                                        >
                                            <Trash2 className="size-3.5" />
                                            <span className="hidden sm:inline text-xs ml-1">Hapus</span>
                                        </Button>
                                    </div>

                                    {/* Row 1: Nama Organisasi & Peran */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                                        <div className="space-y-1.5 sm:col-span-7">
                                            <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                <Users className="size-3.5 text-amber-500" />
                                                Nama Organisasi / Komunitas *
                                            </Label>
                                            <Input
                                                value={org.organizations_name}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        idx,
                                                        'organizations_name',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Contoh: Himpunan Mahasiswa / Google Developer Student Clubs"
                                                className="rounded-xl text-xs sm:text-sm"
                                            />
                                            {errors[`org_name_${idx}`] && (
                                                <p className="text-xs text-rose-500">
                                                    {errors[`org_name_${idx}`]}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5 sm:col-span-5">
                                            <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                <ShieldCheck className="size-3.5 text-amber-500" />
                                                Peran / Jabatan *
                                            </Label>
                                            <Input
                                                value={org.role}
                                                onChange={(e) =>
                                                    handleFieldChange(idx, 'role', e.target.value)
                                                }
                                                placeholder="Contoh: Ketua Departemen Kominfo"
                                                className="rounded-xl text-xs sm:text-sm"
                                            />
                                            {errors[`role_${idx}`] && (
                                                <p className="text-xs text-rose-500">
                                                    {errors[`role_${idx}`]}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Row 2: Periode Waktu & Durasi dengan Checkbox */}
                                    <div className="rounded-xl bg-neutral-50/70 dark:bg-neutral-850/50 p-3.5 border border-neutral-100 dark:border-neutral-800 space-y-3">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                            {/* Start Date */}
                                            <div className="space-y-1.5">
                                                <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                    <Calendar className="size-3.5 text-neutral-400" />
                                                    Mulai (Contoh: 2022 / Jan 2022)
                                                </Label>
                                                <Input
                                                    value={org.start_date}
                                                    onChange={(e) =>
                                                        handleFieldChange(idx, 'start_date', e.target.value)
                                                    }
                                                    placeholder="2022-01 atau Jan 2022"
                                                    className="rounded-xl bg-white dark:bg-neutral-900 font-mono text-xs sm:text-sm"
                                                />
                                            </div>

                                            {/* End Date */}
                                            <div className="space-y-1.5">
                                                <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                    <Calendar className="size-3.5 text-neutral-400" />
                                                    Selesai (Contoh: 2023 / Des 2023)
                                                </Label>
                                                <Input
                                                    value={isPresent ? 'Sekarang' : org.end_date}
                                                    disabled={isPresent}
                                                    onChange={(e) =>
                                                        handleFieldChange(idx, 'end_date', e.target.value)
                                                    }
                                                    placeholder="2023-01 atau Sekarang"
                                                    className={`rounded-xl font-mono text-xs sm:text-sm ${
                                                        isPresent
                                                            ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-semibold'
                                                            : 'bg-white dark:bg-neutral-900'
                                                    }`}
                                                />
                                            </div>

                                            {/* Duration */}
                                            <div className="space-y-1.5">
                                                <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                    <Clock className="size-3.5 text-neutral-400" />
                                                    Estimasi Durasi (Opsional)
                                                </Label>
                                                <Input
                                                    value={org.duration}
                                                    onChange={(e) =>
                                                        handleFieldChange(idx, 'duration', e.target.value)
                                                    }
                                                    placeholder="Contoh: 1 Tahun / 6 Bulan"
                                                    className="rounded-xl bg-white dark:bg-neutral-900 text-xs sm:text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Checkbox Masih Aktif */}
                                        <div className="flex items-center gap-2 pt-1 border-t border-neutral-200/50 dark:border-neutral-800">
                                            <input
                                                id={`is_current_org_${idx}`}
                                                type="checkbox"
                                                checked={isPresent}
                                                onChange={(e) =>
                                                    handleToggleCurrentOrg(idx, e.target.checked)
                                                }
                                                className="size-4 rounded border-neutral-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                                            />
                                            <label
                                                htmlFor={`is_current_org_${idx}`}
                                                className="text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer select-none"
                                            >
                                                Saat ini saya masih aktif menjabat di organisasi ini
                                            </label>
                                        </div>
                                    </div>

                                    {/* Row 3: Description Bullet Points */}
                                    <div className="space-y-2.5 pt-1">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                Tanggung Jawab & Kontribusi (Poin-poin Penjelasan)
                                            </Label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleAddBulletPoint(idx)}
                                                className="text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 gap-1 h-7 rounded-lg cursor-pointer font-medium"
                                            >
                                                <PlusCircle className="size-3.5" />
                                                <span>Tambah Poin</span>
                                            </Button>
                                        </div>

                                        <div className="space-y-2">
                                            {(org.description && org.description.length > 0
                                                ? org.description
                                                : ['']
                                            ).map((bullet, bulletIdx) => (
                                                <div key={bulletIdx} className="flex items-center gap-2">
                                                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                                                        {bulletIdx + 1}
                                                    </span>
                                                    <Input
                                                        value={bullet}
                                                        onChange={(e) =>
                                                            handleBulletPointChange(
                                                                idx,
                                                                bulletIdx,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Contoh: Menginisiasi program kerja seminar teknologi yang dihadiri 200+ peserta..."
                                                        className="rounded-xl text-xs sm:text-sm"
                                                    />
                                                    {(org.description?.length || 0) > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveBulletPoint(idx, bulletIdx)
                                                            }
                                                            className="text-neutral-400 hover:text-rose-500 transition-colors p-1 cursor-pointer shrink-0"
                                                            title="Hapus poin ini"
                                                        >
                                                            <MinusCircle className="size-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="pt-2 flex justify-center">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddOrganization}
                                className="w-full sm:w-auto rounded-xl border-dashed gap-2 text-xs font-semibold hover:border-amber-500 hover:text-amber-600 py-3 cursor-pointer"
                            >
                                <Plus className="size-4" />
                                Tambah Pengalaman Organisasi Lainnya
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        );
    }
);
