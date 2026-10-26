import React, { useState } from 'react';
import { Sparkles, Loader2, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getCsrfToken, cn } from '@/lib/utils';
import { toast } from 'sonner';

export type AiEnhanceType = 'experience' | 'education' | 'summary';

export interface AiEnhanceContext {
    company?: string | null;
    position?: string | null;
    location?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    is_current?: boolean | null;
    institution?: string | null;
    degree?: string | null;
    field_of_study?: string | null;
    major?: string | null;
    gpa?: string | null;
    targetRole?: string | null;
}

export interface AiInlineEnhanceButtonProps {
    type: AiEnhanceType;
    currentText: string;
    onApply: (enhancedText: string) => void;
    context?: AiEnhanceContext;
    className?: string;
    size?: 'default' | 'sm' | 'lg' | 'icon';
    variant?: 'default' | 'outline' | 'secondary' | 'ghost';
    onLoadingStateChange?: (loading: boolean) => void;
}

export function AiInlineEnhanceButton({
    type,
    currentText,
    onApply,
    context = {},
    className,
    size = 'sm',
    variant = 'outline',
    onLoadingStateChange,
}: AiInlineEnhanceButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [previousText, setPreviousText] = useState<string | null>(null);
    const [canUndo, setCanUndo] = useState(false);

    // Bersihkan teks dari tag HTML (jika dipanggil dari editor Tiptap)
    const rawDraft = (currentText || '').replace(/<[^>]*>/g, '').trim();
    const hasText = rawDraft.length > 0;

    // Evaluasi Minimal Input Triggers untuk Strict Context
    let isTriggerMet = false;
    let tooltipMessage = '';

    if (type === 'experience') {
        const hasPosition = Boolean(context.position && context.position.trim().length > 0);
        const hasMinDraft = rawDraft.length >= 15;
        isTriggerMet = hasPosition && hasMinDraft;

        if (!isTriggerMet) {
            if (!hasPosition && !hasMinDraft) {
                tooltipMessage = 'Tuliskan minimal peran dan draf singkat deskripsi untuk mengaktifkan AI';
            } else if (!hasPosition) {
                tooltipMessage = 'Isi posisi / jabatan terlebih dahulu untuk mengaktifkan AI';
            } else {
                tooltipMessage = 'Tuliskan minimal draf singkat deskripsi (min. 15 karakter) untuk mengaktifkan AI';
            }
        } else {
            tooltipMessage = 'Sempurnakan draf pengalaman kerja dengan AI (Strict Context)';
        }
    } else if (type === 'education') {
        const hasInstitution = Boolean(context.institution && context.institution.trim().length > 0);
        const hasMajor = Boolean(
            (context.field_of_study && context.field_of_study.trim().length > 0) ||
            (context.major && context.major.trim().length > 0) ||
            (context.degree && context.degree.trim().length > 0)
        );
        // Draf aktivitas / skripsi opsional untuk pendidikan
        isTriggerMet = hasInstitution && hasMajor;

        if (!isTriggerMet) {
            if (!hasInstitution && !hasMajor) {
                tooltipMessage = 'Wajib terisi Nama Kampus/Sekolah dan Jurusan untuk mengaktifkan AI';
            } else if (!hasInstitution) {
                tooltipMessage = 'Isi nama kampus / sekolah terlebih dahulu untuk mengaktifkan AI';
            } else {
                tooltipMessage = 'Isi jurusan / program studi terlebih dahulu untuk mengaktifkan AI';
            }
        } else {
            tooltipMessage = hasText
                ? 'Sempurnakan ringkasan riwayat pendidikan dengan AI (Strict Context)'
                : 'Buatkan ringkasan fokus studi pendidikan dengan AI (Strict Context)';
        }
    } else {
        // Summary / Tentang Saya
        const hasTargetRole = Boolean(context.targetRole && context.targetRole.trim().length > 0);
        const hasMinDraft = rawDraft.length >= 15;
        isTriggerMet = hasTargetRole || hasMinDraft;

        if (!isTriggerMet) {
            tooltipMessage = 'Tuliskan minimal target peran atau draf singkat ringkasan untuk mengaktifkan AI';
        } else {
            tooltipMessage = 'Sempurnakan ringkasan profesional dengan AI';
        }
    }

    const getEndpointAndPayload = () => {
        const textPayload = hasText ? rawDraft : null;

        switch (type) {
            case 'experience':
                return {
                    url: '/api/v1/ai/enhance-experience',
                    payload: {
                        text: textPayload,
                        company: context.company || null,
                        position: context.position || null,
                        location: context.location || null,
                        start_date: context.start_date || null,
                        end_date: context.end_date || null,
                        is_current: Boolean(context.is_current),
                        target_role: context.targetRole || null,
                        tone: 'impactful',
                    },
                    labelSuccess: 'Deskripsi pengalaman kerja berhasil disempurnakan oleh AI',
                };

            case 'education':
                return {
                    url: '/api/v1/ai/enhance-education',
                    payload: {
                        text: textPayload,
                        institution: context.institution || null,
                        degree: context.degree || null,
                        field_of_study: context.field_of_study || context.major || null,
                        start_date: context.start_date || null,
                        end_date: context.end_date || null,
                        is_current: Boolean(context.is_current),
                        gpa: context.gpa || null,
                        tone: 'professional',
                    },
                    labelSuccess: 'Deskripsi pendidikan berhasil disempurnakan oleh AI',
                };

            case 'summary':
            default:
                return {
                    url: '/api/v1/ai/enhance-summary',
                    payload: {
                        text: textPayload,
                        target_role: context.targetRole || null,
                        tone: 'professional',
                    },
                    labelSuccess: 'Ringkasan profil berhasil disempurnakan oleh AI',
                };
        }
    };

    const handleGenerate = async () => {
        if (!isTriggerMet || isGenerating) return;

        const originalBeforeGenerate = currentText;
        const config = getEndpointAndPayload();

        setIsGenerating(true);
        onLoadingStateChange?.(true);

        try {
            const token = getCsrfToken();
            const response = await fetch(config.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-XSRF-TOKEN': token,
                },
                credentials: 'same-origin',
                body: JSON.stringify(config.payload),
            });

            const json = await response.json();

            if (!response.ok) {
                const errorMsg =
                    json.message ||
                    'Layanan AI sedang mengalami kendala. Silakan coba beberapa saat lagi.';
                toast.error(errorMsg);
                return;
            }

            if (json.data?.enhanced_text) {
                const generated = json.data.enhanced_text;
                setPreviousText(originalBeforeGenerate);
                setCanUndo(true);
                onApply(generated);

                toast.success(`${config.labelSuccess}!`, {
                    description:
                        'Klik tombol "Batalkan" di samping jika ingin mengembalikan teks sebelumnya.',
                });
            } else {
                toast.error('AI tidak memberikan hasil teks deskripsi.');
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

    const idleLabel = hasText ? 'Sempurnakan dengan AI' : 'Tulis dengan AI';
    const loadingLabel = hasText ? 'Memperbaiki...' : 'Menulis...';
    const isDisabled = !isTriggerMet || isGenerating;

    return (
        <div className="inline-flex items-center gap-1.5">
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className={cn('inline-flex', !isTriggerMet && 'cursor-not-allowed')}>
                        <Button
                            type="button"
                            variant={variant}
                            size={size}
                            disabled={isDisabled}
                            onClick={handleGenerate}
                            className={cn(
                                'group relative inline-flex items-center gap-1.5 font-medium transition-all duration-300',
                                !isTriggerMet
                                    ? 'cursor-not-allowed border-neutral-200 bg-neutral-100/90 text-neutral-400 shadow-none hover:border-neutral-200 hover:bg-neutral-100/90 hover:text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-500 pointer-events-none'
                                    : 'border-sky-300/80 bg-gradient-to-r from-sky-50/90 to-indigo-50/90 text-sky-800 shadow-2xs hover:border-sky-400 hover:from-sky-100 hover:to-indigo-100 dark:border-sky-800 dark:from-sky-950/40 dark:to-indigo-950/40 dark:text-sky-300 dark:hover:from-sky-900/60 dark:hover:to-indigo-900/60',
                                isGenerating && 'cursor-not-allowed opacity-80',
                                className,
                            )}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="size-3.5 animate-spin text-sky-600 dark:text-sky-400" />
                                    <span>{loadingLabel}</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles
                                        className={cn(
                                            'size-3.5 transition-transform duration-300',
                                            !isTriggerMet
                                                ? 'text-neutral-400 dark:text-neutral-500'
                                                : 'text-sky-600 dark:text-sky-400 group-hover:scale-110 group-hover:rotate-12',
                                        )}
                                    />
                                    <span>{idleLabel}</span>
                                </>
                            )}
                        </Button>
                    </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-center text-xs">
                    {tooltipMessage}
                </TooltipContent>
            </Tooltip>

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
