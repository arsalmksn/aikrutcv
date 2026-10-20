import React, { useMemo, useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    Briefcase,
    Building2,
    Calendar,
    Check,
    ChevronRight,
    Code,
    DollarSign,
    Edit3,
    Headphones,
    Layers,
    Loader2,
    Megaphone,
    Palette,
    PenTool,
    Plus,
    Search,
    TrendingUp,
    User,
    Users,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TechSkillIcon } from './TechSkillIcon';

export interface WizardRoleItem {
    id: number;
    career_sub_category_id: number;
    name: string;
    slug: string;
    popular_skills: string[];
    sort_order: number;
    is_active: boolean;
}

export interface WizardSubCategoryItem {
    id: number;
    career_category_id: number;
    name: string;
    slug: string;
    description: string | null;
    popular_skills?: string[];
    sort_order: number;
    is_active: boolean;
    roles?: WizardRoleItem[];
}

export interface WizardCategoryItem {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string;
    sort_order: number;
    is_active: boolean;
    sub_categories: WizardSubCategoryItem[];
}

export type WizardSavePayload = {
    career_category_id: number;
    career_sub_category_id?: number;
    new_sub_category_name?: string;
    career_sub_category_ids?: number[];
    skills: string[];
    [key: string]: any;
};

interface OnboardingWizardProps {
    categories: WizardCategoryItem[];
    onCancel: () => void;
    onSave: (payload: WizardSavePayload) => void;
    onOpenAddCategory: () => void;
    isSaving?: boolean;
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

// Fallback curated skills for quick selection if a sub-category has few skills
const DEFAULT_CURATED_SKILLS = [
    'React',
    'Next.js',
    'Vue.js',
    'Angular',
    'TypeScript',
    'JavaScript',
    'Tailwind CSS',
    'HTML & CSS',
    'SASS',
];

export function OnboardingWizard({
    categories,
    onCancel,
    onSave,
    onOpenAddCategory,
    isSaving = false,
}: OnboardingWizardProps) {
    // Current Step (1 to 3)
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

    // Selections
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(() => {
        return categories.length > 0 ? categories[0].id : null;
    });

    const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState<number[]>([]);
    const [focusedSubCategoryId, setFocusedSubCategoryId] = useState<number | null>(null);

    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [newSkillInput, setNewSkillInput] = useState<string>('');

    // Search queries per step
    const [searchStep1, setSearchStep1] = useState('');
    const [searchStep2, setSearchStep2] = useState('');
    const [searchStep3, setSearchStep3] = useState('');

    // Active Category Object
    const activeCategory = useMemo(() => {
        return categories.find((c) => c.id === selectedCategoryId) || null;
    }, [categories, selectedCategoryId]);

    // Active SubCategory Object
    const activeSubCategory = useMemo(() => {
        if (!activeCategory) return null;
        if (focusedSubCategoryId) {
            return activeCategory.sub_categories.find((sc) => sc.id === focusedSubCategoryId) || null;
        }
        if (selectedSubCategoryIds.length > 0) {
            return activeCategory.sub_categories.find((sc) => sc.id === selectedSubCategoryIds[0]) || null;
        }
        return activeCategory.sub_categories[0] || null;
    }, [activeCategory, focusedSubCategoryId, selectedSubCategoryIds]);

    // Filtered Categories (Step 1)
    const filteredCategories = useMemo(() => {
        const query = searchStep1.trim().toLowerCase();
        if (!query) return categories;
        return categories.filter(
            (c) =>
                c.name.toLowerCase().includes(query) ||
                (c.description && c.description.toLowerCase().includes(query))
        );
    }, [categories, searchStep1]);

    // Filtered SubCategories (Step 2)
    const filteredSubCategories = useMemo(() => {
        if (!activeCategory) return [];
        const query = searchStep2.trim().toLowerCase();
        if (!query) return activeCategory.sub_categories;
        return activeCategory.sub_categories.filter(
            (sc) =>
                sc.name.toLowerCase().includes(query) ||
                (sc.description && sc.description.toLowerCase().includes(query))
        );
    }, [activeCategory, searchStep2]);

    // Available Skills for Step 3
    const availableSkills = useMemo(() => {
        const skillsSet = new Set<string>();

        // 1. Add skills directly from activeSubCategory.popular_skills
        if (activeSubCategory?.popular_skills) {
            activeSubCategory.popular_skills.forEach((s) => skillsSet.add(s));
        }

        // 2. Add skills from roles if present for fallback
        if (activeSubCategory?.roles) {
            activeSubCategory.roles.forEach((r) => {
                if (r.popular_skills) {
                    r.popular_skills.forEach((s) => skillsSet.add(s));
                }
            });
        }

        // 3. Fallback curated skills if list is small
        if (skillsSet.size < 6) {
            DEFAULT_CURATED_SKILLS.forEach((s) => skillsSet.add(s));
        }

        // 4. Add currently selected skills
        selectedSkills.forEach((s) => skillsSet.add(s));

        const list = Array.from(skillsSet);
        const query = searchStep3.trim().toLowerCase();
        if (!query) return list;
        return list.filter((s) => s.toLowerCase().includes(query));
    }, [activeSubCategory, selectedSkills, searchStep3]);

    // Step 2: Toggle SubCategory selection
    const toggleSubCategory = (id: number) => {
        setSelectedSubCategoryIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            }
            return [...prev, id];
        });
    };

    // Step 2: Select/Deselect All
    const handleSelectAllSubCategories = () => {
        if (!activeCategory) return;
        const allIds = activeCategory.sub_categories.map((sc) => sc.id);
        if (selectedSubCategoryIds.length === allIds.length) {
            setSelectedSubCategoryIds([]);
        } else {
            setSelectedSubCategoryIds(allIds);
        }
    };

    // Step 3: Toggle Skill selection
    const toggleSkill = (skill: string) => {
        setSelectedSkills((prev) => {
            if (prev.includes(skill)) {
                return prev.filter((s) => s !== skill);
            }
            return [...prev, skill];
        });
    };

    // Add custom skill
    const handleAddCustomSkill = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newSkillInput.trim();
        if (!trimmed) return;
        if (!selectedSkills.includes(trimmed)) {
            setSelectedSkills((prev) => [...prev, trimmed]);
        }
        setNewSkillInput('');
    };

    // Handle next step validation & navigation
    const handleNext = () => {
        if (currentStep === 1) {
            if (!selectedCategoryId && categories.length > 0) {
                setSelectedCategoryId(categories[0].id);
            }
            if (activeCategory && selectedSubCategoryIds.length === 0 && activeCategory.sub_categories.length > 0) {
                setSelectedSubCategoryIds([activeCategory.sub_categories[0].id]);
                setFocusedSubCategoryId(activeCategory.sub_categories[0].id);
            }
            setCurrentStep(2);
        } else if (currentStep === 2) {
            if (selectedSubCategoryIds.length > 0 && !focusedSubCategoryId) {
                setFocusedSubCategoryId(selectedSubCategoryIds[0]);
            }
            // Pre-fill skills from subCategory if none selected yet
            if (activeSubCategory && selectedSkills.length === 0 && activeSubCategory.popular_skills) {
                setSelectedSkills(activeSubCategory.popular_skills.slice(0, 4));
            }
            setCurrentStep(3);
        }
    };

    const handleBack = () => {
        if (currentStep === 3) setCurrentStep(2);
        else if (currentStep === 2) setCurrentStep(1);
    };

    // Final save directly from Step 3
    const handleFinish = () => {
        if (!selectedCategoryId) return;

        const subCatId = focusedSubCategoryId || (selectedSubCategoryIds.length > 0 ? selectedSubCategoryIds[0] : 0);

        onSave({
            career_category_id: selectedCategoryId,
            career_sub_category_ids: selectedSubCategoryIds,
            career_sub_category_id: subCatId,
            skills: selectedSkills,
        });
    };

    return (
        <div className="w-full bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col">
            {/* Top Breadcrumb & Stepper Header */}
            <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/40 dark:bg-neutral-900/40">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mb-3">
                    <span>Onboarding</span>
                    <span>&gt;</span>
                    <span className="text-neutral-700 dark:text-neutral-300 font-semibold">Peminatan Karir</span>
                </div>

                {/* Stepper Progress Bar (3 Steps: Bidang Utama -> Bidang Spesifik -> Skill) */}
                <div className="flex items-center justify-between max-w-2xl mx-auto py-2">
                    {[
                        { step: 1, label: 'Bidang Utama' },
                        { step: 2, label: 'Bidang Spesifik' },
                        { step: 3, label: 'Skill / Teknologi' },
                    ].map((item, idx, arr) => {
                        const isCompleted = currentStep > item.step;
                        const isActive = currentStep === item.step;

                        return (
                            <React.Fragment key={item.step}>
                                <div
                                    className="flex items-center gap-2.5 cursor-pointer group"
                                    onClick={() => {
                                        if (item.step <= currentStep) {
                                            setCurrentStep(item.step as 1 | 2 | 3);
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
                                        className={`text-xs sm:text-sm font-semibold transition-colors ${
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
                                    <div className="flex-1 mx-3 sm:mx-6 h-0.5 bg-neutral-200 dark:bg-neutral-800 relative">
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

            {/* Stepper Body Container */}
            <div className="p-6 sm:p-10 flex-1">
                {/* ========================================================================= */}
                {/* STEP 1: TAMBAH / PILIH BIDANG UTAMA                                       */}
                {/* ========================================================================= */}
                {currentStep === 1 && (
                    <div className="space-y-6 max-w-5xl mx-auto">
                        <div className="space-y-1">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                Tambah / Pilih Bidang Utama
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                                Pilih kategori bidang karir utama untuk menentukan spesialisasi keahlian.
                            </p>
                        </div>

                        {/* Search & Action Bar */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                <Input
                                    type="text"
                                    placeholder="Cari bidang utama..."
                                    value={searchStep1}
                                    onChange={(e) => setSearchStep1(e.target.value)}
                                    className="pl-10 h-10 rounded-xl text-xs sm:text-sm bg-neutral-50/50 dark:bg-neutral-950/40 border-neutral-200 dark:border-neutral-800 shadow-2xs"
                                />
                            </div>

                            <Button
                                type="button"
                                onClick={onOpenAddCategory}
                                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-semibold h-10 px-4 gap-2 shadow-sm shadow-blue-600/30 cursor-pointer"
                            >
                                <Plus className="size-4" />
                                + Tambah Bidang Utama
                            </Button>
                        </div>

                        {/* 3-Column Card Grid matching Panel 1 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                            {filteredCategories.map((cat) => {
                                const isSelected = selectedCategoryId === cat.id;
                                const IconComp = CATEGORY_ICON_MAP[cat.icon] || Briefcase;

                                return (
                                    <div
                                        key={cat.id}
                                        onClick={() => {
                                            setSelectedCategoryId(cat.id);
                                            if (cat.sub_categories.length > 0) {
                                                setSelectedSubCategoryIds([cat.sub_categories[0].id]);
                                                setFocusedSubCategoryId(cat.sub_categories[0].id);
                                            } else {
                                                setSelectedSubCategoryIds([]);
                                                setFocusedSubCategoryId(null);
                                            }
                                        }}
                                        className={`rounded-2xl p-5 border text-left cursor-pointer transition-all duration-200 relative group flex flex-col justify-between h-40 ${
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
                                                    {cat.name}
                                                </h3>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-0.5">
                                                    {cat.description || 'Peminatan dan fokus industri kerja.'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                                            <span>{cat.sub_categories.length} Bidang Spesifik</span>
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
                {/* STEP 2: BIDANG SPESIFIK (PILIH BIDANG SPESIFIK)                           */}
                {/* ========================================================================= */}
                {currentStep === 2 && (
                    <div className="space-y-6 max-w-5xl mx-auto">
                        <div className="space-y-1">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                Pilih Bidang Spesifik
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                                Pilih bidang spesifik yang sesuai dengan fokus peminatan kariermu.
                            </p>
                        </div>

                        {/* Selected Parent Chip */}
                        {activeCategory && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(1)}
                                    className="text-neutral-400 hover:text-red-500"
                                    title="Ganti Kategori"
                                >
                                    <X className="size-3.5" />
                                </button>
                                <span>{activeCategory.name}</span>
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(1)}
                                    className="text-neutral-400 hover:text-blue-600 ml-1"
                                    title="Edit Kategori"
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
                                {activeCategory && selectedSubCategoryIds.length === activeCategory.sub_categories.length
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
                                    const isChecked = selectedSubCategoryIds.includes(sub.id);

                                    return (
                                        <div
                                            key={sub.id}
                                            onClick={() => {
                                                toggleSubCategory(sub.id);
                                                setFocusedSubCategoryId(sub.id);
                                            }}
                                            className={`rounded-2xl p-4 sm:p-5 border text-left cursor-pointer transition-all duration-200 flex items-start gap-3.5 ${
                                                isChecked
                                                    ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 ring-1 ring-blue-600/30'
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

                                            <div className="space-y-1">
                                                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                                    {sub.name}
                                                </h4>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                                                    {sub.description || 'Fokus pekerjaan dan keahlian spesifik.'}
                                                </p>
                                                {sub.popular_skills && sub.popular_skills.length > 0 && (
                                                    <p className="text-[11px] text-blue-600 dark:text-blue-400 pt-1">
                                                        {sub.popular_skills.length} Skill tersedia
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
                {/* STEP 3: SKILL / TEKNOLOGI (MULTIPLE SELECT - DIRECT SAVE)                 */}
                {/* ========================================================================= */}
                {currentStep === 3 && (
                    <div className="space-y-6 max-w-5xl mx-auto">
                        <div className="space-y-1">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                Pilih Skill / Teknologi
                            </h2>
                            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                                Pilih satu atau lebih skill atau teknologi yang relevan dengan bidang spesifik ini.
                            </p>
                        </div>

                        {/* Breadcrumbs Path Chip */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex-wrap">
                            <span>{activeCategory?.name}</span>
                            <span className="text-neutral-400">&gt;</span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold">{activeSubCategory?.name || 'Bidang Spesifik'}</span>
                            <button
                                type="button"
                                onClick={() => setCurrentStep(2)}
                                className="text-neutral-400 hover:text-blue-600 ml-1"
                                title="Ubah Bidang Spesifik"
                            >
                                <Edit3 className="size-3" />
                            </button>
                        </div>

                        {/* Search Bar + Custom Skill Adder */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                                <Input
                                    type="text"
                                    placeholder="Cari skill atau teknologi..."
                                    value={searchStep3}
                                    onChange={(e) => setSearchStep3(e.target.value)}
                                    className="pl-10 h-10 rounded-xl text-xs sm:text-sm bg-neutral-50/50 dark:bg-neutral-950/40 border-neutral-200 dark:border-neutral-800"
                                />
                            </div>

                            <form onSubmit={handleAddCustomSkill} className="flex items-center gap-2">
                                <Input
                                    type="text"
                                    placeholder="+ Ketik skill custom..."
                                    value={newSkillInput}
                                    onChange={(e) => setNewSkillInput(e.target.value)}
                                    className="h-10 text-xs rounded-xl w-44"
                                />
                                <Button type="submit" variant="outline" className="h-10 text-xs rounded-xl">
                                    Tambah
                                </Button>
                            </form>
                        </div>

                        {/* Section Header */}
                        <div className="pt-2">
                            <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                {activeSubCategory?.name || 'Teknologi'}
                            </h3>
                        </div>

                        {/* 3-Column Skills Grid with Brand Logos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                            {availableSkills.map((skill) => {
                                const isChecked = selectedSkills.includes(skill);

                                return (
                                    <div
                                        key={skill}
                                        onClick={() => toggleSkill(skill)}
                                        className={`rounded-2xl p-3.5 sm:p-4 border text-left cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 ${
                                            isChecked
                                                ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/20 ring-1 ring-blue-600/30'
                                                : 'border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <TechSkillIcon name={skill} className="size-6 shrink-0" />
                                            <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                                                {skill}
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
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Stepper Footer Navigation */}
            <div className="px-6 sm:px-8 py-4 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/40 dark:bg-neutral-900/40 flex items-center justify-between">
                <div>
                    {currentStep === 1 ? (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="rounded-xl text-xs sm:text-sm h-10 px-5 cursor-pointer text-neutral-600 dark:text-neutral-300"
                        >
                            Batal
                        </Button>
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
                    {currentStep < 3 ? (
                        <Button
                            type="button"
                            onClick={handleNext}
                            disabled={
                                (currentStep === 1 && !selectedCategoryId) ||
                                (currentStep === 2 && selectedSubCategoryIds.length === 0)
                            }
                            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm h-10 px-6 gap-2 cursor-pointer shadow-sm shadow-blue-600/30 font-semibold"
                        >
                            Selanjutnya
                            <ArrowRight className="size-3.5" />
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={handleFinish}
                            disabled={isSaving}
                            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm h-10 px-6 gap-2 cursor-pointer shadow-sm shadow-blue-600/30 font-semibold"
                        >
                            {isSaving && <Loader2 className="size-3.5 animate-spin mr-1" />}
                            Simpan Data
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
