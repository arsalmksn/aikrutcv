import { Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Compass,
    Layers,
    Loader2,
    Plus,
    RefreshCw,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
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
import { CareerTreeTable } from './components/CareerTreeTable';
import {
    OnboardingWizard,
    type WizardCategoryItem,
    type WizardRoleItem,
    type WizardSavePayload,
    type WizardSubCategoryItem,
} from './components/OnboardingWizard';

export type AdminRoleItem = WizardRoleItem;
export type AdminSubCategoryItem = WizardSubCategoryItem;
export type AdminCategoryItem = WizardCategoryItem;

interface AdminOnboardingProps {
    categories: AdminCategoryItem[];
    availableIcons: string[];
    stats: {
        total_categories: number;
        active_categories: number;
        total_sub_categories: number;
        active_sub_categories: number;
        total_roles?: number;
        active_roles?: number;
    };
    activeTab?: string;
}

export default function AdminOnboardingIndex({
    categories,
    availableIcons = [],
    stats,
    activeTab = 'all',
}: AdminOnboardingProps) {
    // Primary View Mode: 'table' (Daftar Peminatan Karir) or 'wizard' (Tambah Peminatan Karir)
    const [viewMode, setViewMode] = useState<'table' | 'wizard'>('table');

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

    const [skillModal, setSkillModal] = useState<{
        isOpen: boolean;
        subCategoryId: number;
        subCategoryName: string;
    } | null>(null);

    const [skillInput, setSkillInput] = useState('');

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        type: 'category' | 'sub_category' | 'skill';
        id: number;
        name: string;
        subCategoryId?: number;
        skillName?: string;
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

    // =========================================================================
    // Category Handlers
    // =========================================================================
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
                        toast.error(
                            (Object.values(err)[0] as string) || 'Gagal menyimpan kategori'
                        );
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
                    toast.error(
                        (Object.values(err)[0] as string) || 'Gagal menambahkan kategori'
                    );
                    setIsSubmitting(false);
                },
            });
        }
    };

    const handleToggleCategoryStatus = (cat: AdminCategoryItem) => {
        router.patch(
            `/admin/onboarding-steps/categories/${cat.id}`,
            {
                name: cat.name,
                is_active: !cat.is_active,
            },
            {
                onSuccess: () => {
                    toast.success(
                        `Kategori ${cat.name} ${!cat.is_active ? 'diaktifkan' : 'dinonaktifkan'}`
                    );
                },
                onError: () => {
                    toast.error('Gagal memperbarui status');
                },
            }
        );
    };

    // =========================================================================
    // Sub-Category Handlers
    // =========================================================================
    const openAddSubCategory = (targetCategoryId?: number) => {
        const defaultCatId =
            targetCategoryId || (categories.length > 0 ? categories[0].id : 0);
        setSubCatForm({
            career_category_id: defaultCatId,
            name: '',
            slug: '',
            description: '',
            sort_order: 0,
            is_active: true,
        });
        setSubCategoryModal({
            isOpen: true,
            subCategory: null,
            targetCategoryId: defaultCatId,
        });
    };

    const openEditSubCategory = (sub: AdminSubCategoryItem) => {
        setSubCatForm({
            career_category_id: sub.career_category_id,
            name: sub.name,
            slug: sub.slug,
            description: sub.description || '',
            sort_order: sub.sort_order,
            is_active: sub.is_active,
        });
        setSubCategoryModal({ isOpen: true, subCategory: sub });
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
                        toast.error(
                            (Object.values(err)[0] as string) || 'Gagal menyimpan sub-bidang'
                        );
                        setIsSubmitting(false);
                    },
                }
            );
        } else {
            router.post('/admin/onboarding-steps/sub-categories', subCatForm, {
                onSuccess: () => {
                    toast.success('Sub-bidang berhasil ditambahkan');
                    setSubCategoryModal({ isOpen: false, subCategory: null });
                    setIsSubmitting(false);
                },
                onError: (err) => {
                    toast.error(
                        (Object.values(err)[0] as string) || 'Gagal menambahkan sub-bidang'
                    );
                    setIsSubmitting(false);
                },
            });
        }
    };

    const handleToggleSubCategoryStatus = (sub: AdminSubCategoryItem) => {
        router.patch(
            `/admin/onboarding-steps/sub-categories/${sub.id}`,
            {
                name: sub.name,
                is_active: !sub.is_active,
            },
            {
                onSuccess: () => {
                    toast.success(
                        `Sub-bidang ${sub.name} ${!sub.is_active ? 'diaktifkan' : 'dinonaktifkan'}`
                    );
                },
                onError: () => {
                    toast.error('Gagal memperbarui status');
                },
            }
        );
    };

    // =========================================================================
    // =========================================================================
    // Skill Direct Handlers (Level 3: Under Bidang Spesifik)
    // =========================================================================
    const openAddSkill = (subCategoryId: number) => {
        const foundSub = categories
            .flatMap((c) => c.sub_categories)
            .find((sc) => sc.id === subCategoryId);

        setSkillModal({
            isOpen: true,
            subCategoryId,
            subCategoryName: foundSub ? foundSub.name : 'Bidang Spesifik',
        });
        setSkillInput('');
    };

    const handleSaveSkill = (e: React.FormEvent) => {
        e.preventDefault();
        if (!skillModal || !skillInput.trim()) return;

        setIsSubmitting(true);
        router.post(
            `/admin/onboarding-steps/sub-categories/${skillModal.subCategoryId}/skills`,
            { skill: skillInput.trim() },
            {
                onSuccess: () => {
                    toast.success(`Skill "${skillInput.trim()}" berhasil ditambahkan`);
                    setSkillModal(null);
                    setSkillInput('');
                    setIsSubmitting(false);
                },
                onError: (err) => {
                    toast.error(
                        (Object.values(err)[0] as string) || 'Gagal menambahkan skill'
                    );
                    setIsSubmitting(false);
                },
            }
        );
    };

    const handleDeleteSkill = (sub: AdminSubCategoryItem, skill: string) => {
        setDeleteModal({
            isOpen: true,
            type: 'skill',
            id: sub.id,
            name: skill,
            subCategoryId: sub.id,
            skillName: skill,
        });
    };

    // =========================================================================
    // Delete Confirmation
    // =========================================================================
    const handleConfirmDelete = () => {
        if (!deleteModal) return;
        setIsSubmitting(true);

        if (deleteModal.type === 'skill' && deleteModal.subCategoryId && deleteModal.skillName) {
            router.delete(`/admin/onboarding-steps/sub-categories/${deleteModal.subCategoryId}/skills`, {
                data: { skill: deleteModal.skillName },
                onSuccess: () => {
                    toast.success(`Skill ${deleteModal.skillName} berhasil dihapus`);
                    setDeleteModal(null);
                    setIsSubmitting(false);
                },
                onError: (err) => {
                    toast.error(
                        (Object.values(err)[0] as string) || 'Gagal menghapus skill'
                    );
                    setIsSubmitting(false);
                },
            });
            return;
        }

        const url =
            deleteModal.type === 'category'
                ? `/admin/onboarding-steps/categories/${deleteModal.id}`
                : `/admin/onboarding-steps/sub-categories/${deleteModal.id}`;

        router.delete(url, {
            onSuccess: () => {
                toast.success(`${deleteModal.name} berhasil dihapus`);
                setDeleteModal(null);
                setIsSubmitting(false);
            },
            onError: (err) => {
                toast.error((Object.values(err)[0] as string) || 'Gagal menghapus');
                setIsSubmitting(false);
            },
        });
    };

    // =========================================================================
    // Wizard Save Handler
    // =========================================================================
    const handleSaveWizard = (payload: WizardSavePayload) => {
        setIsSubmitting(true);
        router.post('/admin/onboarding-steps/wizard-save', payload, {
            onSuccess: () => {
                toast.success('Pilihan peminatan dan skill berhasil disimpan!');
                setViewMode('table');
                setIsSubmitting(false);
            },
            onError: (err) => {
                toast.error(
                    (Object.values(err)[0] as string) || 'Gagal menyimpan peminatan'
                );
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
                {/* Secondary Quick Action: Reset Seed Defaults */}
                {viewMode === 'table' && (
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-400">Total data master:</span>
                            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                {stats.active_categories} Bidang Utama • {stats.active_sub_categories} Bidang Spesifik
                            </span>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleSeedDefaults}
                            disabled={isSeeding}
                            className="rounded-xl text-xs gap-1.5 h-8 text-neutral-600 dark:text-neutral-400 cursor-pointer"
                        >
                            <RefreshCw className={`size-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                            {isSeeding ? 'Menyinkronkan...' : 'Reset Default'}
                        </Button>
                    </div>
                )}

                {/* View Mode Switching: Table or 3-Step Wizard */}
                {viewMode === 'wizard' ? (
                    <OnboardingWizard
                        categories={categories}
                        onCancel={() => setViewMode('table')}
                        onSave={handleSaveWizard}
                        onOpenAddCategory={openAddCategory}
                        isSaving={isSubmitting}
                    />
                ) : (
                    <CareerTreeTable
                        categories={categories}
                        activeTab={activeTab}
                        onOpenWizard={() => setViewMode('wizard')}
                        onEditCategory={openEditCategory}
                        onEditSubCategory={openEditSubCategory}
                        onAddSubCategory={openAddSubCategory}
                        onAddSkill={openAddSkill}
                        onDeleteCategory={(cat) =>
                            setDeleteModal({
                                isOpen: true,
                                type: 'category',
                                id: cat.id,
                                name: cat.name,
                            })
                        }
                        onDeleteSubCategory={(sub) =>
                            setDeleteModal({
                                isOpen: true,
                                type: 'sub_category',
                                id: sub.id,
                                name: sub.name,
                            })
                        }
                        onDeleteSkill={(sub, skill) => handleDeleteSkill(sub, skill)}
                        onToggleCategoryStatus={handleToggleCategoryStatus}
                        onToggleSubCategoryStatus={handleToggleSubCategoryStatus}
                    />
                )}
            </div>

            {/* ========================================================================= */}
            {/* MODAL 1: TAMBAH / EDIT KATEGORI (LEVEL 1: BIDANG UTAMA)                   */}
            {/* ========================================================================= */}
            <Dialog
                open={categoryModal.isOpen}
                onOpenChange={(open) =>
                    !open && setCategoryModal({ isOpen: false, category: null })
                }
            >
                <DialogContent className="sm:max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">
                            {categoryModal.category ? 'Edit Bidang Utama' : 'Tambah Bidang Utama'}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Bidang utama merupakan industri atau pilar utama karier (Level 1).
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveCategory} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Nama Bidang Utama *</Label>
                            <Input
                                type="text"
                                required
                                placeholder="Contoh: IT & Software Development, Sales & Business..."
                                value={catForm.name}
                                onChange={(e) =>
                                    setCatForm((prev) => ({ ...prev, name: e.target.value }))
                                }
                                className="rounded-xl text-xs sm:text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Slug (Opsional)</Label>
                            <Input
                                type="text"
                                placeholder="it-software-development (otomatis dibuat jika kosong)"
                                value={catForm.slug}
                                onChange={(e) =>
                                    setCatForm((prev) => ({ ...prev, slug: e.target.value }))
                                }
                                className="rounded-xl text-xs sm:text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Deskripsi Singkat</Label>
                            <Input
                                type="text"
                                placeholder="Ringkasan cakupan industri..."
                                value={catForm.description}
                                onChange={(e) =>
                                    setCatForm((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                className="rounded-xl text-xs sm:text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Ikon Tampilan</Label>
                            <div className="flex flex-wrap gap-2 pt-1 max-h-28 overflow-y-auto p-1 border rounded-xl">
                                {availableIcons.map((iconName) => (
                                    <button
                                        key={iconName}
                                        type="button"
                                        onClick={() =>
                                            setCatForm((prev) => ({ ...prev, icon: iconName }))
                                        }
                                        className={`px-2.5 py-1 text-xs rounded-lg border flex items-center gap-1.5 cursor-pointer ${
                                            catForm.icon === iconName
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
                                        }`}
                                    >
                                        <span>{iconName}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    setCategoryModal({ isOpen: false, category: null })
                                }
                                className="rounded-xl text-xs"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs"
                            >
                                {isSubmitting && (
                                    <Loader2 className="size-3.5 animate-spin mr-1" />
                                )}
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ========================================================================= */}
            {/* MODAL 2: TAMBAH / EDIT SUB-BIDANG (LEVEL 2: BIDANG SPESIFIK)              */}
            {/* ========================================================================= */}
            <Dialog
                open={subCategoryModal.isOpen}
                onOpenChange={(open) =>
                    !open &&
                    setSubCategoryModal({ isOpen: false, subCategory: null })
                }
            >
                <DialogContent className="sm:max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">
                            {subCategoryModal.subCategory
                                ? 'Edit Bidang Spesifik'
                                : 'Tambah Bidang Spesifik'}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Bidang spesifik berada di bawah Bidang Utama (Level 2).
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveSubCategory} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Pilih Bidang Utama *</Label>
                            <select
                                required
                                value={subCatForm.career_category_id}
                                onChange={(e) =>
                                    setSubCatForm((prev) => ({
                                        ...prev,
                                        career_category_id: Number(e.target.value),
                                    }))
                                }
                                className="w-full h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs sm:text-sm"
                            >
                                <option value="" disabled>
                                    -- Pilih Bidang Utama --
                                </option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Nama Bidang Spesifik *</Label>
                            <Input
                                type="text"
                                required
                                placeholder="Contoh: Frontend Development, Backend Development..."
                                value={subCatForm.name}
                                onChange={(e) =>
                                    setSubCatForm((prev) => ({ ...prev, name: e.target.value }))
                                }
                                className="rounded-xl text-xs sm:text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Deskripsi</Label>
                            <Input
                                type="text"
                                placeholder="Contoh: Pengembangan antarmuka dan pengalaman user..."
                                value={subCatForm.description}
                                onChange={(e) =>
                                    setSubCatForm((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                className="rounded-xl text-xs sm:text-sm"
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    setSubCategoryModal({ isOpen: false, subCategory: null })
                                }
                                className="rounded-xl text-xs"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs"
                            >
                                {isSubmitting && (
                                    <Loader2 className="size-3.5 animate-spin mr-1" />
                                )}
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ========================================================================= */}
            {/* MODAL 3: TAMBAH SKILL CEPAT (KE BIDANG SPESIFIK)                          */}
            {/* ========================================================================= */}
            <Dialog
                open={skillModal !== null}
                onOpenChange={(open) => !open && setSkillModal(null)}
            >
                <DialogContent className="sm:max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">
                            Tambah Skill ke {skillModal?.subCategoryName}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Skill atau teknologi baru yang dapat dipilih pengguna di bidang spesifik ini.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveSkill} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Nama Skill / Teknologi *</Label>
                            <Input
                                type="text"
                                required
                                placeholder="Contoh: React, TypeScript, Tailwind CSS, Docker..."
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                className="rounded-xl text-xs sm:text-sm"
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSkillModal(null)}
                                className="rounded-xl text-xs"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || !skillInput.trim()}
                                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs"
                            >
                                {isSubmitting && (
                                    <Loader2 className="size-3.5 animate-spin mr-1" />
                                )}
                                Tambah Skill
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
                            Konfirmasi Hapus{' '}
                            {deleteModal?.type === 'category'
                                ? 'Bidang Utama'
                                : deleteModal?.type === 'sub_category'
                                ? 'Bidang Spesifik'
                                : 'Skill'}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Apakah Anda yakin ingin menghapus{' '}
                            <strong className="text-neutral-900 dark:text-neutral-100">
                                {deleteModal?.name}
                            </strong>
                            ?
                            {deleteModal?.type === 'category' &&
                                ' Seluruh bidang spesifik dan skill di bawahnya juga akan terhapus.'}
                            {deleteModal?.type === 'sub_category' &&
                                ' Seluruh skill di bawah bidang spesifik ini juga akan terhapus.'}
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
                            {isSubmitting && (
                                <Loader2 className="size-3.5 animate-spin mr-1" />
                            )}
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
            title: 'Onboarding',
            href: '/admin/onboarding-steps',
        },
        {
            title: 'Peminatan Karir',
            href: '/admin/onboarding-steps',
        },
    ],
};
