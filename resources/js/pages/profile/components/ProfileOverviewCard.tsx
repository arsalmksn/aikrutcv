import React, { useRef, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    Mail,
    MapPin,
    Phone,
    User as UserIcon,
    CheckCircle2,
    Calendar,
    Sparkles,
    FileDown,
    Linkedin,
    UploadCloud,
    Camera,
    Trash2,
    Loader2,
    Edit3,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { UserProfileData } from '@/types/profile';

function getCsrfToken(): string {
    const metaTag = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (metaTag) return metaTag;

    const match = document.cookie.match(new RegExp('(^|;\\s*)XSRF-TOKEN=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : '';
}

interface ProfileOverviewCardProps {
    profile: UserProfileData;
    onOpenWizard?: () => void;
    onEditSection: (section: string) => void;
    onOpenImportCv?: () => void;
    onOpenCompleteness?: (tab?: 'completeness' | 'ai-score') => void;
    onProfileUpdated?: (updatedProfile: UserProfileData) => void;
}

export function ProfileOverviewCard({
    profile,
    onOpenWizard,
    onEditSection,
    onOpenImportCv,
    onOpenCompleteness,
    onProfileUpdated,
}: ProfileOverviewCardProps) {
    const completeness = profile.completeness?.percentage ?? 0;
    const aiScore = profile.ai_scoring?.overall_score ?? null;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Get initials for avatar
    const initials = (profile.full_name || 'U')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset file input value so same file can be selected again if needed
        e.target.value = '';

        if (!file.type.startsWith('image/')) {
            toast.error('Berkas harus berupa gambar (JPG, PNG, WEBP, GIF).');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Ukuran gambar maksimal 5MB.');
            return;
        }

        setIsUploadingAvatar(true);
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const token = getCsrfToken();
            const response = await fetch('/api/v1/profile/avatar', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-XSRF-TOKEN': token,
                },
                credentials: 'same-origin',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || 'Gagal mengunggah foto profil.');
                return;
            }

            setImageError(false);
            if (result.profile && onProfileUpdated) {
                onProfileUpdated(result.profile);
            }
            toast.success('Foto profil berhasil diperbarui.');
            router.reload({ only: ['auth'] });
        } catch {
            toast.error('Terjadi kesalahan jaringan saat mengunggah foto.');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleResetAvatar = async () => {
        if (!confirm('Apakah Anda yakin ingin mereset foto profil ke default?')) {
            return;
        }

        setIsUploadingAvatar(true);
        try {
            const token = getCsrfToken();
            const response = await fetch('/api/v1/profile/avatar', {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-XSRF-TOKEN': token,
                },
                credentials: 'same-origin',
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || 'Gagal mereset foto profil.');
                return;
            }

            setImageError(false);
            if (result.profile && onProfileUpdated) {
                onProfileUpdated(result.profile);
            }
            toast.success('Foto profil berhasil direset.');
            router.reload({ only: ['auth'] });
        } catch {
            toast.error('Terjadi kesalahan jaringan saat mereset foto.');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs transition-all dark:border-neutral-800 dark:bg-neutral-900">
            {/* Hidden file input for avatar upload */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Top decorative gradient banner */}
            <div className="h-28 w-full bg-linear-to-r from-sky-500 via-indigo-500 to-purple-600 sm:h-32">
                <div className="flex h-full items-center justify-end px-6 opacity-20">
                    <Sparkles className="size-20 text-white" />
                </div>
            </div>

            <div className="relative px-5 pb-6 sm:px-8">
                {/* Avatar and Primary Info */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between -mt-12 sm:-mt-14 mb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 flex-1 min-w-0">
                        {/* Interactive Avatar Container */}
                        <div className="group relative flex size-24 sm:size-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-linear-to-br from-sky-600 to-indigo-700 text-2xl font-bold text-white shadow-md dark:border-neutral-900">
                            {profile.avatar && !imageError ? (
                                <img
                                    src={profile.avatar}
                                    alt={profile.full_name || 'Foto Profil'}
                                    className="h-full w-full object-cover"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                initials || <UserIcon className="size-10 text-white" />
                            )}

                            {/* Floating camera / action overlay on hover */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 backdrop-blur-[1px]">
                                {isUploadingAvatar ? (
                                    <div className="flex flex-col items-center gap-1">
                                        <Loader2 className="size-5 animate-spin text-white" />
                                        <span className="text-[10px] font-medium text-white">Memproses...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="rounded-lg bg-white/20 p-2 hover:bg-white/35 text-white transition-colors cursor-pointer"
                                            title="Ubah Foto Profil"
                                        >
                                            <Camera className="size-4" />
                                        </button>
                                        {profile.avatar && (
                                            <button
                                                type="button"
                                                onClick={handleResetAvatar}
                                                className="rounded-lg bg-red-500/80 p-2 hover:bg-red-600 text-white transition-colors cursor-pointer"
                                                title="Reset Foto ke Default"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl dark:text-neutral-50 truncate">
                                    {profile.full_name || 'Pengguna Tanpa Nama'}
                                </h1>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEditSection('profile')}
                                    className="h-7 px-2.5 text-xs font-semibold text-neutral-600 hover:text-sky-600 hover:bg-sky-50 dark:text-neutral-300 dark:hover:text-sky-400 dark:hover:bg-neutral-800 gap-1.5 rounded-lg border border-neutral-200/80 dark:border-neutral-700/80 shadow-2xs"
                                    title="Ubah Nama, Kontak & Info Dasar"
                                >
                                    <Edit3 className="size-3.5 text-neutral-500 dark:text-neutral-400" />
                                    <span>Edit Info</span>
                                </Button>
                                {completeness >= 80 && (
                                    <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:bg-emerald-500/20 dark:text-emerald-300">
                                        <CheckCircle2 className="mr-1 size-3.5" />
                                        Profil Lengkap
                                    </Badge>
                                )}
                                {aiScore !== null && (
                                    <button
                                        type="button"
                                        onClick={() => onOpenCompleteness?.('ai-score')}
                                        className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors dark:bg-indigo-950/40 dark:text-indigo-300 cursor-pointer"
                                    >
                                        <Sparkles className="size-3 text-indigo-500" />
                                        <span>Skor AI: {aiScore}%</span>
                                    </button>
                                )}
                            </div>
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                {profile.field_of_interest?.length
                                    ? profile.field_of_interest.join(' • ')
                                    : 'Master Profile & Single Source of Truth CV'}
                            </p>
                        </div>
                    </div>

                    {/* Actions Buttons */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 sm:self-end shrink-0">
                        {onOpenImportCv && !profile.is_cv_import_locked && (
                            <Button
                                type="button"
                                onClick={onOpenImportCv}
                                variant="outline"
                                className="rounded-xl border-sky-200 bg-sky-50/70 hover:bg-sky-100 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300 px-3.5 py-2 text-xs sm:text-sm font-semibold shadow-2xs gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
                            >
                                <UploadCloud className="size-4 text-sky-600 dark:text-sky-400" />
                                <span>Import CV AI</span>
                            </Button>
                        )}

                        <Link
                            href="/cv/templates?source=profile"
                            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white px-4 py-2 text-xs sm:text-sm font-semibold shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-95"
                        >
                            <FileDown className="size-4" />
                            <span>Buat CV / Ekspor</span>
                        </Link>
                    </div>
                </div>

                {/* Quick Info & Contacts Grid */}
                <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 border-t border-neutral-100 pt-4 text-xs text-neutral-600 sm:text-sm dark:border-neutral-800 dark:text-neutral-400">
                    {profile.email && (
                        <div className="flex items-center gap-1.5">
                            <Mail className="size-4 text-neutral-400" />
                            <span>{profile.email}</span>
                        </div>
                    )}
                    {profile.whatsapp_number && (
                        <div className="flex items-center gap-1.5">
                            <Phone className="size-4 text-emerald-500" />
                            <a
                                href={`https://wa.me/${profile.whatsapp_number.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                            >
                                {profile.whatsapp_number}
                            </a>
                        </div>
                    )}
                    {profile.location && (
                        <div className="flex items-center gap-1.5">
                            <MapPin className="size-4 text-rose-500" />
                            <span>{profile.location}</span>
                        </div>
                    )}
                    {(profile.age || profile.gender) && (
                        <div className="flex items-center gap-1.5">
                            <Calendar className="size-4 text-neutral-400" />
                            <span>
                                {[
                                    profile.age ? `${profile.age} tahun` : null,
                                    profile.gender || null,
                                ]
                                    .filter(Boolean)
                                    .join(', ')}
                            </span>
                        </div>
                    )}
                    {profile.linkedin_url && (
                        <div className="flex items-center gap-1.5">
                            <Linkedin className="size-4 text-sky-600" />
                            <a
                                href={profile.linkedin_url.startsWith('http') ? profile.linkedin_url : `https://${profile.linkedin_url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-sky-600 hover:underline dark:text-sky-400"
                            >
                                LinkedIn
                            </a>
                        </div>
                    )}
                </div>

                {/* Full-width Completeness Progress Bar memanjang di bawah email, no hp & alamat */}
                <div className="mt-4 border-t border-neutral-100 pt-3.5 dark:border-neutral-800">
                    <button
                        type="button"
                        onClick={() => onOpenCompleteness?.('completeness')}
                        className="group flex flex-col gap-1.5 w-full text-left cursor-pointer transition-all"
                        title="Klik untuk melihat rincian checklist kelengkapan profil dan audit skor AI"
                    >
                        <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                    Kelengkapan Profil
                                </span>
                                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-normal hidden sm:inline">
                                    • Klik untuk melihat panduan checklist seksi
                                </span>
                            </div>
                            <span className="text-sky-600 dark:text-sky-400 font-bold text-xs sm:text-sm">
                                {completeness}%
                            </span>
                        </div>
                        <div className="h-2 sm:h-2.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                            <div
                                className="h-full rounded-full bg-linear-to-r from-sky-500 via-indigo-500 to-purple-600 transition-all duration-500 group-hover:brightness-110"
                                style={{ width: `${completeness}%` }}
                            />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
