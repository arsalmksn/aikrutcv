import React, { useState } from 'react';
import { Save, Check, Plus, X, DollarSign, Target, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { UserProfileData } from '@/types/profile';

interface SummaryPreferencesSectionProps {
    profile: UserProfileData;
    onSaveSection: (section: string, payload: Partial<UserProfileData>) => Promise<boolean>;
}

const EMPLOYMENT_OPTIONS = [
    'Full-time',
    'Part-time',
    'Contract',
    'Remote',
    'Internship',
    'Freelance',
];

export function SummaryPreferencesSection({
    profile,
    onSaveSection,
}: SummaryPreferencesSectionProps) {
    const [aboutMe, setAboutMe] = useState(profile.about_me || '');
    const [fieldsOfInterest, setFieldsOfInterest] = useState<string[]>(
        profile.field_of_interest || []
    );
    const [newInterestInput, setNewInterestInput] = useState('');
    const [employmentTypes, setEmploymentTypes] = useState<string[]>(
        profile.employment_type || ['Full-time']
    );
    const [salary, setSalary] = useState({
        currency: profile.expected_monthly_salary?.currency || 'IDR',
        amount: profile.expected_monthly_salary?.amount || 0,
        is_negotiable: profile.expected_monthly_salary?.is_negotiable ?? true,
    });

    const [saving, setSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);

    const handleAddInterest = () => {
        const trimmed = newInterestInput.trim();
        if (trimmed && !fieldsOfInterest.includes(trimmed)) {
            setFieldsOfInterest((prev) => [...prev, trimmed]);
            setNewInterestInput('');
        }
    };

    const handleRemoveInterest = (item: string) => {
        setFieldsOfInterest((prev) => prev.filter((i) => i !== item));
    };

    const handleToggleEmployment = (type: string) => {
        setEmploymentTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSavedSuccess(false);

        // Save summary
        const successSummary = await onSaveSection('summary', {
            about_me: aboutMe,
        });

        // Save preferences
        const successPreferences = await onSaveSection('preferences', {
            field_of_interest: fieldsOfInterest,
            employment_type: employmentTypes,
            expected_monthly_salary: {
                currency: salary.currency,
                amount: Number(salary.amount) || 0,
                is_negotiable: salary.is_negotiable,
            },
        });

        setSaving(false);
        if (successSummary && successPreferences) {
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4 dark:border-neutral-800">
                <div>
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        Ringkasan Profesional & Preferensi Kerja
                    </h2>
                    <p className="text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
                        Deskripsi singkat tentang diri Anda, ekspektasi karier, dan preferensi jenis pekerjaan.
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

            {/* About Me Section */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="about_me" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        Ringkasan Tentang Saya (Professional Summary)
                    </Label>
                    <span className="text-xs text-neutral-400">
                        {aboutMe.length} karakter
                    </span>
                </div>
                <textarea
                    id="about_me"
                    rows={4}
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    placeholder="Tulis ringkasan singkat 2-4 kalimat yang menonjolkan keahlian utama, pengalaman relevan, dan nilai tambah yang Anda bawa untuk perusahaan..."
                    className="flex w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-neutral-900 leading-relaxed"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Field of Interest */}
                <div className="space-y-3">
                    <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        <Target className="size-3.5 text-sky-500" />
                        Bidang Minat Pekerjaan
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            value={newInterestInput}
                            onChange={(e) => setNewInterestInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddInterest();
                                }
                            }}
                            placeholder="Contoh: Frontend Engineering, Data Analyst"
                            className="rounded-xl text-xs sm:text-sm"
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleAddInterest}
                            className="rounded-xl shrink-0"
                        >
                            <Plus className="size-4" />
                            Tambah
                        </Button>
                    </div>

                    {/* Tags List */}
                    <div className="flex flex-wrap gap-2 pt-1">
                        {fieldsOfInterest.length === 0 ? (
                            <p className="text-xs text-neutral-400 italic">
                                Belum ada bidang minat yang ditambahkan.
                            </p>
                        ) : (
                            fieldsOfInterest.map((interest) => (
                                <span
                                    key={interest}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-950/50 dark:text-sky-300"
                                >
                                    {interest}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveInterest(interest)}
                                        className="rounded-full p-0.5 hover:bg-sky-200 dark:hover:bg-sky-800"
                                    >
                                        <X className="size-3" />
                                    </button>
                                </span>
                            ))
                        )}
                    </div>
                </div>

                {/* Employment Type */}
                <div className="space-y-3">
                    <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        <Briefcase className="size-3.5 text-indigo-500" />
                        Tipe Pekerjaan yang Diinginkan
                    </Label>
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                        {EMPLOYMENT_OPTIONS.map((type) => {
                            const isChecked = employmentTypes.includes(type);
                            return (
                                <label
                                    key={type}
                                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-xs font-medium cursor-pointer transition-colors ${
                                        isChecked
                                            ? 'border-indigo-500 bg-indigo-50/50 text-indigo-900 dark:border-indigo-400 dark:bg-indigo-950/30 dark:text-indigo-200'
                                            : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50'
                                    }`}
                                >
                                    <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={() => handleToggleEmployment(type)}
                                    />
                                    <span>{type}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Expected Salary */}
            <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 space-y-4 dark:border-neutral-800 dark:bg-neutral-900/40">
                <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    <DollarSign className="size-3.5 text-emerald-500" />
                    Ekspektasi Gaji Bulanan (Opsional)
                </Label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <Label htmlFor="salary_currency" className="text-[11px] text-neutral-500">
                            Mata Uang
                        </Label>
                        <select
                            id="salary_currency"
                            value={salary.currency}
                            onChange={(e) =>
                                setSalary((prev) => ({ ...prev, currency: e.target.value }))
                            }
                            className="mt-1 flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-xs dark:bg-neutral-900"
                        >
                            <option value="IDR">IDR (Rupiah)</option>
                            <option value="USD">USD (Dollar)</option>
                            <option value="SGD">SGD (Singapore Dollar)</option>
                        </select>
                    </div>

                    <div className="sm:col-span-2">
                        <Label htmlFor="salary_amount" className="text-[11px] text-neutral-500">
                            Nominal per Bulan
                        </Label>
                        <Input
                            id="salary_amount"
                            type="number"
                            min="0"
                            step="500000"
                            value={salary.amount || ''}
                            onChange={(e) =>
                                setSalary((prev) => ({
                                    ...prev,
                                    amount: Number(e.target.value),
                                }))
                            }
                            placeholder="Contoh: 10000000"
                            className="mt-1 rounded-xl"
                        />
                    </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <Checkbox
                        checked={salary.is_negotiable}
                        onCheckedChange={(checked) =>
                            setSalary((prev) => ({
                                ...prev,
                                is_negotiable: Boolean(checked),
                            }))
                        }
                    />
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                        Gaji bersifat dapat dinegosiasikan (Negotiable)
                    </span>
                </label>
            </div>
        </form>
    );
}
