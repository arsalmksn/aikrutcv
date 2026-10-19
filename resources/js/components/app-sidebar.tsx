import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Bot,
    FileText,
    HelpCircle,
    LayoutGrid,
    LayoutTemplate,
    ShieldCheck,
    User,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const userNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'CV Saya',
        href: '/cv',
        icon: FileText,
    },
    {
        title: 'Template CV',
        href: '/cv/templates',
        icon: LayoutTemplate,
    },
    {
        title: 'Profil',
        href: '/profile',
        icon: User,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Pengguna',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Kelola Template',
        href: '/templates',
        icon: LayoutTemplate,
    },
    {
        title: 'Pengaturan AI',
        href: '/admin/ai-settings',
        icon: Bot,
    },
];

export function AppSidebar() {
    const page = usePage();
    const user = page.props.auth?.user;
    const currentUrl = page.url;
    const isAdminRoute = currentUrl.startsWith('/admin') || currentUrl.startsWith('/templates');
    const [showHelpDialog, setShowHelpDialog] = useState(false);

    return (
        <>
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href={isAdminRoute ? '/admin/dashboard' : dashboard()} prefetch>
                                    <AppLogo />
                                    {isAdminRoute && (
                                        <span className="ml-auto rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-amber-600 uppercase dark:bg-amber-400/10 dark:text-amber-400">
                                            Admin
                                        </span>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    {isAdminRoute ? (
                        <NavMain items={adminNavItems} label="Admin Area" />
                    ) : (
                        <>
                            <NavMain items={userNavItems} />
                            <div className="my-2 mx-4 border-t border-sidebar-border/40" />
                            <SidebarGroup className="px-2 py-0">
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            onClick={() => setShowHelpDialog(true)}
                                            className="rounded-xl px-3 py-2 text-sm text-slate-600 transition-all hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-neutral-800 dark:hover:text-slate-200"
                                            tooltip={{ children: 'Pusat Bantuan & Panduan' }}
                                        >
                                            <HelpCircle className="size-4 text-slate-500" />
                                            <span>Pusat Bantuan</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroup>

                            {user?.role === 'admin' && (
                                <SidebarGroup className="mt-2 px-2 py-0">
                                    <SidebarGroupLabel>Administrator</SidebarGroupLabel>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                asChild
                                                className="bg-amber-500/10 font-medium text-amber-700 hover:bg-amber-500/15 hover:text-amber-800 dark:bg-amber-400/10 dark:text-amber-400 dark:hover:bg-amber-400/15"
                                                tooltip={{ children: 'Masuk Panel Admin' }}
                                            >
                                                <Link href="/admin/dashboard" prefetch>
                                                    <ShieldCheck className="size-4 text-amber-600 dark:text-amber-400" />
                                                    <span>Panel Admin</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroup>
                            )}
                        </>
                    )}
                </SidebarContent>

                <SidebarFooter className="border-t border-sidebar-border/40 px-3 py-2">
                    <div className="px-2 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Akun
                    </div>
                    <NavUser />
                </SidebarFooter>
            </Sidebar>

            {/* Pusat Bantuan Modal Dialog */}
            <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
                <DialogContent className="max-w-md rounded-2xl">
                    <DialogHeader>
                        <div className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 mb-2">
                            <HelpCircle className="size-6" />
                        </div>
                        <DialogTitle className="text-lg font-bold text-slate-900">
                            Pusat Bantuan Aikrut CV
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Panduan singkat untuk menyusun dan mengunduh CV profesional berstandar ATS.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3.5 pt-2 text-xs leading-relaxed text-slate-600">
                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                            <h4 className="font-semibold text-slate-800">1. Bagaimana cara membuat CV baru?</h4>
                            <p className="mt-1 text-slate-500">
                                Klik tombol <strong>+ Buat CV baru</strong> di Dashboard atau menu <strong>Template CV</strong> untuk memilih desain yang diinginkan.
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                            <h4 className="font-semibold text-slate-800">2. Apakah CV ramah sistem ATS?</h4>
                            <p className="mt-1 text-slate-500">
                                Ya, seluruh template kami dirancang secara struktural agar mudah dibaca dan diindeks oleh sistem Applicant Tracking System (ATS).
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                            <h4 className="font-semibold text-slate-800">3. Cara mengunduh PDF CV?</h4>
                            <p className="mt-1 text-slate-500">
                                Anda dapat mengunduh PDF kapan saja melalui menu aksi <strong>•••</strong> pada tabel atau langsung di dalam halaman Builder.
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

