import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function getCsrfToken(): string {
    if (typeof document === 'undefined') return '';
    const metaTag = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');
    if (metaTag) return metaTag;

    const match = document.cookie.match(
        new RegExp('(^|;\\s*)XSRF-TOKEN=([^;]+)'),
    );
    return match ? decodeURIComponent(match[2]) : '';
}
