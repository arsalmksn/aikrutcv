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
import type { CvExperienceData } from '@/types/cv';
import { MonthYearPicker } from '@/components/cv/month-year-picker';
import { TiptapEditor } from '@/components/cv/tiptap-editor';

interface ExperienceStepProps {
    experiences: CvExperienceData[];
    onChange: (experiences: CvExperienceData[]) => void;
    onBack: () => void;
    onNext: () => void;
    isSaving?: boolean;
}

export function ExperienceStep({
    experiences,
    onChange,
    onBack,
    onNext,
    isSaving: _isSaving,
}: ExperienceStepProps) {
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
        field: keyof CvExperienceData,
        value: any,
    ) => {
        const updated = [...experiences];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        onChange(updated);
    };

    const handleAddExperience = () => {
        const newExp: CvExperienceData = {
            company_name: '',
            position: '',
            city: '',
            start_date: '',
            end_date: '',
            is_current: false,
            description: '',
            sort_order: experiences.length,
        };
        const nextIndex = experiences.length;
        setExpandedIds((prev) => ({ ...prev, [nextIndex]: true }));
        onChange([...experiences, newExp]);
    };

    const handleDeleteExperience = (index: number) => {
        const filtered = experiences.filter((_, i) => i !== index);
        onChange(filtered);
    };

    const isFieldFilled = (val?: string | null) => {
        return Boolean(val && val.trim().length > 0);
    };

    // Helper to format a single date string (e.g. "02/2026" or "2026-02-01" -> "Feb 2026")
    const formatSingleMonthYear = (d?: string | null) => {
        if (!d) return '';
        const monthNames = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'Mei',
            'Jun',
            'Jul',
            'Agu',
            'Sep',
            'Okt',
            'Nov',
            'Des',
        ];
        if (/^\d{2}\/\d{4}$/.test(d)) {
            const [m, y] = d.split('/');
            const idx = parseInt(m, 10) - 1;
            return `${monthNames[idx] || m} ${y}`;
        }
        if (/^\d{4}-\d{2}/.test(d)) {
            const [y, m] = d.split('-');
            const idx = parseInt(m, 10) - 1;
            return `${monthNames[idx] || m} ${y}`;
        }
        return d;
    };

    // Format display date for card header
    const formatDisplayDate = (
        startDate?: string | null,
        endDate?: string | null,
        isCurrent?: boolean,
    ) => {
        const start = formatSingleMonthYear(startDate);
        if (!start) return 'Tanggal belum diisi';

        if (isCurrent) {
            return `${start} — Saat Ini`;
        }

        const end = formatSingleMonthYear(endDate);
        if (end) {
            return `${start} — ${end}`;
        }

        return start;
    };

    return (
        <div className="flex max-w-2xl flex-col space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                            Pengalaman
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
                        <span>Tips pengalaman kerja</span>
                        <ChevronDown
                            className={`h-3 w-3 text-amber-600 transition-transform ${
                                showTips ? 'rotate-180' : ''
                            }`}
                        />
                    </button>
                </div>

                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    Cantumkan pengalaman kerja Anda mulai dari posisi yang
                    paling baru.
                </p>

                {/* Collapsible Tips Content */}
                {showTips && (
                    <div className="mt-3.5 animate-in rounded-xl border border-amber-200/90 bg-amber-50/60 p-4 text-xs leading-relaxed text-amber-900 duration-200 fade-in slide-in-from-top-2">
                        <p className="mb-1 font-semibold text-amber-950">
                            💡 Tips Menulis Pengalaman Kerja Profesional:
                        </p>
                        <ul className="list-inside list-disc space-y-1 text-amber-900/90">
                            <li>
                                Gunakan kata kerja aksi di awal kalimat (misal:{' '}
                                <em>Mengembangkan, Mengoptimalkan, Memimpin</em>
                                ).
                            </li>
                            <li>
                                Sertakan metrik atau pencapaian kuantitatif
                                (contoh: <em>Meningkatkan retensi 25%</em>).
                            </li>
                            <li>
                                Tuliskan secara ringkas dalam format poin-poin
                                agar mudah dipindai oleh sistem ATS dan
                                perekrut.
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Experience Cards List */}
            <div className="space-y-4">
                {experiences.map((exp, index) => {
                    const isExpanded = expandedIds[index] !== false;
                    const positionDisplay = exp.position || 'Judul pekerjaan';
                    const companyDisplay = exp.company_name || 'Pemberi kerja';
                    const titleHeader = `${positionDisplay}, ${companyDisplay}`;
                    const dateHeader = formatDisplayDate(
                        exp.start_date,
                        exp.end_date,
                        exp.is_current,
                    );

                    return (
                        <div
                            key={index}
                            className="rounded-xl border border-slate-200 bg-white shadow-xs transition-all"
                        >
                            {/* Card Accordion Bar */}
                            <div
                                className={`flex items-center justify-between rounded-t-xl border-b border-slate-100 bg-white px-4 py-3.5 ${
                                    !isExpanded ? 'rounded-b-xl' : ''
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="cursor-grab text-slate-400 hover:text-slate-600">
                                        <GripVertical className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            {titleHeader}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {dateHeader}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => toggleExpand(index)}
                                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                        aria-label="Toggle details"
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
                                            handleDeleteExperience(index)
                                        }
                                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                                        title="Hapus posisi ini"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Card Body (Form Fields) */}
                            {isExpanded && (
                                <div className="space-y-4 p-4 sm:p-5">
                                    {/* Judul pekerjaan & Pemberi kerja */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-slate-700">
                                                Judul pekerjaan
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={exp.position || ''}
                                                    onChange={(e) =>
                                                        handleFieldChange(
                                                            index,
                                                            'position',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Contoh: RPL"
                                                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 focus:outline-none"
                                                />
                                                {isFieldFilled(
                                                    exp.position,
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
                                                Pemberi kerja
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={
                                                        exp.company_name || ''
                                                    }
                                                    onChange={(e) =>
                                                        handleFieldChange(
                                                            index,
                                                            'company_name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Contoh: UDB"
                                                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 focus:outline-none"
                                                />
                                                {isFieldFilled(
                                                    exp.company_name,
                                                ) && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                                                            <Check className="h-3 w-3 stroke-[3]" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lokasi, Tanggal Mulai, Tanggal Akhir */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-medium text-slate-700">
                                                Lokasi
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={exp.city || ''}
                                                    onChange={(e) =>
                                                        handleFieldChange(
                                                            index,
                                                            'city',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Contoh: Surakarta"
                                                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 focus:outline-none"
                                                />
                                                {isFieldFilled(exp.city) && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                                                            <Check className="h-3 w-3 stroke-[3]" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                                            <div>
                                                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                                                    Tanggal mulai
                                                </label>
                                                <MonthYearPicker
                                                    value={exp.start_date}
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
                                                    value={exp.end_date}
                                                    onChange={(val) =>
                                                        handleFieldChange(
                                                            index,
                                                            'end_date',
                                                            val,
                                                        )
                                                    }
                                                    placeholder="YYYY"
                                                    disabled={Boolean(
                                                        exp.is_current,
                                                    )}
                                                    disabledText="—"
                                                    align="left"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkbox: Saat ini bekerja di sini */}
                                    <div className="flex items-center gap-2 pt-1">
                                        <input
                                            type="checkbox"
                                            id={`is_current_${index}`}
                                            checked={Boolean(exp.is_current)}
                                            onChange={(e) => {
                                                const checked =
                                                    e.target.checked;
                                                const updated = [
                                                    ...experiences,
                                                ];
                                                updated[index] = {
                                                    ...updated[index],
                                                    is_current: checked,
                                                    ...(checked
                                                        ? { end_date: '' }
                                                        : {}),
                                                };
                                                onChange(updated);
                                            }}
                                            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                        />
                                        <label
                                            htmlFor={`is_current_${index}`}
                                            className="cursor-pointer text-xs text-slate-700 select-none"
                                        >
                                            Saat ini bekerja di sini
                                        </label>
                                    </div>

                                    {/* Deskripsi & Rich Toolbar (Tiptap) */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-slate-700">
                                            Deskripsi
                                        </label>
                                        <TiptapEditor
                                            value={exp.description || ''}
                                            onChange={(val) =>
                                                handleFieldChange(
                                                    index,
                                                    'description',
                                                    val,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Add Position Button */}
                <button
                    type="button"
                    onClick={handleAddExperience}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 py-3 text-xs font-semibold text-slate-700 transition-all hover:border-sky-400 hover:bg-sky-50/50 hover:text-sky-700"
                >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Pengalaman Kerja</span>
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
                    Berikutnya: Pendidikan
                </button>
            </div>
        </div>
    );
}
