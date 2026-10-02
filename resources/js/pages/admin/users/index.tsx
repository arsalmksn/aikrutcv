import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Check,
    CheckCircle2,
    Eye,
    KeyRound,
    Loader2,
    MoreHorizontal,
    Pencil,
    Plus,
    Search,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Trash2,
    User,
    UserCheck,
    UserPlus,
    Users,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export interface UserItem {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user' | string;
    cvs_count: number;
    created_at: string;
    is_current_user: boolean;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedUsers {
    data: UserItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

interface AdminUsersProps {
    users: PaginatedUsers;
    filters: {
        search: string;
        role: string;
    };
    counts: {
        total: number;
        admins: number;
        users: number;
    };
}

export default function AdminUsersPage({
    users,
    filters,
    counts,
}: AdminUsersProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Dialog state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [resettingUser, setResettingUser] = useState<UserItem | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);

    // Create user form
    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });

    // Edit user form
    const editForm = useForm({
        name: '',
        email: '',
        role: 'user',
    });

    // Reset password form
    const resetPasswordForm = useForm({
        password: '',
        password_confirmation: '',
    });

    // Search & Filter handlers
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/users',
            {
                search: searchQuery,
                role: filters.role !== 'all' ? filters.role : undefined,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleRoleTabChange = (selectedRole: string) => {
        router.get(
            '/admin/users',
            {
                search: searchQuery || undefined,
                role: selectedRole !== 'all' ? selectedRole : undefined,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    // Open Edit modal
    const handleOpenEdit = (user: UserItem) => {
        setEditingUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            role: user.role,
        });
        editForm.clearErrors();
    };

    // Open Reset Password modal
    const handleOpenResetPassword = (user: UserItem) => {
        setResettingUser(user);
        resetPasswordForm.reset();
        resetPasswordForm.clearErrors();
    };

    // Submit Create
    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/users', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
                toast.success('Pengguna baru berhasil ditambahkan');
            },
        });
    };

    // Submit Edit
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        editForm.patch(`/admin/users/${editingUser.id}`, {
            onSuccess: () => {
                setEditingUser(null);
                toast.success('Data akun pengguna berhasil diperbarui');
            },
        });
    };

    // Submit Reset Password
    const handleResetPasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!resettingUser) return;

        resetPasswordForm.patch(`/admin/users/${resettingUser.id}/password`, {
            onSuccess: () => {
                setResettingUser(null);
                resetPasswordForm.reset();
                toast.success('Kata sandi berhasil direset');
            },
        });
    };

    // Submit Delete
    const handleDeleteSubmit = () => {
        if (!deletingUser) return;

        router.delete(`/admin/users/${deletingUser.id}`, {
            onSuccess: () => {
                setDeletingUser(null);
                toast.success('Akun pengguna berhasil dihapus');
            },
        });
    };

    return (
        <>
            <Head title="Kelola Pengguna - Admin" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Kelola Pengguna
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Atur seluruh akun pengguna, kelola hak akses role, reset kata sandi, dan tambahkan admin baru.
                        </p>
                    </div>

                    <Button
                        onClick={() => {
                            createForm.reset();
                            createForm.clearErrors();
                            setIsCreateOpen(true);
                        }}
                        className="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
                    >
                        <UserPlus className="mr-2 size-4" />
                        <span>Tambah Pengguna</span>
                    </Button>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="flex flex-col gap-4 rounded-xl border border-border/80 bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    {/* Role Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => handleRoleTabChange('all')}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                filters.role === 'all' || !filters.role
                                    ? 'bg-primary text-primary-foreground shadow-xs'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            Semua ({counts.total})
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRoleTabChange('user')}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                filters.role === 'user'
                                    ? 'bg-primary text-primary-foreground shadow-xs'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            User Biasa ({counts.users})
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRoleTabChange('admin')}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                filters.role === 'admin'
                                    ? 'bg-amber-600 text-white shadow-xs dark:bg-amber-500'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            Administrator ({counts.admins})
                        </button>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearchSubmit} className="relative flex w-full max-w-sm items-center gap-2">
                        <div className="relative w-full">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari nama atau email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-8"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('');
                                        router.get(
                                            '/admin/users',
                                            {
                                                role: filters.role !== 'all' ? filters.role : undefined,
                                            },
                                            { preserveState: true }
                                        );
                                    }}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="size-3.5" />
                                </button>
                            )}
                        </div>
                        <Button type="submit" size="sm" variant="secondary" className="shrink-0">
                            Cari
                        </Button>
                    </form>
                </div>

                {/* Users Table */}
                <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-border/70 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <tr>
                                    <th className="px-5 py-3.5">Pengguna</th>
                                    <th className="px-5 py-3.5">Hak Akses (Role)</th>
                                    <th className="px-5 py-3.5 text-center">CV Dibuat</th>
                                    <th className="px-5 py-3.5">Terdaftar</th>
                                    <th className="px-5 py-3.5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-sm text-muted-foreground">
                                            Tidak ada data pengguna yang sesuai dengan filter pencarian.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className={`transition-colors hover:bg-muted/30 ${
                                                user.is_current_user ? 'bg-amber-500/5 dark:bg-amber-500/5' : ''
                                            }`}
                                        >
                                            {/* Name & Email */}
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary uppercase">
                                                        {user.name.slice(0, 2)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="truncate font-semibold text-foreground">
                                                                {user.name}
                                                            </span>
                                                            {user.is_current_user && (
                                                                <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400">
                                                                    Anda
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="truncate text-xs text-muted-foreground">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td className="px-5 py-3.5 whitespace-nowrap">
                                                {user.role === 'admin' ? (
                                                    <Badge
                                                        variant="default"
                                                        className="gap-1 bg-amber-500/15 text-amber-700 hover:bg-amber-500/20 dark:bg-amber-400/10 dark:text-amber-300 border-amber-300/30"
                                                    >
                                                        <ShieldCheck className="size-3" />
                                                        <span>Admin</span>
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="gap-1 text-muted-foreground">
                                                        <User className="size-3" />
                                                        <span>User</span>
                                                    </Badge>
                                                )}
                                            </td>

                                            {/* CVs Count */}
                                            <td className="px-5 py-3.5 text-center whitespace-nowrap">
                                                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground">
                                                    {user.cvs_count}
                                                </span>
                                            </td>

                                            {/* Created At */}
                                            <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                                                {user.created_at}
                                            </td>

                                            {/* Action Dropdown */}
                                            <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="size-8">
                                                            <MoreHorizontal className="size-4" />
                                                            <span className="sr-only">Menu aksi</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                                                            Aksi Pengguna
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() => handleOpenEdit(user)}
                                                            className="cursor-pointer"
                                                        >
                                                            <Pencil className="mr-2 size-4 text-blue-500" />
                                                            <span>Edit Profil & Role</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleOpenResetPassword(user)}
                                                            className="cursor-pointer"
                                                        >
                                                            <KeyRound className="mr-2 size-4 text-amber-500" />
                                                            <span>Reset Password</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => setDeletingUser(user)}
                                                            disabled={user.is_current_user}
                                                            className="cursor-pointer text-destructive focus:text-destructive disabled:opacity-50"
                                                        >
                                                            <Trash2 className="mr-2 size-4" />
                                                            <span>
                                                                {user.is_current_user
                                                                    ? 'Akun Anda Sendiri'
                                                                    : 'Hapus Akun'}
                                                            </span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bar */}
                    {users.last_page > 1 && (
                        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/70 p-4 sm:flex-row">
                            <div className="text-xs text-muted-foreground">
                                Menampilkan <span className="font-semibold text-foreground">{users.from || 0}</span> -{' '}
                                <span className="font-semibold text-foreground">{users.to || 0}</span> dari total{' '}
                                <span className="font-semibold text-foreground">{users.total}</span> pengguna
                            </div>

                            <div className="flex flex-wrap items-center gap-1">
                                {users.links.map((link, idx) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="rounded-md px-2.5 py-1 text-xs text-muted-foreground opacity-50"
                                            />
                                        );
                                    }
                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            preserveState
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal: Tambah Pengguna Baru */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tambah Pengguna Baru</DialogTitle>
                        <DialogDescription>
                            Daftarkan akun pengguna atau administrator baru ke dalam sistem Aikrut CV.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="create-name">Nama Lengkap</Label>
                            <Input
                                id="create-name"
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value)}
                                placeholder="Contoh: Ahmad Fauzi"
                                required
                            />
                            {createForm.errors.name && (
                                <p className="text-xs text-destructive">{createForm.errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="create-email">Alamat Email</Label>
                            <Input
                                id="create-email"
                                type="email"
                                value={createForm.data.email}
                                onChange={(e) => createForm.setData('email', e.target.value)}
                                placeholder="email@contoh.com"
                                required
                            />
                            {createForm.errors.email && (
                                <p className="text-xs text-destructive">{createForm.errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="create-password">Kata Sandi Awal</Label>
                            <Input
                                id="create-password"
                                type="password"
                                value={createForm.data.password}
                                onChange={(e) => createForm.setData('password', e.target.value)}
                                placeholder="Minimal 8 karakter"
                                required
                            />
                            {createForm.errors.password && (
                                <p className="text-xs text-destructive">{createForm.errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="create-role">Hak Akses (Role)</Label>
                            <Select
                                value={createForm.data.role}
                                onValueChange={(val) => createForm.setData('role', val)}
                            >
                                <SelectTrigger id="create-role">
                                    <SelectValue placeholder="Pilih hak akses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User Biasa</SelectItem>
                                    <SelectItem value="admin">Administrator</SelectItem>
                                </SelectContent>
                            </Select>
                            {createForm.errors.role && (
                                <p className="text-xs text-destructive">{createForm.errors.role}</p>
                            )}
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing && <Loader2 className="mr-2 size-4 animate-spin" />}
                                Simpan Akun
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal: Edit Pengguna & Role */}
            <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Pengguna</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi akun dan hak akses role untuk {editingUser?.name}.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-name">Nama Lengkap</Label>
                            <Input
                                id="edit-name"
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                                required
                            />
                            {editForm.errors.name && (
                                <p className="text-xs text-destructive">{editForm.errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-email">Alamat Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editForm.data.email}
                                onChange={(e) => editForm.setData('email', e.target.value)}
                                required
                            />
                            {editForm.errors.email && (
                                <p className="text-xs text-destructive">{editForm.errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-role">Hak Akses (Role)</Label>
                            <Select
                                value={editForm.data.role}
                                onValueChange={(val) => editForm.setData('role', val)}
                                disabled={editingUser?.is_current_user}
                            >
                                <SelectTrigger id="edit-role">
                                    <SelectValue placeholder="Pilih hak akses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User Biasa</SelectItem>
                                    <SelectItem value="admin">Administrator</SelectItem>
                                </SelectContent>
                            </Select>
                            {editingUser?.is_current_user && (
                                <p className="text-xs text-muted-foreground">
                                    Anda tidak dapat mengubah hak akses akun Anda sendiri demi keamanan.
                                </p>
                            )}
                            {editForm.errors.role && (
                                <p className="text-xs text-destructive">{editForm.errors.role}</p>
                            )}
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingUser(null)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                {editForm.processing && <Loader2 className="mr-2 size-4 animate-spin" />}
                                Simpan Perubahan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal: Reset Password */}
            <Dialog open={!!resettingUser} onOpenChange={(open) => !open && setResettingUser(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reset Kata Sandi</DialogTitle>
                        <DialogDescription>
                            Atur kata sandi baru untuk pengguna{' '}
                            <span className="font-semibold text-foreground">{resettingUser?.name}</span>.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="reset-pass">Kata Sandi Baru</Label>
                            <Input
                                id="reset-pass"
                                type="password"
                                placeholder="Minimal 8 karakter"
                                value={resetPasswordForm.data.password}
                                onChange={(e) => resetPasswordForm.setData('password', e.target.value)}
                                required
                            />
                            {resetPasswordForm.errors.password && (
                                <p className="text-xs text-destructive">{resetPasswordForm.errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="reset-confirm">Konfirmasi Kata Sandi Baru</Label>
                            <Input
                                id="reset-confirm"
                                type="password"
                                placeholder="Ulangi kata sandi baru"
                                value={resetPasswordForm.data.password_confirmation}
                                onChange={(e) => resetPasswordForm.setData('password_confirmation', e.target.value)}
                                required
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setResettingUser(null)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={resetPasswordForm.processing}>
                                {resetPasswordForm.processing && <Loader2 className="mr-2 size-4 animate-spin" />}
                                Update Kata Sandi
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal: Konfirmasi Hapus Akun */}
            <Dialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <AlertTriangle className="size-5" />
                        </div>
                        <DialogTitle>Hapus Akun Pengguna?</DialogTitle>
                        <DialogDescription className="space-y-2">
                            <span>
                                Tindakan ini akan menghapus akun{' '}
                                <strong className="text-foreground">{deletingUser?.name}</strong> ({deletingUser?.email}) beserta
                                seluruh dokumen CV dan data profil yang terkait secara permanen.
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingUser(null)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDeleteSubmit}
                        >
                            Ya, Hapus Akun
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

AdminUsersPage.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '/admin/dashboard',
        },
        {
            title: 'Pengguna',
            href: '/admin/users',
        },
    ],
};
