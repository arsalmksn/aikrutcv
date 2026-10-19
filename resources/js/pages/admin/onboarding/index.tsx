import { Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Brain,
    Briefcase,
    Check,
    ChevronDown,
    ChevronRight,
    Code,
    Compass,
    Cpu,
    DollarSign,
    Edit3,
    Globe,
    Headphones,
    Layers,
    Loader2,
    Palette,
    Plus,
    RefreshCw,
    Search,
    Server,
    ShieldCheck,
    Sparkles,
    Trash2,
    TrendingUp,
    Users,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface AdminRoleItem {
    id: number;
    career_sub_category_id: number;
    name: string;
    slug: string;
    popular_skills: string[];
    sort_order: number;
    is_active: boolean;
}

export interface AdminSubCategoryItem {
    id: number;
    career_category_id: number;
    name: string;
    slug: string;
    description: string | null;
    sort_order: number;
    is_active: boolean;
    roles_count: number;
    roles: AdminRoleItem[];
}

export interface AdminCategoryItem {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string;
    sort_order: number;
    is_active: boolean;
    sub_categories_count: number;
    roles_count: number;
    sub_categories: AdminSubCategoryItem[];
}

interface AdminOnboardingProps {
    categories: AdminCategoryItem[];
    availableIcons: string[];
    stats: {
        total_categories: number;
        active_categories: number;
        total_sub_categories: number;
        active_sub_categories: number;
        total_roles: number;
        active_roles: number;
    };
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

export default function AdminOnboardingIndex({
    categories,
    availableIcons = [],
    stats,
}: AdminOnboardingProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>(() => {
        // Expand first category by default
        const initial: Record<number, boolean> = {};
        if (categories.length > 0) {
            initial[categories[0].id] = true;
        }
        return initial;
    });

    // Modals state
    const [categoryModal, setCategoryModal] = useState<{
        isOpen: boolean;
        category?: AdminCategoryItem | null;
    }>({ isOpen: false, category: null });

    const [subCategoryModal, setSubCategoryModal] = useState<{
        isOpen: boolean;
        subCategory?: AdminSubCategoryItem | null;
        targetCategoryId?: number;
    }>({ isOpen: false, subCategory: null });

    const [roleModal, setRoleModal] = useState<{
        isOpen: boolean;
        role?: AdminRoleItem | null;
        targetSubCategoryId?: number;
    }>({ isOpen: false, role: null });

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        type: 'category' | 'sub_category' | 'role';
        id: number;
        name: string;
    } | null>(null);

    const [isSeeding, setIsSeeding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form inputs state
    const [catForm, setCatForm] = useState({
        name: '',
        slug: '',
        description: '',
        icon: 'Briefcase',
        sort_order: 0,
        is_active: true,
    });

    const [subCatForm, setSubCatForm] = useState({
        career_category_id: 0,
        name: '',
        slug: '',
        description: '',
        sort_order: 0,
        is_active: true,
    });

    const [roleForm, setRoleForm] = useState<{
        career_sub_category_id: number;
        name: string;
        slug: string;
        popular_skills: string[];
        new_skill_input: string;
        sort_order: number;
        is_active: boolean;
    }>({
        career_sub_category_id: 0,
        name: '',
        slug: '',
        popular_skills: [],
        new_skill_input: '',
        sort_order: 0,
        is_active: true,
    });

    // Filtered data based on search
    const filteredCategories = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return categories;

        return categories
            .map((cat) => {
                const catMatches =
                    cat.name.toLowerCase().includes(query) ||
                    (cat.description && cat.description.toLowerCase().includes(query));

                const filteredSubCats = cat.sub_categories
                    .map((sub) => {
                        const subMatches =
                            sub.name.toLowerCase().includes(query) ||
                            (sub.description && sub.description.toLowerCase().includes(query));

                        const filteredRoles = sub.roles.filter(
                            (r) =>
                                r.name.toLowerCase().includes(query) ||
                                (r.popular_skills &&
                                    r.popular_skills.some((sk) => sk.toLowerCase().includes(query)))
                        );

                        if (subMatches || filteredRoles.length > 0) {
                            return {
                                ...sub,
                                roles: subMatches ? sub.roles : filteredRoles,
                            };
                        }
                        return null;
                    })
                    .filter(Boolean) as AdminSubCategoryItem[];

                if (catMatches || filteredSubCats.length > 0) {
                    return {
                        ...cat,
                        sub_categories: catMatches ? cat.sub_categories : filteredSubCats,
                    };
                }
                return null;
            })
            .filter(Boolean) as AdminCategoryItem[];
    }, [categories, searchQuery]);

    const toggleCategoryExpand = (id: number) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Category Handlers
    const openAddCategory = () => {
        setCatForm({
            name: '',
            slug: '',
            description: '',
            icon: 'Briefcase',
            sort_order: categories.length,
            is_active: true,
        });
        setCategoryModal({ isOpen: true, category: null });
    };

    const openEditCategory = (cat: AdminCategoryItem) => {
        setCatForm({
            name: cat.name,
            slug: cat.slug,
            description: cat.description || '',
            icon: cat.icon || 'Briefcase',
            sort_order: cat.sort_order,
            is_active: cat.is_active,
        });
        setCategoryModal({ isOpen: true, category: cat });
    };

    const handleSaveCategory = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (categoryModal.category) {
            router.patch(
                `/admin/onboarding-steps/categories/${categoryModal.category.id}`,
                catForm,
                {
                    onSuccess: () => {
                        toast.success('Kategori berhasil diperbarui');
                        setCategoryModal({ isOpen: false, category: null });
                        setIsSubmitting(false);
                    },
                    onError: (err) => {
                        toast.error(Object.values(err)[0] as string || 'Gagal menyimpan kategori');
                        setIsSubmitting(false);
                    },
                }
            );
        } else {
            router.post('/admin/onboarding-steps/categories', catForm, {
                onSuccess: () => {
                    toast.success('Kategori baru berhasil ditambahkan');
                    setCategoryModal({ isOpen: false, category: null });
                    setIsSubmitting(false);
                },
                onError: (err) => {
                    toast.error(Object.values(err)[0] as string || 'Gagal menambahkan kategori');
                    setIsSubmitting(false);
                },
            });
        }
    };

    // Sub-Category Handlers
    const openAddSubCategory = (categoryId: number) => {
        setSubCatForm({
            career_category_id: categoryId,
            name: '',
            slug: '',
            description: '',
            sort_order: 0,
            is_active: true,
        });
        setSubCategoryModal({ isOpen: true, subCategory: null, targetCategoryId: categoryId });
    };

    const openEditSubCategory = (subCat: AdminSubCategoryItem) => {
        setSubCatForm({
            career_category_id: subCat.career_category_id,
            name: subCat.name,
            slug: subCat.slug,
            description: subCat.description || '',
            sort_order: subCat.sort_order,
            is_active: subCat.is_active,
        });
        setSubCategoryModal({ isOpen: true, subCategory: subCat, targetCategoryId: subCat.career_category_id });
    };

    const handleSaveSubCategory = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (subCategoryModal.subCategory) {
            router.patch(
                `/admin/onboarding-steps/sub-categories/${subCategoryModal.subCategory.id}`,
                subCatForm,
                {
                    onSuccess: () => {
                        toast.success('Sub-bidang berhasil diperbarui');
                        setSubCategoryModal({ isOpen: false, subCategory: null });
                        setIsSubmitting(false);
                    },
                    onError: (err) => {
                        toast.error(Object.values(err)[0] as string || 'Gagal memperbarui sub-bidang');
                        setIsSubmitting(false);
                    },
                }
            );
        } else {
            router.post('/admin/onboarding-steps/sub-categories', subCatForm, {
                onSuccess: () => {
                    toast.success('Sub-bidang baru berhasil ditambahkan');
                    setSubCategoryModal({ isOpen: false, subCategory: null });
                    setIsSubmitting(false);
                },
                onError: (err) => {
                    toast.error(Object.values(err)[0] as string || 'Gagal menambahkan sub-bidang');
                    setIsSubmitting(false);
                },
            });
        }
    };

    // Role Handlers
    const openAddRole = (subCategoryId: number) => {
        setRoleForm({
            career_sub_category_id: subCategoryId,
            name: '',
            slug: '',
            popular_skills: [],
            new_skill_input: '',
            sort_order: 0,
            is_active: true,
        });
        setRoleModal({ isOpen: true, role: null, targetSubCategoryId: subCategoryId });
    };

    const openEditRole = (role: AdminRoleItem) => {
        setRoleForm({
            career_sub_category_id: role.career_sub_category_id,
            name: role.name,
            slug: role.slug,
            popular_skills: role.popular_skills || [],
            new_skill_input: '',
            sort_order: role.sort_order,
            is_active: role.is_active,
        });
        setRoleModal({ isOpen: true, role, targetSubCategoryId: role.career_sub_category_id });
    };

    const handleAddSkillToRole = () => {
        const trimmed = roleForm.new_skill_input.trim();
        if (trimmed && !roleForm.popular_skills.includes(trimmed)) {
            setRoleForm((prev) => ({
                ...prev,
                popular_skills: [...prev.popular_skills, trimmed],
                new_skill_input: '',
            }));
        }
    };

    const handleRemoveSkillFromRole = (skillToRemove: string) => {
        setRoleForm((prev) => ({
            ...prev,
            popular_skills: prev.popular_skills.filter((s) => s !== skillToRemove),
        }));
    };

    const handleSaveRole = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            career_sub_category_id: roleForm.career_sub_category_id,
            name: roleForm.name,
            slug: roleForm.slug,
            popular_skills: roleForm.popular_skills,
            sort_order: roleForm.sort_order,
            is_active: roleForm.is_active,
        };

        if (roleModal.role) {
            router.patch(
                `/admin/onboarding-steps/roles/${roleModal.role.id}`,
                payload,
                {
                    onSuccess: () => {
                        toast.success('Tech Stack / Skill berhasil diperbarui');
                        setRoleModal({ isOpen: false, role: null });
                        setIsSubmitting(false);
                    },
                    onError: (err) => {
                        toast.error(Object.values(err)[0] as string || 'Gagal memperbarui tech stack / skill');
                        setIsSubmitting(false);
                    },
                }
            );
        } else {
            router.post('/admin/onboarding-steps/roles', payload, {
                onSuccess: () => {
                    toast.success('Tech Stack / Skill baru berhasil ditambahkan');
                    setRoleModal({ isOpen: false, role: null });
                    setIsSubmitting(false);
                },
                onError: (err) => {
                    toast.error(Object.values(err)[0] as string || 'Gagal menambahkan tech stack / skill');
                    setIsSubmitting(false);
                },
            });
        }
    };

    // Toggle Active Status
    const handleToggleCategoryStatus = (cat: AdminCategoryItem) => {
        router.patch(
            `/admin/onboarding-steps/categories/${cat.id}`,
            {
                name: cat.name,
                is_active: !cat.is_active,
            },
            {
                preserveScroll: true,
                onSuccess: () => toast.success(`Status ${cat.name} diubah`),
            }
        );
    };

    const handleToggleSubCategoryStatus = (subCat: AdminSubCategoryItem) => {
        router.patch(
            `/admin/onboarding-steps/sub-categories/${subCat.id}`,
            {
                name: subCat.name,
                is_active: !subCat.is_active,
            },
            {
                preserveScroll: true,
                onSuccess: () => toast.success(`Status sub-bidang ${subCat.name} diubah`),
            }
        );
    };

    const handleToggleRoleStatus = (role: AdminRoleItem) => {
        router.patch(
            `/admin/onboarding-steps/roles/${role.id}`,
            {
                name: role.name,
                is_active: !role.is_active,
            },
            {
                preserveScroll: true,
                onSuccess: () => toast.success(`Status ${role.name} diubah`),
            }
        );
    };

    // Confirm Delete
    const handleConfirmDelete = () => {
        if (!deleteModal) return;
        setIsSubmitting(true);

        const url =
            deleteModal.type === 'category'
                ? `/admin/onboarding-steps/categories/${deleteModal.id}`
                : deleteModal.type === 'sub_category'
                ? `/admin/onboarding-steps/sub-categories/${deleteModal.id}`
                : `/admin/onboarding-steps/roles/${deleteModal.id}`;

        router.delete(url, {
            onSuccess: () => {
                toast.success(`${deleteModal.name} berhasil dihapus`);
                setDeleteModal(null);
                setIsSubmitting(false);
            },
            onError: (err) => {
                toast.error(Object.values(err)[0] as string || 'Gagal menghapus');
                setIsSubmitting(false);
            },
        });
    };

    // Reset default seed
    const handleSeedDefaults = () => {
        setIsSeeding(true);
        router.post(
            '/admin/onboarding-steps/seed-defaults',
            {},
            {
                onSuccess: () => {
                    toast.success('Data master default berhasil disinkronkan!');
                    setIsSeeding(false);
                },
                onError: () => {
                    toast.error('Gagal sinkronisasi data master default');
                    setIsSeeding(false);
                },
            }
        );
    };

    return (
        <>
            <Head title="Pengaturan Data Master Onboarding - Admin" />

            <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
                {/* Hero Header */}
                <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl ring-1 ring-white/10 dark:from-neutral-950 dark:via-indigo-950/60 dark:to-neutral-900">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-2 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                                <Compass className="size-3.5" />
                                <span>Master Data Onboarding & Peminatan</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                Kelola Bidang, Sub-Bidang & Tech Stack / Skill
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                Atur data master 3-tingkat yang tampil di modal onboarding pengguna. Pengguna memilih secara mengerucut: 
                                <strong className="text-white"> Bidang Utama</strong> $\rightarrow$ 
                                <strong className="text-white"> Sub-Bidang Netral</strong> $\rightarrow$ 
                                <strong className="text-white"> Tech Stack & Skill</strong> tanpa bisa menambah peran bebas sendiri.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSeedDefaults}
                                disabled={isSeeding}
                                className="bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-xl text-xs gap-2 cursor-pointer"
                            >
                                <RefreshCw className={`size-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                                {isSeeding ? 'Menyinkronkan...' : 'Reset Default Data'}
                            </Button>

                            <Button
                                type="button"
                                onClick={openAddCategory}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
                            >
                                <Plus className="size-4" />
                                + Tambah Kategori
                            </Button>
                        </div>
                    </div>

                    {/* Stats Overview Pill Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-white/10 mt-6">
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                            <div className="text-[11px] text-slate-400 font-medium">Level 1: Bidang Utama</div>
                            <div className="text-xl font-bold mt-0.5 text-white">
                                {stats.active_categories} <span className="text-xs text-slate-400 font-normal">/ {stats.total_categories} Aktif</span>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                            <div className="text-[11px] text-slate-400 font-medium">Level 2: Sub-Bidang Netral</div>
                            <div className="text-xl font-bold mt-0.5 text-white">
                                {stats.active_sub_categories} <span className="text-xs text-slate-400 font-normal">/ {stats.total_sub_categories} Aktif</span>
                            </div>
                        </div>
                        <div className="col-span-2 sm:col-span-1 bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                            <div className="text-[11px] text-slate-400 font-medium">Level 3: Tech Stack & Skill</div>
                            <div className="text-xl font-bold mt-0.5 text-white">
                                {stats.active_roles} <span className="text-xs text-slate-400 font-normal">/ {stats.total_roles} Aktif</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                    <Input
                        type="text"
                        placeholder="Cari kategori, sub-bidang, atau tech stack (misal: Laravel, React, Mobile, DevOps)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-9 h-11 text-xs sm:text-sm rounded-2xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs"
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

                {/* Categories Hierarchical List */}
                <div className="space-y-4">
                    {filteredCategories.length === 0 ? (
                        <div className="text-center py-12 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-3">
                            <Compass className="size-10 text-neutral-400 mx-auto" />
                            <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                {searchQuery ? 'Tidak ada data master yang cocok dengan pencarian' : 'Belum ada data master onboarding'}
                            </h3>
                            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                                {searchQuery ? 'Coba ubah kata kunci atau bersihkan pencarian.' : 'Klik tombol "Reset Default Data" untuk mengisi kategori dan tech stack bawaan.'}
                            </p>
                        </div>
                    ) : (
                        filteredCategories.map((cat) => {
                            const IconComponent = ICON_MAP[cat.icon] || Briefcase;
                            const isExpanded = expandedCategories[cat.id] ?? false;

                            return (
                                <div
                                    key={cat.id}
                                    className={`rounded-3xl border transition-all overflow-hidden ${
                                        cat.is_active
                                            ? 'border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm'
                                            : 'border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/60 dark:bg-neutral-950/40 opacity-75'
                                    }`}
                                >
                                    {/* Level 1: Category Header Card */}
                                    <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/40">
                                        <div
                                            className="flex items-start gap-3.5 cursor-pointer flex-1"
                                            onClick={() => toggleCategoryExpand(cat.id)}
                                        >
                                            <div
                                                className={`size-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                                                    cat.is_active
                                                        ? 'bg-linear-to-tr from-indigo-500 to-blue-600 text-white'
                                                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                                                }`}
                                            >
                                                <IconComponent className="size-5" />
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                                        Level 1: Bidang Utama
                                                    </span>
                                                    <Badge
                                                        variant={cat.is_active ? 'default' : 'secondary'}
                                                        className={`text-[10px] ${
                                                            cat.is_active
                                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                                                : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800'
                                                        }`}
                                                    >
                                                        {cat.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </Badge>
                                                    <span className="text-xs text-neutral-400">•</span>
                                                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                                        {cat.sub_categories_count} Sub-Bidang ({cat.roles_count} Tech Stack)
                                                    </span>
                                                </div>

                                                <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                                                    {cat.name}
                                                    <span className="text-xs font-normal text-neutral-400">({cat.slug})</span>
                                                </h2>

                                                {cat.description && (
                                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                                                        {cat.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleCategoryStatus(cat)}
                                                className="text-xs rounded-xl h-8"
                                            >
                                                {cat.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditCategory(cat)}
                                                className="text-xs rounded-xl h-8"
                                            >
                                                <Edit3 className="size-3.5 mr-1" /> Edit
                                            </Button>

                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => openAddSubCategory(cat.id)}
                                                className="text-xs rounded-xl h-8 bg-indigo-600 hover:bg-indigo-500 text-white"
                                            >
                                                <Plus className="size-3.5 mr-1" /> + Sub-Bidang
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setDeleteModal({
                                                        isOpen: true,
                                                        type: 'category',
                                                        id: cat.id,
                                                        name: cat.name,
                                                    })
                                                }
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl size-8 p-0"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>

                                            <button
                                                type="button"
                                                onClick={() => toggleCategoryExpand(cat.id)}
                                                className="size-8 rounded-xl flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                            >
                                                {isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Level 2 & 3: Accordion Content */}
                                    {isExpanded && (
                                        <div className="p-4 sm:p-6 space-y-4 bg-neutral-50/30 dark:bg-neutral-950/20">
                                            {cat.sub_categories.length === 0 ? (
                                                <div className="text-center py-6 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                                                    <p className="text-xs text-neutral-500">
                                                        Belum ada sub-bidang di kategori ini.
                                                    </p>
                                                    <Button
                                                        type="button"
                                                        variant="link"
                                                        size="sm"
                                                        onClick={() => openAddSubCategory(cat.id)}
                                                        className="text-indigo-600 text-xs mt-1"
                                                    >
                                                        + Tambah Sub-Bidang Pertama
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {cat.sub_categories.map((sub) => (
                                                        <div
                                                            key={sub.id}
                                                            className={`rounded-2xl border p-4 transition-all ${
                                                                sub.is_active
                                                                    ? 'bg-white dark:bg-neutral-900 border-neutral-200/80 dark:border-neutral-800 shadow-xs'
                                                                    : 'bg-neutral-100/50 dark:bg-neutral-950/30 border-neutral-200/50 dark:border-neutral-800/50 opacity-70'
                                                            }`}
                                                        >
                                                            {/* Level 2: Sub-Category Bar */}
                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800/60">
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                                                            Level 2: Sub-Bidang Netral
                                                                        </span>
                                                                        <Badge
                                                                            variant={sub.is_active ? 'default' : 'secondary'}
                                                                            className={`text-[9px] px-1.5 py-0 h-4 ${
                                                                                sub.is_active
                                                                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                                                                    : 'bg-neutral-100 text-neutral-500'
                                                                            }`}
                                                                        >
                                                                            {sub.is_active ? 'Aktif' : 'Nonaktif'}
                                                                        </Badge>
                                                                    </div>
                                                                    <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                                                                        {sub.name}
                                                                    </h3>
                                                                    {sub.description && (
                                                                        <p className="text-xs text-neutral-500 line-clamp-1">
                                                                            {sub.description}
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                {/* Sub-Category Actions */}
                                                                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleToggleSubCategoryStatus(sub)}
                                                                        className="text-[11px] h-7 px-2"
                                                                    >
                                                                        {sub.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => openEditSubCategory(sub)}
                                                                        className="text-[11px] h-7 px-2"
                                                                    >
                                                                        <Edit3 className="size-3 mr-1" /> Edit
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        size="sm"
                                                                        onClick={() => openAddRole(sub.id)}
                                                                        className="text-[11px] h-7 px-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg cursor-pointer"
                                                                    >
                                                                        <Plus className="size-3 mr-1" /> + Tech Stack / Skill
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            setDeleteModal({
                                                                                isOpen: true,
                                                                                type: 'sub_category',
                                                                                id: sub.id,
                                                                                name: sub.name,
                                                                            })
                                                                        }
                                                                        className="text-red-500 hover:text-red-700 h-7 w-7 p-0 cursor-pointer"
                                                                    >
                                                                        <Trash2 className="size-3.5" />
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            {/* Level 3: Tech Stacks & Skills Chips & Details */}
                                                            <div className="pt-3">
                                                                <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-2 flex items-center justify-between">
                                                                    <span>Level 3: Pilihan Tech Stack & Skill ({sub.roles.length})</span>
                                                                    <span className="text-[10px] text-neutral-400 italic">Tampil langsung di Langkah 3 onboarding pengguna</span>
                                                                </div>

                                                                {sub.roles.length === 0 ? (
                                                                    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-dashed border-neutral-200 dark:border-neutral-800 text-center">
                                                                        <span className="text-xs text-neutral-400">Belum ada tech stack / skill spesifik.</span>{' '}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => openAddRole(sub.id)}
                                                                            className="text-xs font-semibold text-blue-600 underline ml-1 cursor-pointer"
                                                                        >
                                                                            Tambah sekarang
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                                                        {sub.roles.map((role) => (
                                                                            <div
                                                                                key={role.id}
                                                                                className={`p-3 rounded-xl border flex flex-col justify-between gap-2 text-xs transition-all ${
                                                                                    role.is_active
                                                                                        ? 'bg-neutral-50/80 dark:bg-neutral-800/50 border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300'
                                                                                        : 'bg-neutral-100/50 dark:bg-neutral-900/40 border-neutral-200/40 opacity-60'
                                                                                }`}
                                                                            >
                                                                                <div className="flex items-start justify-between gap-2">
                                                                                    <div className="space-y-1 min-w-0 flex-1">
                                                                                        <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 flex-wrap">
                                                                                            <span className="truncate">{role.name}</span>
                                                                                            {!role.is_active && (
                                                                                                <Badge variant="secondary" className="text-[9px] py-0 px-1 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                                                                                                    Nonaktif
                                                                                                </Badge>
                                                                                            )}
                                                                                        </div>
                                                                                        <div className="text-[10px] text-neutral-400 font-mono">
                                                                                            {role.slug}
                                                                                        </div>
                                                                                        {role.popular_skills && role.popular_skills.length > 0 && (
                                                                                            <div className="flex flex-wrap gap-1 mt-1.5">
                                                                                                {role.popular_skills.slice(0, 4).map((skill, sIdx) => (
                                                                                                    <span
                                                                                                        key={sIdx}
                                                                                                        className="px-1.5 py-0.5 rounded-md bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 text-[10px] border border-neutral-200 dark:border-neutral-800"
                                                                                                    >
                                                                                                        {skill}
                                                                                                    </span>
                                                                                                ))}
                                                                                                {role.popular_skills.length > 4 && (
                                                                                                    <span className="text-[9px] text-neutral-400 self-center">
                                                                                                        +{role.popular_skills.length - 4}
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>

                                                                                    {/* Role Actions */}
                                                                                    <div className="flex items-center gap-1 shrink-0">
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => handleToggleRoleStatus(role)}
                                                                                            title={role.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                                                            className="size-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                                                                        >
                                                                                            <Check className={`size-3.5 ${role.is_active ? 'text-emerald-600 stroke-[2.5]' : 'opacity-30'}`} />
                                                                                        </button>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => openEditRole(role)}
                                                                                            title="Edit"
                                                                                            className="size-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                                                                        >
                                                                                            <Edit3 className="size-3.5" />
                                                                                        </button>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() =>
                                                                                                setDeleteModal({
                                                                                                    isOpen: true,
                                                                                                    type: 'role',
                                                                                                    id: role.id,
                                                                                                    name: role.name,
                                                                                                })
                                                                                            }
                                                                                            title="Hapus"
                                                                                            className="size-7 rounded-lg flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                                                                                        >
                                                                                            <Trash2 className="size-3.5" />
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ========================================================================= */}
            {/* MODAL 1: TAMBAH / EDIT KATEGORI (LEVEL 1)                                  */}
            {/* ========================================================================= */}
            <Dialog
                open={categoryModal.isOpen}
                onOpenChange={(open) => !open && setCategoryModal({ isOpen: false, category: null })}
            >
                <DialogContent className="sm:max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">
                            {categoryModal.category ? 'Edit Kategori Bidang Utama' : 'Tambah Kategori Bidang Utama (Level 1)'}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Kategori bidang umum/industri yang menjadi pilihan level pertama bagi pengguna.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveCategory} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Nama Kategori</Label>
                            <Input
                                required
                                placeholder="Contoh: Software & Technology"
                                value={catForm.name}
                                onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                                className="rounded-xl text-xs sm:text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Slug (Opsional)</Label>
                            <Input
                                placeholder="Contoh: tech-engineering"
                                value={catForm.slug}
                                onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                                className="rounded-xl text-xs sm:text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Pilih Ikon</Label>
                            <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto p-1.5 border rounded-xl bg-neutral-50 dark:bg-neutral-900">
                                {availableIcons.map((iconName) => {
                                    const IconComp = ICON_MAP[iconName] || Briefcase;
                                    const isSelected = catForm.icon === iconName;
                                    return (
                                        <button
                                            key={iconName}
                                            type="button"
                                            onClick={() => setCatForm({ ...catForm, icon: iconName })}
                                            className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs gap-1 transition-all ${
                                                isSelected
                                                    ? 'bg-indigo-600 text-white shadow-xs'
                                                    : 'hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                                            }`}
                                        >
                                            <IconComp className="size-4" />
                                            <span className="text-[9px] line-clamp-1">{iconName}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Deskripsi Singkat</Label>
                            <textarea
                                rows={2}
                                placeholder="Deskripsi ringkas yang mendefinisikan bidang ini..."
                                value={catForm.description}
                                onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                                className="w-full text-xs rounded-xl border border-input bg-transparent p-2.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <input
                                type="checkbox"
                                id="cat_is_active"
                                checked={catForm.is_active}
                                onChange={(e) => setCatForm({ ...catForm, is_active: e.target.checked })}
                                className="rounded size-4 text-indigo-600"
                            />
                            <Label htmlFor="cat_is_active" className="text-xs cursor-pointer">
                                Tampilkan kategori ini di modal onboarding pengguna (Aktif)
                            </Label>
                        </div>

                        <DialogFooter className="pt-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCategoryModal({ isOpen: false, category: null })}
                                className="rounded-xl text-xs"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs gap-1.5"
                            >
                                {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
                                {categoryModal.category ? 'Simpan Perubahan' : 'Tambah Kategori'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ========================================================================= */}
            {/* MODAL 2: TAMBAH / EDIT SUB-KATEGORI NETRAL (LEVEL 2)                       */}
            {/* ========================================================================= */}
            <Dialog
                open={subCategoryModal.isOpen}
                onOpenChange={(open) => !open && setSubCategoryModal({ isOpen: false, subCategory: null })}
            >
                <DialogContent className="sm:max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">
                            {subCategoryModal.subCategory ? 'Edit Sub-Bidang Netral' : 'Tambah Sub-Bidang Netral (Level 2)'}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Pilihan kedua: buat disiplin fungsional netral tanpa menyebut teknologi spesifik (misal: Frontend Web Development, Backend Web Development, Mobile Development).
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveSubCategory} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Nama Sub-Bidang</Label>
                            <Input
                                required
                                placeholder="Contoh: Backend Web Development"
                                value={subCatForm.name}
                                onChange={(e) => setSubCatForm({ ...subCatForm, name: e.target.value })}
                                className="rounded-xl text-xs sm:text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Slug (Opsional)</Label>
                            <Input
                                placeholder="Contoh: backend-web-development"
                                value={subCatForm.slug}
                                onChange={(e) => setSubCatForm({ ...subCatForm, slug: e.target.value })}
                                className="rounded-xl text-xs sm:text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Deskripsi Ringkas</Label>
                            <textarea
                                rows={2}
                                placeholder="Arsitektur server, integrasi API, dan logika bisnis..."
                                value={subCatForm.description}
                                onChange={(e) => setSubCatForm({ ...subCatForm, description: e.target.value })}
                                className="w-full text-xs rounded-xl border border-input bg-transparent p-2.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <input
                                type="checkbox"
                                id="sub_is_active"
                                checked={subCatForm.is_active}
                                onChange={(e) => setSubCatForm({ ...subCatForm, is_active: e.target.checked })}
                                className="rounded size-4 text-blue-600"
                            />
                            <Label htmlFor="sub_is_active" className="text-xs cursor-pointer">
                                Tampilkan sub-bidang ini di modal onboarding pengguna (Aktif)
                            </Label>
                        </div>

                        <DialogFooter className="pt-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSubCategoryModal({ isOpen: false, subCategory: null })}
                                className="rounded-xl text-xs"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs gap-1.5"
                            >
                                {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
                                {subCategoryModal.subCategory ? 'Simpan Perubahan' : 'Tambah Sub-Bidang'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ========================================================================= */}
            {/* MODAL 3: TAMBAH / EDIT TECH STACK & PERAN (LEVEL 3)                        */}
            {/* ========================================================================= */}
            <Dialog
                open={roleModal.isOpen}
                onOpenChange={(open) => !open && setRoleModal({ isOpen: false, role: null })}
            >
                <DialogContent className="sm:max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">
                            {roleModal.role ? 'Edit Tech Stack / Skill' : 'Tambah Tech Stack & Skill (Level 3)'}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Pilihan level 3: teknologi, framework, atau skill spesifik yang tampil di onboarding pengguna (misal: Laravel / PHP, React / Next.js, Flutter / Dart, Docker & Kubernetes).
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveRole} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Nama Tech Stack / Skill</Label>
                            <Input
                                required
                                placeholder="Contoh: Laravel / PHP, React / Next.js, Figma, SQL"
                                value={roleForm.name}
                                onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                                className="rounded-xl text-xs sm:text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs">Slug (Opsional)</Label>
                            <Input
                                placeholder="Contoh: laravel-php, react-nextjs, figma"
                                value={roleForm.slug}
                                onChange={(e) => setRoleForm({ ...roleForm, slug: e.target.value })}
                                className="rounded-xl text-xs sm:text-sm"
                            />
                        </div>

                        {/* Popular Skills Tags Input */}
                        <div className="space-y-1.5">
                            <Label className="text-xs">Kata Kunci / Keahlian Populer Terkait (Opsional)</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Contoh: PHP 8+, Eloquent ORM, MySQL"
                                    value={roleForm.new_skill_input}
                                    onChange={(e) => setRoleForm({ ...roleForm, new_skill_input: e.target.value })}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddSkillToRole();
                                        }
                                    }}
                                    className="rounded-xl text-xs"
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleAddSkillToRole}
                                    className="rounded-xl text-xs shrink-0 cursor-pointer"
                                >
                                    + Tambah Skill
                                </Button>
                            </div>

                            {/* Skills Pills */}
                            {roleForm.popular_skills.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {roleForm.popular_skills.map((skill) => (
                                        <Badge
                                            key={skill}
                                            variant="secondary"
                                            className="text-[11px] gap-1 pl-2 pr-1 py-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSkillFromRole(skill)}
                                                className="hover:text-red-500 rounded-full size-3 flex items-center justify-center cursor-pointer"
                                            >
                                                <X className="size-2.5" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <input
                                type="checkbox"
                                id="role_is_active"
                                checked={roleForm.is_active}
                                onChange={(e) => setRoleForm({ ...roleForm, is_active: e.target.checked })}
                                className="rounded size-4 text-indigo-600"
                            />
                            <Label htmlFor="role_is_active" className="text-xs cursor-pointer">
                                Tampilkan tech stack / skill ini di pilihan onboarding pengguna (Aktif)
                            </Label>
                        </div>

                        <DialogFooter className="pt-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setRoleModal({ isOpen: false, role: null })}
                                className="rounded-xl text-xs cursor-pointer"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs gap-1.5 cursor-pointer"
                            >
                                {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
                                {roleModal.role ? 'Simpan Perubahan' : 'Tambah Tech Stack / Skill'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ========================================================================= */}
            {/* MODAL 4: KONFIRMASI HAPUS                                                 */}
            {/* ========================================================================= */}
            <Dialog
                open={deleteModal !== null}
                onOpenChange={(open) => !open && setDeleteModal(null)}
            >
                <DialogContent className="sm:max-w-md rounded-3xl">
                    <DialogHeader>
                        <div className="size-11 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mb-2">
                            <AlertTriangle className="size-5" />
                        </div>
                        <DialogTitle className="text-lg font-bold">
                            Konfirmasi Hapus {deleteModal?.type === 'category' ? 'Kategori' : deleteModal?.type === 'sub_category' ? 'Sub-Bidang' : 'Tech Stack / Skill'}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Apakah Anda yakin ingin menghapus <strong className="text-neutral-900 dark:text-neutral-100">{deleteModal?.name}</strong>?
                            {deleteModal?.type === 'category' && ' Seluruh sub-bidang dan tech stack di bawah kategori ini juga akan terhapus.'}
                            {deleteModal?.type === 'sub_category' && ' Seluruh tech stack & skill di bawah sub-bidang ini juga akan terhapus.'}
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteModal(null)}
                            className="rounded-xl text-xs"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmDelete}
                            disabled={isSubmitting}
                            className="bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs"
                        >
                            {isSubmitting && <Loader2 className="size-3.5 animate-spin mr-1" />}
                            Hapus Sekarang
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

AdminOnboardingIndex.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '/admin/dashboard',
        },
        {
            title: 'Data Master Onboarding',
            href: '/admin/onboarding-steps',
        },
    ],
};
