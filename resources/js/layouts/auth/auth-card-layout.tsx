import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
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

    // Title resolution in Indonesian
    let resolvedTitle = title;
    let resolvedDescription = description;

    if (!resolvedTitle) {
        if (isAdminLogin) {
            resolvedTitle = 'Portal Administrator';
            resolvedDescription = resolvedDescription || 'Masukkan kredensial administrator untuk mengelola sistem.';
        } else if (isRegister) {
            resolvedTitle = 'Buat Akun Baru';
            resolvedDescription = resolvedDescription || 'Mulai susun CV ATS profesional impianmu secara gratis.';
        } else if (isForgotPassword) {
            resolvedTitle = 'Atur Ulang Kata Sandi';
            resolvedDescription = resolvedDescription || 'Masukkan email Anda untuk menerima tautan pemulihan kata sandi.';
        } else if (isResetPassword) {
            resolvedTitle = 'Buat Kata Sandi Baru';
            resolvedDescription = resolvedDescription || 'Masukkan kata sandi baru untuk mengamankan akun Anda.';
        } else {
            resolvedTitle = 'Masuk ke Akun Anda';
            resolvedDescription = resolvedDescription || 'Lanjutkan penyusunan CV profesional berstandar ATS Anda.';
        }
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden bg-[#FAF7F2] p-4 sm:p-6 lg:p-8 select-none">
            {/* Ambient Decorative Glowing Blobs (Blur Background) */}
            {/* Top-Right Golden Amber Blob */}
            <div className="pointer-events-none absolute -top-24 -right-24 size-80 sm:size-[460px] rounded-full bg-[#FFC329] opacity-35 blur-3xl" />

            {/* Bottom-Left Purple Violet Blob */}
            <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 sm:size-[460px] rounded-full bg-[#5025D1] opacity-25 blur-3xl" />

            {/* Subtle Purple Curves Background */}
            <svg
                className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
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

            {/* Top Navigation Bar */}
            <header className="relative z-20 mx-auto flex w-full max-w-5xl items-center justify-between pb-4 sm:pb-6">
                {/* Back to Home Link */}
                <Link
                    href={home()}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-600 transition-colors hover:text-[#5025D1]"
                >
                    <ArrowLeft className="size-4" />
                    <span>Kembali ke Beranda</span>
                </Link>

                {/* Center Brand Ribbon */}
                <Link href={home()} className="inline-flex items-center gap-2 group">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-white p-0.5 shadow-xs ring-1 ring-neutral-200/80 transition-transform group-hover:scale-105">
                        <AppLogoIcon className="size-full object-contain" />
                    </div>
                    <span className="text-lg font-black tracking-tight text-[#172554]">
                        Aikrut
                    </span>
                </Link>

                {/* Top-Right Toggle Link */}
                <div className="flex items-center gap-3">
                    {isAdminLogin ? (
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800">
                            <ShieldCheck className="size-3.5 text-amber-600" />
                            <span>Administrator</span>
                        </div>
                    ) : isRegister ? (
                        <div className="text-xs sm:text-sm font-medium text-neutral-500">
                            <span className="hidden sm:inline">Sudah punya akun? </span>
                            <Link
                                href={login()}
                                className="inline-flex items-center gap-1 font-bold text-[#5025D1] transition-colors hover:text-[#401DA8] ml-1"
                            >
                                <span>Masuk</span>
                                <ArrowRight className="size-3.5" />
                            </Link>
                        </div>
                    ) : (
                        <div className="text-xs sm:text-sm font-medium text-neutral-500">
                            <span className="hidden sm:inline">Belum punya akun? </span>
                            <Link
                                href={register()}
                                className="inline-flex items-center gap-1 font-bold text-[#5025D1] transition-colors hover:text-[#401DA8] ml-1"
                            >
                                <span>Daftar</span>
                                <ArrowRight className="size-3.5" />
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Center Floating Card */}
            <main className="relative z-10 mx-auto my-auto w-full max-w-5xl overflow-hidden rounded-[28px] sm:rounded-[32px] border border-white/80 bg-white/95 backdrop-blur-xl shadow-[0_25px_65px_-15px_rgba(80,37,209,0.12),0_0_1px_1px_rgba(0,0,0,0.02)]">
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px]">
                    {/* If Register: Reversed layout (Left: Form Panel, Right: Showcase) */}
                    {isRegister ? (
                        <>
                            {/* Left Column (Col-span-7): Form Panel */}
                            <div className="col-span-1 lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white">
                                <div className="my-auto py-2">
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold tracking-tight text-[#172554] sm:text-3xl">
                                            {resolvedTitle}
                                        </h2>
                                        {resolvedDescription && (
                                            <p className="mt-1.5 text-xs sm:text-sm text-[#64748B]">
                                                {resolvedDescription}
                                            </p>
                                        )}
                                    </div>

                                    {/* Form Children Content */}
                                    {children}
                                </div>

                                {/* Subtle Minimal Footer Info */}
                                <div className="pt-6 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                                    <span>© {new Date().getFullYear()} Aikrut CV. Hak cipta dilindungi.</span>
                                    <span className="hidden sm:inline">AI Resume & ATS Platform</span>
                                </div>
                            </div>

                            {/* Right Column (Col-span-5): Visual Showcase */}
                            <div className="hidden lg:col-span-5 lg:block bg-gradient-to-b from-[#FAF7F2] via-[#F8F6F1] to-[#F1ECE4] border-l border-neutral-200/80">
                                <AuthShowcase />
                            </div>
                        </>
                    ) : (
                        /* If Login or other: Standard layout (Left: Showcase, Right: Form Panel) */
                        <>
                            {/* Left Column (Col-span-5): Visual Showcase */}
                            <div className="hidden lg:col-span-5 lg:block bg-gradient-to-b from-[#FAF7F2] via-[#F8F6F1] to-[#F1ECE4] border-r border-neutral-200/80">
                                <AuthShowcase />
                            </div>

                            {/* Right Column (Col-span-7): Form Panel */}
                            <div className="col-span-1 lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white">
                                <div className="my-auto py-2">
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold tracking-tight text-[#172554] sm:text-3xl">
                                            {resolvedTitle}
                                        </h2>
                                        {resolvedDescription && (
                                            <p className="mt-1.5 text-xs sm:text-sm text-[#64748B]">
                                                {resolvedDescription}
                                            </p>
                                        )}
                                    </div>

                                    {/* Form Children Content */}
                                    {children}
                                </div>

                                {/* Subtle Minimal Footer Info */}
                                <div className="pt-6 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                                    <span>© {new Date().getFullYear()} Aikrut CV. Hak cipta dilindungi.</span>
                                    <span className="hidden sm:inline">AI Resume & ATS Platform</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Bottom Spacer/Footer for full height balance */}
            <footer className="relative z-10 pt-4 text-center text-xs text-neutral-400">
                <span>Solusi Cerdas Membuat Resume ATS Profesional • Didukung Teknologi AI Terdepan</span>
            </footer>
        </div>
    );
}
