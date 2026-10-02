import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Settings, ShieldCheck, User as UserIcon } from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const page = usePage();
    const isAdminRoute = page.url.startsWith('/admin') || page.url.startsWith('/templates');
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                {user.role === 'admin' && (
                    isAdminRoute ? (
                        <DropdownMenuItem asChild>
                            <Link
                                className="block w-full cursor-pointer text-blue-600 dark:text-blue-400 font-medium"
                                href="/dashboard"
                                prefetch
                                onClick={cleanup}
                            >
                                <UserIcon className="mr-2 inline size-4" />
                                Beralih ke Tampilan User
                            </Link>
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem asChild>
                            <Link
                                className="block w-full cursor-pointer text-amber-600 dark:text-amber-400 font-medium"
                                href="/admin/dashboard"
                                prefetch
                                onClick={cleanup}
                            >
                                <ShieldCheck className="mr-2 inline size-4" />
                                Panel Admin
                            </Link>
                        </DropdownMenuItem>
                    )
                )}
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
