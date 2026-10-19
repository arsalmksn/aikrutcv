import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { toUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function NavMain({
    items,
    label,
}: {
    items: NavItem[];
    label?: string;
}) {
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
        <SidebarGroup className="px-2 py-0">
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarMenu className="gap-1.5">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={checkIsActive(item.href)}
                            tooltip={{ children: item.title }}
                            className="rounded-xl px-3 py-2 text-sm text-slate-600 transition-all hover:bg-slate-100/80 hover:text-slate-900 data-[active=true]:bg-sky-50 data-[active=true]:font-medium data-[active=true]:text-sky-800 dark:text-slate-400 dark:hover:bg-neutral-800 dark:hover:text-slate-200 dark:data-[active=true]:bg-sky-950/60 dark:data-[active=true]:text-sky-200"
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon className="size-4" />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
