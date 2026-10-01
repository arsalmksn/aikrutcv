import React from 'react';
import {
    FileText,
    Globe,
    Paperclip,
    Download,
    ExternalLink,
    Edit3,
    Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    return (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs transition-all dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between">
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                            <FileText className="size-4" />
                        </div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                            Resume & Dokumen Portofolio
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
                        <span>Kelola Berkas</span>
                    </Button>
                </div>

                {/* Portfolio Web Link */}
                {portfolioLink && (
                    <div className="flex items-center justify-between rounded-xl bg-neutral-50/70 p-3 text-xs dark:bg-neutral-800/40">
                        <div className="flex items-center gap-2 truncate">
                            <Globe className="size-4 text-sky-500 shrink-0" />
                            <span className="truncate font-medium text-neutral-800 dark:text-neutral-200">
                                {portfolioLink}
                            </span>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(portfolioLink, '_blank')}
                            className="text-sky-600 hover:bg-sky-100 dark:text-sky-400 h-7 px-2"
                        >
                            <ExternalLink className="size-3.5" />
                        </Button>
                    </div>
                )}

                {/* Resumes List */}
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center justify-between">
                        <span>Berkas CV Manual ({resumes.length})</span>
                    </h4>
                    {resumes.length === 0 ? (
                        <p className="text-xs text-neutral-400 italic">
                            Belum ada resume fisik yang diunggah.
                        </p>
                    ) : (
                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {resumes.map((r) => (
                                <div
                                    key={r.id}
                                    className="flex items-center justify-between py-2 text-xs"
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <FileText className="size-3.5 text-purple-500 shrink-0" />
                                        <span className="truncate font-medium text-neutral-800 dark:text-neutral-200">
                                            {r.file_name}
                                        </span>
                                    </div>
                                    {r.file_url && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => window.open(r.file_url, '_blank')}
                                            className="text-sky-600 hover:bg-sky-50 dark:text-sky-400 h-7 px-2 gap-1 text-xs"
                                        >
                                            <Download className="size-3" />
                                            <span>Unduh</span>
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Attachments List */}
                <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center justify-between">
                        <span>Lampiran Portofolio ({attachments.length})</span>
                    </h4>
                    {attachments.length === 0 ? (
                        <p className="text-xs text-neutral-400 italic">
                            Belum ada dokumen lampiran portofolio yang diunggah.
                        </p>
                    ) : (
                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {attachments.map((att) => (
                                <div
                                    key={att.id}
                                    className="flex items-center justify-between py-2 text-xs"
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <Paperclip className="size-3.5 text-emerald-500 shrink-0" />
                                        <span className="truncate font-medium text-neutral-800 dark:text-neutral-200">
                                            {att.title || att.file_name}
                                        </span>
                                    </div>
                                    {att.file_url && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => window.open(att.file_url, '_blank')}
                                            className="text-sky-600 hover:bg-sky-50 dark:text-sky-400 h-7 px-2 gap-1 text-xs"
                                        >
                                            <Download className="size-3" />
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
