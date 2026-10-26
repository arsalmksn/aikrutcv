import React from 'react';
import {
    Users,
    Calendar,
    Clock,
    Edit3,
    Plus,
    CheckCircle2,
    ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { UserOrganizationItem } from '@/types/profile';

interface OrganizationCardProps {
    organizations: UserOrganizationItem[];
    onEdit: () => void;
}

export function OrganizationCard({
    organizations = [],
    onEdit,
}: OrganizationCardProps) {
    return (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs transition-all dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between">
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400 border border-amber-100/80 dark:border-amber-900/50 shadow-2xs">
                            <Users className="size-4.5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                    Organisasi & Kepemimpinan
                                </h3>
                                <Badge
                                    variant="secondary"
                                    className="text-[11px] font-semibold py-0 px-2 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-100 dark:border-amber-900/40"
                                >
                                    {organizations.length} Organisasi
                                </Badge>
                            </div>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                Peran kepemimpinan, komite & kegiatan sukarela
                            </p>
                        </div>
                    </div>
                    {organizations.length > 0 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onEdit}
                            className="text-xs text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/40 gap-1.5 h-8 font-medium rounded-xl"
                        >
                            <Edit3 className="size-3.5" />
                            <span>Kelola Organisasi</span>
                        </Button>
                    )}
                </div>

                {/* Content: List or Empty State */}
                {organizations.length === 0 ? (
                    <div className="py-10 px-4 text-center rounded-2xl border-2 border-dashed border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/30">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-950/50 dark:text-amber-400 mb-3">
                            <Users className="size-6" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                            Belum Ada Riwayat Organisasi
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto mt-1 mb-4">
                            Tambahkan pengalaman organisasi, himpunan mahasiswa, atau komunitas kerelawanan untuk memperkaya soft-skills kepemimpinan Anda.
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onEdit}
                            className="rounded-xl text-xs gap-1.5 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-950/50 font-semibold shadow-2xs"
                        >
                            <Plus className="size-3.5" />
                            <span>Tambah Organisasi</span>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3 pt-1">
                        {organizations.map((org, idx) => {
                            const isPresent =
                                !org.end_date ||
                                org.end_date.toLowerCase() === 'sekarang' ||
                                org.end_date.toLowerCase() === 'saat ini';

                            return (
                                <div
                                    key={org.id || idx}
                                    className="group relative rounded-xl border border-neutral-200/80 bg-neutral-50/40 p-4 transition-all duration-200 hover:border-amber-300 hover:bg-white hover:shadow-xs dark:border-neutral-800 dark:bg-neutral-850/40 dark:hover:border-amber-800/80 dark:hover:bg-neutral-850 space-y-2.5"
                                >
                                    {/* Top Row: Org Name + Role + Date Badge */}
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                        <div className="flex items-start gap-3">
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-2xs border border-neutral-200/60 dark:bg-neutral-800 dark:text-amber-400 dark:border-neutral-700/60">
                                                <ShieldCheck className="size-4.5" />
                                            </div>
                                            <div className="space-y-0.5 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 leading-snug">
                                                        {org.organizations_name}
                                                    </h4>
                                                    {isPresent && (
                                                        <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                                            Aktif
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                                                    {org.role}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Period & Duration */}
                                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0 pl-12 sm:pl-0">
                                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400 bg-white/80 dark:bg-neutral-800/80 px-2.5 py-1 rounded-lg border border-neutral-200/60 dark:border-neutral-700/60">
                                                <Calendar className="size-3 text-neutral-400" />
                                                <span>
                                                    {org.start_date || '-'} —{' '}
                                                    {isPresent ? (
                                                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                            Sekarang
                                                        </span>
                                                    ) : (
                                                        org.end_date
                                                    )}
                                                </span>
                                            </div>
                                            {org.duration && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[10px] font-medium bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"
                                                >
                                                    <Clock className="size-2.5 mr-1 text-neutral-400" />
                                                    {org.duration}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description / Bullet Points */}
                                    {org.description && org.description.length > 0 && (
                                        <div className="pt-1.5 pl-12 sm:pl-12">
                                            <div className="rounded-lg bg-white/70 p-3 text-xs text-neutral-600 dark:bg-neutral-800/50 dark:text-neutral-300 border border-neutral-100 dark:border-neutral-800 space-y-1.5">
                                                {org.description
                                                    .filter((bullet) => typeof bullet === 'string' && bullet.trim().length > 0)
                                                    .map((bullet, bIdx) => (
                                                        <div key={bIdx} className="flex items-start gap-2 leading-relaxed">
                                                            <div className="size-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                                                            <span>{bullet}</span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
