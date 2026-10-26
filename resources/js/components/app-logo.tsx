import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white p-0.5 shadow-xs ring-1 ring-neutral-200/80 dark:bg-white dark:ring-neutral-700">
                <AppLogoIcon className="size-full object-contain" />
            </div>
            <div className="ml-1.5 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-bold tracking-tight text-neutral-900 dark:text-white">
                    CV Builder
                </span>
            </div>
        </>
    );
}

