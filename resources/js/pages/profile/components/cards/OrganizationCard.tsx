import React from 'react';
import { Users, Calendar, Clock, Edit3, Plus } from 'lucide-react';
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
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                            <Users className="size-4" />
                        </div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            <span>Organisasi & Kepemimpinan</span>
                            <Badge variant="secondary" className="text-[11px] font-normal py-0">
                                {organizations.length} Organisasi
                            </Badge>
                        </h3>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        className="text-xs text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/40 gap-1.5 h-8"
                    >
                        <Edit3 className="size-3.5" />
                        <span>Edit</span>
                    </Button>
                </div>

                {/* Content */}
                {organizations.length === 0 ? (
                    <div className="py-8 text-center rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
                        <p className="text-xs text-neutral-400 mb-2">
                            Belum ada riwayat organisasi yang dicatat.
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onEdit}
                            className="rounded-xl text-xs gap-1.5"
                        >
                            <Plus className="size-3.5" />
                            Tambah Organisasi
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4 pt-1">
                        {organizations.map((org, idx) => (
                            <div
                                key={org.id || idx}
                                className="relative pl-5 border-l-2 border-amber-500/30 dark:border-amber-500/20 space-y-1.5"
                            >
                                <div className="absolute -left-1.5 top-1 size-3 rounded-full border-2 border-white bg-amber-500 dark:border-neutral-900" />

                                <div className="flex flex-wrap items-center justify-between gap-1">
                                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                        {org.organizations_name}
                                    </h4>
                                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                                        <Calendar className="size-3 text-neutral-400" />
                                        <span>
                                            {org.start_date || '-'} s/d {org.end_date || 'Selesai'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                        {org.role}
                                    </span>
                                    {org.duration && (
                                        <span className="flex items-center gap-1 text-neutral-400 text-[11px]">
                                            <Clock className="size-2.5" />
                                            {org.duration}
                                        </span>
                                    )}
                                </div>

                                {org.description && org.description.length > 0 && (
                                    <ul className="list-disc ml-4 space-y-0.5 pt-1 text-xs text-neutral-600 dark:text-neutral-300">
                                        {org.description.map((bullet, bIdx) => (
                                            <li key={bIdx} className="leading-relaxed">
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
