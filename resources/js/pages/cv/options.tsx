import React, { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    UploadCloud,
    Sparkles,
    ArrowRight,
    ArrowLeft,
    FileText,
    CheckCircle2,
    ShieldCheck,
    Clock,
    Zap,
    Trash2,
    Loader2,
    FileCheck,
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';

interface CvOptionsPageProps {
    template_id?: number | null;
}

export default function CvOptionsPage({ template_id }: CvOptionsPageProps) {
    const [activeView, setActiveView] = useState<'select' | 'upload'>('select');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const handleFileValidationAndSet = (file: File) => {
        setErrorMessage(null);

        // Allowed extensions: pdf, doc, docx
        const validExtensions = ['pdf', 'doc', 'docx'];
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

        if (!validExtensions.includes(fileExtension)) {
            setErrorMessage(
                'Format file tidak didukung. Harap unggah file PDF, DOC, atau DOCX.'
            );
            return;
        }

        // Limit size to 10MB
        if (file.size > 10 * 1024 * 1024) {
            setErrorMessage(
                'Ukuran file terlalu besar. Batas maksimal ukuran adalah 10 MB.'
            );
            return;
        }

        setSelectedFile(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileValidationAndSet(e.dataTransfer.files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileValidationAndSet(e.target.files[0]);
        }
    };

    const handleProceedWithUploadedFile = () => {
        if (!selectedFile) return;

        setIsProcessing(true);
        // Simulasi pemindaian file resume sebelum beralih ke builder
        setTimeout(() => {
            router.visit(
                template_id ? `/cv/builder?template_id=${template_id}` : '/cv/builder',
            );
        }, 1500);
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#FDFDFD] font-sans text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
            <Head title="Pilihan Pembuatan Resume - Aikrut" />

            {/* Minimalist Top Navigation Header */}
            <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-md transition-colors dark:border-neutral-800 dark:bg-neutral-900/95">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Brand Logo */}
                    <Link
                        href="/"
                        className="group flex items-center gap-2.5 focus:outline-none"
                    >
                        <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-colors group-hover:bg-blue-700">
                            <AppLogoIcon className="size-5 fill-current" />
                        </div>
                        <span className="font-sans text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            Aikrut
                        </span>
                    </Link>

                    {/* Back to Templates Link */}
                    <Link
                        href="/cv/templates"
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                    >
                        <ArrowLeft className="size-4" />
                        <span>Kembali ke Template</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                {activeView === 'select' ? (
                    <div>
                        {/* Hero Header */}
                        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
                            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400">
                                <Zap className="size-3.5" />
                                Langkah Cepat
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl dark:text-white">
                                Bagaimana Anda ingin memulai?
                            </h1>
                            <p className="mt-3.5 text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400">
                                Pilih cara yang paling sesuai untuk menyusun resume
                                profesional berstandar ATS Anda.
                            </p>
                        </div>

                        {/* Options Grid (2 Cards) */}
                        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
                            {/* Card 1: Sudah Memiliki Resume */}
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={() => setActiveView('upload')}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setActiveView('upload');
                                    }
                                }}
                                className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border-2 border-neutral-200/90 bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 focus:border-blue-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-500"
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex aspect-square size-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-105 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-400">
                                            <UploadCloud className="size-7" />
                                        </div>
                                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                            Hemat Waktu
                                        </span>
                                    </div>

                                    <h2 className="mt-6 text-xl font-bold text-neutral-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                        Sudah memiliki resume
                                    </h2>

                                    <p className="mt-2.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                                        Unggah resume yang sudah Anda miliki dalam format PDF
                                        atau Word. Sistem kami akan memformat ulang dengan
                                        standar ATS.
                                    </p>

                                    <ul className="mt-5 space-y-2.5 border-t border-neutral-100 pt-5 text-xs text-neutral-600 dark:border-neutral-800/80 dark:text-neutral-400">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                                            <span>Format otomatis sesuai standar industri</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                                            <span>Mendukung file PDF & Word (DOCX)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                                            <span>Edit data dengan mudah setelahnya</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="mt-8">
                                    <Button
                                        type="button"
                                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-all group-hover:bg-blue-700"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveView('upload');
                                        }}
                                    >
                                        <span>Unggah Resume</span>
                                        <UploadCloud className="size-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Card 2: Mulai Dari Awal */}
                            <Link
                                href={
                                    template_id
                                        ? `/cv/builder?template_id=${template_id}`
                                        : '/cv/builder'
                                }
                                className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border-2 border-neutral-200/90 bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 focus:border-emerald-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-500"
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex aspect-square size-14 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 transition-transform duration-300 group-hover:scale-105 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-400">
                                            <Sparkles className="size-7" />
                                        </div>
                                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                            Rekomendasi
                                        </span>
                                    </div>

                                    <h2 className="mt-6 text-xl font-bold text-neutral-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                                        Mulai dari awal
                                    </h2>

                                    <p className="mt-2.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                                        Buat resume baru dari nol langkah demi langkah
                                        dengan bantuan panduan cerdas, tips penulisan, dan
                                        contoh siap pakai.
                                    </p>

                                    <ul className="mt-5 space-y-2.5 border-t border-neutral-100 pt-5 text-xs text-neutral-600 dark:border-neutral-800/80 dark:text-neutral-400">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                            <span>Panduan pengisian terstruktur dan mudah</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                            <span>Kiat penulisan deskripsi kerja profesional</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                            <span>Pratinjau CV real-time dan unduh PDF</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="mt-8">
                                    <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-all group-hover:bg-emerald-700">
                                        <span>Buat dari Awal</span>
                                        <ArrowRight className="size-4" />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* Upload Panel View */
                    <div className="mx-auto w-full max-w-2xl">
                        {/* Top Back Action */}
                        <div className="mb-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveView('select');
                                    setErrorMessage(null);
                                }}
                                className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                            >
                                <ArrowLeft className="size-4" />
                                <span>Kembali ke pilihan</span>
                            </button>
                        </div>

                        {/* Card Container */}
                        <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm sm:p-10 dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mb-6 text-center">
                                <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
                                    Unggah Resume Anda
                                </h2>
                                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                                    Unggah dokumen resume lama Anda untuk disesuaikan secara
                                    otomatis.
                                </p>
                            </div>

                            {/* Error Alert if any */}
                            {errorMessage && (
                                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                                    {errorMessage}
                                </div>
                            )}

                            {/* Dropzone Area */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                onChange={handleFileInputChange}
                            />

                            {!selectedFile ? (
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 sm:p-12 ${
                                        isDragging
                                            ? 'border-blue-500 bg-blue-50/60 dark:border-blue-400 dark:bg-blue-950/30'
                                            : 'border-neutral-300 bg-neutral-50/50 hover:border-blue-400 hover:bg-blue-50/30 dark:border-neutral-700 dark:bg-neutral-800/40 dark:hover:border-blue-500 dark:hover:bg-neutral-800/80'
                                    }`}
                                >
                                    <div className="flex aspect-square size-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                                        <UploadCloud className="size-8" />
                                    </div>
                                    <p className="mt-4 text-base font-semibold text-neutral-900 dark:text-white">
                                        Tarik & lepas file resume Anda ke sini
                                    </p>
                                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                        atau{' '}
                                        <span className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
                                            telusuri file
                                        </span>{' '}
                                        dari perangkat Anda
                                    </p>
                                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                                        <span className="rounded-md bg-neutral-200/80 px-2 py-1 font-medium dark:bg-neutral-700">
                                            PDF
                                        </span>
                                        <span className="rounded-md bg-neutral-200/80 px-2 py-1 font-medium dark:bg-neutral-700">
                                            DOC
                                        </span>
                                        <span className="rounded-md bg-neutral-200/80 px-2 py-1 font-medium dark:bg-neutral-700">
                                            DOCX
                                        </span>
                                        <span className="ml-1 text-neutral-400">
                                            (Maksimal 10 MB)
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                /* Selected File Preview Card */
                                <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 dark:border-neutral-700/80 dark:bg-neutral-800/60">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <div className="flex aspect-square size-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                                                <FileCheck className="size-6" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
                                                    {selectedFile.name}
                                                </p>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    {formatFileSize(selectedFile.size)} • Siap diproses
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            disabled={isProcessing}
                                            onClick={() => {
                                                setSelectedFile(null);
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = '';
                                                }
                                            }}
                                            className="cursor-pointer rounded-lg p-2 text-neutral-400 hover:bg-neutral-200/60 hover:text-red-600 focus:outline-none dark:hover:bg-neutral-700 dark:hover:text-red-400"
                                            title="Hapus file"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>

                                    {/* Action Button */}
                                    <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
                                        <button
                                            type="button"
                                            disabled={isProcessing}
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-xs font-medium text-neutral-500 hover:text-neutral-800 hover:underline dark:text-neutral-400 dark:hover:text-neutral-200"
                                        >
                                            Ganti file lain
                                        </button>

                                        <Button
                                            type="button"
                                            disabled={isProcessing}
                                            onClick={handleProceedWithUploadedFile}
                                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-blue-700 sm:w-auto"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="size-4 animate-spin" />
                                                    <span>Memproses Resume...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Lanjutkan ke Builder</span>
                                                    <ArrowRight className="size-4" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Privacy and Security Guarantee */}
                            <div className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-neutral-500 dark:text-neutral-400">
                                <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                <span>
                                    Privasi terjamin. File resume Anda dienkripsi dan hanya
                                    digunakan untuk kebutuhan pembuatan CV Anda.
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
