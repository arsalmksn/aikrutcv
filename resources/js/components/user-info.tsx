import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-sky-100 dark:border-sky-900/40">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-full bg-sky-50 text-sky-700 text-xs font-semibold dark:bg-sky-950/80 dark:text-sky-300">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-slate-800 dark:text-slate-100">{user.name}</span>
                {showEmail ? (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                ) : (
                    <span className="truncate text-xs text-slate-400 capitalize dark:text-slate-500">
                        {user.role === 'admin' ? 'Administrator' : 'Pengguna'}
                    </span>
                )}
            </div>
        </>
    );
}
