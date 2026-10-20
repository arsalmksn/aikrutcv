import { router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Brain,
    Briefcase,
    Check,
    CheckCircle2,
    ChevronRight,
    Code,
    Compass,
    Cpu,
    DollarSign,
    FileText,
    Globe,
    Headphones,
    Layers,
    Loader2,
    Palette,
    Search,
    Server,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    UploadCloud,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    CAREER_CATEGORIES,
    type CareerCategoryItem,
    type CareerSubCategoryItem,
    type CareerSubRoleItem,
} from '@/data/career-categories';
import { CvImportModal } from '@/pages/profile/components/CvImportModal';
import type { UserProfileData } from '@/types/profile';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose?: () => void;
    savedPeminatan?: string[];
    careerCategories?: CareerCategoryItem[];
}

const ICON_MAP: Record<string, React.ElementType> = {
    Code,
    Brain,
    Palette,
    Briefcase,
    TrendingUp,
    DollarSign,
    Users,
    Headphones,
    Layers,
    Compass,
    Sparkles,
    Server,
    Cpu,
    ShieldCheck,
    Globe,
};

export function OnboardingModal({
    isOpen,
    onClose,
    savedPeminatan = [],
    careerCategories = CAREER_CATEGORIES,
}: OnboardingModalProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Cascading Drill-Down State for Step 1
    // drillLevel: 1 = Pilih Bidang Utama, 2 = Pilih Sub-Bidang Netral, 3 = Pilih Tech Stack / Spesialisasi
    const [drillLevel, setDrillLevel] = useState<1 | 2 | 3>(1);
    const [selectedCategory, setSelectedCategory] = useState<CareerCategoryItem | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<CareerSubCategoryItem | null>(null);

    const [selectedRoles, setSelectedRoles] = useState<string[]>(
        savedPeminatan.length > 0 ? savedPeminatan : []
    );
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isCvModalOpen, setIsCvModalOpen] = useState<boolean>(false);

    // Flatten all skills across all categories and sub-categories for global searching
    const allSearchableRoles = useMemo(() => {
        const results: Array<{
            roleName: string;
            subCategoryName: string;
            categoryName: string;
            skills: string[];
            categoryId: string;
            subCategoryId: string | number;
        }> = [];

        const seenKeys = new Set<string>();

        for (const cat of careerCategories) {
            const catTitle = cat.title || cat.name || 'Bidang';
            if (cat.sub_categories && cat.sub_categories.length > 0) {
                for (const sub of cat.sub_categories) {
                    const skills =
                        sub.popular_skills && sub.popular_skills.length > 0
                            ? sub.popular_skills
                            : sub.roles && sub.roles.length > 0
                            ? sub.roles.flatMap((r) =>
                                  r.popular_skills && r.popular_skills.length > 0
                                      ? r.popular_skills
                                      : [r.name]
                              )
                            : [];

                    for (const sk of skills) {
                        const uniqueKey = `${cat.id}-${sub.id}-${sk}`;
                        if (!seenKeys.has(uniqueKey)) {
                            seenKeys.add(uniqueKey);
                            results.push({
                                roleName: sk,
                                subCategoryName: sub.name,
                                categoryName: catTitle,
                                skills: [sk],
                                categoryId: String(cat.id),
                                subCategoryId: sub.id,
                            });
                        }
                    }
                }
            } else if (cat.roles && cat.roles.length > 0) {
                for (const r of cat.roles) {
                    results.push({
                        roleName: r,
                        subCategoryName: 'Umum',
                        categoryName: catTitle,
                        skills: cat.popular_skills || [],
                        categoryId: String(cat.id),
                        subCategoryId: 'general',
                    });
                }
            }
        }

        return results;
    }, [careerCategories]);

    // Live search filtering across role/skill, subcategory, category, and skills
    const matchingSearchResults = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return [];

        return allSearchableRoles.filter((item) => {
            return (
                item.roleName.toLowerCase().includes(q) ||
                item.subCategoryName.toLowerCase().includes(q) ||
                item.categoryName.toLowerCase().includes(q) ||
                item.skills.some((sk) => sk.toLowerCase().includes(q))
            );
        });
    }, [allSearchableRoles, searchQuery]);

    // Active skills for currently selected Sub-Category (Bidang Spesifik)
    const activeSubSkills = useMemo(() => {
        if (!selectedSubCategory) return [];
        if (
            selectedSubCategory.popular_skills &&
            selectedSubCategory.popular_skills.length > 0
        ) {
            return selectedSubCategory.popular_skills;
        }
        if (selectedSubCategory.roles && selectedSubCategory.roles.length > 0) {
            const aggregated = selectedSubCategory.roles.flatMap((r) =>
                r.popular_skills && r.popular_skills.length > 0
                    ? r.popular_skills
                    : [r.name]
            );
            return Array.from(new Set(aggregated));
        }
        return [];
    }, [selectedSubCategory]);

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

    // Navigation helper in drill-down
    const handleSelectCategory = (cat: CareerCategoryItem) => {
        setSelectedCategory(cat);
        setSelectedSubCategory(null);
        setDrillLevel(2);
        setErrorMessage(null);
    };

    const handleSelectSubCategory = (sub: CareerSubCategoryItem) => {
        setSelectedSubCategory(sub);
        setDrillLevel(3);
        setErrorMessage(null);
    };

    const handleBackToCategories = () => {
        setDrillLevel(1);
        setSelectedCategory(null);
        setSelectedSubCategory(null);
        setErrorMessage(null);
    };

    const handleBackToSubCategories = () => {
        setDrillLevel(2);
        setSelectedSubCategory(null);
        setErrorMessage(null);
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
                <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    {/* Top Progress Bar */}
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 relative overflow-hidden">
                        <div
                            className="h-full bg-linear-to-r from-sky-500 via-blue-600 to-indigo-600 transition-all duration-500 ease-out"
                            style={{ width: step === 1 ? '50%' : '100%' }}
                        />
                    </div>

                    {/* Modal Header */}
                    <div className="px-6 pt-5 pb-3.5 border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="size-9 rounded-xl bg-linear-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                                <Sparkles className="size-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                                        STEP {step} DARI 2
                                    </span>
                                    <span className="text-neutral-300 dark:text-neutral-700">•</span>
                                    <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                                        {step === 1 ? 'Peminatan Karier & Tech Stack' : 'Sumber Data Master'}
                                    </span>
                                </div>
                                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                    {step === 1 ? 'Pilih Peminatan & Tech Stack Anda' : 'Inisialisasi Data Master Profil'}
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
                            <X className="size-4 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Modal Content Body */}
                    <div className="p-6 overflow-y-auto flex-1 space-y-5">
                        {/* ========================================================================= */}
                        {/* STEP 1: CASCADING DRILL-DOWN PEMINATAN (3 LEVELS)                         */}
                        {/* ========================================================================= */}
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                {/* Global Search Bar */}
                                <div className="relative">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                    <Input
                                        type="text"
                                        placeholder="Cari peran, tech stack, atau keahlian langsung (misal: Laravel, React, Flutter, Python, DevOps)..."
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
                                            <X className="size-4" />
                                        </button>
                                    )}
                                </div>

                                {/* ================================================================= */}
                                {/* CASE A: INSTANT GLOBAL SEARCH RESULTS                             */}
                                {/* ================================================================= */}
                                {searchQuery.trim().length > 0 ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-xs text-neutral-500">
                                            <span>
                                                Hasil Pencarian untuk &ldquo;<strong>{searchQuery.trim()}</strong>&rdquo; ({matchingSearchResults.length} peran ditemukan)
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setSearchQuery('')}
                                                className="text-blue-600 hover:underline text-xs"
                                            >
                                                Kembali ke alur bertingkat
                                            </button>
                                        </div>

                                        {matchingSearchResults.length === 0 ? (
                                            <div className="p-6 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-2 bg-neutral-50/50 dark:bg-neutral-900/40">
                                                <Compass className="size-8 text-neutral-400 mx-auto" />
                                                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                    Peminatan atau teknologi tidak ditemukan
                                                </p>
                                                <p className="text-[11px] text-neutral-400 max-w-md mx-auto">
                                                    Pengguna hanya dapat memilih peran dan tech stack yang terdaftar di data master resmi. Silakan coba kata kunci lain atau pilih melalui tingkatan kategori di bawah.
                                                </p>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => setSearchQuery('')}
                                                    className="text-xs rounded-xl mt-2"
                                                >
                                                    Lihat Semua Bidang
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                                                {matchingSearchResults.map((item, idx) => {
                                                    const isSelected = selectedRoles.includes(item.roleName);
                                                    return (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => toggleRole(item.roleName)}
                                                            className={`group text-left p-3 rounded-xl border text-xs transition-all relative flex items-center justify-between gap-2 cursor-pointer ${isSelected
                                                                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 shadow-xs ring-2 ring-blue-500/50'
                                                                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300'
                                                                }`}
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <span
                                                                    className={`font-semibold leading-snug line-clamp-1 ${isSelected ? 'text-blue-700 dark:text-blue-300 font-bold' : ''
                                                                        }`}
                                                                >
                                                                    {item.roleName}
                                                                </span>
                                                                <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5 line-clamp-1">
                                                                    {item.categoryName} &gt; {item.subCategoryName}
                                                                </div>
                                                            </div>

                                                            <div
                                                                className={`size-5 rounded-full flex items-center justify-center shrink-0 transition-all ${isSelected
                                                                        ? 'bg-blue-600 text-white'
                                                                        : 'border border-neutral-300 dark:border-neutral-700 opacity-60 group-hover:opacity-100'
                                                                    }`}
                                                            >
                                                                {isSelected && <Check className="size-3 stroke-[3]" />}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* ============================================================= */
                                    /* CASE B: 3-TIER DRILL-DOWN CASCADING FUNNEL                     */
                                    /* ============================================================= */
                                    <div className="space-y-4">
                                        {/* Stepper Breadcrumb Header */}
                                        <div className="flex items-center gap-1.5 text-xs pb-1 overflow-x-auto scrollbar-none border-b border-neutral-100 dark:border-neutral-800">
                                            <button
                                                type="button"
                                                onClick={handleBackToCategories}
                                                className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                                                    drillLevel === 1
                                                        ? 'bg-blue-600 text-white shadow-xs'
                                                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                                }`}
                                            >
                                                <span>1. Bidang Utama</span>
                                            </button>

                                            <ChevronRight className="size-3.5 text-neutral-400 shrink-0" />

                                            <button
                                                type="button"
                                                onClick={handleBackToSubCategories}
                                                disabled={drillLevel < 2}
                                                className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                                                    drillLevel === 2
                                                        ? 'bg-blue-600 text-white shadow-xs cursor-pointer'
                                                        : drillLevel > 2
                                                        ? 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer'
                                                        : 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
                                                }`}
                                            >
                                                <span>
                                                    2. Bidang Spesifik
                                                    {selectedCategory && (
                                                        <span className="opacity-80 ml-1 font-normal">
                                                            ({selectedCategory.title})
                                                        </span>
                                                    )}
                                                </span>
                                            </button>

                                            <ChevronRight className="size-3.5 text-neutral-400 shrink-0" />

                                            <div
                                                className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                                                    drillLevel === 3
                                                        ? 'bg-blue-600 text-white shadow-xs'
                                                        : 'text-neutral-300 dark:text-neutral-700'
                                                }`}
                                            >
                                                <span>
                                                    3. Skill & Keahlian
                                                    {selectedSubCategory && (
                                                        <span className="opacity-80 ml-1 font-normal">
                                                            ({selectedSubCategory.name})
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* ========================================================= */}
                                        {/* LEVEL 1: PILIH BIDANG UTAMA                               */}
                                        {/* ========================================================= */}
                                        {drillLevel === 1 && (
                                            <div className="space-y-3 animate-in fade-in duration-150">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                                            Langkah 1: Pilih Bidang Utama Karier Anda
                                                        </h3>
                                                        <p className="text-[11px] sm:text-xs text-neutral-500">
                                                            Klik salah satu bidang di bawah untuk melihat bidang spesifik di dalamnya.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[310px] overflow-y-auto pr-1">
                                                    {careerCategories.map((cat) => {
                                                        const IconComp = ICON_MAP[cat.icon] || Briefcase;
                                                        const subCount = cat.sub_categories?.length || 0;

                                                        return (
                                                            <div
                                                                key={cat.id}
                                                                onClick={() => handleSelectCategory(cat)}
                                                                className="cursor-pointer group p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-neutral-900 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                                                            >
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="size-9 rounded-xl bg-linear-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                                                                            <IconComp className="size-4" />
                                                                        </div>
                                                                        <span className="text-[10px] font-medium text-neutral-400 group-hover:text-blue-600 flex items-center gap-1 transition-colors">
                                                                            Lihat Spesifik <ChevronRight className="size-3" />
                                                                        </span>
                                                                    </div>

                                                                    <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                        {cat.title}
                                                                    </h4>

                                                                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                                                                        {cat.description}
                                                                    </p>
                                                                </div>

                                                                <div className="pt-2.5 mt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-400">
                                                                    <span>{subCount} Bidang Spesifik Tersedia</span>
                                                                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
                                                                        Pilih &gt;
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* ========================================================= */}
                                        {/* LEVEL 2: PILIH BIDANG SPESIFIK                            */}
                                        {/* ========================================================= */}
                                        {drillLevel === 2 && selectedCategory && (
                                            <div className="space-y-3 animate-in fade-in duration-150">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                                            <button
                                                                type="button"
                                                                onClick={handleBackToCategories}
                                                                className="text-blue-600 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                                                            >
                                                                <ArrowLeft className="size-3" /> Ganti Bidang Utama
                                                            </button>
                                                            <span>•</span>
                                                            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                                {selectedCategory.title}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                                                            Langkah 2: Pilih Bidang Spesifik
                                                        </h3>
                                                        <p className="text-[11px] sm:text-xs text-neutral-500">
                                                            Pilih bidang keahlian spesifik Anda untuk memilih kumpulan keahlian / skill yang dikuasai.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[310px] overflow-y-auto pr-1">
                                                    {(selectedCategory.sub_categories || []).map((sub) => {
                                                        const skillCount =
                                                            (sub.popular_skills?.length || 0) > 0
                                                                ? sub.popular_skills!.length
                                                                : sub.roles?.length || 0;

                                                        return (
                                                            <div
                                                                key={sub.id}
                                                                onClick={() => handleSelectSubCategory(sub)}
                                                                className="cursor-pointer group p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-neutral-900 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                                                            >
                                                                <div className="space-y-1.5">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                                                            Bidang Spesifik
                                                                        </span>
                                                                        <span className="text-[10px] text-neutral-400 group-hover:text-blue-600 flex items-center gap-0.5 transition-colors">
                                                                            Pilih Skill <ChevronRight className="size-3" />
                                                                        </span>
                                                                    </div>

                                                                    <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                        {sub.name}
                                                                    </h4>

                                                                    {sub.description && (
                                                                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2">
                                                                            {sub.description}
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                <div className="pt-2 mt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-400">
                                                                    <span>{skillCount} Pilihan Skill / Teknologi</span>
                                                                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
                                                                        Pilih Skill &gt;
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* ========================================================= */}
                                        {/* LEVEL 3: PILIH SKILL & KEAHLIAN LANGSUNG                  */}
                                        {/* ========================================================= */}
                                        {drillLevel === 3 && selectedSubCategory && selectedCategory && (
                                            <div className="space-y-3 animate-in fade-in duration-150">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                    <div>
                                                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                                            <button
                                                                type="button"
                                                                onClick={handleBackToSubCategories}
                                                                className="text-blue-600 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                                                            >
                                                                <ArrowLeft className="size-3" /> Ganti Bidang Spesifik
                                                            </button>
                                                            <span>•</span>
                                                            <span className="text-neutral-500">{selectedCategory.title}</span>
                                                            <span>&gt;</span>
                                                            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                                {selectedSubCategory.name}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                                                            Langkah 3: Pilih Skill & Keahlian Anda
                                                        </h3>
                                                        <p className="text-[11px] sm:text-xs text-neutral-500">
                                                            Pilih teknologi dan keahlian di bidang {selectedSubCategory.name} yang Anda kuasai (bisa pilih lebih dari satu).
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={handleBackToCategories}
                                                        className="text-[11px] text-neutral-400 hover:text-blue-600 transition-colors self-start sm:self-auto cursor-pointer"
                                                    >
                                                        + Eksplor Bidang Lain
                                                    </button>
                                                </div>

                                                {activeSubSkills.length === 0 ? (
                                                    <div className="p-6 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-2 bg-neutral-50/50 dark:bg-neutral-900/40">
                                                        <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                            Belum ada daftar skill untuk {selectedSubCategory.name}
                                                        </p>
                                                        <p className="text-[11px] text-neutral-400 max-w-md mx-auto">
                                                            Gunakan pencarian global di atas untuk mencari keahlian yang spesifik, atau pilih bidang spesifik lain.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                                                        {activeSubSkills.map((skillName) => {
                                                            const isSelected = selectedRoles.includes(skillName);
                                                            return (
                                                                <button
                                                                    key={skillName}
                                                                    type="button"
                                                                    onClick={() => toggleRole(skillName)}
                                                                    className={`group text-left px-3.5 py-3 rounded-xl border text-xs transition-all relative flex items-center justify-between gap-2 cursor-pointer ${
                                                                        isSelected
                                                                            ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 shadow-xs ring-2 ring-blue-500/50'
                                                                            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300'
                                                                    }`}
                                                                >
                                                                    <span
                                                                        className={`font-semibold leading-snug line-clamp-2 ${
                                                                            isSelected ? 'text-blue-700 dark:text-blue-300 font-bold' : ''
                                                                        }`}
                                                                    >
                                                                        {skillName}
                                                                    </span>
                                                                    <div
                                                                        className={`size-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                                                            isSelected
                                                                                ? 'bg-blue-600 text-white'
                                                                                : 'border border-neutral-300 dark:border-neutral-700 opacity-60 group-hover:opacity-100'
                                                                        }`}
                                                                    >
                                                                        {isSelected && <Check className="size-3 stroke-[3]" />}
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ================================================================= */}
                                {/* SELECTED ROLES & TECH STACKS PREVIEW DRAWER                       */}
                                {/* ================================================================= */}
                                {selectedRoles.length > 0 && (
                                    <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 space-y-2 mt-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                                                <CheckCircle2 className="size-3.5 text-blue-600" />
                                                Peminatan & Tech Stack Terpilih ({selectedRoles.length})
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedRoles([])}
                                                className="text-[11px] text-neutral-400 hover:text-red-500 transition-colors"
                                            >
                                                Reset Semua
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
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

                                {/* STEP 2: TWO CARDS */}
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
                                            ✓ {selectedRoles.length} peran / tech stack dipilih
                                        </span>
                                    ) : (
                                        <span>Pilih minimal 1 peran / tech stack untuk melanjutkan</span>
                                    )}
                                </span>

                                <Button
                                    type="button"
                                    onClick={() => {
                                        if (selectedRoles.length === 0) {
                                            setErrorMessage('Silakan pilih minimal 1 peminatan peran / tech stack.');
                                            return;
                                        }
                                        setErrorMessage(null);
                                        setStep(2);
                                    }}
                                    disabled={selectedRoles.length === 0}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
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
                                    className="text-xs gap-1.5 rounded-xl cursor-pointer"
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
