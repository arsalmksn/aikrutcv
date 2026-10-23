import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import AuthShowcase from '@/components/auth/auth-showcase';
import { home, login, register } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    const page = usePage();
    const url = page.url || '';
    const isAdminLogin = Boolean(
        (page.props as { isAdminLogin?: boolean }).isAdminLogin ??
            url.includes('/admin'),
    );

    const isRegister = url.startsWith('/register');
    const isLogin = url.startsWith('/login') || url === '/';
    const isForgotPassword = url.startsWith('/forgot-password');
    const isResetPassword = url.startsWith('/reset-password');

    // Title resolution
    let resolvedTitle = title;
    if (!resolvedTitle) {
        if (isAdminLogin) {
            resolvedTitle = 'Admin Console';
        } else if (isRegister) {
            resolvedTitle = 'Create Account';
        } else if (isForgotPassword) {
            resolvedTitle = 'Reset Password';
        } else if (isResetPassword) {
            resolvedTitle = 'Set New Password';
        } else {
            resolvedTitle = 'Sign In';
        }
    }

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-[#FAF8F5] p-3 sm:p-6 lg:p-8 select-none">
            {/* Ambient Decorative Shapes */}
            {/* Top-Right Golden Amber Blob */}
            <div className="pointer-events-none absolute -top-16 -right-16 size-72 sm:size-[400px] rounded-full bg-[#FFD56B] opacity-80 blur-2xl" />

            {/* Bottom-Left Golden Amber Blob */}
            <div className="pointer-events-none absolute -bottom-20 -left-20 size-72 sm:size-[420px] rounded-full bg-[#FFD56B] opacity-75 blur-2xl" />

            {/* Subtle Purple Curves Background */}
            <svg
                className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
                viewBox="0 0 1440 900"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M-50 620 C 320 720, 680 420, 1490 560"
                    stroke="#8B5CF6"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                />
                <path
                    d="M1250 820 C 1330 860, 1400 830, 1460 790"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                />
            </svg>

            {/* Main Center Floating Card */}
            <main className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[28px] sm:rounded-[32px] border border-neutral-200/80 bg-white shadow-[0_25px_65px_-15px_rgba(0,0,0,0.08),0_0_1px_1px_rgba(0,0,0,0.02)]">
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px]">
                    {/* Left Column: Visual Showcase (Mockup Presentation) */}
                    <div className="hidden lg:col-span-5 lg:block bg-gradient-to-b from-[#FBFBFE] via-[#F8F8FC] to-[#F3F3FA] border-r border-neutral-100">
                        <AuthShowcase />
                    </div>

                    {/* Mobile Header (Shown on small screens only) */}
                    <div className="flex items-center justify-between border-b border-neutral-100 bg-[#FBFBFE] px-6 py-4 lg:hidden">
                        <Link href={home()} className="flex items-center gap-1.5">
                            <span className="text-xl font-extrabold tracking-tight text-neutral-900">
                                Aikrut
                            </span>
                            <span className="text-xs font-semibold text-violet-600">
                                cvbuilder
                            </span>
                        </Link>
                        <span className="text-xs font-medium text-neutral-500">
                            Smart Resume Platform
                        </span>
                    </div>

                    {/* Right Column: Form Panel */}
                    <div className="col-span-1 lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white">
                        {/* Top Bar inside Form Panel */}
                        <div className="flex items-center justify-end pb-4">
                            {isAdminLogin ? (
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800">
                                    <ShieldCheck className="size-3.5 text-amber-600" />
                                    <span>Administrator Portal</span>
                                </div>
                            ) : isRegister ? (
                                <div className="text-xs sm:text-sm font-medium text-neutral-500">
                                    Already have an account?{' '}
                                    <Link
                                        href={login()}
                                        className="inline-flex items-center gap-1 font-bold text-neutral-900 hover:text-violet-600 transition-colors ml-1"
                                    >
                                        <span>Sign In</span>
                                        <ArrowRight className="size-3.5" />
                                    </Link>
                                </div>
                            ) : isLogin ? (
                                <div className="text-xs sm:text-sm font-medium text-neutral-500">
                                    Don't have an account?{' '}
                                    <Link
                                        href={register()}
                                        className="inline-flex items-center gap-1 font-bold text-neutral-900 hover:text-violet-600 transition-colors ml-1"
                                    >
                                        <span>Sign Up</span>
                                        <ArrowRight className="size-3.5" />
                                    </Link>
                                </div>
                            ) : (
                                <div className="text-xs sm:text-sm font-medium text-neutral-500">
                                    Remember your password?{' '}
                                    <Link
                                        href={login()}
                                        className="inline-flex items-center gap-1 font-bold text-neutral-900 hover:text-violet-600 transition-colors ml-1"
                                    >
                                        <span>Sign In</span>
                                        <ArrowRight className="size-3.5" />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Title and Body */}
                        <div className="my-auto py-2">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                                    {resolvedTitle}
                                </h2>
                                {description && (
                                    <p className="mt-1.5 text-xs sm:text-sm text-neutral-500">
                                        {description}
                                    </p>
                                )}
                            </div>

                            {/* Form Children Content */}
                            {children}
                        </div>

                        {/* Subtle Minimal Footer Info */}
                        <div className="pt-6 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                            <span>© {new Date().getFullYear()} Aikrut CV. All rights reserved.</span>
                            <span className="hidden sm:inline">Crafted for career growth</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
