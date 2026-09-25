import React, { useState } from 'react';
import { Check, ChevronDown, Lightbulb, Pencil, Plus } from 'lucide-react';
import { TiptapEditor } from '@/components/cv/tiptap-editor';

export interface SummaryStepProps {
    content: string;
    onChange: (content: string) => void;
    onBack: () => void;
    onNext: () => void;
    desiredJobTitle?: string | null;
    isSaving?: boolean;
}

interface SummarySuggestion {
    id: string;
    text: string;
}

export function SummaryStep({
    content,
    onChange,
    onBack,
    onNext,
    desiredJobTitle,
    isSaving: _isSaving,
}: SummaryStepProps) {
    const [showTips, setShowTips] = useState(false);

    const displayJobTitle = desiredJobTitle?.trim() || 'RPL';

    const suggestions: SummarySuggestion[] = [
        {
            id: 'sug-1',
            text: 'Profesional berorientasi detail dengan pengalaman 3+ tahun di [bidang]. Terampil dalam [keahlian kunci]. Berusaha untuk berkontribusi pada [jenis tim/perusahaan atau tujuan].',
        },
        {
            id: 'sug-2',
            text: 'Lulusan baru yang termotivasi dengan latar belakang di [bidang]. Ingin menerapkan keterampilan di [area keahlian] dan berkembang dalam organisasi yang dinamis.',
        },
        {
            id: 'sug-3',
            text: 'Profesional berpengalaman dengan rekam jejak terbukti dalam memimpin proyek teknis, meningkatkan efisiensi sistem, dan memberikan hasil berkualitas tinggi.',
        },
        {
            id: 'sug-4',
            text: 'Spesialis berorientasi hasil yang terampil dalam pemecahan masalah analitis, kolaborasi lintas tim, dan adaptasi cepat terhadap teknologi baru.',
        },
    ];

    // Helper to strip HTML tags for comparison
    const cleanText = (str: string) =>
        str
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .trim();

    const currentClean = cleanText(content);

    const handleSelectSuggestion = (text: string) => {
        onChange(text);
    };

    return (
        <div className="space-y-6">
            {/* Step Header */}
            <div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                            Ringkasan
                        </h2>
                        <button
                            type="button"
                            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                            aria-label="Edit judul bagian"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowTips(!showTips)}
                        className="flex cursor-pointer items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50/90 px-3.5 py-1 text-xs font-medium text-amber-800 transition-all hover:bg-amber-100/90"
                    >
                        <Lightbulb className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                        <span>Tips ringkasan</span>
                        <ChevronDown
                            className={`h-3 w-3 text-amber-600 transition-transform ${
                                showTips ? 'rotate-180' : ''
                            }`}
                        />
                    </button>
                </div>

                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    Tulislah pengantar singkat yang menyoroti pengalaman,
                    keahlian kunci, dan tujuan karier Anda.
                </p>

                {/* Collapsible Tips Content */}
                {showTips && (
                    <div className="mt-3.5 animate-in rounded-xl border border-amber-200/90 bg-amber-50/60 p-4 text-xs leading-relaxed text-amber-900 duration-200 fade-in slide-in-from-top-2">
                        <p className="mb-1 font-semibold text-amber-950">
                            💡 Tips Menulis Ringkasan Profil yang Menarik:
                        </p>
                        <ul className="list-inside list-disc space-y-1 text-amber-900/90">
                            <li>
                                Tuliskan 2–4 kalimat ringkas dan padat tentang
                                siapa Anda secara profesional.
                            </li>
                            <li>
                                Sebutkan spesialisasi utama, jumlah tahun
                                pengalaman, atau pencapaian terbesar Anda.
                            </li>
                            <li>
                                Hindari kata-kata klise tanpa konteks; gunakan
                                istilah atau kata kunci yang dicari oleh
                                recruiter.
                            </li>
                            <li>
                                Klik salah satu template ringkasan di bawah
                                untuk memasukkan struktur kalimat rekomendasi.
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Rich Text Editor */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-xs">
                <TiptapEditor
                    value={content}
                    onChange={onChange}
                    placeholder="Tuliskan ringkasan profesional Anda di sini..."
                    className="border-0 shadow-none focus-within:ring-0 [&_.ProseMirror]:min-h-[140px] [&_.ProseMirror]:p-4 [&_.ProseMirror]:text-sm [&_.ProseMirror]:leading-relaxed"
                />
            </div>

            {/* Suggested Structure Section */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5">
                <div className="mb-3">
                    <h3 className="text-sm font-semibold text-slate-800">
                        Struktur ringkasan yang disarankan untuk{' '}
                        <span className="text-sky-600">{displayJobTitle}</span>
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Klik contoh untuk memasukkan dan menyesuaikan.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {suggestions.map((item) => {
                        const isSelected =
                            currentClean === cleanText(item.text);

                        return (
                            <div
                                key={item.id}
                                onClick={() =>
                                    handleSelectSuggestion(item.text)
                                }
                                className={`group flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all ${
                                    isSelected
                                        ? 'border-sky-300 bg-sky-50/70 shadow-xs ring-1 ring-sky-200'
                                        : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/30'
                                }`}
                            >
                                <div className="mt-0.5 shrink-0">
                                    {isSelected ? (
                                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500 text-white shadow-xs">
                                            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                                        </div>
                                    ) : (
                                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500 text-white shadow-xs transition-colors group-hover:bg-sky-600">
                                            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                                        </div>
                                    )}
                                </div>

                                <p className="text-xs leading-relaxed text-slate-700">
                                    {item.text}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
                >
                    Kembali
                </button>

                <button
                    type="button"
                    onClick={onNext}
                    className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-sky-500 px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-sky-600"
                >
                    Berikutnya: Finalisasi
                </button>
            </div>
        </div>
    );
}
