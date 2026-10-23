import React, { useState, useRef } from 'react';
import {
    UploadCloud,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    FileText,
    Loader2,
    X,
    ArrowRight,
    Briefcase,
    GraduationCap,
    Wrench,
    Award,
    RefreshCw,
    ShieldCheck,
    Check,
    Building2,
    Calendar,
    MapPin,
    Trash2,
    Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
    UserProfileData,
    UserExperienceItem,
    UserEducationItem,
    UserOrganizationItem,
    UserCertificationItem,
    UserAwardItem,
} from '@/types/profile';

interface ParsedCvData {
    personal_info: {
        full_name?: string | null;
        email?: string | null;
        whatsapp_number?: string | null;
        location?: string | null;
        linkedin_url?: string | null;
        portfolio_link?: string | null;
    };
    about_me: string;
    field_of_interest: string[];
    tools: string[];
    experiences: UserExperienceItem[];
    educations: UserEducationItem[];
    organizations: UserOrganizationItem[];
    certifications: UserCertificationItem[];
    awards: UserAwardItem[];
}

interface CvImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (updatedProfile: UserProfileData) => void;
}

function getCsrfToken(): string {
    const metaTag = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (metaTag) return metaTag;
    const match = document.cookie.match(new RegExp('(^|;\\s*)XSRF-TOKEN=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : '';
}

export function CvImportModal({ isOpen, onClose, onSuccess }: CvImportModalProps) {
    const [step, setStep] = useState<'upload' | 'parsing' | 'preview'>('upload');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [tone, setTone] = useState<'professional' | 'concise' | 'impactful'>('professional');
    const [isDragging, setIsDragging] = useState(false);
    const [parsedData, setParsedData] = useState<ParsedCvData | null>(null);
    const [applyMode, setApplyMode] = useState<'replace' | 'merge'>('replace');
    const [activeTab, setActiveTab] = useState<'biodata' | 'experiences' | 'educations' | 'skills'>('biodata');
    const [isApplying, setIsApplying] = useState(false);
    const [aiMeta, setAiMeta] = useState<{
        provider_name?: string;
        model_name?: string;
        latency_ms?: number;
    } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleReset = () => {
        setStep('upload');
        setSelectedFile(null);
        setParsedData(null);
        setAiMeta(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileValidation = (file: File) => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext !== 'pdf' && ext !== 'docx') {
            toast.error('Format berkas tidak didukung. Harap unggah file PDF atau DOCX.');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error('Ukuran berkas melebihi batas maksimal 10 MB.');
            return;
        }

        setSelectedFile(file);
    };

    const handleStartExtraction = async () => {
        if (!selectedFile) {
            toast.error('Silakan pilih berkas CV terlebih dahulu.');
            return;
        }

        setStep('parsing');

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('tone', tone);

        try {
            const token = getCsrfToken();
            const response = await fetch('/api/v1/profile/import-cv/parse', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-XSRF-TOKEN': token,
                },
                credentials: 'same-origin',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || 'Gagal memproses dokumen CV.');
                setStep('upload');
                return;
            }

            if (result.data?.parsed) {
                setParsedData(result.data.parsed);
                setAiMeta({
                    provider_name: result.data.provider_name,
                    model_name: result.data.model_name,
                    latency_ms: result.data.latency_ms,
                });
                setStep('preview');
                toast.success('CV berhasil diekstrak dan disempurnakan oleh AI!');
            } else {
                toast.error('Data hasil pemrosesan tidak valid.');
                setStep('upload');
            }
        } catch {
            toast.error('Terjadi kendala jaringan saat menghubungi server.');
            setStep('upload');
        }
    };

    const handleApplyToProfile = async () => {
        if (!parsedData) return;

        setIsApplying(true);
        try {
            const token = getCsrfToken();
            const response = await fetch('/api/v1/profile/import-cv/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-XSRF-TOKEN': token,
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    mode: applyMode,
                    ...parsedData,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || 'Gagal menerapkan data ke profil.');
                setIsApplying(false);
                return;
            }

            toast.success(result.message || 'Profil berhasil diperbarui dari data CV!');
            if (result.data) {
                onSuccess(result.data);
            }
            onClose();
            handleReset();
        } catch {
            toast.error('Terjadi kesalahan jaringan saat menyimpan ke profil.');
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
            <div className="relative flex flex-col w-full max-w-4xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                {/* Header Modal */}
                <div className="flex items-center justify-between px-6 py-4.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <div className="flex items-center gap-2.5">
                        <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-500/20">
                            <Sparkles className="size-4.5" />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                Import CV dengan AI Enhance
                                {step === 'preview' && (
                                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                        Siap Diterapkan
                                    </span>
                                )}
                            </h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {step === 'upload' && 'Unggah file PDF atau Word (DOCX) untuk diekstrak dan disempurnakan otomatis ke profil'}
                                {step === 'parsing' && 'Sedang menganalisis dokumen dan menyempurnakan ke standar ATS...'}
                                {step === 'preview' && 'Tinjau dan sesuaikan data sebelum disimpan ke profil Anda'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* TAHAP 1: UPLOAD & KONFIGURASI */}
                    {step === 'upload' && (
                        <div className="space-y-6">
                            {/* Drag and Drop Zone */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.docx"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) handleFileValidation(e.target.files[0]);
                                }}
                            />

                            {!selectedFile ? (
                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={(e) => {
                                        e.preventDefault();
                                        setIsDragging(false);
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setIsDragging(false);
                                        if (e.dataTransfer.files?.[0]) {
                                            handleFileValidation(e.dataTransfer.files[0]);
                                        }
                                    }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`flex flex-col items-center justify-center p-8 sm:p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 text-center ${
                                        isDragging
                                            ? 'border-sky-500 bg-sky-50/60 dark:border-sky-400 dark:bg-sky-950/30'
                                            : 'border-neutral-300 bg-neutral-50/50 hover:border-sky-400 hover:bg-sky-50/30 dark:border-neutral-700 dark:bg-neutral-800/40 dark:hover:border-sky-500'
                                    }`}
                                >
                                    <div className="flex aspect-square size-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400 mb-3.5 shadow-sm">
                                        <UploadCloud className="size-7" />
                                    </div>
                                    <p className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-white">
                                        Pilih atau seret berkas CV Anda ke sini
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                        Mendukung file dokumen <span className="font-semibold text-neutral-700 dark:text-neutral-300">PDF</span> dan <span className="font-semibold text-neutral-700 dark:text-neutral-300">DOCX</span> (Maksimal 10 MB)
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="mt-4 rounded-xl text-xs font-semibold gap-1.5"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fileInputRef.current?.click();
                                        }}
                                    >
                                        <FileText className="size-3.5" />
                                        Pilih dari Perangkat
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-4.5 rounded-2xl border border-sky-200 bg-sky-50/40 dark:border-sky-900/60 dark:bg-sky-950/30">
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="flex aspect-square size-11 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
                                            <FileText className="size-5.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Berkas siap diproses
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedFile(null)}
                                        className="p-2 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                        title="Hapus file"
                                    >
                                        <Trash2 className="size-4.5" />
                                    </button>
                                </div>
                            )}

                            {/* Pilihan Gaya Bahasa (Tone) */}
                            <div className="space-y-3">
                                <Label className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                                    <Sparkles className="size-3.5 text-sky-600" />
                                    Pilih Gaya Bahasa Penyempurnaan AI (Tone)
                                </Label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setTone('professional')}
                                        className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                                            tone === 'professional'
                                                ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 ring-2 ring-sky-500/20'
                                                : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                                        }`}
                                    >
                                        <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center justify-between">
                                            👔 Profesional
                                            {tone === 'professional' && <Check className="size-3.5 text-sky-600" />}
                                        </span>
                                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                                            Formal, elegan, berwibawa, dan standar korporat modern.
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setTone('concise')}
                                        className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                                            tone === 'concise'
                                                ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 ring-2 ring-sky-500/20'
                                                : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                                        }`}
                                    >
                                        <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center justify-between">
                                            ⚡ Ringkas
                                            {tone === 'concise' && <Check className="size-3.5 text-sky-600" />}
                                        </span>
                                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                                            Padat, tajam, to-the-point tanpa kalimat bertele-tele.
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setTone('impactful')}
                                        className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                                            tone === 'impactful'
                                                ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 ring-2 ring-sky-500/20'
                                                : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                                        }`}
                                    >
                                        <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center justify-between">
                                            🚀 Impresif
                                            {tone === 'impactful' && <Check className="size-3.5 text-sky-600" />}
                                        </span>
                                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                                            Aksi kuat, berorientasi pencapaian nyata & metrik ATS.
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Keuntungan Fitur */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-neutral-600 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                                    <span>Ekstraksi data profil otomatis</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                                    <span>Poin aksi berstandar ATS</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                                    <span>Bisa ditinjau sebelum disimpan</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAHAP 2: PARSING ANIMASI */}
                    {step === 'parsing' && (
                        <div className="flex flex-col items-center justify-center py-16 text-center space-y-5">
                            <div className="relative">
                                <div className="size-20 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/25 animate-pulse">
                                    <Sparkles className="size-10" />
                                </div>
                                <Loader2 className="size-24 text-sky-500 absolute -top-2 -left-2 animate-spin opacity-40" />
                            </div>

                            <div className="max-w-md space-y-2">
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                                    Sedang Mengekstrak & Menyempurnakan CV
                                </h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                    AI sedang membaca isi dokumen, memformat riwayat karier, dan mengoptimalkan deskripsi kerja ke standar ATS internasional.
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                                <ShieldCheck className="size-4 text-emerald-500" />
                                <span>Menggunakan API AI Model Aktif Admin</span>
                            </div>
                        </div>
                    )}

                    {/* TAHAP 3: PREVIEW & EDITOR */}
                    {step === 'preview' && parsedData && (
                        <div className="space-y-6">
                            {/* AI Meta Banner */}
                            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-sky-50 via-indigo-50/50 to-white dark:from-sky-950/40 dark:via-indigo-950/30 dark:to-neutral-900 border border-sky-100 dark:border-sky-900/50 text-xs">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="size-4 text-sky-600 shrink-0" />
                                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                        Data berhasil di-enhance dengan AI
                                    </span>
                                    {aiMeta?.model_name && (
                                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white dark:bg-neutral-800 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300">
                                            {aiMeta.model_name}
                                        </span>
                                    )}
                                </div>
                                {aiMeta?.latency_ms && (
                                    <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                                        Waktu proses: {(aiMeta.latency_ms / 1000).toFixed(1)}s
                                    </span>
                                )}
                            </div>

                            {/* Pilihan Metode Penerapan: Replace vs Merge */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                    Metode Penerapan ke Profil:
                                </Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setApplyMode('replace')}
                                        className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                                            applyMode === 'replace'
                                                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                                                : 'border-neutral-200 dark:border-neutral-800'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-neutral-900 dark:text-white">
                                                Ganti Semua Data Profil (Replace)
                                            </span>
                                            {applyMode === 'replace' && <Check className="size-4 text-indigo-600" />}
                                        </div>
                                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                                            Rekomendasi jika ingin merombak profil dari awal. Riwayat profil lama digantikan sepenuhnya dengan data CV baru ini.
                                        </p>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setApplyMode('merge')}
                                        className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                                            applyMode === 'merge'
                                                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                                                : 'border-neutral-200 dark:border-neutral-800'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-neutral-900 dark:text-white">
                                                Gabungkan Data (Merge)
                                            </span>
                                            {applyMode === 'merge' && <Check className="size-4 text-indigo-600" />}
                                        </div>
                                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                                            Menambahkan riwayat pekerjaan & pendidikan baru tanpa menghapus data riwayat lama yang sudah ada di profil.
                                        </p>
                                    </button>
                                </div>
                            </div>

                            {/* Navigasi Tab Data Preview */}
                            <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-2 overflow-x-auto">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('biodata')}
                                    className={`px-3 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                                        activeTab === 'biodata'
                                            ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
                                            : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                                    }`}
                                >
                                    Biodata & Ringkasan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('experiences')}
                                    className={`px-3 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                                        activeTab === 'experiences'
                                            ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
                                            : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                                    }`}
                                >
                                    Pengalaman ({parsedData.experiences?.length || 0})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('educations')}
                                    className={`px-3 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                                        activeTab === 'educations'
                                            ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
                                            : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                                    }`}
                                >
                                    Pendidikan ({parsedData.educations?.length || 0})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('skills')}
                                    className={`px-3 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                                        activeTab === 'skills'
                                            ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
                                            : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                                    }`}
                                >
                                    Keahlian ({parsedData.tools?.length || 0})
                                </button>
                            </div>

                            {/* TAB 1: BIODATA & RINGKASAN */}
                            {activeTab === 'biodata' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                                Nama Lengkap
                                            </Label>
                                            <Input
                                                value={parsedData.personal_info.full_name || ''}
                                                onChange={(e) =>
                                                    setParsedData({
                                                        ...parsedData,
                                                        personal_info: {
                                                            ...parsedData.personal_info,
                                                            full_name: e.target.value,
                                                        },
                                                    })
                                                }
                                                className="text-xs h-9 rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                                Email
                                            </Label>
                                            <Input
                                                value={parsedData.personal_info.email || ''}
                                                onChange={(e) =>
                                                    setParsedData({
                                                        ...parsedData,
                                                        personal_info: {
                                                            ...parsedData.personal_info,
                                                            email: e.target.value,
                                                        },
                                                    })
                                                }
                                                className="text-xs h-9 rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                                WhatsApp / No. Telepon
                                            </Label>
                                            <Input
                                                value={parsedData.personal_info.whatsapp_number || ''}
                                                onChange={(e) =>
                                                    setParsedData({
                                                        ...parsedData,
                                                        personal_info: {
                                                            ...parsedData.personal_info,
                                                            whatsapp_number: e.target.value,
                                                        },
                                                    })
                                                }
                                                className="text-xs h-9 rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                                Lokasi / Domisili
                                            </Label>
                                            <Input
                                                value={parsedData.personal_info.location || ''}
                                                onChange={(e) =>
                                                    setParsedData({
                                                        ...parsedData,
                                                        personal_info: {
                                                            ...parsedData.personal_info,
                                                            location: e.target.value,
                                                        },
                                                    })
                                                }
                                                className="text-xs h-9 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    {/* Ringkasan Profil (Enhanced About Me) */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                                                <Sparkles className="size-3.5 text-sky-500" />
                                                Ringkasan Profesional (Tentang Saya - Enhanced)
                                            </Label>
                                            <span className="text-[10px] text-neutral-400">Dapat diedit</span>
                                        </div>
                                        <textarea
                                            rows={4}
                                            value={parsedData.about_me || ''}
                                            onChange={(e) =>
                                                setParsedData({
                                                    ...parsedData,
                                                    about_me: e.target.value,
                                                })
                                            }
                                            className="w-full flex rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-xs leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-sky-500"
                                        />
                                    </div>

                                    {/* Bidang Minat / Target Posisi */}
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                            Target Posisi / Bidang Minat
                                        </Label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {parsedData.field_of_interest?.map((field, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                                                >
                                                    {field}
                                                </span>
                                            ))}
                                            {(!parsedData.field_of_interest || parsedData.field_of_interest.length === 0) && (
                                                <span className="text-xs text-neutral-400 italic">Tidak terdeteksi</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: PENGALAMAN KERJA */}
                            {activeTab === 'experiences' && (
                                <div className="space-y-4">
                                    {parsedData.experiences?.length === 0 ? (
                                        <div className="text-center py-8 text-neutral-400 text-xs italic">
                                            Tidak ditemukan data pengalaman kerja pada resume.
                                        </div>
                                    ) : (
                                        parsedData.experiences?.map((exp, idx) => (
                                            <div
                                                key={idx}
                                                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-800/40 space-y-3"
                                            >
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <div>
                                                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
                                                            {exp.position}
                                                        </h4>
                                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                                                            {exp.company} {exp.location ? `• ${exp.location}` : ''}
                                                        </p>
                                                    </div>
                                                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                                                        {exp.start_date
                                                            ? (exp.is_current ? `${exp.start_date} — Sekarang` : (exp.end_date ? `${exp.start_date} — ${exp.end_date}` : exp.start_date))
                                                            : (exp.end_date ? `Selesai: ${exp.end_date}` : 'Periode tidak ditentukan')}
                                                    </span>
                                                </div>

                                                {/* Bullet points or text description */}
                                                <div className="space-y-1.5 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                                                    <p className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                                                        <Sparkles className="size-3 text-sky-500" />
                                                        Deskripsi Pekerjaan ATS Enhanced:
                                                    </p>
                                                    {Array.isArray(exp.description) ? (
                                                        <ul className="list-disc list-inside space-y-1 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                                            {exp.description.map((bullet, bIdx) => (
                                                                <li key={bIdx} className="pl-1">
                                                                    {bullet}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                                                            {exp.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* TAB 3: PENDIDIKAN */}
                            {activeTab === 'educations' && (
                                <div className="space-y-4">
                                    {parsedData.educations?.length === 0 ? (
                                        <div className="text-center py-8 text-neutral-400 text-xs italic">
                                            Tidak ditemukan data pendidikan pada resume.
                                        </div>
                                    ) : (
                                        parsedData.educations?.map((edu, idx) => (
                                            <div
                                                key={idx}
                                                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-800/40 space-y-1.5"
                                            >
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
                                                        {edu.institution}
                                                    </h4>
                                                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                                                        {edu.start_date || ''} — {edu.end_date || 'Selesai'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                                    {[edu.degree, edu.major].filter(Boolean).join(' • ')}
                                                </p>
                                                {edu.gpa && (
                                                    <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                                                        IPK / GPA: {edu.gpa}
                                                    </p>
                                                )}
                                                {edu.description && (
                                                    <p className="text-xs text-neutral-700 dark:text-neutral-300 pt-1 border-t border-neutral-100 dark:border-neutral-800 whitespace-pre-line">
                                                        {edu.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* TAB 4: KEAHLIAN & LAINNYA */}
                            {activeTab === 'skills' && (
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                            Keahlian & Tools yang Distandarisasi AI ({parsedData.tools?.length || 0})
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                            {parsedData.tools?.map((tool, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs font-medium px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                                                >
                                                    {tool}
                                                </span>
                                            ))}
                                            {(!parsedData.tools || parsedData.tools.length === 0) && (
                                                <span className="text-xs text-neutral-400 italic">Tidak ada keahlian terdeteksi</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Organisasi jika ada */}
                                    {parsedData.organizations && parsedData.organizations.length > 0 && (
                                        <div className="space-y-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                            <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                Pengalaman Organisasi ({parsedData.organizations.length})
                                            </Label>
                                            <div className="space-y-2">
                                                {parsedData.organizations.map((org, idx) => (
                                                    <div key={idx} className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs">
                                                        <span className="font-bold">{org.role}</span> di {org.organizations_name}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Sertifikasi jika ada */}
                                    {parsedData.certifications && parsedData.certifications.length > 0 && (
                                        <div className="space-y-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                            <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                Sertifikasi ({parsedData.certifications.length})
                                            </Label>
                                            <div className="space-y-2">
                                                {parsedData.certifications.map((cert, idx) => (
                                                    <div key={idx} className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs">
                                                        <span className="font-bold">{cert.name}</span> — {cert.issuer}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Modal Actions */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                    {step === 'upload' && (
                        <>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="text-xs font-semibold rounded-xl"
                            >
                                Batal
                            </Button>
                            <Button
                                type="button"
                                disabled={!selectedFile}
                                onClick={handleStartExtraction}
                                className="rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white gap-2 shadow-md shadow-sky-500/20"
                            >
                                <Sparkles className="size-4" />
                                <span>Mulai Ekstrak & Enhance</span>
                            </Button>
                        </>
                    )}

                    {step === 'parsing' && (
                        <div className="w-full text-center">
                            <span className="text-xs text-neutral-400 italic">
                                Mohon tunggu beberapa detik, proses enhance sedang berjalan...
                            </span>
                        </div>
                    )}

                    {step === 'preview' && (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleReset}
                                disabled={isApplying}
                                className="text-xs font-semibold rounded-xl gap-1.5"
                            >
                                <RefreshCw className="size-3.5" />
                                <span>Ulangi Unggah</span>
                            </Button>

                            <Button
                                type="button"
                                disabled={isApplying}
                                onClick={handleApplyToProfile}
                                className="rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-2 shadow-md shadow-emerald-500/20"
                            >
                                {isApplying ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        <span>Menyimpan ke Profil...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check className="size-4" />
                                        <span>Terapkan ke Profil</span>
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
