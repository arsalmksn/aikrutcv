import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    Copy,
    Download,
    Edit3,
    FileText,
    Lightbulb,
    Loader2,
    MoreHorizontal,
    Plus,
    Sparkles,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
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
import type { CareerCategoryItem } from '@/data/career-categories';
import { dashboard } from '@/routes';

interface RecentCvItem {
    id: number;
    title: string;
    subtitle: string;
    template_name: string;
    is_published: boolean;
    status_label: string;
    updated_at_formatted: string;
}

interface DashboardStats {
    total_cvs: number;
    total_cvs_formatted: string;
    last_updated_time: string;
    last_updated_cv_title: string;
}

interface DashboardProps {
    hasCompletedOnboarding?: boolean;
    savedPeminatan?: string[];
    careerCategories?: CareerCategoryItem[];
    stats?: DashboardStats;
    recentCvs?: RecentCvItem[];
}

export default function Dashboard({
    hasCompletedOnboarding,
    savedPeminatan = [],
    careerCategories,
    stats = {
        total_cvs: 0,
        total_cvs_formatted: '00',
        last_updated_time: 'Belum ada',
        last_updated_cv_title: 'Belum ada dokumen',
    },
    recentCvs = [],
}: DashboardProps) {
    const { auth } = usePage().props as any;

    const userNeedsOnboarding =
        hasCompletedOnboarding === false ||
        (auth?.user && !auth.user.onboarding_completed_at);

    const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(
        Boolean(userNeedsOnboarding)
    );

    // Tips modal dialog state
    const [showTipsModal, setShowTipsModal] = useState(false);

    // Rename dialog state
    const [editingCv, setEditingCv] = useState<RecentCvItem | null>(null);
    const [newTitle, setNewTitle] = useState('');
    const [isRenaming, setIsRenaming] = useState(false);

    // Delete dialog state
    const [deletingCv, setDeletingCv] = useState<RecentCvItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [duplicatingId, setDuplicatingId] = useState<number | null>(null);

    const handleOpenRename = (cv: RecentCvItem) => {
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
                preserveScroll: true,
                onSuccess: () => {
                    setEditingCv(null);
                    setIsRenaming(false);
                },
                onError: () => {
                    setIsRenaming(false);
                },
            }
        );
    };

    const handleDuplicate = (cv: RecentCvItem) => {
        setDuplicatingId(cv.id);
        router.post(
            `/cv/${cv.id}/duplicate`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setDuplicatingId(null),
            }
        );
    };

    const handleConfirmDelete = () => {
        if (!deletingCv) return;

        setIsDeleting(true);
        router.delete(`/cv/${deletingCv.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeletingCv(null);
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <>
            <Head title="Dashboard" />

            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                {/* Top Welcome Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                            Selamat datang kembali
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Lanjutkan menyusun CV profesionalmu dengan lebih terarah.
                        </p>
                    </div>

                    <div className="shrink-0">
                        <Link
                            href="/cv/templates"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#37198a] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-[#2b1270] hover:shadow-md active:scale-98 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                        >
                            <Plus className="size-4" />
                            <span>Buat CV baru</span>
                        </Link>
                    </div>
                </div>

                {/* 2 Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
                    {/* Card 1: CV yang dibuat */}
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="text-xs font-medium text-slate-400 dark:text-neutral-400">
                            CV yang dibuat
                        </div>
                        <div className="mt-3 flex items-baseline gap-3">
                            <span className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-neutral-100">
                                {stats.total_cvs_formatted}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-neutral-500">
                                Dokumen tersimpan
                            </span>
                        </div>
                    </div>

                    {/* Card 2: Terakhir diperbarui */}
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="text-xs font-medium text-slate-400 dark:text-neutral-400">
                            Terakhir diperbarui
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-neutral-100">
                                {stats.last_updated_time}
                            </div>
                            <div className="mt-1 truncate text-xs text-slate-400 dark:text-neutral-400">
                                {stats.last_updated_cv_title}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent CVs Section */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-white">
                                CV terbaru
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-400 dark:text-neutral-400">
                                Dokumen yang terakhir kamu kerjakan.
                            </p>
                        </div>

                        <Link
                            href="/cv"
                            className="text-xs font-semibold text-slate-600 transition-colors hover:text-indigo-600 dark:text-neutral-300 dark:hover:text-indigo-400"
                        >
                            Lihat semua
                        </Link>
                    </div>

                    {/* Table / List Card */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] dark:border-neutral-800 dark:bg-neutral-900">
                        {recentCvs.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-[#f8fafc] dark:border-neutral-800 dark:bg-neutral-900/80">
                                            <th className="py-3.5 px-6 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-400">
                                                NAMA DOKUMEN
                                            </th>
                                            <th className="py-3.5 px-6 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-400">
                                                TERAKHIR DIEDIT
                                            </th>
                                            <th className="py-3.5 px-6 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-400">
                                                STATUS
                                            </th>
                                            <th className="py-3.5 px-6 text-right text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-400">
                                                AKSI
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-neutral-800/80">
                                        {recentCvs.map((cv) => (
                                            <tr
                                                key={cv.id}
                                                className="group transition-colors hover:bg-slate-50/60 dark:hover:bg-neutral-800/40"
                                            >
                                                {/* Document Name */}
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3.5">
                                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-400 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400">
                                                            <FileText className="size-5 stroke-[1.5]" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <Link
                                                                href={`/cv/${cv.id}/builder`}
                                                                className="block truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-neutral-100 dark:group-hover:text-indigo-400"
                                                            >
                                                                {cv.title}
                                                            </Link>
                                                            <div className="mt-0.5 truncate text-xs text-slate-400 dark:text-neutral-500">
                                                                {cv.subtitle}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Last Edited Date */}
                                                <td className="py-4 px-6 text-xs text-slate-600 whitespace-nowrap dark:text-neutral-300">
                                                    {cv.updated_at_formatted}
                                                </td>

                                                {/* Status */}
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <span className="text-xs font-medium text-slate-600 dark:text-neutral-300">
                                                        {cv.status_label}
                                                    </span>
                                                </td>

                                                {/* Action Menu */}
                                                <td className="py-4 px-6 text-right whitespace-nowrap">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                                                            >
                                                                <MoreHorizontal className="size-4" />
                                                                <span className="sr-only">Aksi</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-48 rounded-xl shadow-lg"
                                                        >
                                                            <DropdownMenuItem asChild>
                                                                <Link
                                                                    href={`/cv/${cv.id}/builder`}
                                                                    className="cursor-pointer gap-2.5 text-xs font-medium"
                                                                >
                                                                    <Edit3 className="size-3.5 text-slate-500" />
                                                                    <span>Lanjut Edit</span>
                                                                </Link>
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem asChild>
                                                                <a
                                                                    href={`/cv/${cv.id}/download-pdf`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="cursor-pointer gap-2.5 text-xs font-medium"
                                                                >
                                                                    <Download className="size-3.5 text-slate-500" />
                                                                    <span>Unduh PDF</span>
                                                                </a>
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem
                                                                onClick={() => handleOpenRename(cv)}
                                                                className="cursor-pointer gap-2.5 text-xs font-medium"
                                                            >
                                                                <Edit3 className="size-3.5 text-slate-500" />
                                                                <span>Ganti Judul</span>
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem
                                                                onClick={() => handleDuplicate(cv)}
                                                                disabled={duplicatingId === cv.id}
                                                                className="cursor-pointer gap-2.5 text-xs font-medium"
                                                            >
                                                                <Copy className="size-3.5 text-slate-500" />
                                                                <span>
                                                                    {duplicatingId === cv.id
                                                                        ? 'Menduplikasi...'
                                                                        : 'Duplikat CV'}
                                                                </span>
                                                            </DropdownMenuItem>

                                                            <DropdownMenuSeparator />

                                                            <DropdownMenuItem
                                                                onClick={() => setDeletingCv(cv)}
                                                                className="cursor-pointer gap-2.5 text-xs font-medium text-rose-600 focus:bg-rose-50 focus:text-rose-700 dark:focus:bg-rose-950/40 dark:focus:text-rose-400"
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                                <span>Hapus CV</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            /* Empty State when user has 0 CVs */
                            <div className="flex flex-col items-center justify-center p-8 text-center sm:p-12">
                                <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-neutral-800 dark:text-neutral-400">
                                    <FileText className="size-7 stroke-[1.5]" />
                                </div>
                                <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-neutral-100">
                                    Belum ada CV yang dibuat
                                </h3>
                                <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-neutral-400">
                                    Mulai langkah karier profesionalmu dengan membuat CV berstandar ATS sekarang.
                                </p>
                                <div className="mt-5">
                                    <Link
                                        href="/cv/templates"
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#37198a] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#2b1270] active:scale-95 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                                    >
                                        <Plus className="size-3.5" />
                                        <span>Buat CV Pertama</span>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Banner Card: Tips CV */}
                <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sm:flex-row sm:items-center sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-neutral-100">
                            Tips untuk CV yang lebih kuat
                        </h3>
                        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500 sm:text-sm dark:text-neutral-400">
                            Gunakan informasi yang relevan, susun pengalaman dengan jelas, dan sesuaikan CV dengan posisi yang kamu tuju.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowTipsModal(true)}
                        className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-700 transition-colors hover:text-indigo-600 sm:text-sm dark:text-neutral-300 dark:hover:text-indigo-400 cursor-pointer"
                    >
                        <span>Pelajari tips</span>
                        <ArrowRight className="size-3.5" />
                    </button>
                </div>
            </div>

            {/* Rename Title Dialog */}
            <Dialog open={editingCv !== null} onOpenChange={(open) => !open && setEditingCv(null)}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Ganti Judul CV</DialogTitle>
                        <DialogDescription className="text-xs">
                            Beri nama yang memudahkan Anda membedakan versi resume ini.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveTitle} className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label htmlFor="cv-title" className="text-xs font-semibold">
                                Judul Resume
                            </Label>
                            <Input
                                id="cv-title"
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Misal: CV UI/UX Designer"
                                className="rounded-xl"
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
                                className="rounded-xl"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isRenaming || !newTitle.trim()}
                                className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
                            >
                                {isRenaming ? (
                                    <>
                                        <Loader2 className="mr-2 size-3.5 animate-spin" />
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
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-rose-600">Hapus Dokumen CV</DialogTitle>
                        <DialogDescription className="text-xs">
                            Apakah Anda yakin ingin menghapus resume{' '}
                            <strong className="font-semibold text-slate-900 dark:text-neutral-100">
                                "{deletingCv?.title}"
                            </strong>
                            ? Tindakan ini permanen dan tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 pt-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingCv(null)}
                            disabled={isDeleting}
                            className="rounded-xl"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="rounded-xl"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 size-3.5 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                'Ya, Hapus CV'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Tips untuk CV yang Lebih Kuat Dialog Modal */}
            <Dialog open={showTipsModal} onOpenChange={setShowTipsModal}>
                <DialogContent className="max-w-lg rounded-2xl">
                    <DialogHeader>
                        <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-2 dark:bg-amber-950/60 dark:text-amber-400">
                            <Lightbulb className="size-5" />
                        </div>
                        <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                            Panduan Menyusun CV Berstandar ATS
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                            Terapkan 5 prinsip kunci ini untuk meningkatkan peluang lolos skrining resume HRD & ATS.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 pt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/60">
                            <h4 className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                                <span className="flex size-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                                    1
                                </span>
                                Gunakan Kata Kerja Aksi (Action Verbs)
                            </h4>
                            <p className="mt-1 text-slate-500 dark:text-slate-400">
                                Awali setiap poin pengalaman dengan kata kerja aktif yang kuat seperti <em>Mengembangkan</em>, <em>Mengoptimalkan</em>, <em>Memimpin</em>, atau <em>Mendesain</em>.
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/60">
                            <h4 className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                                <span className="flex size-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                                    2
                                </span>
                                Cantumkan Metrik dan Hasil Terukur
                            </h4>
                            <p className="mt-1 text-slate-500 dark:text-slate-400">
                                Sertakan angka atau persentase pencapaian, misalnya <em>"Meningkatkan konversi pendaftaran pengguna sebesar 24% dalam 3 bulan"</em>.
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/60">
                            <h4 className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                                <span className="flex size-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                                    3
                                </span>
                                Sesuaikan Kata Kunci (Keywords) Posisi
                            </h4>
                            <p className="mt-1 text-slate-500 dark:text-slate-400">
                                Cocokkan keterampilan teknis dan istilah industri dengan kualifikasi pada lowongan kerja yang Anda tuju.
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/60">
                            <h4 className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                                <span className="flex size-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                                    4
                                </span>
                                Pertahankan Struktur yang Konsisten
                            </h4>
                            <p className="mt-1 text-slate-500 dark:text-slate-400">
                                Gunakan format tanggal standar dan urutan pengalaman dari yang paling baru (kronologis terbalik).
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            onClick={() => setShowTipsModal(false)}
                            className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-neutral-100 dark:text-slate-900 dark:hover:bg-neutral-200"
                        >
                            Tutup Panduan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 2-Step Onboarding Modal for New Accounts */}
            <OnboardingModal
                isOpen={showOnboardingModal}
                onClose={() => setShowOnboardingModal(false)}
                savedPeminatan={savedPeminatan}
                careerCategories={careerCategories}
            />
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
