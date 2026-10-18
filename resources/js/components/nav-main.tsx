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
    label = 'Platform',
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
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={checkIsActive(item.href)}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
