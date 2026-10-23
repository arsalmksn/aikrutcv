import { Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    FileCheck,
    Lock,
    Rocket,
    Shield,
    ShieldCheck,
    Sparkles,
    Zap,
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const page = usePage();
    const url = page.url || '';
    const appName = (page.props.name as string) || 'Aikrut CV';
    const isAdminLogin = Boolean(
        (page.props as { isAdminLogin?: boolean }).isAdminLogin ??
        url.includes('/admin'),
    );

    // Resolve title and description based on context
    const isDefaultLoginTitle =
        !title ||
        title === 'Log in to your account' ||
        title.toLowerCase().includes('log in');

    const resolvedTitle = isDefaultLoginTitle
        ? isAdminLogin
            ? 'Sign in to Admin Console'
            : 'Welcome back'
        : title;

    const resolvedDescription =
        !description ||
        description === 'Enter your email and password below to log in'
            ? isAdminLogin
                ? 'Enter your administrator credentials to access system management.'
                : 'Enter your email and password to access your dashboard.'
            : description;

    return (
        <div className="relative min-h-screen w-full bg-background text-foreground lg:grid lg:grid-cols-12">
            {/* Left Column: Editorial Minimalist Showcase (Desktop only) */}
            <div className="relative hidden flex-col justify-between overflow-hidden border-r border-zinc-800/80 bg-zinc-950 p-10 select-none lg:col-span-5 lg:flex xl:col-span-5 xl:p-14 dark:border-zinc-800">
                {/* Subtle Ambient Background Gradients */}
                <div
                    className={
                        isAdminLogin
                            ? 'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(245,158,11,0.14),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(217,119,6,0.08),transparent_50%)]'
                            : 'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.18),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.12),transparent_50%)]'
                    }
                />

                {/* Top Branding */}
                <div className="relative z-10 flex items-center justify-between">
                    <Link
                        href={home()}
                        className="group inline-flex items-center gap-3 transition-opacity hover:opacity-90"
                    >
                        <div className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 shadow-inner backdrop-blur-md transition-transform group-hover:scale-105">
                            <AppLogoIcon className="size-5 fill-current text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base leading-none font-semibold tracking-tight text-white">
                                {appName}
                            </span>
                            <span className="mt-1 text-[11px] font-medium text-zinc-400">
                                {isAdminLogin
                                    ? 'Internal Console'
                                    : 'Smart Resume Platform'}
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Center Editorial Showcase */}
                <div className="relative z-10 my-auto py-10">
                    {isAdminLogin ? (
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-amber-300 uppercase">
                                <ShieldCheck className="size-3.5 text-amber-400" />
                                <span>Platform Governance</span>
                            </div>

                            <blockquote className="space-y-4">
                                <p className="text-2xl leading-snug font-medium tracking-tight text-zinc-100 xl:text-3xl">
                                    “Precision in administration and vigilance
                                    in security power the foundation of
                                    thousands of professional careers.”
                                </p>
                                <footer className="text-sm font-medium text-zinc-400">
                                    — Aikrut CV Admin Operations Console
                                </footer>
                            </blockquote>

                            <div className="space-y-3.5 border-t border-zinc-800/80 pt-7">
                                <div className="flex items-center gap-3 text-sm text-zinc-300">
                                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
                                        <Shield className="size-3.5" />
                                    </div>
                                    <span>
                                        Granular Role-Based Access Control
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-zinc-300">
                                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
                                        <Zap className="size-3.5" />
                                    </div>
                                    <span>
                                        Real-time AI Model & Quota Management
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-zinc-300">
                                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
                                        <Lock className="size-3.5" />
                                    </div>
                                    <span>
                                        Protected Infrastructure & Audit Logs
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-blue-300 uppercase">
                                <Sparkles className="size-3.5 text-blue-400" />
                                <span>AI-Powered Career Growth</span>
                            </div>

                            <blockquote className="space-y-4">
                                <p className="text-2xl leading-snug font-medium tracking-tight text-zinc-100 xl:text-3xl">
                                    “Your professional journey deserves to be
                                    articulated with absolute precision,
                                    clarity, and confidence.”
                                </p>
                                <footer className="text-sm font-medium text-zinc-400">
                                    — Crafting ATS-Optimized Resumes with Aikrut
                                    AI
                                </footer>
                            </blockquote>

                            <div className="space-y-3.5 border-t border-zinc-800/80 pt-7">
                                <div className="flex items-center gap-3 text-sm text-zinc-300">
                                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400">
                                        <Sparkles className="size-3.5" />
                                    </div>
                                    <span>
                                        AI Bullet Optimizer & Blueprint
                                        Generator
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-zinc-300">
                                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400">
                                        <FileCheck className="size-3.5" />
                                    </div>
                                    <span>
                                        ATS-Standard Layouts & Parsing Guarantee
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-zinc-300">
                                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400">
                                        <Rocket className="size-3.5" />
                                    </div>
                                    <span>
                                        Instant Export to Clean, High-Impact PDF
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Operational Status */}
                <div className="relative z-10 flex items-center justify-between border-t border-zinc-900 pt-6 text-xs text-zinc-400">
                    <span>
                        © {new Date().getFullYear()} {appName}. All rights
                        reserved.
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="inline-block size-2 animate-pulse rounded-full bg-emerald-500" />
                        <span className="font-mono text-zinc-400">Online</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Form Panel (Comfortable, Non-Cramped Width) */}
            <div className="col-span-12 flex min-h-screen flex-col justify-between p-6 sm:p-10 lg:col-span-7 lg:p-12 xl:col-span-7 xl:p-16">
                {/* Top Bar with Corner Navigation */}
                <header className="flex items-center justify-between">
                    {/* Mobile Brand Identity */}
                    <Link
                        href={home()}
                        className="flex items-center gap-2.5 transition-opacity hover:opacity-90 lg:hidden"
                    >
                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <AppLogoIcon className="size-5 fill-current" />
                        </div>
                        <span className="text-base font-semibold text-foreground">
                            {appName}
                        </span>
                    </Link>

                    {/* Desktop Return to Website Link */}
                    <Link
                        href={home()}
                        className="group hidden items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
                    >
                        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
                        <span>Back to Home</span>
                    </Link>

                    {/* Discreet Corner Switcher */}
                    <div className="ml-auto">
                        {isAdminLogin ? (
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                                <ArrowLeft className="size-3.5" />
                                <span>User Login</span>
                            </Link>
                        ) : url.startsWith('/login') ? (
                            <Link
                                href="/admin/login"
                                className="group inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                                <Shield className="size-3.5 text-amber-600 dark:text-amber-400" />
                                <span>Admin Portal</span>
                                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        ) : url.startsWith('/register') ? (
                            <Link
                                href="/login"
                                className="group inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                                <span>Sign in</span>
                                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                                <ArrowLeft className="size-3.5" />
                                <span>Back to Login</span>
                            </Link>
                        )}
                    </div>
                </header>

                {/* Form Wrapper with Spacious Width */}
                <main className="my-auto w-full max-w-md py-8 sm:py-10">
                    {/* Header Area */}
                    <div className="mb-8 space-y-2">
                        {isAdminLogin && (
                            <div className="mb-2 inline-flex items-center gap-1.5 rounded-md border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold tracking-wider text-amber-700 uppercase dark:text-amber-300">
                                <ShieldCheck className="size-3.5 text-amber-600 dark:text-amber-400" />
                                <span>Administrator Portal</span>
                            </div>
                        )}

                        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            {resolvedTitle}
                        </h1>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {resolvedDescription}
                        </p>
                    </div>

                    {/* Page Content */}
                    {children}
                </main>

                {/* Footer Bar */}
                <footer className="w-full max-w-md py-3 text-center text-xs text-muted-foreground/70">
                    <span>
                        Secured with TLS encryption • Protected environment
                    </span>
                </footer>
            </div>
        </div>
    );
}
