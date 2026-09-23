import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Globe, Linkedin, MapPin } from 'lucide-react';
import type { CvContactData } from '@/types/cv';

interface ContactStepProps {
    data: CvContactData;
    onChange: (field: keyof CvContactData, value: string) => void;
    onNext: () => void;
    isSaving?: boolean;
}

export function ContactStep({ data, onChange, onNext, isSaving }: ContactStepProps) {
    const [showAdditional, setShowAdditional] = useState(false);

    const isFieldValid = (val?: string | null) => {
        return Boolean(val && val.trim().length > 0);
    };

    const isEmailValid = (email?: string | null) => {
        if (!email) return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    };

    return (
        <div className="flex max-w-2xl flex-col space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                    Kontak
                </h1>
                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                    Tambahkan informasi kontak terbaru Anda agar pemberi kerja dan perekrut dapat dengan mudah menghubungi Anda.
                </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                {/* Nama Depan & Nama Belakang */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700">
                            Nama depan
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={data.first_name || ''}
                                onChange={(e) => onChange('first_name', e.target.value)}
                                placeholder="Contoh: Arsa"
                                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 transition-all focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
                            />
                            {isFieldValid(data.first_name) && (
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                                        <Check className="h-3 w-3 stroke-[3]" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700">
                            Nama belakang
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={data.last_name || ''}
                                onChange={(e) => onChange('last_name', e.target.value)}
                                placeholder="Contoh: Aji"
                                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 transition-all focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
                            />
                            {isFieldValid(data.last_name) && (
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                                        <Check className="h-3 w-3 stroke-[3]" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Judul Pekerjaan */}
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-700">
                        Judul pekerjaan yang diinginkan
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={data.desired_job_title || ''}
                            onChange={(e) => onChange('desired_job_title', e.target.value)}
                            placeholder="Contoh: Full Stack Developer"
                            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 transition-all focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
                        />
                        {isFieldValid(data.desired_job_title) && (
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                                    <Check className="h-3 w-3 stroke-[3]" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Telepon & Surel */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700">
                            Telepon
                        </label>
                        <div className="flex rounded-lg border border-slate-200 bg-slate-50/50 transition-all focus-within:border-sky-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100">
                            {/* Indonesia Country Code Prefix with Flag */}
                            <div className="flex items-center gap-1.5 border-r border-slate-200 px-3 py-2 text-slate-700 select-none">
                                <span className="flex h-3.5 w-5 overflow-hidden rounded-xs shadow-xs">
                                    <span className="h-1/2 w-full bg-red-600" />
                                    <span className="h-1/2 w-full bg-white" />
                                </span>
                                <span className="text-xs font-medium text-slate-600">+62</span>
                                <ChevronDown className="h-3 w-3 text-slate-400" />
                            </div>
                            <div className="relative flex-1">
                                <input
                                    type="tel"
                                    value={data.phone || ''}
                                    onChange={(e) => onChange('phone', e.target.value)}
                                    placeholder="08888888888"
                                    className="w-full bg-transparent px-3.5 py-2.5 pr-9 text-sm text-slate-900 focus:outline-none"
                                />
                                {isFieldValid(data.phone) && (
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
                                        <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-500 text-white">
                                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700">
                            Surel
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={data.email || ''}
                                onChange={(e) => onChange('email', e.target.value)}
                                placeholder="admin@aikrut.com"
                                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 transition-all focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
                            />
                            {isEmailValid(data.email) && (
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                                        <Check className="h-3 w-3 stroke-[3]" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Collapsible Informasi Tambahan */}
                <div className="pt-2">
                    <button
                        type="button"
                        onClick={() => setShowAdditional(!showAdditional)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 transition-colors hover:text-sky-700"
                    >
                        <span>Informasi tambahan</span>
                        {showAdditional ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                        )}
                    </button>

                    {showAdditional && (
                        <div className="mt-3 space-y-3.5 rounded-xl border border-sky-100 bg-sky-50/40 p-4 transition-all">
                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700 flex items-center gap-1">
                                        <MapPin className="h-3 w-3 text-sky-500" />
                                        Kota / Wilayah
                                    </label>
                                    <input
                                        type="text"
                                        value={data.city || ''}
                                        onChange={(e) => onChange('city', e.target.value)}
                                        placeholder="Contoh: Surakarta, Indonesia"
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700">
                                        Alamat Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        value={data.address || ''}
                                        onChange={(e) => onChange('address', e.target.value)}
                                        placeholder="Contoh: Jl. Ahmad Yani No. 10"
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700 flex items-center gap-1">
                                        <Linkedin className="h-3 w-3 text-sky-600" />
                                        LinkedIn URL
                                    </label>
                                    <input
                                        type="url"
                                        value={data.linkedin_url || ''}
                                        onChange={(e) => onChange('linkedin_url', e.target.value)}
                                        placeholder="linkedin.com/in/username"
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700 flex items-center gap-1">
                                        <Globe className="h-3 w-3 text-sky-600" />
                                        Website / Portofolio
                                    </label>
                                    <input
                                        type="url"
                                        value={data.website_url || ''}
                                        onChange={(e) => onChange('website_url', e.target.value)}
                                        placeholder="https://portfolio-anda.com"
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-6">
                <div className="text-xs text-slate-400">
                    {isSaving ? (
                        <span className="flex items-center gap-1.5 text-amber-600">
                            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                            Menyimpan perubahan...
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 text-slate-400">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                            Semua perubahan tersimpan
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    onClick={onNext}
                    className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-sky-600 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 cursor-pointer"
                >
                    Berikutnya: Pengalaman
                </button>
            </div>
        </div>
    );
}
