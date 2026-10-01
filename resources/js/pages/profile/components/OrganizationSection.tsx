import React, { useState } from 'react';
import {
    Users,
    Calendar,
    Clock,
    Plus,
    Save,
    Check,
    Trash2,
    PlusCircle,
    MinusCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UserOrganizationItem, UserProfileData } from '@/types/profile';

interface OrganizationSectionProps {
    profile: UserProfileData;
    onSaveSection: (section: string, payload: Partial<UserProfileData>) => Promise<boolean>;
}

export function OrganizationSection({
    profile,
    onSaveSection,
}: OrganizationSectionProps) {
    const [organizations, setOrganizations] = useState<UserOrganizationItem[]>(
        profile.organizations?.length ? profile.organizations : []
    );

    const [saving, setSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSaving(true);
        setSavedSuccess(false);

        const sanitized = organizations.map((org, idx) => ({
            ...org,
            sort_order: idx,
            description: (org.description || []).filter((d) => d.trim().length > 0),
        }));

        const success = await onSaveSection('organizations', {
            organizations: sanitized,
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
                        Pengalaman Organisasi & Kepemimpinan
                    </h2>
                    <p className="text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
                        Catat keterlibatan Anda dalam kepanitiaan, komunitas, BEM/Himpunan, atau yayasan sosial.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddOrganization}
                        className="rounded-xl border-dashed gap-1.5"
                    >
                        <Plus className="size-4" />
                        Tambah Organisasi
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
                                Simpan Organisasi
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {organizations.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-12 text-center dark:border-neutral-800">
                    <div className="rounded-full bg-amber-50 p-3 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                        <Users className="size-6" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Belum ada riwayat organisasi
                    </h3>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        Riwayat organisasi meningkatkan nilai kepemimpinan dan kerja sama tim di mata perekrut.
                    </p>
                    <Button
                        type="button"
                        onClick={handleAddOrganization}
                        className="mt-4 gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs"
                    >
                        <Plus className="size-3.5" />
                        Tambah Organisasi Sekarang
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {organizations.map((org, idx) => (
                        <div
                            key={idx}
                            className="relative rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs transition-all dark:border-neutral-800 dark:bg-neutral-900/60 space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                                <div className="flex items-center gap-2">
                                    <span className="flex size-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                        {idx + 1}
                                    </span>
                                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                        {org.organizations_name || org.role
                                            ? `${org.role || 'Peran'} - ${org.organizations_name || 'Organisasi'}`
                                            : `Entri Organisasi #${idx + 1}`}
                                    </span>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveOrganization(idx)}
                                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40"
                                >
                                    <Trash2 className="size-4" />
                                    <span className="hidden sm:inline text-xs">Hapus</span>
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                <div className="space-y-1.5 md:col-span-2">
                                    <Label className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                        <Users className="size-3 text-neutral-400" />
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
                                        placeholder="Contoh: Himpunan Mahasiswa Informatika / Google Developer Student Clubs"
                                        className="rounded-xl text-xs sm:text-sm"
                                    />
                                    {errors[`org_name_${idx}`] && (
                                        <p className="text-xs text-rose-500">
                                            {errors[`org_name_${idx}`]}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                        Peran / Jabatan *
                                    </Label>
                                    <Input
                                        value={org.role}
                                        onChange={(e) =>
                                            handleFieldChange(idx, 'role', e.target.value)
                                        }
                                        placeholder="Contoh: Ketua Divisi Hubungan Luar"
                                        className="rounded-xl text-xs sm:text-sm"
                                    />
                                    {errors[`role_${idx}`] && (
                                        <p className="text-xs text-rose-500">
                                            {errors[`role_${idx}`]}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                        <Calendar className="size-3 text-neutral-400" />
                                        Mulai (YYYY-MM)
                                    </Label>
                                    <Input
                                        value={org.start_date}
                                        onChange={(e) =>
                                            handleFieldChange(idx, 'start_date', e.target.value)
                                        }
                                        placeholder="2022-01"
                                        className="rounded-xl font-mono text-xs sm:text-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                        <Calendar className="size-3 text-neutral-400" />
                                        Selesai (YYYY-MM)
                                    </Label>
                                    <Input
                                        value={org.end_date}
                                        onChange={(e) =>
                                            handleFieldChange(idx, 'end_date', e.target.value)
                                        }
                                        placeholder="2023-01"
                                        className="rounded-xl font-mono text-xs sm:text-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                        <Clock className="size-3 text-neutral-400" />
                                        Durasi (Opsional)
                                    </Label>
                                    <Input
                                        value={org.duration}
                                        onChange={(e) =>
                                            handleFieldChange(idx, 'duration', e.target.value)
                                        }
                                        placeholder="Contoh: 1 tahun / 6 bulan"
                                        className="rounded-xl text-xs sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Description Bullet Points */}
                            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                        Tanggung Jawab & Kontribusi (Poin-poin)
                                    </Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleAddBulletPoint(idx)}
                                        className="text-xs text-amber-600 hover:text-amber-700 gap-1 h-7"
                                    >
                                        <PlusCircle className="size-3.5" />
                                        Tambah Poin
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    {(org.description && org.description.length > 0
                                        ? org.description
                                        : ['']
                                    ).map((bullet, bulletIdx) => (
                                        <div key={bulletIdx} className="flex items-start gap-2">
                                            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-neutral-400" />
                                            <Input
                                                value={bullet}
                                                onChange={(e) =>
                                                    handleBulletPointChange(
                                                        idx,
                                                        bulletIdx,
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Contoh: Memimpin delegasi 15 anggota dalam menyelenggarakan seminar nasional teknologi..."
                                                className="rounded-xl text-xs sm:text-sm"
                                            />
                                            {(org.description?.length || 0) > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveBulletPoint(idx, bulletIdx)
                                                    }
                                                    className="mt-2 text-neutral-400 hover:text-rose-500"
                                                    title="Hapus poin"
                                                >
                                                    <MinusCircle className="size-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </form>
    );
}
