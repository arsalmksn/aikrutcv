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
    Copy,
    Trash2,
    Download,
    Briefcase,
    FileCheck2,
    Layers,
    ArrowRight,
    Loader2,
} from 'lucide-react';
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
    } | null;
    contact: {
        first_name: string | null;
        last_name: string | null;
        desired_job_title: string | null;
        email: string | null;
        phone: string | null;
    } | null;
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
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl">
                                Daftar CV Saya
                            </h1>
                            <Badge variant="outline" className="h-6 rounded-full px-2 text-xs font-semibold">
                                {totalCount} Resume
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            Kelola, perbarui, dan unduh seluruh resume profesional berstandar ATS Anda.
                        </p>
                    </div>

                    <Link
                        href="/cv/options"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-95 sm:w-auto"
                    >
                        <Plus className="size-4" />
                        <span>Buat CV Baru</span>
                    </Link>
                </div>

                {/* Quick Summary Cards */}
                {totalCount > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-4 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex size-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                <Layers className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total CV</p>
                                <p className="text-xl font-bold text-neutral-900 dark:text-white">{totalCount}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex size-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                <CheckCircle2 className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">CV Lengkap (100%)</p>
                                <p className="text-xl font-bold text-neutral-900 dark:text-white">{completeCount}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex size-11 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                                <AlertCircle className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Dalam Draf</p>
                                <p className="text-xl font-bold text-neutral-900 dark:text-white">{draftCount}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filter and Search Controls */}
                {totalCount > 0 && (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* Status Filter Tabs */}
                        <div className="flex items-center rounded-lg border border-neutral-200/80 bg-neutral-100/70 p-1 dark:border-neutral-800 dark:bg-neutral-900">
                            <button
                                type="button"
                                onClick={() => setStatusFilter('all')}
                                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                                    statusFilter === 'all'
                                        ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white'
                                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                                }`}
                            >
                                Semua ({totalCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('complete')}
                                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                                    statusFilter === 'complete'
                                        ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white'
                                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                                }`}
                            >
                                Lengkap ({completeCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('draft')}
                                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                                    statusFilter === 'draft'
                                        ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white'
                                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
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
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCvs.map((cv) => {
                            const isComplete = cv.completeness.is_complete;
                            const percentage = cv.completeness.percentage;
                            const fullName = [cv.contact?.first_name, cv.contact?.last_name]
                                .filter(Boolean)
                                .join(' ');
                            const jobTitle = cv.contact?.desired_job_title || 'Posisi belum ditentukan';

                            return (
                                <div
                                    key={cv.id}
                                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-900"
                                >
                                    {/* Top Accent Line */}
                                    <div
                                        className={`absolute top-0 right-0 left-0 h-1.5 transition-colors ${
                                            isComplete
                                                ? 'bg-emerald-500'
                                                : percentage >= 50
                                                  ? 'bg-blue-500'
                                                  : 'bg-amber-400'
                                        }`}
                                    />

                                    <div>
                                        {/* Card Header: Title & Dropdown */}
                                        <div className="flex items-start justify-between gap-2 pt-1">
                                            <div className="min-w-0 flex-1">
                                                <h3
                                                    className="truncate text-base font-bold text-neutral-900 group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400"
                                                    title={cv.title}
                                                >
                                                    {cv.title}
                                                </h3>
                                                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                                    <Badge
                                                        variant="secondary"
                                                        className="gap-1 px-2 py-0.5 text-[10px] font-medium"
                                                    >
                                                        <Sparkles className="size-2.5 text-blue-500" />
                                                        <span>{cv.template?.name || 'Standar ATS'}</span>
                                                    </Badge>
                                                    {isComplete ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                                                            <CheckCircle2 className="size-2.5" />
                                                            Siap Dipakai
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                                                            <Clock className="size-2.5" />
                                                            Draf ({percentage}%)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Menu */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                                                    >
                                                        <MoreVertical className="size-4" />
                                                        <span className="sr-only">Menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44">
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

                                        {/* Contact & Target Job Preview */}
                                        <div className="mt-3.5 space-y-1 rounded-xl bg-neutral-50/80 p-3 text-xs text-neutral-600 dark:bg-neutral-800/40 dark:text-neutral-400">
                                            <div className="flex items-center gap-1.5 font-medium text-neutral-900 dark:text-neutral-200">
                                                <Briefcase className="size-3.5 text-blue-500 shrink-0" />
                                                <span className="truncate">{jobTitle}</span>
                                            </div>
                                            <p className="truncate text-neutral-500 dark:text-neutral-400">
                                                {fullName ? fullName : 'Data nama kontak belum diisi'}
                                            </p>
                                        </div>

                                        {/* Progress Bar & Completeness Badges */}
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-medium text-neutral-600 dark:text-neutral-400">
                                                    Kelengkapan Resume
                                                </span>
                                                <span className="font-semibold text-neutral-900 dark:text-white">
                                                    {percentage}%
                                                </span>
                                            </div>
                                            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-300 ${
                                                        isComplete
                                                            ? 'bg-emerald-500'
                                                            : percentage >= 50
                                                              ? 'bg-blue-500'
                                                              : 'bg-amber-500'
                                                    }`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>

                                            {/* Micro Checklist Badges */}
                                            <div className="mt-2.5 flex flex-wrap gap-1">
                                                {[
                                                    { key: 'contact', label: 'Kontak', ok: cv.completeness.checklist.contact },
                                                    { key: 'summary', label: 'Ringkasan', ok: cv.completeness.checklist.summary },
                                                    { key: 'experiences', label: 'Pengalaman', ok: cv.completeness.checklist.experiences },
                                                    { key: 'educations', label: 'Pendidikan', ok: cv.completeness.checklist.educations },
                                                    { key: 'skills', label: 'Keahlian', ok: cv.completeness.checklist.skills },
                                                ].map((item) => (
                                                    <span
                                                        key={item.key}
                                                        className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-medium ${
                                                            item.ok
                                                                ? 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                                                                : 'bg-neutral-50 text-neutral-400 opacity-60 dark:bg-neutral-900 dark:text-neutral-500'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`size-1.5 rounded-full ${
                                                                item.ok ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-700'
                                                            }`}
                                                        />
                                                        {item.label}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer: Metadata & Actions */}
                                    <div className="mt-5 border-t border-neutral-100 pt-3.5 dark:border-neutral-800/80">
                                        <div className="mb-3 flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
                                            <Clock className="size-3" />
                                            <span>Diperbarui {cv.updated_at}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/cv/${cv.id}/builder`}
                                                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-98"
                                            >
                                                <span>Lanjut Edit</span>
                                                <ArrowRight className="size-3.5" />
                                            </Link>

                                            <a
                                                href={`/cv/${cv.id}/download-pdf`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Download PDF"
                                                className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white p-2 text-neutral-700 shadow-xs transition-all hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                                            >
                                                <Download className="size-4" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : totalCount > 0 ? (
                    /* Search / Filter Empty Results */
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-16 text-center dark:border-neutral-800">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                            <Search className="size-6" />
                        </div>
                        <h3 className="mt-4 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                            Tidak ada CV yang cocok
                        </h3>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
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
                    <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200/90 bg-neutral-50/50 py-16 text-center dark:border-neutral-800 dark:bg-neutral-900/30">
                        <div className="flex size-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-xs dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-400">
                            <FileText className="size-8" />
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-neutral-900 dark:text-neutral-100">
                            Belum Ada CV yang Dibuat
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                            Mulai langkah karir impian Anda dengan membuat resume profesional berstandar ATS sekarang.
                        </p>
                        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
                            <Link
                                href="/cv/options"
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-95"
                            >
                                <Plus className="size-4" />
                                <span>Buat CV Pertama Anda</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>

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
