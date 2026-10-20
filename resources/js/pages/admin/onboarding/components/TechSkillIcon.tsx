import React from 'react';
import { Code } from 'lucide-react';

interface TechSkillIconProps {
    name: string;
    className?: string;
}

export function TechSkillIcon({ name, className = 'size-5' }: TechSkillIconProps) {
    const normalized = name.toLowerCase().trim();

    // React
    if (normalized.includes('react')) {
        return (
            <svg viewBox="0 0 24 24" fill="none" className={className}>
                <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#00D8FE" strokeWidth="1.5" transform="rotate(0 12 12)" />
                <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#00D8FE" strokeWidth="1.5" transform="rotate(60 12 12)" />
                <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#00D8FE" strokeWidth="1.5" transform="rotate(120 12 12)" />
                <circle cx="12" cy="12" r="1.5" fill="#00D8FE" />
            </svg>
        );
    }

    // Next.js
    if (normalized.includes('next')) {
        return (
            <svg viewBox="0 0 24 24" fill="currentColor" className={`${className} text-neutral-900 dark:text-neutral-100`}>
                <circle cx="12" cy="12" r="10" fill="currentColor" />
                <path d="M9 8v8h1.8v-4.5L14.7 16h1.5V8h-1.8v4.5L10.5 8H9z" fill="#ffffff" />
            </svg>
        );
    }

    // Vue.js
    if (normalized.includes('vue')) {
        return (
            <svg viewBox="0 0 24 24" fill="none" className={className}>
                <path d="M2 3h4l6 10.5L18 3h4L12 21 2 3z" fill="#41B883" />
                <path d="M6 3h3.5L12 7.5 14.5 3H18L12 13.5 6 3z" fill="#35495E" />
            </svg>
        );
    }

    // Angular
    if (normalized.includes('angular')) {
        return (
            <svg viewBox="0 0 24 24" fill="none" className={className}>
                <path d="M12 2L2 5.5l1.5 12.5L12 22l8.5-4L22 5.5 12 2z" fill="#DD0031" />
                <path d="M12 4.5l6.5 11.5h-2.5l-1.3-3.2h-5.4L8 16H5.5L12 4.5zm1.8 6.5L12 7.2l-1.8 3.8h3.6z" fill="#FFFFFF" />
            </svg>
        );
    }

    // TypeScript
    if (normalized.includes('typescript') || normalized === 'ts') {
        return (
            <svg viewBox="0 0 24 24" fill="none" className={className}>
                <rect width="24" height="24" rx="4" fill="#3178C6" />
                <path d="M5 8h6v2H9v7H7v-7H5V8zm7.5 5.5c0-1.8 1.4-2.5 3.3-2.5 1.5 0 2.7.5 3.2 1l-1 1.4c-.4-.4-1.2-.7-2.1-.7-1 0-1.6.4-1.6 1 0 .7.6.9 1.8 1.3 2 .6 3 1.3 3 2.8 0 1.9-1.5 2.6-3.5 2.6-1.7 0-3-.6-3.6-1.2l1.1-1.4c.5.5 1.4.9 2.5.9 1 0 1.7-.4 1.7-1 0-.7-.6-1-1.9-1.4-2-.6-2.9-1.4-2.9-2.8z" fill="#FFFFFF" />
            </svg>
        );
    }

    // JavaScript
    if (normalized.includes('javascript') || normalized === 'js') {
        return (
            <svg viewBox="0 0 24 24" fill="none" className={className}>
                <rect width="24" height="24" rx="4" fill="#F7DF1E" />
                <path d="M8 11.5v5c0 1.5-.8 2.2-2.2 2.2-.8 0-1.5-.2-1.8-.5l.4-1.4c.3.2.7.3 1.1.3.6 0 1-.3 1-1v-4.6H8zm4.5 4.7c.5.3 1.3.5 2 .5 1.1 0 1.8-.5 1.8-1.3 0-.8-.7-1.1-1.8-1.5-1.5-.6-2.5-1.3-2.5-2.5 0-1.4 1.1-2.4 2.8-2.4 1 0 1.8.3 2.3.6l-.5 1.4c-.4-.3-1-.5-1.8-.5-1 0-1.5.5-1.5 1.1 0 .7.6 1 1.7 1.4 1.6.6 2.6 1.3 2.6 2.6 0 1.5-1.2 2.6-3.2 2.6-1.1 0-2-.3-2.6-.7l.7-1.7z" fill="#000000" />
            </svg>
        );
    }

    // Tailwind CSS
    if (normalized.includes('tailwind')) {
        return (
            <svg viewBox="0 0 24 24" fill="none" className={className}>
                <path d="M12 6c-3.3 0-5.3 1.7-6 5 1.3-1.7 3-2.3 5-2 1.2.2 2 1 3 2 1.5 1.6 3.4 3.5 7 3.5 3.3 0 5.3-1.7 6-5-1.3 1.7-3 2.3-5 2-1.2-.2-2-1-3-2-1.5-1.6-3.4-3.5-7-3.5zm-6 6.5c-3.3 0-5.3 1.7-6 5 1.3-1.7 3-2.3 5-2 1.2.2 2 1 3 2 1.5 1.6 3.4 3.5 7 3.5 3.3 0 5.3-1.7 6-5-1.3 1.7-3 2.3-5 2-1.2-.2-2-1-3-2-1.5-1.6-3.4-3.5-7-3.5z" fill="#06B6D4" />
            </svg>
        );
    }

    // HTML / CSS
    if (normalized.includes('html') || normalized.includes('css')) {
        return (
            <svg viewBox="0 0 24 24" fill="none" className={className}>
                <path d="M3 2l1.6 18 7.4 2 7.4-2L21 2H3z" fill="#E34F26" />
                <path d="M12 3.8v16.4l5.9-1.6 1.4-14.8H12z" fill="#EF652A" />
                <path d="M7 6.8h10l-.3 3.4h-6.2l.2 2.8h5.7l-.5 5-3.9 1.1-3.9-1.1-.3-3.1h2.2l.1 1.6 1.9.5 1.9-.5.2-2.1H7.4L7 6.8z" fill="#FFFFFF" />
            </svg>
        );
    }

    // SASS
    if (normalized.includes('sass') || normalized.includes('scss')) {
        return (
            <svg viewBox="0 0 24 24" fill="none" className={className}>
                <rect width="24" height="24" rx="4" fill="#CF649A" />
                <path d="M12 4c-4.4 0-8 2.2-8 5 0 2.1 2.1 4 5.3 4.7-.3.5-.7 1.1-1.3 1.8-1.5 1.8-2.5 2.1-3 2.1-.3 0-.5-.1-.7-.3l-1.3 1.5c.6.6 1.3.8 2 .8 1.7 0 3.3-.9 4.8-2.8 1.1-1.4 1.8-2.6 2.3-3.7 2.8-.5 4.9-2.1 4.9-4.1 0-2.8-3.6-5-8-5zm-.2 7.8c-2.8 0-5.1-1.3-5.1-2.8s2.3-2.8 5.1-2.8 5.1 1.3 5.1 2.8-2.3 2.8-5.1 2.8z" fill="#FFFFFF" />
            </svg>
        );
    }

    // Laravel / PHP
    if (normalized.includes('laravel') || normalized.includes('php')) {
        return (
            <svg viewBox="0 0 24 24" fill="none" className={className}>
                <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#FF2D20" />
                <path d="M12 4.5l6.5 3.6v7.3L12 19l-6.5-3.6V8.1L12 4.5z" stroke="#FFFFFF" strokeWidth="1.2" />
            </svg>
        );
    }

    // Python
    if (normalized.includes('python')) {
        return (
            <svg viewBox="0 0 24 24" fill="none" className={className}>
                <path d="M11.8 2c-4.4 0-4.1 1.9-4.1 1.9l.01 2h4.2v.6H5.4S2 6.1 2 10.5c0 4.3 3 4.2 3 4.2h1.8v-2.5c0-2.9 2.5-2.8 2.5-2.8h4.3c2.4 0 2.4-2.4 2.4-2.4V4.4s.3-2.4-4.2-2.4zm-2.4 1.5c.5 0 .9.4.9.9 0 .5-.4.9-.9.9-.5 0-.9-.4-.9-.9 0-.5.4-.9.9-.9z" fill="#3776AB" />
                <path d="M12.2 22c4.4 0 4.1-1.9 4.1-1.9l-.01-2h-4.2v-.6h6.5s3.4.4 3.4-4c0-4.3-3-4.2-3-4.2h-1.8v2.5c0 2.9-2.5 2.8-2.5 2.8H10.4c-2.4 0-2.4 2.4-2.4 2.4v2.6s-.3 2.4 4.2 2.4zm2.4-1.5c-.5 0-.9-.4-.9-.9 0-.5.4-.9.9-.9.5 0 .9.4.9.9 0 .5-.4.9-.9.9z" fill="#FFD43B" />
            </svg>
        );
    }

    // Default Tech Badge
    return (
        <div className={`flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-bold text-[10px] ${className}`}>
            <Code className="size-3.5" />
        </div>
    );
}
