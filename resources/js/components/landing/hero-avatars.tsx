import React from 'react';

/**
 * High-fidelity vector avatar representing the male professional in suit
 * featured in the reference design's front resume card.
 */
export function HeroResumeAvatar({ className = 'size-20' }: { className?: string }) {
    return (
        <div className={`relative overflow-hidden rounded-full bg-[#E0F2FE] shadow-inner ${className}`}>
            <svg viewBox="0 0 100 100" className="size-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background soft circle */}
                <circle cx="50" cy="50" r="50" fill="#E0F2FE" />

                {/* Dark suit jacket shoulders */}
                <path
                    d="M14 96 C16 76 30 70 50 70 C70 70 84 76 86 96 Z"
                    fill="#1A2B4C"
                />

                {/* Suit lapels */}
                <path d="M30 72 L42 96 L22 96 Z" fill="#14213D" />
                <path d="M70 72 L58 96 L78 96 Z" fill="#14213D" />

                {/* White collared shirt */}
                <path d="M40 68 L50 79 L60 68 L55 64 L45 64 Z" fill="#FFFFFF" />

                {/* Dark blue tie */}
                <path d="M47 70 L53 70 L52 74 L48 74 Z" fill="#1E3A8A" />
                <path d="M48 74 L52 74 L54 94 L50 97 L46 94 Z" fill="#2563EB" />

                {/* Neck */}
                <path d="M43 54 H57 V69 H43 Z" fill="#F8C39F" />
                {/* Neck shadow under chin */}
                <path d="M43 54 C46 60 54 60 57 54 V58 C53 62 47 62 43 58 Z" fill="#E6A880" />

                {/* Ears */}
                <circle cx="33" cy="46" r="5" fill="#F8C39F" />
                <circle cx="67" cy="46" r="5" fill="#F8C39F" />

                {/* Head / Face */}
                <ellipse cx="50" cy="45" rx="15" ry="17" fill="#FAD4B2" />

                {/* Eyes */}
                <circle cx="44" cy="44" r="1.8" fill="#1A202C" />
                <circle cx="56" cy="44" r="1.8" fill="#1A202C" />
                <circle cx="44.5" cy="43.5" r="0.6" fill="#FFFFFF" />
                <circle cx="56.5" cy="43.5" r="0.6" fill="#FFFFFF" />

                {/* Eyebrows */}
                <path d="M40 40 Q44 38 47 41" stroke="#1A202C" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M60 40 Q56 38 53 41" stroke="#1A202C" strokeWidth="1.5" strokeLinecap="round" />

                {/* Smile / Mouth */}
                <path d="M44 52 Q50 58 56 52" stroke="#B95C48" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                <path d="M45.5 52.5 Q50 56.5 54.5 52.5 Z" fill="#FFFFFF" />

                {/* Nose */}
                <path d="M50 45 L48.5 49 H51.5" stroke="#E6A880" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                {/* Hair - Stylish professional dark hair */}
                <path
                    d="M32 44 C31 32 37 26 48 25 C58 24 67 29 68 40 C69 44 68 46 67 47 C65 43 64 36 61 34 C55 30 42 30 35 37 C34 38 33 42 32 44 Z"
                    fill="#1A202C"
                />
                <path
                    d="M34 38 C39 28 55 27 65 33 C62 26 53 23 44 24 C36 25 32 30 34 38 Z"
                    fill="#2D3748"
                />
            </svg>
        </div>
    );
}

/**
 * 4 Social proof avatars matching the circular user avatars in the hero.
 */
export function SocialProofAvatar1() {
    return (
        <div className="relative size-8 sm:size-9 rounded-full ring-2 ring-white dark:ring-neutral-900 overflow-hidden bg-[#FEF3C7] shadow-xs shrink-0">
            <svg viewBox="0 0 40 40" className="size-full" fill="none">
                <circle cx="20" cy="20" r="20" fill="#FEF3C7" />
                <path d="M7 40 C8 31 14 27 20 27 C26 27 32 31 33 40 Z" fill="#1E293B" />
                <path d="M17 27 L20 31 L23 27 Z" fill="#FFFFFF" />
                <circle cx="20" cy="18" r="7" fill="#FCD34D" />
                <path d="M13 16 C14 11 17 9 20 9 C23 9 26 11 27 16 C25 13 23 12 20 12 C17 12 15 13 13 16 Z" fill="#1F2937" />
            </svg>
        </div>
    );
}

export function SocialProofAvatar2() {
    return (
        <div className="relative size-8 sm:size-9 rounded-full ring-2 ring-white dark:ring-neutral-900 overflow-hidden bg-[#DBEAFE] shadow-xs shrink-0">
            <svg viewBox="0 0 40 40" className="size-full" fill="none">
                <circle cx="20" cy="20" r="20" fill="#DBEAFE" />
                <path d="M6 40 C7 30 13 26 20 26 C27 26 33 30 34 40 Z" fill="#2563EB" />
                <path d="M16 26 L20 30 L24 26 Z" fill="#93C5FD" />
                <circle cx="20" cy="17" r="7" fill="#FBCFE8" />
                <path d="M13 15 C13 10 16 8 20 8 C24 8 27 10 27 15 C25 12 22 11 20 11 C18 11 15 12 13 15 Z" fill="#374151" />
            </svg>
        </div>
    );
}

export function SocialProofAvatar3() {
    return (
        <div className="relative size-8 sm:size-9 rounded-full ring-2 ring-white dark:ring-neutral-900 overflow-hidden bg-[#E0E7FF] shadow-xs shrink-0">
            <svg viewBox="0 0 40 40" className="size-full" fill="none">
                <circle cx="20" cy="20" r="20" fill="#E0E7FF" />
                <path d="M7 40 C8 31 14 27 20 27 C26 27 32 31 33 40 Z" fill="#4338CA" />
                <circle cx="20" cy="18" r="7" fill="#FDE68A" />
                <path d="M12 17 C13 11 16 9 20 9 C24 9 27 11 28 17 C26 13 23 12 20 12 C17 12 14 13 12 17 Z" fill="#111827" />
            </svg>
        </div>
    );
}

export function SocialProofAvatar4() {
    return (
        <div className="relative size-8 sm:size-9 rounded-full ring-2 ring-white dark:ring-neutral-900 overflow-hidden bg-[#FCE7F3] shadow-xs shrink-0">
            <svg viewBox="0 0 40 40" className="size-full" fill="none">
                <circle cx="20" cy="20" r="20" fill="#FCE7F3" />
                <path d="M6 40 C7 31 13 27 20 27 C27 27 33 31 34 40 Z" fill="#BE185D" />
                <circle cx="20" cy="18" r="7" fill="#FED7AA" />
                {/* Hair for female avatar */}
                <path d="M12 21 C11 13 14 9 20 9 C26 9 29 13 28 21 C27 23 27 25 28 27 C26 25 26 20 26 18 C25 13 23 12 20 12 C17 12 15 13 14 18 C14 20 14 25 12 27 Z" fill="#92400E" />
            </svg>
        </div>
    );
}

