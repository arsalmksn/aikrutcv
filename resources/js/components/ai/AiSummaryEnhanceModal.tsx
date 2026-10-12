import React, { useState, useEffect } from 'react';
import {
    Sparkles,
    Check,
    Copy,
    RefreshCw,
    Briefcase,
    Zap,
    Target,
    Rocket,
    Cpu,
    ArrowRight,
    SlidersHorizontal,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { getCsrfToken, cn } from '@/lib/utils';
import { toast } from 'sonner';

export type AiTone = 'professional' | 'concise' | 'impactful' | 'creative';

interface AiSummaryEnhanceModalProps {
    currentText: string;
    onApply: (enhancedText: string) => void;
    targetRole?: string | null;
    triggerClassName?: string;
    triggerText?: string;
    triggerVariant?: 'default' | 'outline' | 'secondary' | 'ghost';
    triggerSize?: 'default' | 'sm' | 'lg' | 'icon';
}

const TONES: {
    id: AiTone;
    label: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}[] = [
    {
        id: 'professional',
        label: 'Profesional & Resmi',
        desc: 'Standar resume formal, berwibawa, dan seimbang.',
        icon: Briefcase,
        color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    },
    {
        id: 'impactful',
        label: 'Berorientasi Hasil',
        desc: 'Menonjolkan pencapaian kunci, aksi nyata, dan dampak.',
        icon: Target,
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
        id: 'concise',
        label: 'Ringkas & Padat',
        desc: 'To-the-point 2-3 kalimat tajam tanpa kata berlebih.',
        icon: Zap,
        color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
        id: 'creative',
        label: 'Dinamis & Kreatif',
        desc: 'Modern, berenergi tinggi, cocok untuk startup & teknologi.',
        icon: Rocket,
        color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    },
];

export function AiSummaryEnhanceModal({
    currentText,
    onApply,
    targetRole,
    triggerClassName,
    triggerText,
    triggerVariant = 'outline',
    triggerSize = 'sm',
}: AiSummaryEnhanceModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTone, setSelectedTone] = useState<AiTone>('professional');
    const [customInstruction, setCustomInstruction] = useState('');
    const [showOptions, setShowOptions] = useState(false);

    const [isGenerating, setIsGenerating] = useState(false);
    const [enhancedResult, setEnhancedResult] = useState('');
    const [originalDraft, setOriginalDraft] = useState(currentText);
    const [metaInfo, setMetaInfo] = useState<{
        provider?: string;
        model?: string;
        latencyMs?: number;
    } | null>(null);

    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'preview' | 'compare'>(
        'preview',
    );

    // AI availability status
    const [aiStatus, setAiStatus] = useState<{
        checked: boolean;
        available: boolean;
        count: number;
        modelName?: string;
    }>({
        checked: false,
        available: true,
        count: 0,
    });

    // Check availability on mount or modal open
    useEffect(() => {
        if (!isOpen) return;

        setOriginalDraft(currentText);
        setEnhancedResult('');
        setMetaInfo(null);
        setActiveTab('preview');

        async function checkAi() {
            try {
                const res = await fetch('/api/v1/ai/status');
                if (res.ok) {
                    const data = await res.json();
                    setAiStatus({
                        checked: true,
                        available: Boolean(data.available),
                        count: data.active_models_count || 0,
                        modelName: data.models?.[0]?.name,
                    });
                }
            } catch {
                setAiStatus((prev) => ({ ...prev, checked: true }));
            }
        }

        checkAi();
    }, [isOpen, currentText]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setCopied(false);

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
                    text: originalDraft,
                    tone: selectedTone,
                    target_role: targetRole || null,
                    custom_instruction: customInstruction.trim() || null,
                }),
            });

            const json = await response.json();

            if (!response.ok) {
                const errorMsg =
                    json.message ||
                    'Gagal memproses enhancement dengan AI. Silakan coba lagi.';
                toast.error(errorMsg);
                return;
            }

            if (json.data?.enhanced_text) {
                setEnhancedResult(json.data.enhanced_text);
                setMetaInfo({
                    provider: json.data.provider_name,
                    model: json.data.model_name,
                    latencyMs: json.data.latency_ms,
                });
                toast.success('Ringkasan berhasil disempurnakan oleh AI!');
            }
        } catch {
            toast.error(
                'Terjadi gangguan jaringan saat menghubungi layanan AI.',
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const handleApply = () => {
        if (!enhancedResult) return;
        onApply(enhancedResult);
        setIsOpen(false);
        toast.success('Ringkasan Tentang Saya telah diperbarui.');
    };

    const handleCopy = () => {
        if (!enhancedResult) return;
        navigator.clipboard.writeText(enhancedResult);
        setCopied(true);
        toast.info('Teks berhasil disalin ke clipboard.');
        setTimeout(() => setCopied(false), 2000);
    };

    const buttonLabel =
        triggerText || (currentText?.trim() ? 'Enhance AI' : 'Tulis dengan AI');

    return (
        <>
            <Button
                type="button"
                variant={triggerVariant}
                size={triggerSize}
                onClick={() => setIsOpen(true)}
                className={cn(
                    'group relative inline-flex items-center gap-1.5 font-medium transition-all duration-300',
                    'border-sky-300/80 bg-gradient-to-r from-sky-50/80 to-indigo-50/80 text-sky-800 shadow-2xs hover:border-sky-400 hover:from-sky-100 hover:to-indigo-100',
                    'dark:border-sky-800 dark:from-sky-950/40 dark:to-indigo-950/40 dark:text-sky-300 dark:hover:from-sky-900/60 dark:hover:to-indigo-900/60',
                    triggerClassName,
                )}
            >
                <Sparkles className="size-3.5 text-sky-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 dark:text-sky-400" />
                <span>{buttonLabel}</span>
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl gap-0 overflow-hidden border-neutral-200 p-0 sm:max-w-3xl dark:border-neutral-800">
                    {/* Modal Header */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white">
                        <div className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-sky-500/20 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-12 -left-12 size-48 rounded-full bg-indigo-500/20 blur-3xl" />

                        <DialogHeader className="relative text-left">
                            <div className="flex items-center justify-between gap-2">
                                <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300">
                                    <Sparkles className="size-3 animate-pulse text-sky-400" />
                                    <span>AI Resume Assistant</span>
                                </div>

                                {aiStatus.checked && (
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-300/80">
                                        <Cpu className="size-3 text-sky-400" />
                                        <span>
                                            {aiStatus.available
                                                ? `${aiStatus.count} Model AI Aktif`
                                                : 'Model AI Belum Aktif'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <DialogTitle className="mt-2 text-xl font-bold tracking-tight text-white">
                                Enhance Ringkasan "Tentang Saya"
                            </DialogTitle>
                            <DialogDescription className="mt-1 max-w-xl text-xs text-slate-300 sm:text-sm">
                                Gunakan model AI terlatih untuk merangkai
                                kalimat profesional, menonjolkan keahlian Anda,
                                dan lolos seleksi recruiter serta ATS.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    {/* Modal Body */}
                    <div className="max-h-[75vh] space-y-6 overflow-y-auto bg-neutral-50/50 p-6 dark:bg-neutral-900/50">
                        {aiStatus.checked && !aiStatus.available && (
                            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
                                <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                                <div>
                                    <p className="font-semibold">
                                        Belum Ada Model AI yang Aktif
                                    </p>
                                    <p className="mt-0.5 text-amber-800 dark:text-amber-400">
                                        Administrator perlu mengaktifkan minimal
                                        satu Provider dan Model AI pada menu
                                        Admin Settings agar fitur AI berfungsi.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Tone Selector */}
                        <div className="space-y-2.5">
                            <Label className="text-xs font-bold tracking-wider text-neutral-800 uppercase dark:text-neutral-200">
                                1. Pilih Gaya Bahasa (Tone)
                            </Label>
                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                {TONES.map((tone) => {
                                    const isSelected = selectedTone === tone.id;
                                    const Icon = tone.icon;
                                    return (
                                        <button
                                            key={tone.id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedTone(tone.id)
                                            }
                                            className={cn(
                                                'group flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-left transition-all duration-200',
                                                isSelected
                                                    ? 'border-sky-500 bg-sky-50/80 shadow-xs ring-1 ring-sky-500/30 dark:border-sky-400 dark:bg-sky-950/40'
                                                    : 'border-neutral-200 bg-white hover:border-sky-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700',
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'shrink-0 rounded-lg p-2 transition-colors',
                                                    tone.color,
                                                )}
                                            >
                                                <Icon className="size-4" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                                        {tone.label}
                                                    </span>
                                                    {isSelected && (
                                                        <CheckCircle2 className="size-3.5 text-sky-600 dark:text-sky-400" />
                                                    )}
                                                </div>
                                                <p className="text-[11px] leading-snug text-neutral-500 dark:text-neutral-400">
                                                    {tone.desc}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Current Draft Input */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="ai_draft_input"
                                    className="text-xs font-bold tracking-wider text-neutral-800 uppercase dark:text-neutral-200"
                                >
                                    2. Draf Teks atau Catatan Awal
                                </Label>
                                <span className="text-[11px] text-neutral-400">
                                    {originalDraft.length} karakter
                                </span>
                            </div>
                            <textarea
                                id="ai_draft_input"
                                rows={3}
                                value={originalDraft}
                                onChange={(e) =>
                                    setOriginalDraft(e.target.value)
                                }
                                placeholder="Masukkan draf ringkasan atau poin-poin tentang pengalaman Anda (bisa kosong untuk generate baru)..."
                                className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-xs text-neutral-900 shadow-2xs placeholder:text-neutral-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-hidden sm:text-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
                            />
                        </div>

                        {/* Collapsible Options (Custom Instruction & Target Role) */}
                        <div className="space-y-3 rounded-xl border border-neutral-200/80 bg-white p-3.5 dark:border-neutral-800 dark:bg-neutral-900">
                            <button
                                type="button"
                                onClick={() => setShowOptions(!showOptions)}
                                className="flex w-full items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                            >
                                <span className="flex items-center gap-1.5">
                                    <SlidersHorizontal className="size-3.5 text-sky-500" />
                                    Instruksi Khusus Tambahan (Opsional)
                                </span>
                                <span className="text-[11px] text-neutral-400">
                                    {showOptions ? 'Sembunyikan' : 'Tampilkan'}
                                </span>
                            </button>

                            {showOptions && (
                                <div className="space-y-3 border-t border-neutral-100 pt-2 dark:border-neutral-800">
                                    <div>
                                        <Label className="mb-1 block text-[11px] text-neutral-500">
                                            Catatan khusus untuk AI:
                                        </Label>
                                        <input
                                            type="text"
                                            value={customInstruction}
                                            onChange={(e) =>
                                                setCustomInstruction(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: Tekankan keahlian React, atau cocokkan untuk lulusan baru..."
                                            className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3 py-1.5 text-xs text-neutral-800 focus:border-sky-500 focus:bg-white focus:outline-hidden dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                        />
                                    </div>
                                    {targetRole && (
                                        <p className="flex items-center gap-1 text-[11px] text-neutral-400">
                                            <span>
                                                Target Posisi Terdeteksi:
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className="px-1.5 py-0 text-[10px] font-normal"
                                            >
                                                {targetRole}
                                            </Badge>
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Generate Trigger Button */}
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className={cn(
                                    'gap-2 bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-600 font-semibold text-white shadow-md transition-all hover:from-sky-500 hover:to-indigo-500',
                                    isGenerating && 'cursor-wait opacity-80',
                                )}
                            >
                                {isGenerating ? (
                                    <>
                                        <RefreshCw className="size-4 animate-spin" />
                                        <span>AI Sedang Merangkai...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="size-4" />
                                        <span>
                                            {enhancedResult
                                                ? 'Generate Ulang'
                                                : 'Sempurnakan dengan AI'}
                                        </span>
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Generated Result Card */}
                        {enhancedResult && (
                            <div className="space-y-3 rounded-2xl border border-sky-200/80 bg-gradient-to-b from-sky-50/60 to-white p-4.5 shadow-sm dark:border-sky-900/60 dark:from-sky-950/20 dark:to-neutral-900">
                                <div className="flex items-center justify-between border-b border-sky-100 pb-2.5 dark:border-sky-900/40">
                                    <div className="flex items-center gap-2">
                                        <div className="size-2 animate-ping rounded-full bg-emerald-500" />
                                        <span className="text-xs font-bold text-sky-900 dark:text-sky-300">
                                            Hasil Rekomendasi AI
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                setActiveTab(
                                                    activeTab === 'preview'
                                                        ? 'compare'
                                                        : 'preview',
                                                )
                                            }
                                            className="h-7 text-xs text-sky-700 hover:bg-sky-100/70 dark:text-sky-300 dark:hover:bg-sky-950"
                                        >
                                            {activeTab === 'preview'
                                                ? 'Bandingkan Asli'
                                                : 'Lihat Hasil'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleCopy}
                                            className="h-7 gap-1 text-xs text-sky-700 hover:bg-sky-100/70 dark:text-sky-300 dark:hover:bg-sky-950"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="size-3 text-emerald-600" />
                                                    <span>Tersalin</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="size-3" />
                                                    <span>Salin</span>
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {activeTab === 'preview' ? (
                                    <textarea
                                        rows={4}
                                        value={enhancedResult}
                                        onChange={(e) =>
                                            setEnhancedResult(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-sky-200/80 bg-white/90 p-3 text-xs leading-relaxed text-neutral-800 shadow-2xs focus:border-sky-500 focus:outline-hidden sm:text-sm dark:border-sky-900 dark:bg-neutral-900/80 dark:text-neutral-100"
                                    />
                                ) : (
                                    <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                                        <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900">
                                            <p className="mb-1.5 text-[10px] font-semibold text-neutral-500 uppercase">
                                                Draf Awal
                                            </p>
                                            <p className="leading-relaxed whitespace-pre-line text-neutral-700 dark:text-neutral-300">
                                                {originalDraft ||
                                                    '(Tidak ada teks awal)'}
                                            </p>
                                        </div>
                                        <div className="rounded-xl border border-sky-300 bg-sky-50/70 p-3 dark:border-sky-800 dark:bg-sky-950/40">
                                            <p className="mb-1.5 text-[10px] font-semibold text-sky-700 uppercase dark:text-sky-300">
                                                Hasil AI Baru
                                            </p>
                                            <p className="leading-relaxed whitespace-pre-line text-neutral-800 dark:text-neutral-100">
                                                {enhancedResult}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Meta latency & model badge */}
                                {metaInfo && (
                                    <div className="flex flex-wrap items-center justify-between pt-1 text-[11px] text-neutral-400">
                                        <span>
                                            {
                                                enhancedResult
                                                    .split(/\s+/)
                                                    .filter(Boolean).length
                                            }{' '}
                                            kata • {enhancedResult.length}{' '}
                                            karakter
                                        </span>
                                        <span className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                                            <Cpu className="size-3 text-sky-500" />
                                            <span>
                                                {metaInfo.model} (
                                                {metaInfo.provider})
                                            </span>
                                            {metaInfo.latencyMs !==
                                                undefined && (
                                                <span>
                                                    • {metaInfo.latencyMs}ms
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="flex items-center justify-between border-t border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsOpen(false)}
                            className="text-xs text-neutral-500 hover:text-neutral-800"
                        >
                            Tutup
                        </Button>

                        {enhancedResult && (
                            <Button
                                type="button"
                                onClick={handleApply}
                                className="gap-1.5 bg-sky-600 text-xs font-semibold text-white shadow-sm hover:bg-sky-700"
                            >
                                <Check className="size-4" />
                                <span>Terapkan ke Tentang Saya</span>
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
