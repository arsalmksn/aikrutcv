import React, { useState } from 'react';
import { Save, User, Phone, Mail, MapPin, Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UserProfileData } from '@/types/profile';

interface PersonalIdentitySectionProps {
    profile: UserProfileData;
    onSaveSection: (section: string, payload: Partial<UserProfileData>) => Promise<boolean>;
}

export function PersonalIdentitySection({
    profile,
    onSaveSection,
}: PersonalIdentitySectionProps) {
    const [formData, setFormData] = useState({
        full_name: profile.full_name || '',
        whatsapp_number: profile.whatsapp_number || '',
        email: profile.email || '',
        location: profile.location || '',
        age: profile.age !== null && profile.age !== undefined ? String(profile.age) : '',
        gender: profile.gender || '',
    });

    const [saving, setSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid.';
        }

        if (
            formData.whatsapp_number &&
            !formData.whatsapp_number.startsWith('+') &&
            !formData.whatsapp_number.startsWith('62')
        ) {
            newErrors.whatsapp_number =
                'Disarankan menggunakan format internasional (contoh: +628123456789).';
        }

        if (formData.age) {
            const ageNum = parseInt(formData.age, 10);
            if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
                newErrors.age = 'Usia harus di antara 1 dan 120 tahun.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSaving(true);
        setSavedSuccess(false);

        const success = await onSaveSection('profile', {
            full_name: formData.full_name,
            whatsapp_number: formData.whatsapp_number,
            email: formData.email,
            location: formData.location,
            age: formData.age ? parseInt(formData.age, 10) : null,
            gender: formData.gender,
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
                        Identitas Pribadi & Kontak
                    </h2>
                    <p className="text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
                        Informasi dasar yang akan dicantumkan pada bagian atas header CV dan profil publik.
                    </p>
                </div>
                <Button
                    type="submit"
                    disabled={saving}
                    className="self-start sm:self-auto bg-sky-600 hover:bg-sky-700 text-white gap-2 font-medium shadow-xs"
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
                            Simpan Perubahan
                        </>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Full Name */}
                <div className="space-y-2">
                    <Label htmlFor="full_name" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        <User className="size-3.5 text-neutral-400" />
                        Nama Lengkap
                    </Label>
                    <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => handleChange('full_name', e.target.value)}
                        placeholder="Contoh: Muhammad Raihan Pratama"
                        className="rounded-xl"
                    />
                    {errors.full_name && (
                        <p className="text-xs text-rose-500">{errors.full_name}</p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        <Mail className="size-3.5 text-neutral-400" />
                        Alamat Email Aktif
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="contoh: raihan@email.com"
                        className="rounded-xl"
                    />
                    {errors.email && (
                        <p className="text-xs text-rose-500">{errors.email}</p>
                    )}
                </div>

                {/* WhatsApp Number */}
                <div className="space-y-2">
                    <Label htmlFor="whatsapp_number" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        <Phone className="size-3.5 text-emerald-500" />
                        Nomor WhatsApp
                    </Label>
                    <Input
                        id="whatsapp_number"
                        value={formData.whatsapp_number}
                        onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                        placeholder="+6281234567890"
                        className="rounded-xl"
                    />
                    <p className="text-[11px] text-neutral-400">
                        Gunakan awalan kode negara internasional (misal: +62 untuk Indonesia).
                    </p>
                    {errors.whatsapp_number && (
                        <p className="text-xs text-amber-500">{errors.whatsapp_number}</p>
                    )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        <MapPin className="size-3.5 text-rose-500" />
                        Domisili / Lokasi
                    </Label>
                    <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        placeholder="Contoh: Jakarta Selatan, Indonesia"
                        className="rounded-xl"
                    />
                </div>

                {/* Age */}
                <div className="space-y-2">
                    <Label htmlFor="age" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        <Calendar className="size-3.5 text-neutral-400" />
                        Usia (Tahun)
                    </Label>
                    <Input
                        id="age"
                        type="number"
                        min="1"
                        max="120"
                        value={formData.age}
                        onChange={(e) => handleChange('age', e.target.value)}
                        placeholder="Contoh: 24"
                        className="rounded-xl"
                    />
                    {errors.age && (
                        <p className="text-xs text-rose-500">{errors.age}</p>
                    )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                    <Label htmlFor="gender" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        Jenis Kelamin
                    </Label>
                    <select
                        id="gender"
                        value={formData.gender}
                        onChange={(e) => handleChange('gender', e.target.value)}
                        className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-900"
                    >
                        <option value="">-- Pilih Jenis Kelamin --</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                    </select>
                </div>
            </div>
        </form>
    );
}
