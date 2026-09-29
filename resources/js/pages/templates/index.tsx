import React, { useState, useMemo } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import {
    LayoutTemplate,
    Plus,
    Search,
    Edit3,
    Trash2,
    Eye,
    ExternalLink,
    CheckCircle2,
    XCircle,
    FileCode2,
    FileCheck2,
    AlertTriangle,
    Layers,
    FolderKanban,
    Sparkles,
    UploadCloud,
    Loader2,
    RefreshCw,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export interface TemplateItem {
    id: number;
    name: string;
    category: string | null;
    is_active: boolean;
    file_path: string | null;
    file_url: string | null;
    file_exists: boolean;
    file_size_formatted: string | null;
    cvs_count: number;
    created_at: string;
    updated_at: string;
}

interface TemplatesPageProps {
    templates: TemplateItem[];
    categories: string[];
}

export default function TemplatesIndexPage({
    templates = [],
    categories = ['ATS', 'Modern', 'Classic', 'Sederhana', 'Profesional'],
}: TemplatesPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    // Dialog States
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<TemplateItem | null>(null);
    const [deletingTemplate, setDeletingTemplate] = useState<TemplateItem | null>(null);
    const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);

    // Form for Create Template
    const createForm = useForm({
        name: '',
        category: 'ATS',
        is_active: true,
        template_file: null as File | null,
    });

    // Form for Edit Template
    const editForm = useForm({
        name: '',
        category: 'ATS',
        is_active: true,
        template_file: null as File | null,
    });

    // Statistics
    const totalCount = templates.length;
    const activeCount = templates.filter((t) => t.is_active).length;
    const inactiveCount = totalCount - activeCount;
    const totalCvUsage = templates.reduce((acc, curr) => acc + (curr.cvs_count || 0), 0);

    // Filtered templates
    const filteredTemplates = useMemo(() => {
        return templates.filter((tpl) => {
            const matchesSearch =
                tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (tpl.category && tpl.category.toLowerCase().includes(searchQuery.toLowerCase()));

            if (!matchesSearch) return false;

            if (categoryFilter !== 'all' && tpl.category !== categoryFilter) {
                return false;
            }

            if (statusFilter === 'active' && !tpl.is_active) {
                return false;
            }

            if (statusFilter === 'inactive' && tpl.is_active) {
                return false;
            }

            return true;
        });
    }, [templates, searchQuery, categoryFilter, statusFilter]);

    // Handle Create Submit
    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/templates', {
            onSuccess: () => {
                createForm.reset();
                setIsCreateOpen(false);
            },
        });
    };

    // Open Edit Dialog
    const handleOpenEdit = (tpl: TemplateItem) => {
        setEditingTemplate(tpl);
        editForm.setData({
            name: tpl.name,
            category: tpl.category || 'ATS',
            is_active: tpl.is_active,
            template_file: null,
        });
        editForm.clearErrors();
    };

    // Handle Edit Submit
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTemplate) return;

        editForm.post(`/templates/${editingTemplate.id}`, {
            onSuccess: () => {
                setEditingTemplate(null);
                editForm.reset();
            },
        });
    };

    // Handle Delete Confirm
    const [isDeleting, setIsDeleting] = useState(false);
    const handleConfirmDelete = () => {
        if (!deletingTemplate) return;

        setIsDeleting(true);
        router.delete(`/templates/${deletingTemplate.id}`, {
            onSuccess: () => {
                setDeletingTemplate(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <>
            <Head title="Kelola Template CV - Aikrut" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl">
                                Kelola Template CV
                            </h1>
                            <Badge variant="outline" className="h-6 rounded-full px-2.5 text-xs font-semibold">
                                {totalCount} Template
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            Buat, perbarui, dan unggah file template resume (.html) yang digunakan dalam CV Builder.
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={() => {
                            createForm.reset();
                            createForm.clearErrors();
                            setIsCreateOpen(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-95"
                    >
                        <Plus className="size-4" />
                        <span>Tambah Template</span>
                    </Button>
                </div>

                {/* Quick Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                            <LayoutTemplate className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total Template</p>
                            <p className="text-xl font-bold text-neutral-900 dark:text-white">{totalCount}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                            <CheckCircle2 className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Template Aktif</p>
                            <p className="text-xl font-bold text-neutral-900 dark:text-white">{activeCount}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-11 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                            <XCircle className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Nonaktif</p>
                            <p className="text-xl font-bold text-neutral-900 dark:text-white">{inactiveCount}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-11 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                            <Layers className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total Penggunaan</p>
                            <p className="text-xl font-bold text-neutral-900 dark:text-white">{totalCvUsage} CV</p>
                        </div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                        <Input
                            type="text"
                            placeholder="Cari nama atau kategori template..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-10 pl-9 rounded-xl border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Status Filter */}
                        <div className="inline-flex rounded-xl border border-neutral-200 bg-neutral-100 p-1 text-xs font-medium dark:border-neutral-800 dark:bg-neutral-900">
                            <button
                                type="button"
                                onClick={() => setStatusFilter('all')}
                                className={`rounded-lg px-3 py-1.5 transition-all ${
                                    statusFilter === 'all'
                                        ? 'bg-white font-semibold text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white'
                                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
                                }`}
                            >
                                Semua
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('active')}
                                className={`rounded-lg px-3 py-1.5 transition-all ${
                                    statusFilter === 'active'
                                        ? 'bg-white font-semibold text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white'
                                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
                                }`}
                            >
                                Aktif
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('inactive')}
                                className={`rounded-lg px-3 py-1.5 transition-all ${
                                    statusFilter === 'inactive'
                                        ? 'bg-white font-semibold text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white'
                                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
                                }`}
                            >
                                Nonaktif
                            </button>
                        </div>

                        {/* Category Filter */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            aria-label="Filter kategori template"
                            className="h-9 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                        >
                            <option value="all">Semua Kategori</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Templates Grid List */}
                {filteredTemplates.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredTemplates.map((template) => {
                            return (
                                <div
                                    key={template.id}
                                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                                >
                                    {/* Card Header & Badges */}
                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge
                                                    variant="secondary"
                                                    className="rounded-md font-semibold text-[11px] bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                                                >
                                                    {template.category || 'Standar'}
                                                </Badge>

                                                {template.is_active ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                                                        Nonaktif
                                                    </span>
                                                )}
                                            </div>

                                            <span className="text-[11px] text-neutral-400 font-mono">
                                                ID: #{template.id}
                                            </span>
                                        </div>

                                        <h3 className="mt-3 text-lg font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {template.name}
                                        </h3>

                                        {/* File Details Box */}
                                        <div className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50/80 p-3 text-xs dark:border-neutral-800/80 dark:bg-neutral-800/40">
                                            <div className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
                                                <div className="flex items-center gap-2 truncate">
                                                    <FileCode2 className="size-4 shrink-0 text-blue-500" />
                                                    <span className="truncate font-mono text-[11px]">
                                                        {template.file_path ? template.file_path.split('/').pop() : 'Belum ada file'}
                                                    </span>
                                                </div>

                                                {template.file_size_formatted && (
                                                    <span className="ml-2 text-[10px] text-neutral-400 shrink-0">
                                                        {template.file_size_formatted}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-2 flex items-center justify-between pt-2 border-t border-neutral-200/50 dark:border-neutral-700/50 text-[11px]">
                                                {template.file_exists ? (
                                                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                                        <FileCheck2 className="size-3.5" />
                                                        File terhubung
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                                                        <AlertTriangle className="size-3.5" />
                                                        File tidak ditemukan
                                                    </span>
                                                )}

                                                <span className="text-neutral-500 dark:text-neutral-400">
                                                    Digunakan {template.cvs_count} CV
                                                </span>
                                            </div>
                                        </div>

                                        <p className="mt-3 text-[11px] text-neutral-400">
                                            Diperbarui: {template.updated_at}
                                        </p>
                                    </div>

                                    {/* Action Buttons Footer */}
                                    <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/50 p-3 px-5 dark:border-neutral-800/80 dark:bg-neutral-900/60">
                                        <div className="flex items-center gap-2">
                                            {template.file_url ? (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setPreviewTemplate(template)}
                                                    className="h-8 gap-1.5 rounded-lg text-xs"
                                                >
                                                    <Eye className="size-3.5" />
                                                    <span>Preview</span>
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    disabled
                                                    className="h-8 gap-1.5 rounded-lg text-xs opacity-50"
                                                >
                                                    <Eye className="size-3.5" />
                                                    <span>No File</span>
                                                </Button>
                                            )}

                                            {template.file_url && (
                                                <a
                                                    href={template.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex h-8 items-center justify-center rounded-lg border border-neutral-200 px-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                                    title="Buka file di tab baru"
                                                >
                                                    <ExternalLink className="size-3.5" />
                                                </a>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleOpenEdit(template)}
                                                className="h-8 gap-1 rounded-lg text-xs text-neutral-700 hover:bg-neutral-200/60 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                            >
                                                <Edit3 className="size-3.5" />
                                                <span>Edit</span>
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeletingTemplate(template)}
                                                className="h-8 gap-1 rounded-lg text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40"
                                            >
                                                <Trash2 className="size-3.5" />
                                                <span>Hapus</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 p-12 text-center dark:border-neutral-800">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                            <FolderKanban className="size-7" />
                        </div>
                        <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-white">
                            Tidak ada template ditemukan
                        </h3>
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
                            {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                                ? 'Tidak ada template yang cocok dengan kriteria pencarian Anda. Coba reset filter.'
                                : 'Belum ada template CV yang terdaftar. Tambahkan template baru untuk mulai.'}
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            {(searchQuery || categoryFilter !== 'all' || statusFilter !== 'all') && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setCategoryFilter('all');
                                        setStatusFilter('all');
                                    }}
                                    className="rounded-xl text-xs"
                                >
                                    Reset Filter
                                </Button>
                            )}
                            <Button
                                type="button"
                                onClick={() => {
                                    createForm.reset();
                                    createForm.clearErrors();
                                    setIsCreateOpen(true);
                                }}
                                className="rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700"
                            >
                                <Plus className="mr-1.5 size-4" />
                                Tambah Template Pertama
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* ======================================================== */}
            {/* MODAL 1: TAMBAH TEMPLATE                                 */}
            {/* ======================================================== */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-lg rounded-2xl">
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                                <LayoutTemplate className="size-5 text-blue-600" />
                                Tambah Template Baru
                            </DialogTitle>
                            <DialogDescription className="text-xs text-neutral-500">
                                Isi data template dan unggah file layout resume (.html) ke sistem.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-2">
                            {/* Template Name */}
                            <div className="space-y-1.5">
                                <Label htmlFor="create-name" className="text-xs font-semibold">
                                    Nama Template <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="create-name"
                                    type="text"
                                    placeholder="Contoh: Modern Professional ATS"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    className="rounded-xl"
                                    required
                                />
                                {createForm.errors.name && (
                                    <p className="text-xs text-red-500">{createForm.errors.name}</p>
                                )}
                            </div>

                            {/* Category */}
                            <div className="space-y-1.5">
                                <Label htmlFor="create-category" className="text-xs font-semibold">
                                    Kategori
                                </Label>
                                <select
                                    id="create-category"
                                    value={createForm.data.category}
                                    onChange={(e) => createForm.setData('category', e.target.value)}
                                    className="flex h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                                {createForm.errors.category && (
                                    <p className="text-xs text-red-500">{createForm.errors.category}</p>
                                )}
                            </div>

                            {/* File Upload */}
                            <div className="space-y-1.5">
                                <Label htmlFor="create-file" className="text-xs font-semibold">
                                    File Template HTML (.html, .htm) <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/60 p-4 transition-colors hover:border-blue-500 dark:border-neutral-800 dark:bg-neutral-900/60">
                                    <UploadCloud className="size-8 text-neutral-400 mb-2" />
                                    <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                        {createForm.data.template_file ? (
                                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                {createForm.data.template_file.name} ({(createForm.data.template_file.size / 1024).toFixed(1)} KB)
                                            </span>
                                        ) : (
                                            'Pilih atau seret file .html di sini'
                                        )}
                                    </p>
                                    <p className="text-[11px] text-neutral-400 mt-1">Maksimum ukuran file: 5MB</p>
                                    <Input
                                        id="create-file"
                                        type="file"
                                        accept=".html,.htm,.txt"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            createForm.setData('template_file', file);
                                        }}
                                        className="absolute inset-0 size-full opacity-0 cursor-pointer"
                                        required
                                    />
                                </div>
                                {createForm.errors.template_file && (
                                    <p className="text-xs text-red-500">{createForm.errors.template_file}</p>
                                )}
                            </div>

                            {/* Active Switch */}
                            <div className="flex items-center gap-2 pt-2">
                                <Checkbox
                                    id="create-is-active"
                                    checked={createForm.data.is_active}
                                    onCheckedChange={(checked) => createForm.setData('is_active', Boolean(checked))}
                                />
                                <Label htmlFor="create-is-active" className="text-xs font-medium cursor-pointer">
                                    Aktifkan template ini agar dapat dipilih pengguna
                                </Label>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                                className="rounded-xl"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                                className="rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                            >
                                {createForm.processing ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Template'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ======================================================== */}
            {/* MODAL 2: EDIT TEMPLATE                                   */}
            {/* ======================================================== */}
            <Dialog open={Boolean(editingTemplate)} onOpenChange={(open) => !open && setEditingTemplate(null)}>
                <DialogContent className="sm:max-w-lg rounded-2xl">
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                                <Edit3 className="size-5 text-blue-600" />
                                Edit Template: {editingTemplate?.name}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-neutral-500">
                                Perbarui metadata template atau unggah file baru untuk menggantikan file saat ini.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-2">
                            {/* Template Name */}
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-name" className="text-xs font-semibold">
                                    Nama Template <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="edit-name"
                                    type="text"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="rounded-xl"
                                    required
                                />
                                {editForm.errors.name && (
                                    <p className="text-xs text-red-500">{editForm.errors.name}</p>
                                )}
                            </div>

                            {/* Category */}
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-category" className="text-xs font-semibold">
                                    Kategori
                                </Label>
                                <select
                                    id="edit-category"
                                    value={editForm.data.category}
                                    onChange={(e) => editForm.setData('category', e.target.value)}
                                    className="flex h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                                {editForm.errors.category && (
                                    <p className="text-xs text-red-500">{editForm.errors.category}</p>
                                )}
                            </div>

                            {/* Current File Info */}
                            {editingTemplate?.file_path && (
                                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs dark:border-neutral-800 dark:bg-neutral-900">
                                    <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                                        File Template Saat Ini:
                                    </p>
                                    <div className="mt-1 flex items-center justify-between font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                                        <span className="truncate">{editingTemplate.file_path}</span>
                                        {editingTemplate.file_size_formatted && (
                                            <span className="ml-2 shrink-0">{editingTemplate.file_size_formatted}</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* File Upload (Optional on Edit) */}
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-file" className="text-xs font-semibold">
                                    Ganti File Template (Opsional)
                                </Label>
                                <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/60 p-4 transition-colors hover:border-blue-500 dark:border-neutral-800 dark:bg-neutral-900/60">
                                    <UploadCloud className="size-8 text-neutral-400 mb-2" />
                                    <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                        {editForm.data.template_file ? (
                                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                {editForm.data.template_file.name} ({(editForm.data.template_file.size / 1024).toFixed(1)} KB)
                                            </span>
                                        ) : (
                                            'Pilih file baru jika ingin mengganti file lama'
                                        )}
                                    </p>
                                    <p className="text-[11px] text-neutral-400 mt-1">Format .html atau .htm (Maks 5MB)</p>
                                    <Input
                                        id="edit-file"
                                        type="file"
                                        accept=".html,.htm,.txt"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            editForm.setData('template_file', file);
                                        }}
                                        className="absolute inset-0 size-full opacity-0 cursor-pointer"
                                    />
                                </div>
                                {editForm.errors.template_file && (
                                    <p className="text-xs text-red-500">{editForm.errors.template_file}</p>
                                )}
                            </div>

                            {/* Active Switch */}
                            <div className="flex items-center gap-2 pt-2">
                                <Checkbox
                                    id="edit-is-active"
                                    checked={editForm.data.is_active}
                                    onCheckedChange={(checked) => editForm.setData('is_active', Boolean(checked))}
                                />
                                <Label htmlFor="edit-is-active" className="text-xs font-medium cursor-pointer">
                                    Status Aktif (Ditampilkan pada pilihan template CV)
                                </Label>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingTemplate(null)}
                                className="rounded-xl"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                                className="rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                            >
                                {editForm.processing ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Perubahan'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ======================================================== */}
            {/* MODAL 3: HAPUS TEMPLATE KONFIRMASI                       */}
            {/* ======================================================== */}
            <Dialog open={Boolean(deletingTemplate)} onOpenChange={(open) => !open && setDeletingTemplate(null)}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="size-5" />
                            Konfirmasi Hapus Template
                        </DialogTitle>
                        <DialogDescription className="text-neutral-600 dark:text-neutral-400">
                            Apakah Anda yakin ingin menghapus template{' '}
                            <span className="font-semibold text-neutral-900 dark:text-white">
                                "{deletingTemplate?.name}"
                            </span>
                            ? File template terkait juga akan dihapus dari server.
                        </DialogDescription>
                    </DialogHeader>

                    {deletingTemplate && deletingTemplate.cvs_count > 0 && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
                            <p className="font-semibold">Perhatian:</p>
                            <p className="mt-0.5">
                                Template ini sedang digunakan oleh {deletingTemplate.cvs_count} CV pengguna. Menghapus template ini akan mengosongkan template pada CV terkait.
                            </p>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingTemplate(null)}
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
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                'Ya, Hapus Template'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ======================================================== */}
            {/* MODAL 4: PREVIEW TEMPLATE HTML                          */}
            {/* ======================================================== */}
            <Dialog open={Boolean(previewTemplate)} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
                <DialogContent className="max-w-4xl h-[85vh] p-0 flex flex-col rounded-2xl overflow-hidden">
                    <DialogHeader className="p-4 px-6 border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 flex flex-row items-center justify-between">
                        <div>
                            <DialogTitle className="text-base font-bold flex items-center gap-2">
                                <Eye className="size-4 text-blue-600" />
                                Pratinjau Template: {previewTemplate?.name}
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                                Kategori: {previewTemplate?.category} • File: {previewTemplate?.file_path}
                            </DialogDescription>
                        </div>

                        {previewTemplate?.file_url && (
                            <a
                                href={previewTemplate.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mr-6 inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                            >
                                <ExternalLink className="size-3.5" />
                                <span>Buka Penuh</span>
                            </a>
                        )}
                    </DialogHeader>

                    <div className="flex-1 w-full bg-neutral-100 dark:bg-neutral-950 p-2 sm:p-4 overflow-hidden">
                        {previewTemplate?.file_url ? (
                            <iframe
                                src={previewTemplate.file_url}
                                title={previewTemplate.name}
                                className="size-full rounded-xl border border-neutral-300 bg-white shadow-inner dark:border-neutral-800"
                            />
                        ) : (
                            <div className="flex size-full items-center justify-center text-xs text-neutral-500">
                                File template tidak tersedia untuk dipratinjau.
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

TemplatesIndexPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Template',
            href: '/templates',
        },
    ],
};
