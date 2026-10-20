import { router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Briefcase,
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    Code,
    DollarSign,
    Edit3,
    Headphones,
    Layers,
    Loader2,
    Megaphone,
    Palette,
    PenTool,
    Search,
    TrendingUp,
    UploadCloud,
    User,
    Users,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type {
    CareerCategoryItem,
    CareerSubCategoryItem,
} from '@/data/career-categories';
import { CvImportModal } from '@/pages/profile/components/CvImportModal';
import type { UserProfileData } from '@/types/profile';
import { TechSkillIcon } from './TechSkillIcon';

export interface UserOnboardingWizardProps {
    careerCategories: CareerCategoryItem[];
    savedPeminatan?: string[];
    onClose?: () => void;
    isModal?: boolean;
}

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
    Code,
    TrendingUp,
    Users,
    DollarSign,
    Headphones,
    Palette,
    Briefcase,
    Layers,
    Building2,
    Calendar,
    Megaphone,
    PenTool,
    User,
};

export function UserOnboardingWizard({
    careerCategories,
    savedPeminatan = [],
    onClose,
    isModal = false,
}: UserOnboardingWizardProps) {
    // Current Step: 1 (Bidang Utama) -> 2 (Bidang Spesifik) -> 3 (Skill & Teknologi) -> 4 (Sumber Data Profil)
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

    // Selections State
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | number | null>(() => {
        return careerCategories.length > 0 ? (careerCategories[0].db_id || careerCategories[0].id) : null;
    });

    const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState<Array<string | number>>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    // Search Queries per Step
    const [searchStep1, setSearchStep1] = useState('');
    const [searchStep2, setSearchStep2] = useState('');
    const [searchStep3, setSearchStep3] = useState('');

    // Tab Filter for Step 3: 'all' or subCategoryId
    const [skillActiveTab, setSkillActiveTab] = useState<'all' | string | number>('all');

    // Submission & Modals State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isCvModalOpen, setIsCvModalOpen] = useState(false);

    // Active Category Object
    const activeCategory = useMemo(() => {
        return (
            careerCategories.find(
                (c) => c.id === selectedCategoryId || c.db_id === selectedCategoryId
            ) || null
        );
    }, [careerCategories, selectedCategoryId]);

    // Active SubCategory Objects list based on multi-selected IDs
    const selectedSubCategories = useMemo(() => {
        if (!activeCategory || !activeCategory.sub_categories) return [];
        return activeCategory.sub_categories.filter((sc) =>
            selectedSubCategoryIds.includes(sc.id) || (sc.db_id && selectedSubCategoryIds.includes(sc.db_id))
        );
    }, [activeCategory, selectedSubCategoryIds]);

    // Filtered Categories for Step 1
    const filteredCategories = useMemo(() => {
        const query = searchStep1.trim().toLowerCase();
        if (!query) return careerCategories;
        return careerCategories.filter((c) => {
            const name = c.title || c.name || '';
            const desc = c.description || '';
            return name.toLowerCase().includes(query) || desc.toLowerCase().includes(query);
        });
    }, [careerCategories, searchStep1]);

    // Filtered SubCategories for Step 2
    const filteredSubCategories = useMemo(() => {
        if (!activeCategory || !activeCategory.sub_categories) return [];
        const query = searchStep2.trim().toLowerCase();
        if (!query) return activeCategory.sub_categories;
        return activeCategory.sub_categories.filter((sc) => {
            const name = sc.name || '';
            const desc = sc.description || '';
            return name.toLowerCase().includes(query) || desc.toLowerCase().includes(query);
        });
    }, [activeCategory, searchStep2]);

    // Available Skills aggregated from ALL selected SubCategories for Step 3
    // Map each skill with its associated subCategory id/name for tab filtering
    const allAggregatedSkills = useMemo(() => {
        const skillsMap = new Map<string, { name: string; subCategoryIds: Array<string | number> }>();

        selectedSubCategories.forEach((sub) => {
            const subId = sub.db_id || sub.id;
            const skills: string[] = [];

            if (sub.popular_skills && sub.popular_skills.length > 0) {
                skills.push(...sub.popular_skills);
            }
            if (sub.roles && sub.roles.length > 0) {
                sub.roles.forEach((r) => {
                    if (r.popular_skills && r.popular_skills.length > 0) {
                        skills.push(...r.popular_skills);
                    } else if (r.name) {
                        skills.push(r.name);
                    }
                });
            }

            skills.forEach((sk) => {
                const trimmed = sk.trim();
                if (!trimmed) return;
                const existing = skillsMap.get(trimmed);
                if (existing) {
                    if (!existing.subCategoryIds.includes(subId)) {
                        existing.subCategoryIds.push(subId);
                    }
                } else {
                    skillsMap.set(trimmed, {
                        name: trimmed,
                        subCategoryIds: [subId],
                    });
                }
            });
        });

        return Array.from(skillsMap.values());
    }, [selectedSubCategories]);

    // Filtered Skills in Step 3 by Tab & Search Query
    const filteredSkills = useMemo(() => {
        let list = allAggregatedSkills;

        // Filter by Tab (if not 'all')
        if (skillActiveTab !== 'all') {
            list = list.filter((item) => item.subCategoryIds.includes(skillActiveTab));
        }

        // Filter by Search Query
        const query = searchStep3.trim().toLowerCase();
        if (query) {
            list = list.filter((item) => item.name.toLowerCase().includes(query));
        }

        return list;
    }, [allAggregatedSkills, skillActiveTab, searchStep3]);

    // =========================================================================
    // Handlers
    // =========================================================================

    // Step 2: Toggle SubCategory selection
    const toggleSubCategory = (id: string | number) => {
        setErrorMessage(null);
        setSelectedSubCategoryIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            }
            return [...prev, id];
        });
    };

    // Step 2: Select/Deselect All
    const handleSelectAllSubCategories = () => {
        if (!activeCategory || !activeCategory.sub_categories) return;
        const allIds = activeCategory.sub_categories.map((sc) => sc.db_id || sc.id);
        if (selectedSubCategoryIds.length === allIds.length) {
            setSelectedSubCategoryIds([]);
        } else {
            setSelectedSubCategoryIds(allIds);
        }
        setErrorMessage(null);
    };

    // Step 3: Toggle Skill selection
    const toggleSkill = (skillName: string) => {
        setErrorMessage(null);
        setSelectedSkills((prev) => {
            if (prev.includes(skillName)) {
                return prev.filter((s) => s !== skillName);
            }
            return [...prev, skillName];
        });
    };

    // Next step validation & transition
    const handleNext = () => {
        setErrorMessage(null);

        if (currentStep === 1) {
            if (!selectedCategoryId) {
                setErrorMessage('Silakan pilih salah satu Bidang Utama untuk melanjutkan.');
                return;
            }
            // Auto-select first sub-category if none selected yet
            if (activeCategory && selectedSubCategoryIds.length === 0 && activeCategory.sub_categories && activeCategory.sub_categories.length > 0) {
                const firstSubId = activeCategory.sub_categories[0].db_id || activeCategory.sub_categories[0].id;
                setSelectedSubCategoryIds([firstSubId]);
            }
            setCurrentStep(2);
        } else if (currentStep === 2) {
            if (selectedSubCategoryIds.length === 0) {
                setErrorMessage('Silakan pilih minimal 1 Bidang Spesifik untuk melanjutkan.');
                return;
            }
            // Auto-suggest first 3-4 skills if none selected yet
            if (selectedSkills.length === 0 && allAggregatedSkills.length > 0) {
                setSelectedSkills(allAggregatedSkills.slice(0, 4).map((s) => s.name));
            }
            setSkillActiveTab('all');
            setCurrentStep(3);
        } else if (currentStep === 3) {
            if (selectedSkills.length === 0) {
                setErrorMessage('Silakan pilih minimal 1 Skill atau Teknologi untuk melanjutkan.');
                return;
            }
            setCurrentStep(4);
        }
    };

    const handleBack = () => {
        setErrorMessage(null);
        if (currentStep === 4) setCurrentStep(3);
        else if (currentStep === 3) setCurrentStep(2);
        else if (currentStep === 2) setCurrentStep(1);
    };

    // Step 4: Option A (Pilih dari Onboarding - Mulai Cepat)
    const handleChooseOnboarding = () => {
        if (selectedSubCategories.length === 0) {
            setErrorMessage('Silakan pilih minimal 1 bidang spesifik di Langkah 2.');
            setCurrentStep(2);
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);

        // Store selected sub-category names as field_of_interest
        const fieldOfInterest = selectedSubCategories.map((sc) => sc.name);

        router.post(
            '/onboarding/complete',
            {
                field_of_interest: fieldOfInterest,
                selected_skills: selectedSkills,
                profile_data_source: 'manual',
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
                    setErrorMessage(
                        (Object.values(errors)[0] as string) || 'Gagal menyimpan data onboarding.'
                    );
                },
            }
        );
    };

    // Step 4: Option B (Import dari CV Success Callback)
    const handleCvImportSuccess = (_updatedProfile: UserProfileData) => {
        setIsCvModalOpen(false);
        if (onClose) onClose();
        router.visit('/profile');
    };

    return (
        <div className={`w-full bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col ${
            isModal ? 'max-h-[90vh]' : ''
        }`}>
            {/* Top Stepper Header (4 Steps: Bidang Utama -> Bidang Spesifik -> Skill -> Sumber Data) */}
            <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/40 dark:bg-neutral-900/40 shrink-0">
                {/* Stepper Progress Indicator */}
                <div className="flex items-center justify-between max-w-3xl mx-auto py-2">
                    {[
                        { step: 1, label: 'Bidang Utama' },
                        { step: 2, label: 'Bidang Spesifik' },
                        { step: 3, label: 'Skill & Teknologi' },
                        { step: 4, label: 'Sumber Data Profil' },
                    ].map((item, idx, arr) => {
                        const isCompleted = currentStep > item.step;
                        const isActive = currentStep === item.step;

                        return (
                            <React.Fragment key={item.step}>
                                <div
                                    className="flex items-center gap-2.5 cursor-pointer group"
                                    onClick={() => {
                                        if (item.step < currentStep) {
                                            setCurrentStep(item.step as 1 | 2 | 3 | 4);
                                        }
                                    }}
                                >
                                    <div
                                        className={`size-7 sm:size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                            isActive
                                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/40 ring-4 ring-blue-100 dark:ring-blue-950'
                                                : isCompleted
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                                        }`}
                                    >
                                        {isCompleted ? <Check className="size-4 stroke-[2.5]" /> : item.step}
                                    </div>
                                    <span
                                        className={`hidden sm:inline text-xs sm:text-sm font-semibold transition-colors ${
                                            isActive
                                                ? 'text-blue-600 dark:text-blue-400 font-bold'
                                                : isCompleted
                                                ? 'text-neutral-900 dark:text-neutral-100'
                                                : 'text-neutral-400'
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                </div>

                                {idx < arr.length - 1 && (
                                    <div className="flex-1 mx-2 sm:mx-4 h-0.5 bg-neutral-200 dark:bg-neutral-800 relative">
                                        <div
                                            className="h-full bg-blue-600 transition-all duration-300"
                                            style={{
                                                width: currentStep > item.step ? '100%' : '0%',
                                            }}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Error Notification Banner */}
            {errorMessage && (
                <div className="mx-6 sm:mx-8 mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
                    <X className="size-4 shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Stepper Body Container */}
            <div className="p-6 sm:p-8 md:p-10 flex-1 overflow-y-auto">
                {/* ========================================================================= */}
                {/* STEP 1: PILIH BIDANG UTAMA (SINGLE FOCUS)                                 */}
                {/* ========================================================================= */}
                {currentStep === 1 && (
                    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
                        <div className="space-y-1">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                Pilih Bidang Utama Karier Anda
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                                Pilih kategori bidang karir utama untuk menentukan spesialisasi keahlian profil Anda.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                            <Input
                                type="text"
                                placeholder="Cari bidang utama..."
                                value={searchStep1}
                                onChange={(e) => setSearchStep1(e.target.value)}
                                className="pl-10 h-10 rounded-xl text-xs sm:text-sm bg-neutral-50/50 dark:bg-neutral-950/40 border-neutral-200 dark:border-neutral-800 shadow-2xs"
                            />
                        </div>

                        {/* 3-Column Card Grid matching Admin Wizard */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                            {filteredCategories.map((cat) => {
                                const catId = cat.db_id || cat.id;
                                const isSelected = selectedCategoryId === catId || selectedCategoryId === cat.id;
                                const IconComp = CATEGORY_ICON_MAP[cat.icon] || Briefcase;
                                const subCount = cat.sub_categories?.length || 0;

                                return (
                                    <div
                                        key={catId}
                                        onClick={() => {
                                            setSelectedCategoryId(catId);
                                            // Reset sub-categories to first child if switching
                                            if (cat.sub_categories && cat.sub_categories.length > 0) {
                                                const firstSubId = cat.sub_categories[0].db_id || cat.sub_categories[0].id;
                                                setSelectedSubCategoryIds([firstSubId]);
                                            } else {
                                                setSelectedSubCategoryIds([]);
                                            }
                                            setSelectedSkills([]);
                                            setErrorMessage(null);
                                        }}
                                        className={`rounded-2xl p-5 border text-left cursor-pointer transition-all duration-200 relative group flex flex-col justify-between h-44 ${
                                            isSelected
                                                ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 ring-1 ring-blue-600/30 shadow-xs'
                                                : 'border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-2xs'
                                        }`}
                                    >
                                        <div className="space-y-3">
                                            <div className="size-9 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center">
                                                <IconComp className="size-5" />
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 transition-colors">
                                                    {cat.title || cat.name}
                                                </h3>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-0.5 leading-relaxed">
                                                    {cat.description || 'Peminatan dan fokus industri kerja.'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                                            <span>{subCount} Bidang Spesifik</span>
                                            {isSelected && (
                                                <div className="size-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                                    <Check className="size-3 stroke-[3]" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* STEP 2: BIDANG SPESIFIK (MULTI-SELECTION CHECKBOXES)                      */}
                {/* ========================================================================= */}
                {currentStep === 2 && (
                    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
                        <div className="space-y-1">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                Pilih Bidang Spesifik
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                                Anda dapat memilih lebih dari satu bidang spesifik yang sesuai dengan fokus karier Anda.
                            </p>
                        </div>

                        {/* Selected Parent Chip */}
                        {activeCategory && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                <span>{activeCategory.title || activeCategory.name}</span>
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(1)}
                                    className="text-neutral-400 hover:text-blue-600 ml-1 cursor-pointer"
                                    title="Ganti Bidang Utama"
                                >
                                    <Edit3 className="size-3" />
                                </button>
                            </div>
                        )}

                        {/* Search & "Pilih Semua" bar */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                <Input
                                    type="text"
                                    placeholder="Cari bidang spesifik..."
                                    value={searchStep2}
                                    onChange={(e) => setSearchStep2(e.target.value)}
                                    className="pl-10 h-10 rounded-xl text-xs sm:text-sm bg-neutral-50/50 dark:bg-neutral-950/40 border-neutral-200 dark:border-neutral-800"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleSelectAllSubCategories}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer px-2 py-1"
                            >
                                {activeCategory?.sub_categories &&
                                selectedSubCategoryIds.length === activeCategory.sub_categories.length
                                    ? 'Batalkan Semua'
                                    : 'Pilih Semua'}
                            </button>
                        </div>

                        {/* 3-Column Checkbox Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                            {filteredSubCategories.length === 0 ? (
                                <div className="col-span-full text-center py-10 text-neutral-400 text-xs">
                                    Belum ada bidang spesifik di kategori ini.
                                </div>
                            ) : (
                                filteredSubCategories.map((sub) => {
                                    const subId = sub.db_id || sub.id;
                                    const isChecked = selectedSubCategoryIds.includes(subId) || selectedSubCategoryIds.includes(sub.id);
                                    const skillCount = sub.popular_skills?.length || sub.roles?.length || 0;

                                    return (
                                        <div
                                            key={subId}
                                            onClick={() => toggleSubCategory(subId)}
                                            className={`rounded-2xl p-4 sm:p-5 border text-left cursor-pointer transition-all duration-200 flex items-start gap-3.5 ${
                                                isChecked
                                                    ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 ring-1 ring-blue-600/30 shadow-2xs'
                                                    : 'border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300'
                                            }`}
                                        >
                                            {/* Checkbox box */}
                                            <div
                                                className={`size-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                                                    isChecked
                                                        ? 'bg-blue-600 text-white'
                                                        : 'border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800'
                                                }`}
                                            >
                                                {isChecked && <Check className="size-3.5 stroke-[3]" />}
                                            </div>

                                            <div className="space-y-1 min-w-0">
                                                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                                    {sub.name}
                                                </h4>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                                                    {sub.description || 'Fokus pekerjaan dan keahlian spesifik.'}
                                                </p>
                                                {skillCount > 0 && (
                                                    <p className="text-[11px] text-blue-600 dark:text-blue-400 pt-1 font-medium">
                                                        {skillCount} Skill tersedia
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* STEP 3: SKILL & TEKNOLOGI (UNIFIED GRID + TAB FILTERS, NO CUSTOM INPUT)   */}
                {/* ========================================================================= */}
                {currentStep === 3 && (
                    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
                        <div className="space-y-1">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                Pilih Skill & Teknologi
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                                Pilih keahlian atau teknologi yang Anda kuasai dari data master resmi.
                            </p>
                        </div>

                        {/* Breadcrumbs Path Chip */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex-wrap">
                            <span>{activeCategory?.title || activeCategory?.name}</span>
                            <span className="text-neutral-400">&gt;</span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold">
                                {selectedSubCategories.length} Bidang Spesifik Terpilih
                            </span>
                            <button
                                type="button"
                                onClick={() => setCurrentStep(2)}
                                className="text-neutral-400 hover:text-blue-600 ml-1 cursor-pointer"
                                title="Ubah Bidang Spesifik"
                            >
                                <Edit3 className="size-3" />
                            </button>
                        </div>

                        {/* Quick Filter Tabs per Chosen SubCategory */}
                        {selectedSubCategories.length > 1 && (
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                                <button
                                    type="button"
                                    onClick={() => setSkillActiveTab('all')}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                        skillActiveTab === 'all'
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
                                    }`}
                                >
                                    Semua Skill ({allAggregatedSkills.length})
                                </button>

                                {selectedSubCategories.map((sub) => {
                                    const subId = sub.db_id || sub.id;
                                    const isActive = skillActiveTab === subId;
                                    const subSkillCount = allAggregatedSkills.filter((s) =>
                                        s.subCategoryIds.includes(subId)
                                    ).length;

                                    return (
                                        <button
                                            key={subId}
                                            type="button"
                                            onClick={() => setSkillActiveTab(subId)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                                isActive
                                                    ? 'bg-blue-600 text-white shadow-xs'
                                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
                                            }`}
                                        >
                                            {sub.name} ({subSkillCount})
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Search Bar (NO custom skill adder for users) */}
                        <div className="relative max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                            <Input
                                type="text"
                                placeholder="Cari skill atau teknologi..."
                                value={searchStep3}
                                onChange={(e) => setSearchStep3(e.target.value)}
                                className="pl-10 h-10 rounded-xl text-xs sm:text-sm bg-neutral-50/50 dark:bg-neutral-950/40 border-neutral-200 dark:border-neutral-800"
                            />
                        </div>

                        {/* 3-Column Skills Grid with Official Brand Logos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                            {filteredSkills.length === 0 ? (
                                <div className="col-span-full text-center py-10 text-neutral-400 text-xs">
                                    Tidak ada skill yang cocok dengan pencarian.
                                </div>
                            ) : (
                                filteredSkills.map((item) => {
                                    const isChecked = selectedSkills.includes(item.name);

                                    return (
                                        <div
                                            key={item.name}
                                            onClick={() => toggleSkill(item.name)}
                                            className={`rounded-2xl p-3.5 sm:p-4 border text-left cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 ${
                                                isChecked
                                                    ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 ring-1 ring-blue-600/30 shadow-2xs'
                                                    : 'border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <TechSkillIcon name={item.name} className="size-6 shrink-0" />
                                                <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                                                    {item.name}
                                                </span>
                                            </div>

                                            <div
                                                className={`size-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                                                    isChecked
                                                        ? 'bg-blue-600 text-white'
                                                        : 'border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800'
                                                }`}
                                            >
                                                {isChecked && <Check className="size-3.5 stroke-[3]" />}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Selected Skills Counter Summary */}
                        {selectedSkills.length > 0 && (
                            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
                                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                                    <CheckCircle2 className="size-4 text-blue-600" />
                                    {selectedSkills.length} Skill Terpilih
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedSkills([])}
                                    className="text-xs text-neutral-400 hover:text-red-500 cursor-pointer transition-colors"
                                >
                                    Reset Pilihan
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ========================================================================= */}
                {/* STEP 4: SUMBER DATA MASTER PROFIL (Pilih Onboarding vs Import dari CV)     */}
                {/* ========================================================================= */}
                {currentStep === 4 && (
                    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">

                        <div className="space-y-1">
                            <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                Pilih Cara Pengisian Data Master Anda
                            </h3>
                            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                                Pilih salah satu opsi di bawah ini untuk menginisialisasi profil karier Anda.
                            </p>
                        </div>

                        {/* TWO CARDS MATCHING ADMIN AESTHETICS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                            {/* CARD 1: BIKIN MANUAL */}
                            <div
                                onClick={handleChooseOnboarding}
                                className="group cursor-pointer rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 hover:border-blue-600 dark:hover:border-blue-500 bg-white dark:bg-neutral-900 p-6 space-y-4 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 flex flex-col justify-between relative overflow-hidden"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="size-11 rounded-xl bg-linear-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                                            <PenTool className="size-5" />
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className="text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                                        >
                                            Input Mandiri
                                        </Badge>
                                    </div>

                                    <div className="space-y-1">
                                        <h4 className="font-bold text-base text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            Bikin Manual
                                        </h4>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                            Mulai profil dari awal dengan data kosong. Peminatan & skill yang Anda pilih disimpan sebagai acuan AI Enhance agar asisten AI tidak halu.
                                        </p>
                                    </div>

                                    <div className="space-y-1.5 pt-1 text-xs text-neutral-600 dark:text-neutral-400">
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircle2 className="size-3.5 text-blue-600 shrink-0" />
                                            <span>Tanpa riwayat bawaan (profil bersih)</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircle2 className="size-3.5 text-blue-600 shrink-0" />
                                            <span>Pengisian data mandiri dan bertahap</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <CheckCircle2 className="size-3.5 text-blue-600 shrink-0" />
                                            <span>Fitur Import CV di profil tetap dapat digunakan kapan saja</span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl py-2.5 gap-2 shadow-xs group-hover:shadow-md transition-all mt-4 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <>
                                            <span>Bikin Profil Manual & Ke Profil</span>
                                            <ArrowRight className="size-4" />
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* CARD 2: IMPORT DARI CV */}
                            <div
                                onClick={() => setIsCvModalOpen(true)}
                                className="group cursor-pointer rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 hover:border-indigo-600 dark:hover:border-indigo-500 bg-white dark:bg-neutral-900 p-6 space-y-4 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col justify-between relative overflow-hidden"
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
                                        <h4 className="font-bold text-base text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            Import dari CV
                                        </h4>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                            Unggah berkas CV Anda (PDF atau DOCX). AI kami akan mengekstrak riwayat pekerjaan, pendidikan, dan keahlian Anda secara instan ke data master profil.
                                        </p>
                                    </div>

                                    <div className="space-y-1.5 pt-1 text-xs text-neutral-600 dark:text-neutral-400">
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
                                            <span>Data profil diisi murni berdasarkan berkas CV Anda</span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    disabled={isSubmitting}
                                    className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold rounded-xl py-2.5 gap-2 shadow-xs group-hover:shadow-md transition-all mt-4 cursor-pointer"
                                >
                                    <UploadCloud className="size-4" />
                                    <span>Unggah & Ekstrak Berkas CV</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Navigation Bar */}
            <div className="px-6 sm:px-8 py-4 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/40 dark:bg-neutral-900/40 flex items-center justify-between shrink-0">
                <div>
                    {currentStep === 1 ? (
                        onClose && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="rounded-xl text-xs sm:text-sm h-10 px-5 cursor-pointer text-neutral-600 dark:text-neutral-300"
                            >
                                Tutup
                            </Button>
                        )
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            className="rounded-xl text-xs sm:text-sm h-10 px-4 cursor-pointer gap-1.5 text-neutral-700 dark:text-neutral-300"
                        >
                            <ArrowLeft className="size-3.5" />
                            Kembali
                        </Button>
                    )}
                </div>

                <div>
                    {currentStep < 4 && (
                        <Button
                            type="button"
                            onClick={handleNext}
                            disabled={
                                (currentStep === 1 && !selectedCategoryId) ||
                                (currentStep === 2 && selectedSubCategoryIds.length === 0) ||
                                (currentStep === 3 && selectedSkills.length === 0)
                            }
                            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm h-10 px-6 gap-2 cursor-pointer shadow-sm shadow-blue-600/30 font-semibold"
                        >
                            Selanjutnya
                            <ArrowRight className="size-3.5" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Embedded CV Import Modal for Option B in Step 4 */}
            <CvImportModal
                isOpen={isCvModalOpen}
                onClose={() => setIsCvModalOpen(false)}
                onSuccess={handleCvImportSuccess}
            />
        </div>
    );
}
