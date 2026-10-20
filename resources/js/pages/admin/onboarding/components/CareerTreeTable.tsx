import React, { useMemo, useState } from 'react';
import {
    ChevronDown,
    ChevronRight,
    Edit3,
    Layers,
    MoreVertical,
    Plus,
    Search,
    Trash2,
    CheckCircle2,
    XCircle,
    Briefcase,
    Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { TechSkillIcon } from './TechSkillIcon';
import type {
    WizardCategoryItem,
    WizardSubCategoryItem,
} from './OnboardingWizard';

export type TreeItemType = 'Bidang Utama' | 'Bidang Spesifik' | 'Skill';

export interface FlatTreeItem {
    id: string;
    rawId: number;
    name: string;
    type: TreeItemType;
    parentName: string;
    isActive: boolean;
    depth: number; // 0 for category, 1 for sub_category, 2 for skill
    hasChildren: boolean;
    isExpanded: boolean;
    category?: WizardCategoryItem;
    subCategory?: WizardSubCategoryItem;
    skillName?: string;
    parentSubCategoryId?: number;
    parentCategoryId?: number;
}

interface CareerTreeTableProps {
    categories: WizardCategoryItem[];
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    onOpenWizard: () => void;
    onEditCategory: (cat: WizardCategoryItem) => void;
    onEditSubCategory: (sub: WizardSubCategoryItem) => void;
    onAddSubCategory: (categoryId: number) => void;
    onAddSkill: (subCategoryId: number) => void;
    onDeleteCategory: (cat: WizardCategoryItem) => void;
    onDeleteSubCategory: (sub: WizardSubCategoryItem) => void;
    onDeleteSkill: (sub: WizardSubCategoryItem, skill: string) => void;
    onToggleCategoryStatus: (cat: WizardCategoryItem) => void;
    onToggleSubCategoryStatus: (sub: WizardSubCategoryItem) => void;
}

export function CareerTreeTable({
    categories,
    activeTab = 'all',
    onTabChange,
    onOpenWizard,
    onEditCategory,
    onEditSubCategory,
    onAddSubCategory,
    onAddSkill,
    onDeleteCategory,
    onDeleteSubCategory,
    onDeleteSkill,
    onToggleCategoryStatus,
    onToggleSubCategoryStatus,
}: CareerTreeTableProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState<'Semua' | 'Bidang Utama' | 'Bidang Spesifik' | 'Skill'>(() => {
        if (activeTab === 'category') return 'Bidang Utama';
        if (activeTab === 'sub_category') return 'Bidang Spesifik';
        if (activeTab === 'skill') return 'Skill';
        return 'Semua';
    });

    // Track expanded rows by key
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        if (categories.length > 0) {
            initial[`cat-${categories[0].id}`] = true;
            if (categories[0].sub_categories.length > 0) {
                initial[`sub-${categories[0].sub_categories[0].id}`] = true;
            }
        }
        return initial;
    });

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [categoriesPerPage, setCategoriesPerPage] = useState<number>(4);
    const pageSize = 15;
    const isSemua = selectedTab === 'Semua';

    const toggleRow = (key: string) => {
        setExpandedRows((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleExpandAll = () => {
        const all: Record<string, boolean> = {};
        categories.forEach((cat) => {
            all[`cat-${cat.id}`] = true;
            cat.sub_categories.forEach((sub) => {
                all[`sub-${sub.id}`] = true;
            });
        });
        setExpandedRows(all);
    };

    const handleCollapseAll = () => {
        setExpandedRows({});
    };

    // 1. Filtered categories for 'Semua' tab
    const filteredCategories = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return categories;

        return categories.filter((cat) => {
            const catMatches =
                cat.name.toLowerCase().includes(query) ||
                (cat.description && cat.description.toLowerCase().includes(query));
            if (catMatches) return true;

            return cat.sub_categories.some((sub) => {
                const subMatches =
                    sub.name.toLowerCase().includes(query) ||
                    (sub.description && sub.description.toLowerCase().includes(query));
                if (subMatches) return true;

                return (
                    sub.popular_skills &&
                    sub.popular_skills.some((s) => s.toLowerCase().includes(query))
                );
            });
        });
    }, [categories, searchQuery]);

    // 2. All items for specific tabs
    const { flatItemsForSpecificTabs, allCounts } = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        const all: FlatTreeItem[] = [];
        const counts = {
            'Bidang Utama': categories.length,
            'Bidang Spesifik': 0,
            Skill: 0,
        };

        categories.forEach((cat) => {
            all.push({
                id: `cat-${cat.id}`,
                rawId: cat.id,
                name: cat.name,
                type: 'Bidang Utama',
                parentName: '-',
                isActive: cat.is_active,
                depth: 0,
                hasChildren: cat.sub_categories.length > 0,
                isExpanded: false,
                category: cat,
            });

            cat.sub_categories.forEach((sub) => {
                counts['Bidang Spesifik']++;
                const hasSkills = !!(sub.popular_skills && sub.popular_skills.length > 0);

                all.push({
                    id: `sub-${sub.id}`,
                    rawId: sub.id,
                    name: sub.name,
                    type: 'Bidang Spesifik',
                    parentName: cat.name,
                    isActive: sub.is_active,
                    depth: 1,
                    hasChildren: hasSkills,
                    isExpanded: false,
                    category: cat,
                    subCategory: sub,
                    parentCategoryId: cat.id,
                });

                if (sub.popular_skills) {
                    sub.popular_skills.forEach((skill, sIdx) => {
                        counts.Skill++;
                        all.push({
                            id: `skill-${sub.id}-${skill}-${sIdx}`,
                            rawId: sub.id,
                            name: skill,
                            type: 'Skill',
                            parentName: sub.name,
                            isActive: sub.is_active,
                            depth: 2,
                            hasChildren: false,
                            isExpanded: false,
                            category: cat,
                            subCategory: sub,
                            skillName: skill,
                            parentSubCategoryId: sub.id,
                        });
                    });
                }
            });
        });

        const filtered = all.filter((item) => {
            if (item.type !== selectedTab) return false;
            if (!query) return true;
            return (
                item.name.toLowerCase().includes(query) ||
                item.parentName.toLowerCase().includes(query)
            );
        });

        return { flatItemsForSpecificTabs: filtered, allCounts: counts };
    }, [categories, searchQuery, selectedTab]);

    // 3. Tree rows for 'Semua' tab - paginated by categories!
    const paginatedCategories = useMemo(() => {
        if (categoriesPerPage === 0) return filteredCategories;
        const start = (currentPage - 1) * categoriesPerPage;
        return filteredCategories.slice(start, start + categoriesPerPage);
    }, [filteredCategories, currentPage, categoriesPerPage]);

    const treeRowsForSemua = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        const rows: FlatTreeItem[] = [];

        paginatedCategories.forEach((cat) => {
            const catKey = `cat-${cat.id}`;
            const isCatExpanded = expandedRows[catKey] ?? false;
            const hasCatChildren = cat.sub_categories.length > 0;

            const catItem: FlatTreeItem = {
                id: catKey,
                rawId: cat.id,
                name: cat.name,
                type: 'Bidang Utama',
                parentName: '-',
                isActive: cat.is_active,
                depth: 0,
                hasChildren: hasCatChildren,
                isExpanded: isCatExpanded,
                category: cat,
            };

            rows.push(catItem);

            if (isCatExpanded || query) {
                cat.sub_categories.forEach((sub) => {
                    const subKey = `sub-${sub.id}`;
                    const isSubExpanded = expandedRows[subKey] ?? false;
                    const hasSkills = !!(sub.popular_skills && sub.popular_skills.length > 0);

                    const subItem: FlatTreeItem = {
                        id: subKey,
                        rawId: sub.id,
                        name: sub.name,
                        type: 'Bidang Spesifik',
                        parentName: cat.name,
                        isActive: sub.is_active,
                        depth: 1,
                        hasChildren: hasSkills,
                        isExpanded: isSubExpanded,
                        category: cat,
                        subCategory: sub,
                        parentCategoryId: cat.id,
                    };

                    rows.push(subItem);

                    if ((isSubExpanded || query) && sub.popular_skills) {
                        sub.popular_skills.forEach((skill, sIdx) => {
                            const skillKey = `skill-${sub.id}-${skill}-${sIdx}`;
                            const skillItem: FlatTreeItem = {
                                id: skillKey,
                                rawId: sub.id,
                                name: skill,
                                type: 'Skill',
                                parentName: sub.name,
                                isActive: sub.is_active,
                                depth: 2,
                                hasChildren: false,
                                isExpanded: false,
                                category: cat,
                                subCategory: sub,
                                skillName: skill,
                                parentSubCategoryId: sub.id,
                            };

                            rows.push(skillItem);
                        });
                    }
                });
            }
        });

        return rows;
    }, [paginatedCategories, expandedRows, searchQuery]);

    // Current rows to display
    const displayedRows = useMemo(() => {
        if (isSemua) {
            return treeRowsForSemua;
        } else {
            const start = (currentPage - 1) * pageSize;
            return flatItemsForSpecificTabs.slice(start, start + pageSize);
        }
    }, [isSemua, treeRowsForSemua, flatItemsForSpecificTabs, currentPage, pageSize]);

    // Pagination calculations
    const totalPages = useMemo(() => {
        if (isSemua) {
            if (categoriesPerPage === 0) return 1;
            return Math.ceil(filteredCategories.length / categoriesPerPage) || 1;
        } else {
            return Math.ceil(flatItemsForSpecificTabs.length / pageSize) || 1;
        }
    }, [isSemua, filteredCategories.length, categoriesPerPage, flatItemsForSpecificTabs.length, pageSize]);

    return (
        <div className="w-full bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col">
            {/* Top Toolbar Header */}
            <div className="p-6 sm:p-7 border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/40 dark:bg-neutral-900/40 space-y-5">
                {/* Breadcrumbs & Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                            <span>Onboarding</span>
                            <span>&gt;</span>
                            <span className="text-neutral-700 dark:text-neutral-300 font-semibold">Peminatan Karir</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                            Daftar Peminatan Karir
                        </h1>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Button
                            type="button"
                            onClick={onOpenWizard}
                            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-semibold h-10 px-5 gap-2 shadow-sm shadow-blue-600/30 cursor-pointer"
                        >
                            <Plus className="size-4" />
                            + Tambah
                        </Button>
                    </div>
                </div>

                {/* Search Bar & Expand/Collapse shortcuts */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                        <Input
                            type="text"
                            placeholder="Cari data..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10 h-10 rounded-xl text-xs sm:text-sm bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 shadow-2xs"
                        />
                    </div>

                    {selectedTab === 'Semua' && (
                        <div className="flex items-center gap-2 text-xs">
                            <button
                                type="button"
                                onClick={handleExpandAll}
                                className="text-neutral-500 hover:text-blue-600 font-medium px-2 py-1 cursor-pointer"
                            >
                                Buka Semua
                            </button>
                            <span className="text-neutral-300 dark:text-neutral-700">•</span>
                            <button
                                type="button"
                                onClick={handleCollapseAll}
                                className="text-neutral-500 hover:text-blue-600 font-medium px-2 py-1 cursor-pointer"
                            >
                                Tutup Semua
                            </button>
                        </div>
                    )}
                </div>

                {/* Filter Tabs (Semua, Bidang Utama, Bidang Spesifik, Skill) */}
                <div className="flex items-center gap-2 border-b border-neutral-200/80 dark:border-neutral-800 -mb-2 overflow-x-auto pb-0.5">
                    {(['Semua', 'Bidang Utama', 'Bidang Spesifik', 'Skill'] as const).map((tab) => {
                        const isActive = selectedTab === tab;
                        const count = tab === 'Semua' ? categories.length : allCounts[tab] ?? 0;

                        return (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => {
                                    setSelectedTab(tab);
                                    setCurrentPage(1);
                                    if (onTabChange) {
                                        const slug =
                                            tab === 'Bidang Utama'
                                                ? 'category'
                                                : tab === 'Bidang Spesifik'
                                                ? 'sub_category'
                                                : tab === 'Skill'
                                                ? 'skill'
                                                : 'all';
                                        onTabChange(slug);
                                    }
                                }}
                                className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                                    isActive
                                        ? 'text-blue-600 dark:text-blue-400 font-bold'
                                        : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
                                }`}
                            >
                                <span>{tab}</span>
                                <span
                                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium leading-none ${
                                        isActive
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                            : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                                    }`}
                                >
                                    {count}
                                </span>
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Hierarchical Tree Table View */}
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                        <tr className="border-b border-neutral-200/80 dark:border-neutral-800 text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider bg-neutral-50/30 dark:bg-neutral-900/40">
                            <th className="py-3.5 pl-6 pr-4 font-bold">Nama</th>
                            <th className="py-3.5 px-4 font-bold w-40">Tipe</th>
                            <th className="py-3.5 px-4 font-bold w-52">Parent</th>
                            <th className="py-3.5 px-4 font-bold w-28">Status</th>
                            <th className="py-3.5 pr-6 pl-4 font-bold w-24 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                        {displayedRows.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-neutral-400 text-xs">
                                    {searchQuery ? 'Tidak ada data yang cocok dengan pencarian.' : 'Belum ada data peminatan karir.'}
                                </td>
                            </tr>
                        ) : (
                            displayedRows.map((row) => {
                                const isCategory = row.type === 'Bidang Utama';
                                const isSubCategory = row.type === 'Bidang Spesifik';
                                const isSkill = row.type === 'Skill';

                                return (
                                    <tr
                                        key={row.id}
                                        className={`transition-colors group ${
                                            isCategory
                                                ? 'bg-neutral-50/20 dark:bg-neutral-900/30 font-semibold'
                                                : isSubCategory
                                                ? 'hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30'
                                                : 'hover:bg-neutral-50/40 dark:hover:bg-neutral-800/20'
                                        }`}
                                    >
                                        {/* Column 1: Nama with Tree Indentation & Caret */}
                                        <td className="py-3 pl-6 pr-4">
                                            <div
                                                className="flex items-center gap-2"
                                                style={{ paddingLeft: `${row.depth * 24}px` }}
                                            >
                                                {/* Expand / Collapse Caret Button */}
                                                {row.hasChildren && selectedTab === 'Semua' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleRow(row.id)}
                                                        className="size-5 rounded flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-transform cursor-pointer"
                                                    >
                                                        {row.isExpanded ? (
                                                            <ChevronDown className="size-4" />
                                                        ) : (
                                                            <ChevronRight className="size-4" />
                                                        )}
                                                    </button>
                                                ) : (
                                                    <div className="size-5 shrink-0" />
                                                )}

                                                {/* Icon depending on type */}
                                                {isCategory && (
                                                    <div className="size-6 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                                        <Briefcase className="size-3.5" />
                                                    </div>
                                                )}

                                                {isSkill ? (
                                                    <TechSkillIcon name={row.name} className="size-4 shrink-0" />
                                                ) : null}

                                                {/* Name Text */}
                                                <span
                                                    className={`truncate max-w-xs sm:max-w-md ${
                                                        isCategory
                                                            ? 'font-bold text-neutral-900 dark:text-neutral-100 text-sm'
                                                            : isSubCategory
                                                            ? 'font-semibold text-neutral-800 dark:text-neutral-200'
                                                            : 'text-neutral-700 dark:text-neutral-300 font-normal'
                                                    }`}
                                                >
                                                    {row.name}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Column 2: Tipe Badge */}
                                        <td className="py-3 px-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                                    isCategory
                                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                                                        : isSubCategory
                                                        ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border border-violet-200 dark:border-violet-900'
                                                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                                                }`}
                                            >
                                                {row.type}
                                            </span>
                                        </td>

                                        {/* Column 3: Parent */}
                                        <td className="py-3 px-4 text-neutral-500 dark:text-neutral-400 truncate max-w-[200px]">
                                            {row.parentName}
                                        </td>

                                        {/* Column 4: Status */}
                                        <td className="py-3 px-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                                    row.isActive
                                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                                        : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800'
                                                }`}
                                            >
                                                <span
                                                    className={`size-1.5 rounded-full ${
                                                        row.isActive ? 'bg-emerald-500' : 'bg-neutral-400'
                                                    }`}
                                                />
                                                {row.isActive ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>

                                        {/* Column 5: Aksi */}
                                        <td className="py-3 pr-6 pl-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {!isSkill && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (isCategory && row.category) onEditCategory(row.category);
                                                            else if (isSubCategory && row.subCategory) onEditSubCategory(row.subCategory);
                                                        }}
                                                        className="size-7 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center cursor-pointer transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit3 className="size-3.5" />
                                                    </button>
                                                )}

                                                {/* More Dropdown Menu */}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button
                                                            type="button"
                                                            className="size-7 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center cursor-pointer transition-colors"
                                                        >
                                                            <MoreVertical className="size-3.5" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 text-xs rounded-2xl">
                                                        {isCategory && row.category && (
                                                            <>
                                                                <DropdownMenuItem onClick={() => onEditCategory(row.category!)}>
                                                                    <Edit3 className="size-3.5 mr-2" /> Edit Kategori
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => onAddSubCategory(row.category!.id)}>
                                                                    <Plus className="size-3.5 mr-2" /> + Bidang Spesifik
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => onToggleCategoryStatus(row.category!)}>
                                                                    {row.category!.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => onDeleteCategory(row.category!)}
                                                                    className="text-red-600 dark:text-red-400"
                                                                >
                                                                    <Trash2 className="size-3.5 mr-2" /> Hapus Kategori
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}

                                                        {isSubCategory && row.subCategory && (
                                                            <>
                                                                <DropdownMenuItem onClick={() => onEditSubCategory(row.subCategory!)}>
                                                                    <Edit3 className="size-3.5 mr-2" /> Edit Bidang Spesifik
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => onAddSkill(row.subCategory!.id)}>
                                                                    <Plus className="size-3.5 mr-2" /> + Tambah Skill
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => onToggleSubCategoryStatus(row.subCategory!)}>
                                                                    {row.subCategory!.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => onDeleteSubCategory(row.subCategory!)}
                                                                    className="text-red-600 dark:text-red-400"
                                                                >
                                                                    <Trash2 className="size-3.5 mr-2" /> Hapus Bidang Spesifik
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}

                                                        {isSkill && row.subCategory && (
                                                            <DropdownMenuItem
                                                                onClick={() => onDeleteSkill(row.subCategory!, row.name)}
                                                                className="text-red-600 dark:text-red-400"
                                                            >
                                                                <Trash2 className="size-3.5 mr-2" /> Hapus Skill
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/40 dark:bg-neutral-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
                <div className="flex flex-wrap items-center gap-2">
                    {isSemua ? (
                        <>
                            <span>
                                Menampilkan Bidang Utama{' '}
                                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                    {filteredCategories.length === 0
                                        ? 0
                                        : categoriesPerPage === 0
                                        ? 1
                                        : (currentPage - 1) * categoriesPerPage + 1}
                                </span>{' '}
                                -{' '}
                                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                    {categoriesPerPage === 0
                                        ? filteredCategories.length
                                        : Math.min(currentPage * categoriesPerPage, filteredCategories.length)}
                                </span>{' '}
                                dari{' '}
                                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                    {filteredCategories.length}
                                </span>{' '}
                                Bidang Utama
                            </span>
                            <span className="text-neutral-300 dark:text-neutral-700">•</span>
                            <span className="text-neutral-600 dark:text-neutral-400 font-medium">
                                {displayedRows.length} baris terbuka
                            </span>
                        </>
                    ) : (
                        <span>
                            Menampilkan{' '}
                            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                {flatItemsForSpecificTabs.length === 0
                                    ? 0
                                    : (currentPage - 1) * pageSize + 1}
                            </span>{' '}
                            -{' '}
                            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                {Math.min(currentPage * pageSize, flatItemsForSpecificTabs.length)}
                            </span>{' '}
                            dari{' '}
                            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                {flatItemsForSpecificTabs.length}
                            </span>{' '}
                            {selectedTab}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {isSemua && (
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                            <span>Per halaman:</span>
                            <select
                                value={categoriesPerPage}
                                onChange={(e) => {
                                    setCategoriesPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="h-7 px-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                            >
                                <option value={2}>2 Bidang</option>
                                <option value={4}>4 Bidang</option>
                                <option value={6}>6 Bidang</option>
                                <option value={0}>Semua Bidang</option>
                            </select>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex items-center gap-1.5">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={currentPage <= 1}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                className="size-8 p-0 rounded-lg text-xs"
                            >
                                &lt;
                            </Button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <Button
                                    key={pageNum}
                                    type="button"
                                    variant={currentPage === pageNum ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`size-8 p-0 rounded-lg text-xs ${
                                        currentPage === pageNum
                                            ? 'bg-blue-600 text-white font-bold'
                                            : 'text-neutral-600 dark:text-neutral-300'
                                    }`}
                                >
                                    {pageNum}
                                </Button>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={currentPage >= totalPages}
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                className="size-8 p-0 rounded-lg text-xs"
                            >
                                &gt;
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
