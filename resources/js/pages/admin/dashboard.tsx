import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    FileText,
    LayoutTemplate,
    Plus,
    Shield,
    ShieldCheck,
    Sparkles,
    UserCheck,
    Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AdminStats {
    total_users: number;
    total_admins: number;
    total_regular_users: number;
    total_cvs: number;
    total_templates: number;
    total_active_templates: number;
}

interface RecentUser {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface RecentCv {
    id: number;
    title: string;
    user_name: string;
    user_email: string;
    created_at: string;
}

interface AdminDashboardProps {
    stats: AdminStats;
    recentUsers: RecentUser[];
    recentCvs: RecentCv[];
}

export default function AdminDashboard({
    stats,
    recentUsers = [],
    recentCvs = [],
}: AdminDashboardProps) {
    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
                {/* Admin Hero Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl ring-1 ring-white/10 sm:p-8 dark:from-neutral-950 dark:via-indigo-950/60 dark:to-neutral-900">
                    <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div className="max-w-2xl space-y-2.5">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                <span>Panel Kontrol Administrator</span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">
                                Selamat Datang di Dashboard Admin
                            </h1>
                            <p className="text-sm leading-relaxed text-slate-300">
                                Pantau metrik sistem Aikrut CV, kelola akun pengguna, dan konfigurasi template CV secara terpusat.
                            </p>
                        </div>

                        {/* Quick Shortcuts in Hero */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            <Button
                                asChild
                                className="bg-amber-500 font-semibold text-slate-950 shadow-md hover:bg-amber-400"
                                size="sm"
                            >
                                <Link href="/admin/users">
                                    <Users className="mr-1.5 size-4" />
                                    <span>Kelola Pengguna</span>
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                            >
                                <Link href="/templates">
                                    <LayoutTemplate className="mr-1.5 size-4" />
                                    <span>Kelola Template</span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Subtle decorative glow */}
                    <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-amber-500/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-16 left-1/3 size-64 rounded-full bg-indigo-500/10 blur-3xl" />
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Stat: Total Users */}
                    <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-border hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Total Pengguna
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                                <Users className="size-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-bold tracking-tight text-foreground">
                                {stats.total_users.toLocaleString()}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    {stats.total_regular_users}
                                </span>{' '}
                                user biasa terdaftar
                            </p>
                        </div>
                    </div>

                    {/* Stat: Total Admins */}
                    <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-border hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Administrator
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
                                <Shield className="size-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-bold tracking-tight text-foreground">
                                {stats.total_admins.toLocaleString()}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Memiliki akses penuh panel kontrol
                            </p>
                        </div>
                    </div>

                    {/* Stat: Total CVs */}
                    <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-border hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                CV Dibuat
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                                <FileText className="size-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-bold tracking-tight text-foreground">
                                {stats.total_cvs.toLocaleString()}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Dokumen resume aktif di sistem
                            </p>
                        </div>
                    </div>

                    {/* Stat: Templates */}
                    <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-border hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Template CV
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400">
                                <LayoutTemplate className="size-5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-bold tracking-tight text-foreground">
                                {stats.total_templates.toLocaleString()}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                <span className="font-semibold text-purple-600 dark:text-purple-400">
                                    {stats.total_active_templates}
                                </span>{' '}
                                aktif & siap digunakan
                            </p>
                        </div>
                    </div>
                </div>

                {/* Two Column Grid: Recent Users & Recent CVs */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Card 1: Pengguna Baru Bergabung */}
                    <div className="flex flex-col rounded-xl border border-border/80 bg-card shadow-xs">
                        <div className="flex items-center justify-between border-b border-border/70 p-4 sm:px-6">
                            <div className="flex items-center gap-2">
                                <UserCheck className="size-4 text-blue-600 dark:text-blue-400" />
                                <h2 className="text-sm font-semibold text-foreground">
                                    Pengguna Terbaru
                                </h2>
                            </div>
                            <Link
                                href="/admin/users"
                                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                            >
                                <span>Lihat Semua</span>
                                <ArrowRight className="size-3" />
                            </Link>
                        </div>

                        <div className="divide-y divide-border/60">
                            {recentUsers.length === 0 ? (
                                <div className="p-6 text-center text-sm text-muted-foreground">
                                    Belum ada pengguna terdaftar.
                                </div>
                            ) : (
                                recentUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between p-4 transition-colors hover:bg-muted/40 sm:px-6"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary uppercase">
                                                {user.name.slice(0, 2)}
                                            </div>
                                            <div className="truncate">
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate text-xs font-semibold text-foreground sm:text-sm">
                                                        {user.name}
                                                    </span>
                                                    <Badge
                                                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                                                        className={
                                                            user.role === 'admin'
                                                                ? 'bg-amber-500/15 text-amber-700 hover:bg-amber-500/20 dark:bg-amber-400/10 dark:text-amber-300 text-[10px]'
                                                                : 'text-[10px]'
                                                        }
                                                    >
                                                        {user.role === 'admin' ? 'Admin' : 'User'}
                                                    </Badge>
                                                </div>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0 pl-2">
                                            <Clock className="size-3" />
                                            <span>{user.created_at}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Card 2: CV Terkini */}
                    <div className="flex flex-col rounded-xl border border-border/80 bg-card shadow-xs">
                        <div className="flex items-center justify-between border-b border-border/70 p-4 sm:px-6">
                            <div className="flex items-center gap-2">
                                <FileText className="size-4 text-emerald-600 dark:text-emerald-400" />
                                <h2 className="text-sm font-semibold text-foreground">
                                    CV Terbaru Dibuat
                                </h2>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                5 Dokumen Terakhir
                            </span>
                        </div>

                        <div className="divide-y divide-border/60">
                            {recentCvs.length === 0 ? (
                                <div className="p-6 text-center text-sm text-muted-foreground">
                                    Belum ada CV yang dibuat oleh pengguna.
                                </div>
                            ) : (
                                recentCvs.map((cv) => (
                                    <div
                                        key={cv.id}
                                        className="flex items-center justify-between p-4 transition-colors hover:bg-muted/40 sm:px-6"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                                                <FileText className="size-4" />
                                            </div>
                                            <div className="truncate">
                                                <div className="truncate text-xs font-semibold text-foreground sm:text-sm">
                                                    {cv.title || 'CV Tanpa Judul'}
                                                </div>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    Oleh: <span className="font-medium text-foreground">{cv.user_name}</span> ({cv.user_email})
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0 pl-2">
                                            <Clock className="size-3" />
                                            <span>{cv.created_at}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Admin',
            href: '/admin/dashboard',
        },
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
    ],
};
