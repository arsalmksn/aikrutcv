import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    Download,
    Edit3,
    Sparkles,
    ZoomIn,
    ZoomOut,
    CheckCircle2,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TemplatePreview } from '@/components/cv/template-preview';

export interface TemplatePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    template?: {
        id?: number;
        name?: string;
        category?: string | null;
    } | null;
    templateType?: 'modern' | 'classic' | string;
    data?: any;
    useSample?: boolean;
    builderUrl?: string;
    downloadUrl?: string;
}

export function TemplatePreviewModal({
    isOpen,
    onClose,
    title = 'Pratinjau CV',
    subtitle,
    template,
    templateType,
    data,
    useSample = false,
    builderUrl,
    downloadUrl,
}: TemplatePreviewModalProps) {
    const [zoom, setZoom] = useState<number>(0.85);

    const handleZoomIn = () => setZoom((prev) => Math.min(1.2, +(prev + 0.15).toFixed(2)));
    const handleZoomOut = () => setZoom((prev) => Math.max(0.5, +(prev - 0.15).toFixed(2)));
    const handleZoomReset = () => setZoom(0.85);

    const templateName =
        template?.name || (templateType === 'classic' ? 'Classic Professional' : 'Modern Minimalist');

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="fixed top-[50%] left-[50%] z-50 flex h-[92vh] w-[95vw] max-w-5xl translate-x-[-50%] translate-y-[-50%] flex-col gap-0 rounded-3xl border border-slate-200 bg-white p-0 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden sm:max-w-5xl">
                {/* Header Toolbar */}
                <div className="flex items-center justify-between border-b border-slate-200/90 bg-[#FAF7F2] px-6 py-3.5 dark:border-neutral-800 dark:bg-neutral-900/90">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <DialogTitle className="truncate text-base font-bold text-[#172554] dark:text-neutral-100">
                                {title}
                            </DialogTitle>
                            <Badge
                                variant="secondary"
                                className="gap-1 px-2.5 py-0.5 text-[10px] font-semibold bg-[#F0EBFB] text-[#5025D1] border-violet-100 dark:bg-violet-950/60 dark:text-violet-300 shrink-0"
                            >
                                <Sparkles className="size-2.5 text-[#FFC329]" />
                                <span>{templateName}</span>
                            </Badge>
                        </div>
                        {subtitle && (
                            <p className="mt-0.5 truncate text-xs text-[#64748B] dark:text-neutral-400">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Zoom & View Controls */}
                    <div className="flex items-center gap-2 shrink-0 pr-8">
                        <div className="hidden sm:flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs dark:border-neutral-700 dark:bg-neutral-800">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleZoomOut}
                                disabled={zoom <= 0.5}
                                className="size-7 rounded-lg text-slate-600 hover:text-slate-900 dark:text-neutral-300"
                                title="Perkecil"
                            >
                                <ZoomOut className="size-3.5" />
                            </Button>
                            <button
                                type="button"
                                onClick={handleZoomReset}
                                className="px-2 text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:text-[#5025D1] cursor-pointer"
                                title="Reset Zoom"
                            >
                                {Math.round(zoom * 100)}%
                            </button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleZoomIn}
                                disabled={zoom >= 1.2}
                                className="size-7 rounded-lg text-slate-600 hover:text-slate-900 dark:text-neutral-300"
                                title="Perbesar"
                            >
                                <ZoomIn className="size-3.5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Scrollable Document Canvas */}
                <div className="relative flex-1 overflow-y-auto bg-slate-100/90 p-4 sm:p-8 dark:bg-neutral-950/70 [scrollbar-width:thin]">
                    <div className="flex min-h-full items-start justify-center">
                        <div
                            style={{
                                transform: `scale(${zoom})`,
                                transformOrigin: 'top center',
                                transition: 'transform 0.15s ease-out',
                            }}
                            className="w-full max-w-[760px] pb-10"
                        >
                            <TemplatePreview
                                template={template}
                                templateType={templateType}
                                data={data}
                                useSample={useSample}
                                variant="full"
                                floatingType="none"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200/90 bg-white px-6 py-3.5 dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="text-xs text-[#64748B] dark:text-neutral-400">
                        {useSample ? (
                            <span>Format template resmi berstandar ATS</span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                                <CheckCircle2 className="size-3.5" />
                                Pratinjau langsung isi resume yang sedang dibuat
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-2.5">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="rounded-xl text-xs font-semibold px-4 py-2"
                        >
                            Tutup
                        </Button>

                        {downloadUrl && (
                            <a
                                href={downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                            >
                                <Download className="size-3.5" />
                                <span>Unduh PDF</span>
                            </a>
                        )}

                        {builderUrl && (
                            <Link
                                href={builderUrl}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-[#5025D1] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#401DA8] active:scale-95 transition-all dark:bg-violet-600 dark:hover:bg-violet-700"
                            >
                                <Edit3 className="size-3.5" />
                                <span>Lanjut Edit di Builder</span>
                            </Link>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

