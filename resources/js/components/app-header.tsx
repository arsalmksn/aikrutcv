import { Link, usePage } from '@inertiajs/react';
import {
    LogOut,
    Menu,
    Settings,
    ShieldCheck,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn, toUrl } from '@/lib/utils';
import { dashboard, logout } from '@/routes';
import type { BreadcrumbItem, NavItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Daftar CV',
        href: '/cv',
    },
    {
        title: 'Template CV',
        href: '/cv/templates',
    },
    {
        title: 'Profil Saya',
        href: '/profile',
    },
];

const activeItemStyles =
    'bg-primary/10 text-primary font-semibold dark:bg-primary/20 dark:text-primary';

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage();
    const { auth } = page.props;
    const getInitials = useInitials();
    const { currentUrl, isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();

    const checkIsActive = (href: NonNullable<NavItem['href']>) => {
        const path = toUrl(href);
        const dashboardUrl = toUrl(dashboard());
        if (path === '/dashboard' || path === dashboardUrl) {
            return isCurrentUrl(path);
        }
        if (path === '/cv') {
            return (
                currentUrl === '/cv' ||
                (currentUrl.startsWith('/cv/') &&
                    !currentUrl.startsWith('/cv/templates') &&
                    !currentUrl.startsWith('/cv/options'))
            );
        }
        if (path === '/cv/templates') {
            return currentUrl.startsWith('/cv/templates');
        }
        return isCurrentOrParentUrl(path);
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-sidebar-border/80 bg-background/80 backdrop-blur-md transition-colors">
            <div className="mx-auto flex h-16 items-center px-4 sm:px-6 md:max-w-7xl">
                {/* Mobile Menu Button */}
                <div className="lg:hidden mr-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9"
                                aria-label="Buka menu navigasi"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="flex h-full w-72 flex-col justify-between bg-sidebar p-5"
                        >
                            <div>
                                <SheetTitle className="sr-only">
                                    Menu Navigasi Pengguna
                                </SheetTitle>
                                <SheetHeader className="flex flex-row items-center gap-3 border-b border-sidebar-border/70 pb-4 text-left">
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                                        <AppLogoIcon className="size-4.5 fill-current" />
                                    </div>
                                    <span className="font-bold text-base tracking-tight text-foreground">
                                        Aikrut CV
                                    </span>
                                </SheetHeader>

                                {/* Nav items */}
                                <div className="mt-5 flex flex-col space-y-1">
                                    {mainNavItems.map((item) => {
                                        const isActive = checkIsActive(item.href);
                                        return (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                className={cn(
                                                    'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                                    isActive
                                                        ? 'bg-primary/10 text-primary font-semibold dark:bg-primary/20'
                                                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                                )}
                                            >
                                                <span>{item.title}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Mobile Drawer Footer: Admin Shortcut & Profile */}
                            <div className="space-y-4 border-t border-sidebar-border/70 pt-4">
                                {auth.user?.role === 'admin' && (
                                    <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-3 dark:border-amber-400/20 dark:bg-amber-400/10">
                                        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                                            Akses Administrator
                                        </div>
                                        <p className="mt-0.5 text-xs text-amber-700/80 dark:text-amber-400/80">
                                            Kelola user, template, dan sistem AI.
                                        </p>
                                        <Link
                                            href="/admin/dashboard"
                                            prefetch
                                            className="mt-2.5 flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-amber-700 active:scale-95"
                                        >
                                            <ShieldCheck className="size-4" />
                                            <span>Masuk Panel Admin</span>
                                        </Link>
                                    </div>
                                )}

                                {auth.user && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <Avatar className="size-8">
                                                <AvatarImage
                                                    src={auth.user?.avatar}
                                                    alt={auth.user?.name}
                                                />
                                                <AvatarFallback className="text-xs bg-muted">
                                                    {getInitials(auth.user?.name ?? '')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate text-xs font-semibold text-foreground">
                                                    {auth.user?.name}
                                                </div>
                                                <div className="truncate text-[11px] text-muted-foreground">
                                                    {auth.user?.email}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Link
                                                href="/settings/profile"
                                                className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                                                title="Settings"
                                            >
                                                <Settings className="size-4" />
                                            </Link>
                                            <Link
                                                href={logout()}
                                                as="button"
                                                method="post"
                                                className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                                                title="Keluar"
                                            >
                                                <LogOut className="size-4" />
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Brand Logo */}
                <Link
                    href={dashboard()}
                    prefetch
                    className="flex items-center gap-2 focus:outline-none"
                >
                    <AppLogo />
                </Link>

                {/* Desktop Navigation Menu (clean text, no icons) */}
                <div className="ml-8 hidden h-full items-center lg:flex">
                    <NavigationMenu className="flex h-full items-stretch">
                        <NavigationMenuList className="flex h-full items-stretch space-x-1">
                            {mainNavItems.map((item) => {
                                const isActive = checkIsActive(item.href);
                                return (
                                    <NavigationMenuItem
                                        key={item.title}
                                        className="relative flex h-full items-center"
                                    >
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                isActive && activeItemStyles,
                                                'h-9 cursor-pointer px-3.5 text-sm font-medium transition-colors'
                                            )}
                                        >
                                            {item.title}
                                        </Link>
                                        {isActive && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-primary" />
                                        )}
                                    </NavigationMenuItem>
                                );
                            })}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Right actions: Admin Panel Switcher & User Profile */}
                <div className="ml-auto flex items-center gap-2.5">
                    {/* Admin Switcher Badge/Button */}
                    {auth.user?.role === 'admin' && (
                        <Link
                            href="/admin/dashboard"
                            prefetch
                            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-500/20 hover:text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400 dark:hover:bg-amber-400/20 shadow-xs"
                            title="Beralih ke Panel Administrator"
                        >
                            <ShieldCheck className="size-3.5 text-amber-600 dark:text-amber-400" />
                            <span className="hidden sm:inline">Panel Admin</span>
                        </Link>
                    )}

                    {/* User Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="size-9 rounded-full p-0.5 focus-visible:ring-2 focus-visible:ring-primary"
                                aria-label="Menu akun pengguna"
                            >
                                <Avatar className="size-8 overflow-hidden rounded-full">
                                    <AvatarImage
                                        src={auth.user?.avatar}
                                        alt={auth.user?.name}
                                    />
                                    <AvatarFallback className="rounded-full bg-neutral-200 text-xs font-semibold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                                        {getInitials(auth.user?.name ?? '')}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            {auth.user && (
                                <UserMenuContent user={auth.user} />
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Breadcrumbs Sub-bar if more than 1 item */}
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-t border-sidebar-border/60 bg-muted/30">
                    <div className="mx-auto flex h-10 w-full items-center justify-start px-4 sm:px-6 text-xs text-muted-foreground md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </header>
    );
}
