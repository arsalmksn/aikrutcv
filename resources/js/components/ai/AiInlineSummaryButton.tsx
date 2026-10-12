import React, { useState } from 'react';
import { Sparkles, Loader2, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCsrfToken, cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface AiInlineSummaryButtonProps {
    currentText: string;
    onApply: (enhancedText: string) => void;
    targetRole?: string | null;
    className?: string;
    size?: 'default' | 'sm' | 'lg' | 'icon';
    variant?: 'default' | 'outline' | 'secondary' | 'ghost';
    onLoadingStateChange?: (loading: boolean) => void;
}

export function AiInlineSummaryButton({
    currentText,
    onApply,
    targetRole,
    className,
    size = 'sm',
    variant = 'outline',
    onLoadingStateChange,
}: AiInlineSummaryButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [previousText, setPreviousText] = useState<string | null>(null);
    const [canUndo, setCanUndo] = useState(false);

    const hasText = Boolean(currentText && currentText.trim().length > 0);

    const handleGenerate = async () => {
        if (isGenerating) return;

        const originalBeforeGenerate = currentText;
        setIsGenerating(true);
        onLoadingStateChange?.(true);

        try {
            const token = getCsrfToken();
            const response = await fetch('/api/v1/ai/enhance-summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-XSRF-TOKEN': token,
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    text: hasText ? originalBeforeGenerate.trim() : null,
                    tone: 'professional',
                    target_role: targetRole || null,
                }),
            });

            const json = await response.json();

            if (!response.ok) {
                const errorMsg =
                    json.message ||
                    'Gagal memproses dengan AI. Pastikan model AI aktif di pengaturan.';
                toast.error(errorMsg);
                return;
            }

            if (json.data?.enhanced_text) {
                const generated = json.data.enhanced_text;
                setPreviousText(originalBeforeGenerate);
                setCanUndo(true);
                onApply(generated);

                const modelBadge = json.data.model_name
                    ? ` (${json.data.model_name})`
                    : '';
                toast.success(
                    hasText
                        ? `Ringkasan berhasil diperbaiki oleh AI${modelBadge}!`
                        : `Ringkasan berhasil dibuat oleh AI${modelBadge}!`,
                    {
                        description:
                            'Klik tombol "Batalkan" di samping jika ingin mengembalikan teks sebelumnya.',
                    },
                );
            } else {
                toast.error('AI tidak memberikan hasil teks ringkasan.');
            }
        } catch {
            toast.error(
                'Terjadi gangguan koneksi saat menghubungi layanan AI.',
            );
        } finally {
            setIsGenerating(false);
            onLoadingStateChange?.(false);
        }
    };

    const handleUndo = () => {
        if (previousText !== null) {
            onApply(previousText);
            setCanUndo(false);
            setPreviousText(null);
            toast.info('Perubahan AI telah dibatalkan.');
        }
    };

    const idleLabel = hasText ? 'Perbaiki dengan AI' : 'Tulis dengan AI';
    const loadingLabel = hasText ? 'Memperbaiki...' : 'Menulis...';

    return (
        <div className="inline-flex items-center gap-1.5">
            <Button
                type="button"
                variant={variant}
                size={size}
                disabled={isGenerating}
                onClick={handleGenerate}
                className={cn(
                    'group relative inline-flex items-center gap-1.5 font-medium transition-all duration-300',
                    'border-sky-300/80 bg-gradient-to-r from-sky-50/90 to-indigo-50/90 text-sky-800 shadow-2xs hover:border-sky-400 hover:from-sky-100 hover:to-indigo-100',
                    'dark:border-sky-800 dark:from-sky-950/40 dark:to-indigo-950/40 dark:text-sky-300 dark:hover:from-sky-900/60 dark:hover:to-indigo-900/60',
                    isGenerating && 'cursor-not-allowed opacity-80',
                    className,
                )}
                title={
                    hasText
                        ? 'Klik untuk memperbaiki tata bahasa dan memperkuat ringkasan dengan AI'
                        : 'Klik untuk menghasilkan draf ringkasan profesional secara otomatis'
                }
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="size-3.5 animate-spin text-sky-600 dark:text-sky-400" />
                        <span>{loadingLabel}</span>
                    </>
                ) : (
                    <>
                        <Sparkles className="size-3.5 text-sky-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 dark:text-sky-400" />
                        <span>{idleLabel}</span>
                    </>
                )}
            </Button>

            {canUndo && previousText !== null && (
                <Button
                    type="button"
                    variant="ghost"
                    size={size}
                    onClick={handleUndo}
                    className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                    title="Batalkan perubahan AI dan kembalikan teks sebelumnya"
                >
                    <Undo2 className="size-3.5" />
                    <span>Batalkan</span>
                </Button>
            )}
        </div>
    );
}
