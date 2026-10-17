import { router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Briefcase,
    Check,
    CheckCircle2,
    FileText,
    Loader2,
    Plus,
    Search,
    Sparkles,
    UploadCloud,
    UserCheck,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ALL_CAREER_ROLES, CAREER_CATEGORIES, type CareerCategoryItem } from '@/data/career-categories';
import { CvImportModal } from '@/pages/profile/components/CvImportModal';
import type { UserProfileData } from '@/types/profile';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose?: () => void;
    savedPeminatan?: string[];
    careerCategories?: CareerCategoryItem[];
}

export function OnboardingModal({
    isOpen,
    onClose,
    savedPeminatan = [],
    careerCategories = CAREER_CATEGORIES,
}: OnboardingModalProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
    const [selectedRoles, setSelectedRoles] = useState<string[]>(
        savedPeminatan.length > 0 ? savedPeminatan : []
    );
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isCvModalOpen, setIsCvModalOpen] = useState<boolean>(false);

    // Merge predefined roles from categories with fallback to ALL_CAREER_ROLES
    const allRoles = useMemo(() => {
        if (!careerCategories || careerCategories.length === 0) {
            return ALL_CAREER_ROLES;
        }
        return careerCategories.flatMap((cat) =>
            cat.roles.map((r) => ({
                id: `${cat.id}-${r.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                name: r,
                category: cat.id,
                categoryTitle: cat.title,
                popularSkills: cat.popular_skills,
            }))
        );
    }, [careerCategories]);

    // Filter roles based on search and category filter
    const filteredRoles = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return allRoles.filter((item) => {
            const matchesCategory =
                selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
            const matchesQuery =
                !query ||
                item.name.toLowerCase().includes(query) ||
                item.categoryTitle.toLowerCase().includes(query) ||
                (item.popularSkills &&
                    item.popularSkills.some((sk) => sk.toLowerCase().includes(query)));

            return matchesCategory && matchesQuery;
        });
    }, [allRoles, searchQuery, selectedCategoryFilter]);

    // Check if current search query exists exactly in roles
    const queryExistsInRoles = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;
        return allRoles.some((r) => r.name.toLowerCase() === query);
    }, [allRoles, searchQuery]);

    if (!isOpen) return null;

    // Toggle role selection
    const toggleRole = (roleName: string) => {
        setErrorMessage(null);
        if (selectedRoles.includes(roleName)) {
            setSelectedRoles(selectedRoles.filter((r) => r !== roleName));
        } else {
            setSelectedRoles([...selectedRoles, roleName]);
        }
    };

    // Add custom role from search query
    const handleAddCustomRole = () => {
        const trimmed = searchQuery.trim();
        if (trimmed && !selectedRoles.includes(trimmed)) {
            setSelectedRoles([...selectedRoles, trimmed]);
            setSearchQuery('');
            setErrorMessage(null);
        }
    };

    // Submit Step 2: Option A (Pilih dari Onboarding)
    const handleChooseOnboarding = () => {
        if (selectedRoles.length === 0) {
            setErrorMessage('Silakan pilih minimal 1 peminatan di Langkah 1.');
            setStep(1);
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);

        router.post(
            '/onboarding/complete',
            {
                field_of_interest: selectedRoles,
                profile_data_source: 'onboarding',
                career_level: 'Fresh Graduate / Mahasiswa',
            },
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                    if (onClose) onClose();
                    router.visit('/profile');
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    setErrorMessage(Object.values(errors)[0] as string || 'Gagal menyimpan data onboarding.');
                },
            }
        );
    };

    // Success callback after CV Import in Step 2: Option B
    const handleCvImportSuccess = (updatedProfile: UserProfileData) => {
        setIsCvModalOpen(false);
        if (onClose) onClose();
        router.visit('/profile');
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
                <div className="relative flex flex-col w-full max-w-3xl max-h-[92vh] bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    {/* Top Progress Bar */}
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 relative overflow-hidden">
                        <div
                            className="h-full bg-linear-to-r from-sky-500 via-blue-600 to-indigo-600 transition-all duration-500 ease-out"
                            style={{ width: step === 1 ? '50%' : '100%' }}
                        />
                    </div>

                    {/* Modal Header */}
                    <div className="px-6 pt-5 pb-3 border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                                        STEP {step} DARI 2
                                    </span>
                                    <span className="text-neutral-300 dark:text-neutral-700">•</span>
                                    <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                                        {step === 1 ? 'Peminatan Karier' : 'Sumber Data Master'}
                                    </span>
                                </div>
                                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                    {step === 1 ? 'Pilih Peminatan Karier Anda' : 'Inisialisasi Data Master Profil'}
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge
                                variant="secondary"
                                className="text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/60"
                            >
                                Wajib Diisi
                            </Badge>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {errorMessage && (
                        <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
                            <X className="h-4 w-4 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Modal Content Body */}
                    <div className="p-6 overflow-y-auto flex-1 space-y-5">
                        {/* ========================================================================= */}
                        {/* STEP 1: PEMINATAN (Search + 3-Column Grid)                                */}
                        {/* ========================================================================= */}
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    Pilih bidang dan peran yang menjadi target atau minat karier Anda. Data ini akan menjadi referensi utama AI dalam menyesuaikan template CV, kata kunci ATS, dan ringkasan profesional.
                                </p>

                                {/* Search Bar & Live Filter */}
                                <div className="space-y-2.5">
                                    <div className="relative">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search peminatan, bidang, atau profesi (contoh: Frontend, Data Analyst, UI/UX)..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-9 py-2.5 h-11 text-xs sm:text-sm rounded-xl border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/60 focus:bg-white dark:focus:bg-neutral-900 transition-all shadow-xs"
                                        />
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                onClick={() => setSearchQuery('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Quick Category Filter Pills */}
                                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedCategoryFilter('all')}
                                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                                                selectedCategoryFilter === 'all'
                                                    ? 'bg-blue-600 text-white shadow-xs'
                                                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                            }`}
                                        >
                                            Semua Bidang
                                        </button>
                                        {careerCategories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setSelectedCategoryFilter(cat.id)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                                                    selectedCategoryFilter === cat.id
                                                        ? 'bg-blue-600 text-white shadow-xs'
                                                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                                }`}
                                            >
                                                {cat.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Custom Role Action if search doesn't match */}
                                {!queryExistsInRoles && searchQuery.trim() && (
                                    <div
                                        onClick={handleAddCustomRole}
                                        className="cursor-pointer p-3 rounded-xl border border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100/50 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-between transition-all"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Plus className="h-4 w-4" />
                                            <span>
                                                Gunakan peran baru:{' '}
                                                <strong className="underline">{searchQuery.trim()}</strong>
                                            </span>
                                        </div>
                                        <Badge className="bg-blue-600 text-white text-[10px]">
                                            + Tambahkan
                                        </Badge>
                                    </div>
                                )}

                                {/* STEP 1: 3-COLUMN GRID AS SHOWN IN THE SKETCH */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs text-neutral-500">
                                        <span>Daftar Peminatan ({filteredRoles.length} opsi tersedia)</span>
                                        <span>Pilih satu atau beberapa</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[290px] overflow-y-auto pr-1">
                                        {filteredRoles.map((role) => {
                                            const isSelected = selectedRoles.includes(role.name);
                                            return (
                                                <button
                                                    key={role.id}
                                                    type="button"
                                                    onClick={() => toggleRole(role.name)}
                                                    className={`group text-left p-3 rounded-xl border text-xs transition-all relative flex flex-col justify-between min-h-[64px] ${
                                                        isSelected
                                                            ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 shadow-xs ring-2 ring-blue-500/50'
                                                            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-1.5 w-full">
                                                        <span
                                                            className={`font-semibold leading-snug line-clamp-2 ${
                                                                isSelected ? 'text-blue-700 dark:text-blue-300' : ''
                                                            }`}
                                                        >
                                                            {role.name}
                                                        </span>
                                                        <div
                                                            className={`size-4.5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                                                isSelected
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'border border-neutral-300 dark:border-neutral-700 opacity-60 group-hover:opacity-100'
                                                            }`}
                                                        >
                                                            {isSelected && <Check className="size-3 stroke-[3]" />}
                                                        </div>
                                                    </div>

                                                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 line-clamp-1">
                                                        {role.categoryTitle}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Selected Roles Preview Drawer */}
                                {selectedRoles.length > 0 && (
                                    <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                                                Peminatan Terpilih ({selectedRoles.length})
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedRoles([])}
                                                className="text-[11px] text-neutral-400 hover:text-red-500 transition-colors"
                                            >
                                                Reset Pilihan
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedRoles.map((role) => (
                                                <Badge
                                                    key={role}
                                                    className="bg-blue-600 text-white hover:bg-blue-700 text-xs px-2.5 py-1 gap-1.5 shadow-xs"
                                                >
                                                    <span>{role}</span>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleRole(role);
                                                        }}
                                                        className="hover:bg-blue-800 rounded-full p-0.5"
                                                    >
                                                        <X className="size-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ========================================================================= */}
                        {/* STEP 2: DATA MASTER (Pilih dari Onboarding vs Import dari CV)             */}
                        {/* ========================================================================= */}
                        {step === 2 && (
                            <div className="space-y-5 animate-in fade-in duration-200">
                                {/* Educational AI Banner */}
                                <div className="p-4 rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-linear-to-r from-sky-50/70 via-blue-50/40 to-indigo-50/60 dark:from-sky-950/30 dark:via-blue-950/20 dark:to-indigo-950/30 space-y-2">
                                    <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-bold text-xs uppercase tracking-wider">
                                        <Sparkles className="size-4 text-sky-600 dark:text-sky-400 shrink-0" />
                                        <span>Fondasi Data Master untuk AI Bebas Halusinasi</span>
                                    </div>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                        Data Master adalah <em>single source of truth</em> profil Anda. Dengan data faktual ini, fitur <strong>AI Enhance</strong> (penyusun ringkasan profesional, reviewer ATS, dan rekomendasi kerja) mengetahui rekam jejak asli Anda sehingga tidak akan mengarang bebas atau berhalusinasi.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                        Pilih Cara Pengisian Data Master Anda
                                    </h3>
                                    <p className="text-xs text-neutral-500">
                                        Setelah memilih salah satu opsi di bawah, Anda akan langsung diarahkan ke halaman profil untuk meninjau data Anda.
                                    </p>
                                </div>

                                {/* STEP 2: TWO LARGE CARDS AS SHOWN IN THE SKETCH */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* CARD 1: PILIH DARI ONBOARDING */}
                                    <div
                                        onClick={handleChooseOnboarding}
                                        className="group cursor-pointer rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 hover:border-blue-600 dark:hover:border-blue-500 bg-white dark:bg-neutral-900 p-5 space-y-4 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 flex flex-col justify-between relative overflow-hidden"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="size-11 rounded-xl bg-linear-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                                                    <UserCheck className="size-5" />
                                                </div>
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                                                >
                                                    Mulai Cepat
                                                </Badge>
                                            </div>

                                            <div className="space-y-1">
                                                <h4 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    Pilih dari Onboarding
                                                </h4>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                                    Gunakan data peminatan yang baru Anda pilih sebagai awal mula profil. Anda dapat mengisi riwayat pengalaman dan pendidikan secara bertahap di halaman profil.
                                                </p>
                                            </div>

                                            <div className="space-y-1.5 pt-1 text-[11px] text-neutral-600 dark:text-neutral-400">
                                                <div className="flex items-center gap-1.5">
                                                    <CheckCircle2 className="size-3.5 text-blue-600 shrink-0" />
                                                    <span>Tanpa memerlukan berkas CV fisik</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <CheckCircle2 className="size-3.5 text-blue-600 shrink-0" />
                                                    <span>Pengisian profil secara bertahap & fleksibel</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <CheckCircle2 className="size-3.5 text-blue-600 shrink-0" />
                                                    <span>Fitur Import CV di profil nantinya tetap terbuka</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            type="button"
                                            disabled={isSubmitting}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl py-2.5 gap-2 shadow-xs group-hover:shadow-md transition-all mt-2"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="size-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <span>Pilih Opsi Ini & Ke Profil</span>
                                                    <ArrowRight className="size-4" />
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    {/* CARD 2: IMPORT DARI CV */}
                                    <div
                                        onClick={() => setIsCvModalOpen(true)}
                                        className="group cursor-pointer rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 hover:border-indigo-600 dark:hover:border-indigo-500 bg-white dark:bg-neutral-900 p-5 space-y-4 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col justify-between relative overflow-hidden"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="size-11 rounded-xl bg-linear-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                                                    <UploadCloud className="size-5" />
                                                </div>
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                                                >
                                                    Otomatis dengan AI
                                                </Badge>
                                            </div>

                                            <div className="space-y-1">
                                                <h4 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    Import dari CV
                                                </h4>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                                    Unggah berkas CV Anda (PDF atau DOCX). AI kami akan mengekstrak riwayat pekerjaan, pendidikan, dan keahlian Anda secara instan ke data master profil.
                                                </p>
                                            </div>

                                            <div className="space-y-1.5 pt-1 text-[11px] text-neutral-600 dark:text-neutral-400">
                                                <div className="flex items-center gap-1.5">
                                                    <CheckCircle2 className="size-3.5 text-indigo-600 shrink-0" />
                                                    <span>Ekstraksi data cerdas otomatis via AI</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <CheckCircle2 className="size-3.5 text-indigo-600 shrink-0" />
                                                    <span>Tidak perlu mengetik riwayat kerja dari awal</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <CheckCircle2 className="size-3.5 text-indigo-600 shrink-0" />
                                                    <span>Langsung tersimpan rapi di halaman profil</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            type="button"
                                            disabled={isSubmitting}
                                            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold rounded-xl py-2.5 gap-2 shadow-xs group-hover:shadow-md transition-all mt-2"
                                        >
                                            <UploadCloud className="size-4" />
                                            <span>Unggah & Ekstrak Berkas CV</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Modal Footer Controls */}
                    <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/70 flex items-center justify-between shrink-0">
                        {step === 1 ? (
                            <div className="flex items-center justify-between w-full">
                                <span className="text-xs text-neutral-500">
                                    {selectedRoles.length > 0 ? (
                                        <span className="font-medium text-blue-600 dark:text-blue-400">
                                            ✓ {selectedRoles.length} peminatan dipilih
                                        </span>
                                    ) : (
                                        <span>Pilih minimal 1 peran untuk melanjutkan</span>
                                    )}
                                </span>

                                <Button
                                    type="button"
                                    onClick={() => {
                                        if (selectedRoles.length === 0) {
                                            setErrorMessage('Silakan pilih minimal 1 peminatan peran karier.');
                                            return;
                                        }
                                        setErrorMessage(null);
                                        setStep(2);
                                    }}
                                    disabled={selectedRoles.length === 0}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 gap-2 transition-all"
                                >
                                    <span>Lanjut ke Data Master</span>
                                    <ArrowRight className="size-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between w-full">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setErrorMessage(null);
                                        setStep(1);
                                    }}
                                    className="text-xs gap-1.5 rounded-xl"
                                >
                                    <ArrowLeft className="size-3.5" />
                                    <span>Kembali ke Peminatan</span>
                                </Button>

                                <span className="text-[11px] text-neutral-400">
                                    Pilih salah satu opsi kartu di atas untuk melanjutkan ke profil
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Embedded CV Import Modal for Option B */}
            <CvImportModal
                isOpen={isCvModalOpen}
                onClose={() => setIsCvModalOpen(false)}
                onSuccess={handleCvImportSuccess}
            />
        </>
    );
}
