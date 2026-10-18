import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Folder,
    Star,
    Palette,
    FileText,
    Image,
    Briefcase,
    ShieldCheck,
    Sparkles,
    CheckCircle2,
    Download,
    Loader2,
    ArrowRight,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TemplateItem {
    id: number;
    name: string;
    category?: string;
    is_active: boolean;
    preview_type?: 'hendra' | 'ayu' | 'jasmine' | 'indigo';
}

interface TemplatesPageProps {
    templates?: TemplateItem[];
}

interface CategoryTab {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isAvailable: boolean;
}

const CATEGORIES: CategoryTab[] = [
    { id: 'all', label: 'Semua Template', icon: Folder, isAvailable: true },
    { id: 'simple', label: 'Sederhana', icon: Star, isAvailable: true },
    { id: 'modern', label: 'Modern', icon: Palette, isAvailable: true },
    { id: 'single_col', label: 'Satu kolom', icon: FileText, isAvailable: true },
    { id: 'with_photo', label: 'Dengan foto', icon: Image, isAvailable: true },
    { id: 'professional', label: 'Profesional', icon: Briefcase, isAvailable: true },
    { id: 'ats', label: 'ATS', icon: ShieldCheck, isAvailable: true },
];

export default function CvTemplatesPage({
    templates = [],
}: TemplatesPageProps) {
    const isFromProfile =
        typeof window !== 'undefined' &&
        new URLSearchParams(window.location.search).get('source') === 'profile';

    // Default active tab is 'ats'
    const [selectedCategory, setSelectedCategory] = useState<string>('ats');
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [exportingTemplateId, setExportingTemplateId] = useState<number | null>(null);
    const [exportSuccessModal, setExportSuccessModal] = useState<{
        isOpen: boolean;
        cvId: number;
        title: string;
        downloadUrl: string;
        builderUrl: string;
    } | null>(null);

    const handleExportFromProfile = async (templateId: number, overwrite = false) => {
        setIsExporting(true);
        setExportingTemplateId(templateId);
        try {
            const csrfToken =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content') || '';
            const response = await fetch('/cv/create-from-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    template_id: templateId,
                    overwrite: overwrite,
                }),
            });

            const result = await response.json();
            if (result.status === 'success') {
                // Trigger instant download
                const link = document.createElement('a');
                link.href = result.download_url;
                link.setAttribute('download', '');
                document.body.appendChild(link);
                link.click();
                link.remove();

                // Open success modal
                setExportSuccessModal({
                    isOpen: true,
                    cvId: result.cv_id,
                    title: result.cv_title,
                    downloadUrl: result.download_url,
                    builderUrl: result.builder_url,
                });
            }
        } catch (err) {
            console.error('Failed to export CV', err);
        } finally {
            setIsExporting(false);
            setExportingTemplateId(null);
        }
    };

    // Hanya tampilkan template yang sudah dibuat (Modern Minimalist & Classic Professional)
    const activeTemplates: TemplateItem[] = (
        templates.length > 0
            ? templates
            : [
                  {
                      id: 58,
                      name: 'Modern Minimalist',
                      category: 'Modern',
                      is_active: true,
                  },
                  {
                      id: 59,
                      name: 'Classic Professional',
                      category: 'Classic',
                      is_active: true,
                  },
              ]
    ).map((tpl) => {
        const isModern =
            tpl.category?.toLowerCase() === 'modern' ||
            tpl.name.toLowerCase().includes('modern');
        return {
            ...tpl,
            preview_type: isModern ? 'hendra' : 'ayu',
        };
    });

    const displayedTemplates = activeTemplates.filter((tpl) => {
        if (selectedCategory === 'ats' || selectedCategory === 'all') return true;
        if (selectedCategory === 'simple') return true;
        if (selectedCategory === 'modern') return tpl.preview_type === 'hendra';
        if (selectedCategory === 'single_col' || selectedCategory === 'professional') {
            return tpl.preview_type === 'ayu';
        }
        if (selectedCategory === 'with_photo') return false;
        return true;
    });

    const getTemplateBadge = (tpl: TemplateItem) => {
        if (tpl.preview_type === 'hendra') return 'Modern ATS';
        if (tpl.preview_type === 'ayu') return 'Klasik ATS';
        return 'Standar ATS';
    };

    return (
        <>
            <Head title="Pilih Template Resume - Aikrut" />

            {/* Main Content Area */}
            <div className="flex w-full flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {/* Stepper Wizard (Langkah 1, 2, 3) */}
                <div className="mx-auto mb-6 flex justify-center">
                    <nav
                        aria-label="Progress Alur CV"
                        className="inline-flex items-center gap-2 sm:gap-4 rounded-full border border-neutral-200/80 bg-white/90 px-4 py-2 text-xs shadow-xs backdrop-blur-xs sm:px-5 sm:py-2.5 sm:text-sm dark:border-neutral-800 dark:bg-neutral-900/90"
                    >
                        {/* Step 1: Active */}
                        <div className="flex items-center gap-2">
                            <span className="flex size-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs">
                                1
                            </span>
                            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                Pilih template
                            </span>
                        </div>

                        <div className="h-px w-3 sm:w-6 bg-neutral-300 dark:bg-neutral-700" />

                        {/* Step 2: Inactive */}
                        <div className="flex items-center gap-2 opacity-60">
                            <span className="flex size-6 items-center justify-center rounded-full border border-neutral-300 bg-neutral-100 text-xs font-semibold text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                                2
                            </span>
                            <span className="hidden sm:inline font-medium text-neutral-500 dark:text-neutral-400">
                                Masukkan detail Anda
                            </span>
                            <span className="sm:hidden font-medium text-neutral-500 dark:text-neutral-400">
                                Detail
                            </span>
                        </div>

                        <div className="h-px w-3 sm:w-6 bg-neutral-300 dark:bg-neutral-700" />

                        {/* Step 3: Inactive */}
                        <div className="flex items-center gap-2 opacity-60">
                            <span className="flex size-6 items-center justify-center rounded-full border border-neutral-300 bg-neutral-100 text-xs font-semibold text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                                3
                            </span>
                            <span className="hidden sm:inline font-medium text-neutral-500 dark:text-neutral-400">
                                Unduh resume
                            </span>
                            <span className="sm:hidden font-medium text-neutral-500 dark:text-neutral-400">
                                Unduh
                            </span>
                        </div>
                    </nav>
                </div>

                {/* Hero / Header Section */}
                <div className="mx-auto mb-10 max-w-3xl text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl dark:text-white">
                        Template resume ATS
                    </h1>
                    <p className="mt-3.5 text-base font-normal text-neutral-600 sm:text-lg dark:text-neutral-400">
                        Tingkatkan pencarian pekerjaan Anda dengan template resume ATS kami. Kalahkan algoritma, dan tampilkan perhatian terhadap detail.
                    </p>
                    <div className="mt-3">
                        <Link
                            href="/cv/builder"
                            className="inline-block text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
                        >
                            Pilih nanti
                        </Link>
                    </div>
                </div>

                {/* Filter Tabs Navigation */}
                <div className="mb-10 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-b border-neutral-200 dark:border-neutral-800">
                    <div className="mx-auto flex w-max sm:w-auto items-center justify-start sm:justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-5 pb-px px-2">
                        {CATEGORIES.map((category) => {
                            const Icon = category.icon;
                            const isSelected = selectedCategory === category.id;

                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`relative flex cursor-pointer items-center gap-1.5 px-3 py-3 text-sm font-medium whitespace-nowrap transition-all sm:gap-2 sm:px-4 ${
                                        isSelected
                                            ? 'font-semibold text-blue-600 dark:text-blue-400'
                                            : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                                    }`}
                                >
                                    <Icon
                                        className={`size-4 sm:size-4.5 ${
                                            isSelected
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-neutral-500'
                                        }`}
                                    />
                                    <span>{category.label}</span>

                                    {/* Active Underline Indicator */}
                                    {isSelected && (
                                        <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Banner Mode Ekspor dari Profil */}
                {isFromProfile && (
                    <div className="mb-6 rounded-2xl bg-linear-to-r from-sky-500 to-indigo-600 p-4 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-5xl mx-auto w-full">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-xs shrink-0">
                                <Sparkles className="size-5 text-white" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold">Mode Ekspor Profil ke CV ATS</h4>
                                <p className="text-xs text-sky-100">
                                    Pilih template di bawah ini. Seluruh data riwayat profil Anda akan otomatis dimasukkan ke template pilihan dan siap diekspor menjadi PDF.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/profile"
                            className="text-xs font-semibold text-white/90 hover:text-white underline shrink-0 sm:self-center"
                        >
                            Kembali ke Profil
                        </Link>
                    </div>
                )}

                {/* Templates Grid (2 Kolom untuk Template yang Sudah Dibuat) */}
                {displayedTemplates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto w-full">
                        {displayedTemplates.map((tpl) => {
                            const isHendra = tpl.preview_type === 'hendra';
                            const isAyu = tpl.preview_type === 'ayu';

                            return (
                                <div
                                    key={tpl.id}
                                    className="group flex flex-col items-center w-full"
                                >
                                    {/* Realistic A4 Document Preview Card Container */}
                                    <div className="relative w-full rounded-2xl bg-white dark:bg-white text-slate-900 p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] border border-slate-200/90 overflow-hidden min-h-[600px] flex flex-col select-none transition-all duration-300 group-hover:scale-[1.01]">
                                        
                                        {/* ======================================================== */}
                                        {/* CARD 1: HENDRA WIJAYA (ATS SEDERHANA / LEGAL)            */}
                                        {/* ======================================================== */}
                                        {isHendra && (
                                            <div className="w-full text-slate-900 text-[10px] leading-tight flex flex-col pointer-events-none">
                                                <div className="text-center mb-3">
                                                    <h2 className="text-xl sm:text-[22px] font-bold text-black uppercase tracking-wider mb-1">
                                                        HENDRA WIJAYA
                                                    </h2>
                                                    <div className="text-[10.5px] font-semibold text-slate-800 mb-1">
                                                        Pengacara
                                                    </div>
                                                    <div className="text-[8.5px] text-slate-600">
                                                        Jalan Pandley 55, Surabaya, Indonesia, 60223
                                                    </div>
                                                    <div className="text-[8.5px] text-slate-600 mt-0.5">
                                                        hendra.jawas@email.id · +62 815 555 2671
                                                    </div>
                                                    <div className="border-b-2 border-slate-900 mt-2.5 mb-3" />
                                                </div>

                                                <div className="mb-3">
                                                    <div className="font-bold text-[10px] text-black uppercase tracking-wider mb-1">
                                                        RINGKASAN
                                                    </div>
                                                    <p className="text-[8.5px] text-slate-800 leading-relaxed text-justify">
                                                        Pengacara berpengalaman dan inovatif dengan semangat dan dedikasi pada keadilan. Sangat terorganisir, dan terampil dalam berpikir kritis cepat dan tepat. Membantu klien yang terlibat dalam masalah hukum yang menguntungkan bagi klien. Mahir dalam mempersiapkan persidangan, merangkum dokumen, dan mengikuti kasus di pengadilan secara efektif.
                                                    </p>
                                                </div>

                                                <div className="mb-3">
                                                    <div className="font-bold text-[10px] text-black uppercase tracking-wider mb-1.5">
                                                        PENGALAMAN
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div>
                                                            <div className="font-bold text-[9px] text-black flex justify-between">
                                                                <span>Pengacara, PT Pengacara Madiun & Timber</span>
                                                                <span className="font-normal text-slate-600">Mei 2018 — Jul 2021 | Surabaya</span>
                                                            </div>
                                                            <ul className="list-disc ml-4 space-y-0.5 text-[8.5px] text-slate-800 leading-snug mt-1">
                                                                <li>Melakukan riset mendalam untuk memastikan pemahaman tentang kasus.</li>
                                                                <li>Menyiapkan dokumen legal tanpa kesalahan dan tepat waktu.</li>
                                                                <li>Menganalisis berkas perkara sesuai situasi dan regulasi hukum.</li>
                                                                <li>Mengajukan bukti dan mempresentasikan kasus kepada hakim.</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <div className="font-bold text-[10px] text-black uppercase tracking-wider mb-1">
                                                        PENDIDIKAN
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[9px] text-black">
                                                            Universitas Airlangga - Surabaya <span className="font-normal text-slate-700">| Sarjana Hukum</span>
                                                        </div>
                                                        <div className="text-[8.5px] text-slate-600">
                                                            Hukum Bisnis | 2013 - 2017
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="font-bold text-[10px] text-black uppercase tracking-wider mb-1">
                                                        KEAHLIAN
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-x-3 text-[8.5px] text-slate-800">
                                                        <ul className="list-disc ml-4 space-y-0.5">
                                                            <li>Litigasi Perdata & Pidana</li>
                                                            <li>Penyusunan Kontrak Bisnis</li>
                                                        </ul>
                                                        <ul className="list-disc ml-4 space-y-0.5">
                                                            <li>Negosiasi & Mediasi Hukum</li>
                                                            <li>Riset Yurisprudensi</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* ======================================================== */}
                                        {/* CARD 2: AYU SUTANTO (ATS STANDAR / CLASSIC)              */}
                                        {/* ======================================================== */}
                                        {isAyu && (
                                            <div className="w-full text-slate-900 text-[10px] leading-tight flex flex-col pointer-events-none">
                                                <div className="text-center mb-3">
                                                    <div className="text-[10px] font-bold text-black mb-1 tracking-wide">
                                                        Asosiasi Penjualan Senior
                                                    </div>
                                                    <h2 className="font-serif text-2xl sm:text-[26px] font-medium text-slate-900 tracking-tight mb-1.5 leading-none">
                                                        Ayu Sutanto
                                                    </h2>
                                                    <div className="text-[8.5px] text-slate-800 flex flex-wrap justify-center items-center gap-x-1.5 gap-y-0.5 leading-snug">
                                                        <span><strong className="font-bold text-black">Alamat:</strong> Jakarta, JK, 10220</span>
                                                        <span>·</span>
                                                        <span><strong className="font-bold text-black">Alamat email:</strong> ayu.sutanto@example.id</span>
                                                        <span>·</span>
                                                        <span><strong className="font-bold text-black">Nomor telepon:</strong> +62 812-789-1234</span>
                                                    </div>
                                                    <div className="border-b border-dotted border-slate-300 mt-2.5 mb-3" />
                                                </div>

                                                <div className="mb-3">
                                                    <div className="font-bold text-[10px] text-black uppercase tracking-wider mb-1">
                                                        RINGKASAN
                                                    </div>
                                                    <p className="text-[8.5px] text-slate-800 leading-relaxed text-justify">
                                                        Analis Senior dengan pengalaman lebih dari 5 tahun dalam analisis data, intelijen bisnis, dan optimisasi proses. Terampil dalam mendorong efisiensi operasional, peramalan, dan memimpin strategi berbasis data untuk mendukung keputusan bisnis.
                                                    </p>
                                                </div>

                                                <div className="mb-3">
                                                    <div className="font-bold text-[10px] text-black uppercase tracking-wider mb-1.5">
                                                        PENGALAMAN
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div>
                                                            <div className="font-bold text-[9px] text-black">
                                                                ANALIS SENIOR <span className="font-normal text-slate-700">| Jun 2021 — Saat Ini</span>
                                                            </div>
                                                            <div className="text-[8.5px] text-slate-700 mb-0.5">
                                                                PT Lentera & Lampu - Jakarta, 10110
                                                            </div>
                                                            <ul className="list-disc ml-4 space-y-0.5 text-[8.5px] text-slate-800 leading-snug">
                                                                <li>Mengarahkan analisis data dan pelaporan fungsi bisnis kunci.</li>
                                                                <li>Melakukan benchmarking kompetitif untuk keputusan strategis.</li>
                                                            </ul>
                                                        </div>

                                                        <div>
                                                            <div className="font-bold text-[9px] text-black">
                                                                ANALIS BISNIS <span className="font-normal text-slate-700">| Jan 2019 — Mei 2021</span>
                                                            </div>
                                                            <div className="text-[8.5px] text-slate-700 mb-0.5">
                                                                PT Willow & Wren - Jakarta, 10220
                                                            </div>
                                                            <ul className="list-disc ml-4 space-y-0.5 text-[8.5px] text-slate-800 leading-snug">
                                                                <li>Menganalisis data besar untuk peluang optimasi proses bisnis.</li>
                                                                <li>Membuat dasbor metrik KPI antar-departemen.</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <div className="font-bold text-[10px] text-black uppercase tracking-wider mb-1">
                                                        PENDIDIKAN
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[9px] text-black">
                                                            Universitas Indonesia <span className="font-normal text-slate-700">| Sarjana Sains</span>
                                                        </div>
                                                        <div className="text-[8.5px] text-slate-700">
                                                            Ekonomi | 2013 - 2017
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="font-bold text-[10px] text-black uppercase tracking-wider mb-1">
                                                        KEAHLIAN
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-x-3 text-[8.5px] text-slate-800">
                                                        <ul className="list-disc ml-4 space-y-0.5">
                                                            <li>Manajemen Proyek</li>
                                                            <li>SQL & Excel</li>
                                                        </ul>
                                                        <ul className="list-disc ml-4 space-y-0.5">
                                                            <li>Keputusan Berbasis Data</li>
                                                            <li>Analisis Keuangan</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}



                                        {/* ======================================================== */}
                                        {/* PROMINENT CENTERED BUTTON: 'Pilih Template'               */}
                                        {/* EXACT MATCH WITH USER REQUEST AND SCREENSHOT             */}
                                        {/* ======================================================== */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-20">
                                            {isFromProfile ? (
                                                <button
                                                    type="button"
                                                    disabled={isExporting}
                                                    onClick={() => handleExportFromProfile(tpl.id)}
                                                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#009df9] hover:bg-[#008be5] text-white text-base font-semibold px-7 py-3 shadow-lg shadow-sky-500/25 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-sky-300 disabled:opacity-75 disabled:pointer-events-none"
                                                >
                                                    {isExporting && exportingTemplateId === tpl.id ? (
                                                        <>
                                                            <Loader2 className="size-5 animate-spin" />
                                                            <span>Mengunduh PDF...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Download className="size-5" />
                                                            <span>Gunakan & Unduh PDF</span>
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                <Link
                                                    href={`/cv/builder?template_id=${tpl.id}`}
                                                    className="inline-flex items-center justify-center rounded-xl bg-[#009df9] hover:bg-[#008be5] text-white text-base font-semibold px-7 py-3 shadow-lg shadow-sky-500/25 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-sky-300"
                                                >
                                                    Pilih Template
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    {/* Template Metadata Footer (Name & Badge) */}
                                    <div className="flex items-center justify-between w-full mt-3 px-2">
                                        <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {tpl.name}
                                        </h3>
                                        <span className="px-2.5 py-0.5 text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full border border-neutral-200 dark:border-neutral-700">
                                            {getTemplateBadge(tpl)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty filter results state */
                    <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                        <div className="w-full max-w-md rounded-2xl border border-neutral-200/80 bg-white p-8 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mx-auto mb-4 flex aspect-square size-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500 dark:bg-neutral-800">
                                <ShieldCheck className="size-7" />
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1.5">
                                Tidak ada template untuk kategori ini
                            </h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
                                Silakan pilih kategori "Semua Template" untuk melihat seluruh koleksi format resume yang tersedia.
                            </p>
                            <Button
                                type="button"
                                onClick={() => setSelectedCategory('all')}
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
                            >
                                Tampilkan Semua Template
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Export Success Modal */}
            {exportSuccessModal?.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                    <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 animate-in fade-in zoom-in-95 duration-200">
                        <button
                            type="button"
                            onClick={() => setExportSuccessModal(null)}
                            className="absolute top-4 right-4 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                        >
                            <X className="size-5" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mb-4 shadow-sm">
                                <CheckCircle2 className="size-8" />
                            </div>

                            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                CV Berhasil Dibuat & Diunduh!
                            </h3>
                            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                Data profil lengkap Anda telah otomatis terinput ke template, tersimpan di dalam <strong>Daftar CV</strong> Anda, dan file PDF sedang otomatis diunduh.
                            </p>

                            <div className="mt-6 flex w-full flex-col gap-2.5">
                                <Link
                                    href={exportSuccessModal.builderUrl}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white py-3 text-sm font-semibold shadow-md shadow-sky-500/20 transition-all hover:scale-[1.01] active:scale-95"
                                >
                                    <span>Edit di CV Builder</span>
                                    <ArrowRight className="size-4" />
                                </Link>

                                <Link
                                    href="/cv"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-750 py-2.5 text-sm font-medium transition-all"
                                >
                                    <span>Buka Daftar CV</span>
                                </Link>

                                <a
                                    href={exportSuccessModal.downloadUrl}
                                    download
                                    className="inline-flex w-full items-center justify-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 dark:text-sky-400 font-semibold py-1.5"
                                >
                                    <Download className="size-3.5" />
                                    <span>Unduh Ulang PDF</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

CvTemplatesPage.layout = {
    breadcrumbs: [
        {
            title: 'Template CV',
            href: '/cv/templates',
        },
    ],
};
