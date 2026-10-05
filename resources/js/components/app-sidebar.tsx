import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Bot,
    FileText,
    FolderGit2,
    LayoutGrid,
    LayoutTemplate,
    ShieldCheck,
    User,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
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
        title: 'Profil Saya',
        href: '/profile',
        icon: User,
    },
    {
        title: 'Daftar CV',
        href: '/cv',
        icon: FileText,
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

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const page = usePage();
    const user = page.props.auth?.user;
    const currentUrl = page.url;
    const isAdminRoute = currentUrl.startsWith('/admin') || currentUrl.startsWith('/templates');

    return (
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
                        <NavMain items={userNavItems} label="Menu Utama" />
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

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

