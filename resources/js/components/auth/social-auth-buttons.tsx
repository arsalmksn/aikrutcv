import { redirect } from '@/routes/auth/google';

interface SocialAuthButtonsProps {
    mode?: 'login' | 'register';
}

export default function SocialAuthButtons({
    mode = 'register',
}: SocialAuthButtonsProps) {
    const isLogin = mode === 'login';
    const googleRedirectUrl = redirect.url();

    return (
        <div className="space-y-4">
            {/* Google Primary Button */}
            <a
                href={googleRedirectUrl}
                className="group relative flex h-11 sm:h-12 w-full items-center justify-center gap-3 rounded-xl border border-neutral-200/90 bg-white px-4 text-xs sm:text-sm font-semibold text-neutral-700 shadow-xs transition-all hover:border-neutral-300 hover:bg-neutral-50/80 hover:text-neutral-900 hover:shadow-sm active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/20"
                data-test="google-auth-button"
            >
                <svg
                    className="size-5 shrink-0 transition-transform group-hover:scale-105"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                </svg>
                <span>
                    {isLogin ? 'Continue with Google' : 'Sign up with Google'}
                </span>
            </a>

            {/* Divider */}
            <div className="relative flex items-center py-2">
                <div className="grow border-t border-neutral-200" />
                <span className="shrink-0 px-3 text-xs font-medium text-neutral-400">
                    {isLogin ? 'or continue with email' : 'or register with email'}
                </span>
                <div className="grow border-t border-neutral-200" />
            </div>
        </div>
    );
}

