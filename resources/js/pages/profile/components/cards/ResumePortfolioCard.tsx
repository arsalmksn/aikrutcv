import React from 'react';
import {
    FileText,
    Globe,
    Paperclip,
    Download,
    ExternalLink,
    Edit3,
    ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { UserAttachmentItem, UserResumeItem } from '@/types/profile';

interface ResumePortfolioCardProps {
    portfolioLink?: string;
    resumes: UserResumeItem[];
    attachments: UserAttachmentItem[];
    onEdit: () => void;
}

export function ResumePortfolioCard({
    portfolioLink,
    resumes = [],
    attachments = [],
    onEdit,
}: ResumePortfolioCardProps) {
    const totalFiles = resumes.length + attachments.length;

    return (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs transition-all dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between">
            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400 border border-purple-100/80 dark:border-purple-900/50 shadow-2xs">
                            <FileText className="size-4.5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                    Resume & Dokumen Portofolio
                                </h3>
                                <Badge
                                    variant="secondary"
                                    className="text-[11px] font-semibold py-0 px-2 bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-100 dark:border-purple-900/40"
                                >
                                    {totalFiles} Berkas
                                </Badge>
                            </div>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                Berkas CV cetak, tautan portofolio & lampiran karya
                            </p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        className="text-xs text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/40 gap-1.5 h-8 font-medium rounded-xl"
                    >
                        <Edit3 className="size-3.5" />
                        <span>Kelola Berkas</span>
                    </Button>
                </div>

                {/* 1. Portfolio Web Link Card */}
                <div>
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                        Tautan Portofolio Proyek
                    </h4>
                    {portfolioLink ? (
                        <div className="group flex items-center justify-between gap-3 rounded-xl border border-sky-200/80 bg-linear-to-r from-sky-50/70 via-indigo-50/40 to-purple-50/30 p-3.5 transition-all dark:border-sky-900/50 dark:from-sky-950/30 dark:to-indigo-950/20">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-2xs border border-sky-100 dark:bg-neutral-850 dark:text-sky-400 dark:border-sky-900/50">
                                    <Globe className="size-4.5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                                        <span>Website Portofolio Publik</span>
                                        <ArrowUpRight className="size-3 text-sky-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </p>
                                    <p className="truncate text-xs font-medium text-sky-600 dark:text-sky-400">
                                        {portfolioLink}
                                    </p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(portfolioLink.startsWith('http') ? portfolioLink : `https://${portfolioLink}`, '_blank')}
                                className="h-8 px-3 rounded-xl border-sky-300 bg-white text-sky-700 hover:bg-sky-50 dark:border-sky-800 dark:bg-neutral-800 dark:text-sky-300 gap-1.5 text-xs font-semibold shrink-0 shadow-2xs cursor-pointer"
                            >
                                <ExternalLink className="size-3.5" />
                                <span>Kunjungi</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2.5 p-3 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-xs text-neutral-400 dark:text-neutral-500">
                            <Globe className="size-4 text-neutral-400 shrink-0" />
                            <span>Belum ada tautan portofolio online yang ditautkan.</span>
                        </div>
                    )}
                </div>

                {/* 2. Resumes List */}
                <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                            <span>Berkas CV Manual / ATS</span>
                            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-bold">
                                {resumes.length}
                            </Badge>
                        </h4>
                    </div>

                    {resumes.length === 0 ? (
                        <div className="py-4 text-center rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/20">
                            <p className="text-xs text-neutral-400">
                                Belum ada berkas CV manual (PDF/DOCX) yang diunggah.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-2">
                            {resumes.map((r) => (
                                <div
                                    key={r.id}
                                    className="flex items-center justify-between p-3 rounded-xl border border-neutral-200/70 bg-neutral-50/50 hover:bg-white hover:border-purple-300 hover:shadow-2xs transition-all dark:border-neutral-800 dark:bg-neutral-850/40 dark:hover:bg-neutral-850"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                                            <FileText className="size-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                                {r.file_name}
                                            </p>
                                            <p className="text-[10px] text-neutral-400">
                                                Berkas Resume Resmi
                                            </p>
                                        </div>
                                    </div>
                                    {r.file_url && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => window.open(r.file_url, '_blank')}
                                            className="text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/50 h-7 px-2.5 gap-1.5 text-xs font-medium rounded-lg"
                                        >
                                            <Download className="size-3.5" />
                                            <span>Unduh</span>
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. Attachments List */}
                <div className="space-y-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                            <span>Lampiran Sertifikat & Dokumen Portofolio</span>
                            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-bold">
                                {attachments.length}
                            </Badge>
                        </h4>
                    </div>

                    {attachments.length === 0 ? (
                        <div className="py-4 text-center rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/20">
                            <p className="text-xs text-neutral-400">
                                Belum ada lampiran dokumen portofolio atau sertifikat tambahan.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-2">
                            {attachments.map((att) => (
                                <div
                                    key={att.id}
                                    className="flex items-center justify-between p-3 rounded-xl border border-neutral-200/70 bg-neutral-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-2xs transition-all dark:border-neutral-800 dark:bg-neutral-850/40 dark:hover:bg-neutral-850"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                            <Paperclip className="size-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                                {att.title || att.file_name}
                                            </p>
                                            <p className="truncate text-[10px] text-neutral-400">
                                                {att.file_name}
                                            </p>
                                        </div>
                                    </div>
                                    {att.file_url && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => window.open(att.file_url, '_blank')}
                                            className="text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50 h-7 px-2.5 gap-1.5 text-xs font-medium rounded-lg"
                                        >
                                            <Download className="size-3.5" />
                                            <span>Unduh</span>
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
