import React, { useState } from 'react';
import {
    Check,
    ChevronDown,
    ChevronUp,
    GripVertical,
    Lightbulb,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import type { CvEducationData } from '@/types/cv';
import { MonthYearPicker } from '@/components/cv/month-year-picker';
import { TiptapEditor } from '@/components/cv/tiptap-editor';
import { AiInlineEnhanceButton } from '@/components/ai/AiInlineEnhanceButton';

interface EducationStepProps {
    educations: CvEducationData[];
    onChange: (educations: CvEducationData[]) => void;
    onBack: () => void;
    onNext: () => void;
    isSaving?: boolean;
}

export function EducationStep({
    educations,
    onChange,
    onBack,
    onNext,
    isSaving: _isSaving,
}: EducationStepProps) {
    const [showTips, setShowTips] = useState(false);
    const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({
        0: true,
    });

    const toggleExpand = (index: number) => {
        setExpandedIds((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handleFieldChange = (
        index: number,
        field: keyof CvEducationData,
        value: any,
    ) => {
        const updated = [...educations];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        onChange(updated);
    };

    const handleAddEducation = () => {
        const newEdu: CvEducationData = {
            institution_name: '',
            degree: '',
            field_of_study: '',
            city: '',
            start_date: '',
            end_date: '',
            is_current: false,
            description: '',
            sort_order: educations.length,
        };
        const nextIndex = educations.length;
        setExpandedIds((prev) => ({ ...prev, [nextIndex]: true }));
        onChange([...educations, newEdu]);
    };

    const handleDeleteEducation = (index: number) => {
        const filtered = educations.filter((_, i) => i !== index);
        onChange(filtered);
    };

    const isFieldFilled = (val?: string | null) => {
        return Boolean(val && val.trim().length > 0);
    };

    const formatYear = (d?: string | null) => {
        if (!d) return '';
        if (/^\d{2}\/(\d{4})$/.test(d)) {
            return d.split('/')[1];
        }
        if (/^(\d{4})-\d{2}/.test(d)) {
            return d.split('-')[0];
        }
        if (/^\d{4}$/.test(d)) {
            return d;
        }
        return d;
    };

    const formatHeaderDate = (
        startDate?: string | null,
        endDate?: string | null,
        isCurrent?: boolean,
    ) => {
        const startY = formatYear(startDate);
        const endY = formatYear(endDate);

        if (!startY && !endY && !isCurrent) {
            return 'YYYY - YYYY';
        }

        const startDisplay = startY || 'YYYY';

        if (isCurrent) {
            return `${startDisplay} - Sekarang`;
        }

        const endDisplay = endY || 'YYYY';
        return `${startDisplay} - ${endDisplay}`;
    };

    return (
        <div className="flex max-w-2xl flex-col space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                            Pendidikan
                        </h1>
                        <button
                            type="button"
                            className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                            title="Edit nama bagian"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Tips Button / Pill */}
                    <button
                        type="button"
                        onClick={() => setShowTips(!showTips)}
                        className="flex cursor-pointer items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50/90 px-3.5 py-1 text-xs font-medium text-amber-800 transition-all hover:bg-amber-100/90"
                    >
                        <Lightbulb className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                        <span>Tips pendidikan</span>
                        <ChevronDown
                            className={`h-3 w-3 text-amber-600 transition-transform ${
                                showTips ? 'rotate-180' : ''
                            }`}
                        />
                    </button>
                </div>

                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    Tambahkan rincian pendidikan Anda - bahkan jika Anda belum
                    lulus.
                </p>

                {/* Collapsible Tips Content */}
                {showTips && (
                    <div className="mt-3.5 animate-in rounded-xl border border-amber-200/90 bg-amber-50/60 p-4 text-xs leading-relaxed text-amber-900 duration-200 fade-in slide-in-from-top-2">
                        <p className="mb-1 font-semibold text-amber-950">
                            💡 Tips Menulis Riwayat Pendidikan yang Efektif:
                        </p>
                        <ul className="list-inside list-disc space-y-1 text-amber-900/90">
                            <li>
                                Tuliskan jenjang pendidikan tertinggi terlebih
                                dahulu (misal: S1, D3, atau SMA/SMK).
                            </li>
                            <li>
                                Cantumkan nilai IPK jika di atas 3.50 atau
                                predikat kelulusan (cumlaude/sangat memuaskan).
                            </li>
                            <li>
                                Tambahkan pencapaian relevan, judul tugas
                                akhir/skripsi, beasiswa, atau kegiatan
                                organisasi kemahasiswaan pada kolom deskripsi.
                            </li>
                            <li>
                                Jika masih menempuh studi, centang opsi{' '}
                                <em>"Saya masih terdaftar"</em>.
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Education Cards List */}
            <div className="space-y-4">
                {educations.map((edu, index) => {
                    const isExpanded = expandedIds[index] !== false;
                    const schoolDisplay = edu.institution_name?.trim();
                    const degreeDisplay = edu.degree?.trim();
                    const majorDisplay = edu.field_of_study?.trim();

                    const degreeMajorParts = [degreeDisplay, majorDisplay].filter(Boolean).join(' - ');
                    const hasSummaryTitle = Boolean(
                        schoolDisplay || degreeMajorParts,
                    );
                    const titleText = hasSummaryTitle
                        ? `${schoolDisplay || 'Nama sekolah'}${degreeMajorParts ? `, ${degreeMajorParts}` : ''}`
                        : 'Universitas Indonesia, Sarjana - Keuangan dan Perbankan';

                    const dateHeader = formatHeaderDate(
                        edu.start_date,
                        edu.end_date,
                        edu.is_current,
                    );
                    const hasDates = Boolean(
                        edu.start_date || edu.end_date || edu.is_current,
                    );

                    return (
                        <div
                            key={index}
                            className="rounded-2xl border border-slate-200 bg-white shadow-xs transition-all"
                        >
                            {/* Card Accordion Bar */}
                            <div
                                className={`flex items-center justify-between rounded-t-2xl border-b border-slate-100 bg-white px-5 py-3.5 ${
                                    !isExpanded ? 'rounded-b-2xl' : ''
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="cursor-grab text-slate-400 hover:text-slate-600">
                                        <GripVertical className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p
                                            className={`text-sm font-medium ${
                                                hasSummaryTitle
                                                    ? 'font-semibold text-slate-800'
                                                    : 'text-slate-400'
                                            }`}
                                        >
                                            {titleText}
                                        </p>
                                        <p
                                            className={`text-xs ${
                                                hasDates
                                                    ? 'text-slate-500'
                                                    : 'text-slate-400'
                                            }`}
                                        >
                                            {dateHeader}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => toggleExpand(index)}
                                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                        aria-label="Buka rincian pendidikan"
                                    >
                                        {isExpanded ? (
                                            <ChevronUp className="h-4 w-4 text-slate-600" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-slate-600" />
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteEducation(index)
                                        }
                                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                                        title="Hapus pendidikan ini"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Card Body (Form Fields) */}
                            {isExpanded && (
                                <div className="space-y-4 p-5 sm:p-6">
                                    {/* Row 1: Nama sekolah & Lokasi */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-slate-700">
                                                Nama sekolah
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={
                                                        edu.institution_name ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        handleFieldChange(
                                                            index,
                                                            'institution_name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Universitas Indonesia"
                                                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 focus:outline-none"
                                                />
                                                {isFieldFilled(
                                                    edu.institution_name,
                                                ) && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                                                            <Check className="h-3 w-3 stroke-[3]" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-slate-700">
                                                Lokasi
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={edu.city || ''}
                                                    onChange={(e) =>
                                                        handleFieldChange(
                                                            index,
                                                            'city',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Jakarta"
                                                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 focus:outline-none"
                                                />
                                                {isFieldFilled(edu.city) && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                                                            <Check className="h-3 w-3 stroke-[3]" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 2: Gelar & Jurusan/Program Studi */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-slate-700">
                                                Gelar / Jenjang
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={edu.degree || ''}
                                                    onChange={(e) =>
                                                        handleFieldChange(
                                                            index,
                                                            'degree',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Contoh: Sarjana (S1) / Diploma (D3)"
                                                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 focus:outline-none"
                                                />
                                                {isFieldFilled(edu.degree) && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                                                            <Check className="h-3 w-3 stroke-[3]" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-slate-700">
                                                Jurusan / Program Studi
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={edu.field_of_study || ''}
                                                    onChange={(e) =>
                                                        handleFieldChange(
                                                            index,
                                                            'field_of_study',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Contoh: Teknik Informatika / Ilmu Komputer"
                                                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 focus:outline-none"
                                                />
                                                {isFieldFilled(edu.field_of_study) && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                                                            <Check className="h-3 w-3 stroke-[3]" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 3: Periode (Tanggal Mulai, Tanggal Akhir & Checkbox) */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                                                <div>
                                                    <label className="mb-1.5 block text-xs font-medium text-slate-700">
                                                        Tanggal mulai
                                                    </label>
                                                    <MonthYearPicker
                                                        value={edu.start_date}
                                                        onChange={(val) =>
                                                            handleFieldChange(
                                                                index,
                                                                'start_date',
                                                                val,
                                                            )
                                                        }
                                                        placeholder="YYYY"
                                                        align="left"
                                                    />
                                                </div>

                                                <div className="flex items-center justify-center pb-2.5 font-normal text-slate-400 select-none">
                                                    –
                                                </div>

                                                <div>
                                                    <label className="mb-1.5 block text-xs font-medium text-slate-700">
                                                        Tanggal akhir
                                                    </label>
                                                    <MonthYearPicker
                                                        value={edu.end_date}
                                                        onChange={(val) =>
                                                            handleFieldChange(
                                                                index,
                                                                'end_date',
                                                                val,
                                                            )
                                                        }
                                                        placeholder="YYYY"
                                                        disabled={Boolean(
                                                            edu.is_current,
                                                        )}
                                                        disabledText="—"
                                                        align="left"
                                                    />
                                                </div>
                                            </div>

                                            {/* Checkbox: Saya masih terdaftar */}
                                            <div className="flex items-center gap-2 pt-1">
                                                <input
                                                    type="checkbox"
                                                    id={`edu_is_current_${index}`}
                                                    checked={Boolean(
                                                        edu.is_current,
                                                    )}
                                                    onChange={(e) => {
                                                        const checked =
                                                            e.target.checked;
                                                        const updated = [
                                                            ...educations,
                                                        ];
                                                        updated[index] = {
                                                            ...updated[index],
                                                            is_current: checked,
                                                            ...(checked
                                                                ? {
                                                                      end_date:
                                                                          '',
                                                                  }
                                                                : {}),
                                                        };
                                                        onChange(updated);
                                                    }}
                                                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                                />
                                                <label
                                                    htmlFor={`edu_is_current_${index}`}
                                                    className="cursor-pointer text-xs text-slate-700 select-none"
                                                >
                                                    Saya masih terdaftar
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 4: Deskripsi (Tiptap Editor) */}
                                    <div>
                                        <div className="mb-1.5 flex items-center justify-between">
                                            <label className="block text-xs font-medium text-slate-700">
                                                Deskripsi
                                            </label>
                                            <AiInlineEnhanceButton
                                                type="education"
                                                currentText={edu.description ? edu.description.replace(/<[^>]*>/g, '').trim() : ''}
                                                context={{
                                                    institution: edu.institution_name,
                                                    degree: edu.degree,
                                                    field_of_study: edu.field_of_study || edu.degree,
                                                    start_date: edu.start_date,
                                                    end_date: edu.end_date,
                                                    is_current: edu.is_current,
                                                }}
                                                onApply={(enhancedText) => {
                                                    const clean = enhancedText.replace(/^[•\-\*\s]+/gm, '').trim();
                                                    const paragraphs = clean.split(/\r?\n\r?\n/).map(p => p.trim()).filter(Boolean);
                                                    const html = paragraphs.length > 0
                                                        ? paragraphs.map(p => `<p>${p.replace(/\r?\n/g, ' ')}</p>`).join('')
                                                        : `<p>${clean}</p>`;
                                                    handleFieldChange(index, 'description', html);
                                                }}
                                            />
                                        </div>
                                        <TiptapEditor
                                            value={edu.description || ''}
                                            onChange={(val) =>
                                                handleFieldChange(
                                                    index,
                                                    'description',
                                                    val,
                                                )
                                            }
                                            placeholder="Tuliskan fokus studi, mata kuliah utama, atau keaktifan akademik..."
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Add Education Button */}
                <button
                    type="button"
                    onClick={handleAddEducation}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 py-3 text-xs font-semibold text-slate-700 transition-all hover:border-sky-400 hover:bg-sky-50/50 hover:text-sky-700"
                >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Pendidikan</span>
                </button>
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50"
                >
                    Kembali
                </button>

                <button
                    type="button"
                    onClick={onNext}
                    className="rounded-lg bg-sky-500 px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-sky-600"
                >
                    Berikutnya: Keahlian
                </button>
            </div>
        </div>
    );
}
