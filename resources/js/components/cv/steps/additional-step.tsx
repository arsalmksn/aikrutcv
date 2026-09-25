import React, { useState } from 'react';
import {
    Sparkles,
    Globe,
    Award,
    Link2,
    ChevronDown,
    Trash2,
    Plus,
    X,
    CheckCircle2,
    Download,
    FileCheck,
    Eye,
} from 'lucide-react';
import type { CvContactData } from '@/types/cv';

export interface LanguageItem {
    id: string;
    name: string;
    level: string;
}

export interface CertificationItem {
    id: string;
    name: string;
    issuer: string;
    year: string;
}

export interface ReferenceItem {
    id: string;
    name: string;
    company: string;
    contact: string;
}

export interface AdditionalSectionsData {
    references: ReferenceItem[];
    languages: LanguageItem[];
    certifications: CertificationItem[];
    social: {
        linkedin_url: string;
        website_url: string;
        github_url?: string;
    };
}

interface TemplateOption {
    id: number;
    name: string;
    category?: string;
    is_active: boolean;
}

interface AdditionalStepProps {
    contact: CvContactData;
    onContactChange: (field: keyof CvContactData, value: string) => void;
    additionalData: AdditionalSectionsData;
    onAdditionalDataChange: (data: AdditionalSectionsData) => void;
    onBack: () => void;
    onNext: () => void;
    cvId: number;
    cvTitle: string;
    templates?: TemplateOption[];
    selectedTemplateId?: number | null;
    isPublished?: boolean;
    onFinalizeCv?: (
        templateId: number,
        isPublished: boolean,
        title: string,
    ) => Promise<void>;
    isComplete?: boolean;
}

export function AdditionalStep({
    contact,
    onContactChange,
    additionalData,
    onAdditionalDataChange,
    onBack,
    onNext,
    cvId,
    cvTitle,
    templates = [],
    selectedTemplateId,
    isPublished = false,
    onFinalizeCv,
    isComplete = false,
}: AdditionalStepProps) {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
    const [activeTemplate, setActiveTemplate] = useState<number>(() => {
        return selectedTemplateId || (templates[0]?.id ?? 1);
    });
    const [publishedStatus, setPublishedStatus] =
        useState<boolean>(isPublished);
    const [titleInput, setTitleInput] = useState<string>(
        cvTitle || 'Curriculum Vitae',
    );
    const [isFinalizing, setIsFinalizing] = useState<boolean>(false);

    const toggleSection = (id: string) => {
        setExpandedSection((prev) => (prev === id ? null : id));
    };

    // Reference handlers
    const addReference = () => {
        const newItem: ReferenceItem = {
            id: Date.now().toString(),
            name: '',
            company: '',
            contact: '',
        };
        onAdditionalDataChange({
            ...additionalData,
            references: [...additionalData.references, newItem],
        });
        setExpandedSection('references');
    };

    const updateReference = (
        id: string,
        field: keyof ReferenceItem,
        val: string,
    ) => {
        onAdditionalDataChange({
            ...additionalData,
            references: additionalData.references.map((r) =>
                r.id === id ? { ...r, [field]: val } : r,
            ),
        });
    };

    const removeReference = (id: string) => {
        onAdditionalDataChange({
            ...additionalData,
            references: additionalData.references.filter((r) => r.id !== id),
        });
    };

    // Language handlers
    const addLanguage = () => {
        const newItem: LanguageItem = {
            id: Date.now().toString(),
            name: '',
            level: 'Menengah',
        };
        onAdditionalDataChange({
            ...additionalData,
            languages: [...additionalData.languages, newItem],
        });
        setExpandedSection('languages');
    };

    const updateLanguage = (
        id: string,
        field: keyof LanguageItem,
        val: string,
    ) => {
        onAdditionalDataChange({
            ...additionalData,
            languages: additionalData.languages.map((l) =>
                l.id === id ? { ...l, [field]: val } : l,
            ),
        });
    };

    const removeLanguage = (id: string) => {
        onAdditionalDataChange({
            ...additionalData,
            languages: additionalData.languages.filter((l) => l.id !== id),
        });
    };

    // Certification handlers
    const addCertification = () => {
        const newItem: CertificationItem = {
            id: Date.now().toString(),
            name: '',
            issuer: '',
            year: new Date().getFullYear().toString(),
        };
        onAdditionalDataChange({
            ...additionalData,
            certifications: [...additionalData.certifications, newItem],
        });
        setExpandedSection('certifications');
    };

    const updateCertification = (
        id: string,
        field: keyof CertificationItem,
        val: string,
    ) => {
        onAdditionalDataChange({
            ...additionalData,
            certifications: additionalData.certifications.map((c) =>
                c.id === id ? { ...c, [field]: val } : c,
            ),
        });
    };

    const removeCertification = (id: string) => {
        onAdditionalDataChange({
            ...additionalData,
            certifications: additionalData.certifications.filter(
                (c) => c.id !== id,
            ),
        });
    };

    // Clear whole section
    const clearSection = (e: React.MouseEvent, sectionId: string) => {
        e.stopPropagation();
        if (sectionId === 'references') {
            onAdditionalDataChange({ ...additionalData, references: [] });
        } else if (sectionId === 'languages') {
            onAdditionalDataChange({ ...additionalData, languages: [] });
        } else if (sectionId === 'certifications') {
            onAdditionalDataChange({ ...additionalData, certifications: [] });
        } else if (sectionId === 'social') {
            onContactChange('linkedin_url', '');
            onContactChange('website_url', '');
        }
    };

    const handleNextClick = () => {
        setShowDownloadModal(true);
    };

    const handleConfirmFinalize = async () => {
        if (onFinalizeCv) {
            setIsFinalizing(true);
            try {
                await onFinalizeCv(activeTemplate, publishedStatus, titleInput);
            } finally {
                setIsFinalizing(false);
            }
        }
        window.open(`/cv/${cvId}/download-pdf`, '_blank');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                    Bagian Tambahan
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Tambahkan sertifikasi, bahasa, penghargaan, atau detail
                    tambahan lain yang ingin Anda tunjukkan kepada perekrut.
                </p>
            </div>

            {/* Accordion Cards Container */}
            <div className="space-y-3.5 pt-2">
                {/* 1. Referensi */}
                <div
                    className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                        expandedSection === 'references'
                            ? 'border-sky-300 bg-sky-50/20 shadow-xs'
                            : 'border-sky-100 bg-white hover:border-sky-200'
                    }`}
                >
                    <div
                        onClick={() => toggleSection('references')}
                        className="flex cursor-pointer items-center justify-between p-4 sm:p-5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-800 sm:text-base">
                                    Referensi
                                </h3>
                                <p className="text-xs text-slate-500 sm:text-sm">
                                    Ini membangun kepercayaan dan keyakinan
                                    dalam kandidat Anda.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-slate-400">
                            <ChevronDown
                                className={`h-4 w-4 transition-transform duration-200 ${
                                    expandedSection === 'references'
                                        ? 'rotate-180 text-sky-600'
                                        : ''
                                }`}
                            />
                            <button
                                type="button"
                                onClick={(e) => clearSection(e, 'references')}
                                className="rounded-md p-1 transition-colors hover:bg-slate-100 hover:text-red-500"
                                title="Hapus bagian ini"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Accordion Content */}
                    {expandedSection === 'references' && (
                        <div className="space-y-4 border-t border-sky-100/80 bg-white p-5">
                            {additionalData.references.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                                    <p className="text-xs text-slate-500">
                                        Belum ada kontak referensi yang
                                        ditambahkan.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={addReference}
                                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-sky-600 hover:bg-sky-100"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Tambah Referensi
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {additionalData.references.map(
                                        (item, idx) => (
                                            <div
                                                key={item.id}
                                                className="relative rounded-xl border border-slate-200 bg-slate-50/50 p-4"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeReference(item.id)
                                                    }
                                                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                                <div className="grid grid-cols-1 gap-3 pr-6 sm:grid-cols-2">
                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-700">
                                                            Nama Lengkap
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={item.name}
                                                            onChange={(e) =>
                                                                updateReference(
                                                                    item.id,
                                                                    'name',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Contoh: Bpk. Hendra Gunawan"
                                                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-700">
                                                            Perusahaan / Jabatan
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={item.company}
                                                            onChange={(e) =>
                                                                updateReference(
                                                                    item.id,
                                                                    'company',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Engineering Lead - PT Maju Bersama"
                                                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <label className="block text-xs font-medium text-slate-700">
                                                            Kontak (Email /
                                                            Telepon)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={item.contact}
                                                            onChange={(e) =>
                                                                updateReference(
                                                                    item.id,
                                                                    'contact',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="hendra@perusahaan.com | +62812345678"
                                                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                    <button
                                        type="button"
                                        onClick={addReference}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50/50 px-3.5 py-1.5 text-xs font-semibold text-sky-600 hover:bg-sky-100"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Tambah Referensi Lain
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 2. Bahasa */}
                <div
                    className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                        expandedSection === 'languages'
                            ? 'border-sky-300 bg-sky-50/20 shadow-xs'
                            : 'border-sky-100 bg-white hover:border-sky-200'
                    }`}
                >
                    <div
                        onClick={() => toggleSection('languages')}
                        className="flex cursor-pointer items-center justify-between p-4 sm:p-5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                                <Globe className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-800 sm:text-base">
                                    Bahasa
                                </h3>
                                <p className="text-xs text-slate-500 sm:text-sm">
                                    Jika relevan, tambahkan bahasa asli Anda dan
                                    bahasa asing yang Anda ketahui.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-slate-400">
                            <ChevronDown
                                className={`h-4 w-4 transition-transform duration-200 ${
                                    expandedSection === 'languages'
                                        ? 'rotate-180 text-sky-600'
                                        : ''
                                }`}
                            />
                            <button
                                type="button"
                                onClick={(e) => clearSection(e, 'languages')}
                                className="rounded-md p-1 transition-colors hover:bg-slate-100 hover:text-red-500"
                                title="Hapus bagian ini"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Accordion Content */}
                    {expandedSection === 'languages' && (
                        <div className="space-y-4 border-t border-sky-100/80 bg-white p-5">
                            {additionalData.languages.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                                    <p className="text-xs text-slate-500">
                                        Belum ada bahasa yang ditambahkan.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={addLanguage}
                                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-sky-600 hover:bg-sky-100"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Tambah Bahasa
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {additionalData.languages.map((item) => (
                                        <div
                                            key={item.id}
                                            className="relative flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3"
                                        >
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) =>
                                                        updateLanguage(
                                                            item.id,
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Nama bahasa (cth: Bahasa Inggris)"
                                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                                                />
                                            </div>
                                            <div className="w-40">
                                                <select
                                                    value={item.level}
                                                    onChange={(e) =>
                                                        updateLanguage(
                                                            item.id,
                                                            'level',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                                                >
                                                    <option value="Bahasa Asli / Fasih">
                                                        Bahasa Asli / Fasih
                                                    </option>
                                                    <option value="Tingkat Mahir">
                                                        Tingkat Mahir
                                                    </option>
                                                    <option value="Menengah">
                                                        Menengah
                                                    </option>
                                                    <option value="Dasar">
                                                        Dasar
                                                    </option>
                                                </select>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeLanguage(item.id)
                                                }
                                                className="p-1 text-slate-400 hover:text-red-500"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addLanguage}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50/50 px-3.5 py-1.5 text-xs font-semibold text-sky-600 hover:bg-sky-100"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Tambah Bahasa Lain
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 3. Sertifikasi dan lisensi */}
                <div
                    className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                        expandedSection === 'certifications'
                            ? 'border-sky-300 bg-sky-50/20 shadow-xs'
                            : 'border-sky-100 bg-white hover:border-sky-200'
                    }`}
                >
                    <div
                        onClick={() => toggleSection('certifications')}
                        className="flex cursor-pointer items-center justify-between p-4 sm:p-5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-800 sm:text-base">
                                    Sertifikasi dan lisensi
                                </h3>
                                <p className="text-xs text-slate-500 sm:text-sm">
                                    Tambahkan kredensial yang mendukung keahlian
                                    Anda.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-slate-400">
                            <ChevronDown
                                className={`h-4 w-4 transition-transform duration-200 ${
                                    expandedSection === 'certifications'
                                        ? 'rotate-180 text-sky-600'
                                        : ''
                                }`}
                            />
                            <button
                                type="button"
                                onClick={(e) =>
                                    clearSection(e, 'certifications')
                                }
                                className="rounded-md p-1 transition-colors hover:bg-slate-100 hover:text-red-500"
                                title="Hapus bagian ini"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Accordion Content */}
                    {expandedSection === 'certifications' && (
                        <div className="space-y-4 border-t border-sky-100/80 bg-white p-5">
                            {additionalData.certifications.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                                    <p className="text-xs text-slate-500">
                                        Belum ada sertifikasi yang ditambahkan.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={addCertification}
                                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-sky-600 hover:bg-sky-100"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Tambah Sertifikasi
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {additionalData.certifications.map(
                                        (item) => (
                                            <div
                                                key={item.id}
                                                className="relative rounded-xl border border-slate-200 bg-slate-50/50 p-4"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeCertification(
                                                            item.id,
                                                        )
                                                    }
                                                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                                <div className="grid grid-cols-1 gap-3 pr-6 sm:grid-cols-3">
                                                    <div className="sm:col-span-2">
                                                        <label className="block text-xs font-medium text-slate-700">
                                                            Nama Sertifikasi /
                                                            Lisensi
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={item.name}
                                                            onChange={(e) =>
                                                                updateCertification(
                                                                    item.id,
                                                                    'name',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Contoh: AWS Certified Solutions Architect"
                                                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-700">
                                                            Tahun
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={item.year}
                                                            onChange={(e) =>
                                                                updateCertification(
                                                                    item.id,
                                                                    'year',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="2024"
                                                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div className="sm:col-span-3">
                                                        <label className="block text-xs font-medium text-slate-700">
                                                            Organisasi Penerbit
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={item.issuer}
                                                            onChange={(e) =>
                                                                updateCertification(
                                                                    item.id,
                                                                    'issuer',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Amazon Web Services (AWS)"
                                                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                    <button
                                        type="button"
                                        onClick={addCertification}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50/50 px-3.5 py-1.5 text-xs font-semibold text-sky-600 hover:bg-sky-100"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Tambah Sertifikasi Lain
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 4. Situs web dan media sosial */}
                <div
                    className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                        expandedSection === 'social'
                            ? 'border-sky-300 bg-sky-50/20 shadow-xs'
                            : 'border-sky-100 bg-white hover:border-sky-200'
                    }`}
                >
                    <div
                        onClick={() => toggleSection('social')}
                        className="flex cursor-pointer items-center justify-between p-4 sm:p-5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                                <Link2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-800 sm:text-base">
                                    Situs web dan media sosial
                                </h3>
                                <p className="text-xs text-slate-500 sm:text-sm">
                                    Bagikan portofolio Anda, blog, LinkedIn,
                                    atau situs web terkait lainnya.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-slate-400">
                            <ChevronDown
                                className={`h-4 w-4 transition-transform duration-200 ${
                                    expandedSection === 'social'
                                        ? 'rotate-180 text-sky-600'
                                        : ''
                                }`}
                            />
                            <button
                                type="button"
                                onClick={(e) => clearSection(e, 'social')}
                                className="rounded-md p-1 transition-colors hover:bg-slate-100 hover:text-red-500"
                                title="Hapus bagian ini"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Accordion Content */}
                    {expandedSection === 'social' && (
                        <div className="space-y-4 border-t border-sky-100/80 bg-white p-5">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700">
                                        LinkedIn Profile URL
                                    </label>
                                    <input
                                        type="url"
                                        value={contact.linkedin_url || ''}
                                        onChange={(e) =>
                                            onContactChange(
                                                'linkedin_url',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="https://linkedin.com/in/username"
                                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700">
                                        Portfolio / Personal Website
                                    </label>
                                    <input
                                        type="url"
                                        value={contact.website_url || ''}
                                        onChange={(e) =>
                                            onContactChange(
                                                'website_url',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="https://myportfolio.dev"
                                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
                >
                    Kembali
                </button>
                <button
                    type="button"
                    onClick={handleNextClick}
                    className="rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-sky-600 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                >
                    Berikutnya: Unduh
                </button>
            </div>

            {/* Download & Finalize Modal */}
            {showDownloadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
                    <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-7">
                        <button
                            type="button"
                            onClick={() => setShowDownloadModal(false)}
                            className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                                <FileCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Finalisasi & Ekspor CV
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Pilih template dan unduh dokumen CV Anda.
                                </p>
                            </div>
                        </div>

                        {/* Title & Status */}
                        <div className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700">
                                    Judul Dokumen CV
                                </label>
                                <input
                                    type="text"
                                    value={titleInput}
                                    onChange={(e) =>
                                        setTitleInput(e.target.value)
                                    }
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-sky-500 focus:outline-none"
                                />
                            </div>

                            {/* Template Selector */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                    Pilihan Template CV Aktif
                                </label>
                                <div className="grid grid-cols-2 gap-2.5">
                                    {templates.length > 0 ? (
                                        templates.map((tpl) => (
                                            <button
                                                key={tpl.id}
                                                type="button"
                                                onClick={() =>
                                                    setActiveTemplate(tpl.id)
                                                }
                                                className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                                                    activeTemplate === tpl.id
                                                        ? 'border-sky-500 bg-sky-50/50 text-sky-900 shadow-xs'
                                                        : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                            >
                                                <div>
                                                    <p className="text-xs font-bold">
                                                        {tpl.name}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500">
                                                        {tpl.category ||
                                                            'Standar'}
                                                    </p>
                                                </div>
                                                {activeTemplate === tpl.id && (
                                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-sky-500" />
                                                )}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="col-span-2 rounded-lg border border-slate-200 p-2.5 text-xs text-slate-500">
                                            Modern Minimalist (Default)
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status Publish */}
                            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                                <div>
                                    <p className="text-xs font-semibold text-slate-800">
                                        Status Publikasi
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                        CV dapat diakses secara online jika
                                        dipublikasikan.
                                    </p>
                                </div>
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        checked={publishedStatus}
                                        onChange={(e) =>
                                            setPublishedStatus(e.target.checked)
                                        }
                                        className="peer sr-only"
                                    />
                                    <div className="peer h-5 w-9 rounded-full bg-slate-200 peer-checked:bg-sky-500 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
                                </label>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
                            <a
                                href={`/cv/${cvId}/download-pdf?stream=1`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                <Eye className="h-3.5 w-3.5" />
                                Pratinjau PDF
                            </a>
                            <button
                                type="button"
                                onClick={handleConfirmFinalize}
                                disabled={isFinalizing}
                                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-sky-500 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-sky-600 disabled:opacity-50"
                            >
                                <Download className="h-3.5 w-3.5" />
                                {isFinalizing
                                    ? 'Menyimpan...'
                                    : 'Unduh Dokumen PDF'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
