import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    FileText,
    Plus,
    Search,
    Sparkles,
    Clock,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    Edit3,
    Eye,
    Copy,
    Trash2,
    Download,
    Briefcase,
    FileCheck2,
    Layers,
    ArrowRight,
    Loader2,
} from 'lucide-react';
import { TemplatePreview } from '@/components/cv/template-preview';
import { TemplatePreviewModal } from '@/components/cv/template-preview-modal';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface CompletenessChecklist {
    contact: boolean;
    experiences: boolean;
    educations: boolean;
    skills: boolean;
    summary: boolean;
    is_complete: boolean;
}

export interface CvItem {
    id: number;
    title: string;
    is_published: boolean;
    template: {
        id: number;
        name: string;
        category?: string | null;
    } | null;
    contact: {
        first_name: string | null;
        last_name: string | null;
        desired_job_title: string | null;
        email: string | null;
        phone: string | null;
        city?: string | null;
        address?: string | null;
    } | null;
    summary?: string | null;
    experiences?: Array<{
        id: number;
        company_name: string;
        position: string;
        city?: string | null;
    }>;
    educations?: Array<{
        id: number;
        institution_name: string;
        degree?: string | null;
        field_of_study?: string | null;
    }>;
    skills?: Array<{
        id: number;
        name: string;
    }>;
    experiences_count: number;
    educations_count: number;
    skills_count: number;
    completeness: {
        percentage: number;
        is_complete: boolean;
        checklist: CompletenessChecklist;
    };
    created_at: string;
    updated_at: string;
    updated_at_formatted: string;
}

interface CvIndexProps {
    cvs: CvItem[];
}

export default function CvIndexPage({ cvs = [] }: CvIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'complete' | 'draft'>('all');
    const [previewCv, setPreviewCv] = useState<CvItem | null>(null);

    // Dialog state for renaming
    const [editingCv, setEditingCv] = useState<CvItem | null>(null);
    const [newTitle, setNewTitle] = useState('');
    const [isRenaming, setIsRenaming] = useState(false);

    // Dialog state for deleting
    const [deletingCv, setDeletingCv] = useState<CvItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // State for duplication loading
    const [duplicatingId, setDuplicatingId] = useState<number | null>(null);

    // Filter and search computation
    const filteredCvs = useMemo(() => {
        return cvs.filter((cv) => {
            const matchesSearch =
                cv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (cv.contact?.desired_job_title &&
                    cv.contact.desired_job_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (cv.contact?.first_name &&
                    cv.contact.first_name.toLowerCase().includes(searchQuery.toLowerCase()));

            if (!matchesSearch) return false;

            if (statusFilter === 'complete') {
                return cv.completeness.is_complete;
            }
            if (statusFilter === 'draft') {
                return !cv.completeness.is_complete;
            }

            return true;
        });
    }, [cvs, searchQuery, statusFilter]);

    // Statistics
    const totalCount = cvs.length;
    const completeCount = cvs.filter((c) => c.completeness.is_complete).length;
    const draftCount = totalCount - completeCount;

    // Handle Title Update
    const handleOpenRename = (cv: CvItem) => {
        setEditingCv(cv);
        setNewTitle(cv.title);
    };

    const handleSaveTitle = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCv || !newTitle.trim()) return;

        setIsRenaming(true);
        router.patch(
            `/cv/${editingCv.id}/title`,
            { title: newTitle.trim() },
            {
                onSuccess: () => {
                    setEditingCv(null);
                    setNewTitle('');
                },
                onFinish: () => setIsRenaming(false),
            }
        );
    };

    // Handle Duplicate CV
    const handleDuplicate = (cv: CvItem) => {
        setDuplicatingId(cv.id);
        router.post(
            `/cv/${cv.id}/duplicate`,
            {},
            {
                onFinish: () => setDuplicatingId(null),
            }
        );
    };

    // Handle Delete CV
    const handleConfirmDelete = () => {
        if (!deletingCv) return;

        setIsDeleting(true);
        router.delete(`/cv/${deletingCv.id}`, {
            onSuccess: () => setDeletingCv(null),
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <>
            <Head title="Daftar CV - Aikrut" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                {/* Header section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-bold tracking-tight text-[#172554] dark:text-neutral-100 sm:text-3xl">
                                Daftar CV Saya
                            </h1>
                            <span className="rounded-full border border-violet-100 bg-[#F0EBFB] px-2.5 py-0.5 text-xs font-semibold text-[#5025D1] dark:border-violet-900/60 dark:bg-violet-950/60 dark:text-violet-400">
                                {totalCount} Resume
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-[#64748B] dark:text-neutral-400">
                            Kelola, perbarui, dan unduh seluruh resume profesional berstandar ATS Anda.
                        </p>
                    </div>

                    <Link
                        href="/cv/options"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5025D1] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-[#401DA8] active:scale-95 sm:w-auto"
                    >
                        <Plus className="size-4" />
                        <span>Buat CV Baru</span>
                    </Link>
                </div>

                {/* Quick Summary Cards */}
                {totalCount > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-[#F0EBFB] text-[#5025D1] dark:bg-violet-950/60 dark:text-violet-400">
                                <Layers className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-[#64748B] dark:text-neutral-400">Total CV</p>
                                <p className="text-xl font-bold text-[#172554] dark:text-white">{totalCount}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                <CheckCircle2 className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-[#64748B] dark:text-neutral-400">CV Lengkap (100%)</p>
                                <p className="text-xl font-bold text-[#172554] dark:text-white">{completeCount}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                                <AlertCircle className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-[#64748B] dark:text-neutral-400">Dalam Draf</p>
                                <p className="text-xl font-bold text-[#172554] dark:text-white">{draftCount}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filter and Search Controls */}
                {totalCount > 0 && (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* Status Filter Tabs */}
                        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100/80 p-1 dark:border-neutral-800 dark:bg-neutral-900">
                            <button
                                type="button"
                                onClick={() => setStatusFilter('all')}
                                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                                    statusFilter === 'all'
                                        ? 'bg-white text-[#172554] shadow-xs dark:bg-neutral-800 dark:text-white'
                                        : 'text-[#64748B] hover:text-[#172554] dark:text-neutral-400 dark:hover:text-white'
                                }`}
                            >
                                Semua ({totalCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('complete')}
                                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                                    statusFilter === 'complete'
                                        ? 'bg-white text-[#172554] shadow-xs dark:bg-neutral-800 dark:text-white'
                                        : 'text-[#64748B] hover:text-[#172554] dark:text-neutral-400 dark:hover:text-white'
                                }`}
                            >
                                Lengkap ({completeCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('draft')}
                                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                                    statusFilter === 'draft'
                                        ? 'bg-white text-[#172554] shadow-xs dark:bg-neutral-800 dark:text-white'
                                        : 'text-[#64748B] hover:text-[#172554] dark:text-neutral-400 dark:hover:text-white'
                                }`}
                            >
                                Draf ({draftCount})
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
                            <Input
                                type="text"
                                placeholder="Cari judul atau posisi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 text-xs sm:text-sm"
                            />
                        </div>
                    </div>
                )}

                {/* CV Card Grid */}
                {filteredCvs.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredCvs.map((cv) => (
                            <div
                                key={cv.id}
                                className="flex flex-col gap-2"
                            >
                                {/* Keterangan / Judul posisi di atas preview dan tanpa badge */}
                                <div className="flex items-center justify-between px-1">
                                    <Link
                                        href={`/cv/${cv.id}/builder`}
                                        className="truncate text-sm font-bold text-[#172554] transition-colors hover:text-[#5025D1] dark:text-neutral-100 dark:hover:text-violet-400"
                                        title={cv.title}
                                    >
                                        {cv.title}
                                    </Link>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-7 rounded-lg text-neutral-500 hover:bg-slate-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                                            >
                                                <MoreVertical className="size-4" />
                                                <span className="sr-only">Menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg">
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={`/cv/${cv.id}/builder`}
                                                    className="cursor-pointer gap-2"
                                                >
                                                    <Edit3 className="size-4 text-neutral-500" />
                                                    <span>Lanjut Edit</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => setPreviewCv(cv)}
                                                className="cursor-pointer gap-2"
                                            >
                                                <Eye className="size-4 text-[#5025D1]" />
                                                <span>Pratinjau Layar Penuh</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <a
                                                    href={`/cv/${cv.id}/download-pdf`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="cursor-pointer gap-2"
                                                >
                                                    <Download className="size-4 text-neutral-500" />
                                                    <span>Unduh PDF</span>
                                                </a>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleOpenRename(cv)}
                                                className="cursor-pointer gap-2"
                                            >
                                                <Edit3 className="size-4 text-neutral-500" />
                                                <span>Ganti Judul</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDuplicate(cv)}
                                                disabled={duplicatingId === cv.id}
                                                className="cursor-pointer gap-2"
                                            >
                                                {duplicatingId === cv.id ? (
                                                    <Loader2 className="size-4 animate-spin text-blue-600" />
                                                ) : (
                                                    <Copy className="size-4 text-neutral-500" />
                                                )}
                                                <span>Duplikasi CV</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => setDeletingCv(cv)}
                                                className="cursor-pointer gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600 dark:focus:bg-rose-950/50"
                                            >
                                                <Trash2 className="size-4" />
                                                <span>Hapus CV</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Preview Template Saja */}
                                <TemplatePreview
                                    data={cv}
                                    template={cv.template}
                                    variant="card"
                                    floatingType="actions"
                                    useSample={false}
                                    onQuickPreview={() => setPreviewCv(cv)}
                                    builderHref={`/cv/${cv.id}/builder`}
                                />
                            </div>
                        ))}
                    </div>
                ) : totalCount > 0 ? (
                    /* Search / Filter Empty Results */
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-center dark:border-neutral-800">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-[#64748B] dark:bg-neutral-800 dark:text-neutral-400">
                            <Search className="size-6" />
                        </div>
                        <h3 className="mt-4 text-base font-bold text-[#172554] dark:text-neutral-100">
                            Tidak ada CV yang cocok
                        </h3>
                        <p className="mt-1 text-sm text-[#64748B] dark:text-neutral-400">
                            Tidak ditemukan CV dengan kriteria pencarian "{searchQuery}".
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSearchQuery('');
                                setStatusFilter('all');
                            }}
                            className="mt-4 rounded-xl text-xs"
                        >
                            Reset Filter
                        </Button>
                    </div>
                ) : (
                    /* General Empty State (No CVs created yet) */
                    <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/90 bg-[#FAF7F2]/60 py-16 text-center dark:border-neutral-800 dark:bg-neutral-900/30">
                        <div className="flex size-16 items-center justify-center rounded-2xl border border-violet-100 bg-[#F0EBFB] text-[#5025D1] shadow-xs dark:border-violet-900/40 dark:bg-violet-950/40 dark:text-violet-400">
                            <FileText className="size-8" />
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-[#172554] dark:text-neutral-100">
                            Belum Ada CV yang Dibuat
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#64748B] dark:text-neutral-400">
                            Mulai langkah karir impian Anda dengan membuat resume profesional berstandar ATS sekarang.
                        </p>
                        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
                            <Link
                                href="/cv/options"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#5025D1] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-[#401DA8] active:scale-95"
                            >
                                <Plus className="size-4" />
                                <span>Buat CV Pertama Anda</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Preview Fullscreen Modal */}
            <TemplatePreviewModal
                isOpen={Boolean(previewCv)}
                onClose={() => setPreviewCv(null)}
                title={previewCv?.title || 'Pratinjau CV'}
                subtitle={previewCv?.contact?.desired_job_title || undefined}
                template={previewCv?.template}
                data={previewCv}
                useSample={false}
                builderUrl={previewCv ? `/cv/${previewCv.id}/builder` : undefined}
                downloadUrl={previewCv ? `/cv/${previewCv.id}/download-pdf` : undefined}
            />

            {/* Rename Title Dialog */}
            <Dialog open={editingCv !== null} onOpenChange={(open) => !open && setEditingCv(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Ganti Judul CV</DialogTitle>
                        <DialogDescription>
                            Beri nama yang memudahkan Anda membedakan versi resume ini.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveTitle} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul Resume</Label>
                            <Input
                                id="title"
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Misal: CV Software Engineer - Tokopedia"
                                required
                                autoFocus
                            />
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingCv(null)}
                                disabled={isRenaming}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={isRenaming || !newTitle.trim()}>
                                {isRenaming ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Judul'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deletingCv !== null} onOpenChange={(open) => !open && setDeletingCv(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-rose-600">Hapus CV</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus resume{' '}
                            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                "{deletingCv?.title}"
                            </span>
                            ? Tindakan ini permanen dan tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingCv(null)}
                            disabled={isDeleting}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                'Ya, Hapus CV'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

CvIndexPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Daftar CV',
            href: '/cv',
        },
    ],
};
