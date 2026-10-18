import { Link, usePage } from '@inertiajs/react';
import { ShieldCheck, User } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const page = usePage();
    const user = page.props.auth?.user;
    const isAdminRoute = page.url.startsWith('/admin') || page.url.startsWith('/templates');

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {user?.role === 'admin' && (
                <div className="flex items-center gap-2">
                    {isAdminRoute ? (
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border-border/80 shadow-xs"
                        >
                            <Link href="/dashboard" prefetch>
                                <User className="size-3.5 text-blue-500" />
                                <span>Beralih ke User</span>
                            </Link>
                        </Button>
                    ) : (
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 shadow-xs"
                        >
                            <Link href="/admin/dashboard" prefetch>
                                <ShieldCheck className="size-3.5 text-amber-600 dark:text-amber-400" />
                                <span>Panel Admin</span>
                            </Link>
                        </Button>
                    )}
                </div>
            )}
        </header>
    );
}
