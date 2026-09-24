import React, { useState, useEffect } from 'react';
import {
    Check,
    ChevronDown,
    GripVertical,
    Lightbulb,
    Pencil,
    Plus,
    Sparkles,
    Trash2,
    ArrowUp,
    ArrowDown,
} from 'lucide-react';
import type { CvSkillData } from '@/types/cv';

export interface SkillsStepProps {
    skills: CvSkillData[];
    onChange: (skills: CvSkillData[]) => void;
    onBack: () => void;
    onNext: () => void;
    desiredJobTitle?: string | null;
    isSaving?: boolean;
    showLevel?: boolean;
    onToggleShowLevel?: (show: boolean) => void;
}

export const SKILL_LEVELS = [
    { label: 'Pemula', value: 'Pemula', score: 1 },
    { label: 'Menengah', value: 'Menengah', score: 2 },
    { label: 'Terampil', value: 'Terampil', score: 3 },
    { label: 'Berpengalaman', value: 'Berpengalaman', score: 4 },
    { label: 'Ahli', value: 'Ahli', score: 5 },
];

export function getLevelScore(level?: string | null): number {
    if (!level) return 3; // Default level 3: Terampil
    const normalized = level.trim().toLowerCase();
    if (normalized === 'pemula' || normalized === 'beginner' || normalized === '1') return 1;
    if (normalized === 'menengah' || normalized === 'intermediate' || normalized === '2') return 2;
    if (normalized === 'terampil' || normalized === 'skillful' || normalized === '3') return 3;
    if (normalized === 'berpengalaman' || normalized === 'advanced' || normalized === 'mahir' || normalized === '4') return 4;
    if (normalized === 'ahli' || normalized === 'expert' || normalized === '5') return 5;
    return 3;
}

export function getLevelLabel(score: number): string {
    const item = SKILL_LEVELS.find((l) => l.score === score);
    return item ? item.label : 'Terampil';
}

const DEFAULT_SUGGESTIONS = [
    'Kerja Tim',
    'Manajemen Waktu',
    'Penyelesaian Masalah',
    'Komunikasi Efektif',
    'Berpikir Kritis',
    'Adaptasi Cepat',
    'Perhatian pada Detail',
];

export function SkillsStep({
    skills,
    onChange,
    onBack,
    onNext,
    desiredJobTitle,
    isSaving: _isSaving,
    showLevel: controlledShowLevel,
    onToggleShowLevel,
}: SkillsStepProps) {
    const [showTips, setShowTips] = useState(false);
    
    // Internal level toggle state if not controlled externally
    const [internalShowLevel, setInternalShowLevel] = useState<boolean>(() => {
        return skills.some((s) => Boolean(s.level));
    });

    const isLevelActive = controlledShowLevel !== undefined ? controlledShowLevel : internalShowLevel;

    const handleToggleLevel = () => {
        const nextState = !isLevelActive;
        if (onToggleShowLevel) {
            onToggleShowLevel(nextState);
        } else {
            setInternalShowLevel(nextState);
        }

        if (!nextState) {
            // Clear levels
            const updated = skills.map((s) => ({
                ...s,
                level: null,
            }));
            onChange(updated);
        } else {
            // Apply default level 'Terampil' or keep existing
            const updated = skills.map((s) => ({
                ...s,
                level: s.level || 'Terampil',
            }));
            onChange(updated);
        }
    };

    const handleFieldChange = (
        index: number,
        field: keyof CvSkillData,
        value: any,
    ) => {
        const updated = [...skills];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        onChange(updated);
    };

    const handleAddSkill = (skillName: string = '') => {
        const newSkill: CvSkillData = {
            name: skillName,
            level: isLevelActive ? 'Terampil' : null,
            sort_order: skills.length,
        };
        onChange([...skills, newSkill]);
    };

    const handleDeleteSkill = (index: number) => {
        const filtered = skills.filter((_, i) => i !== index);
        const reindexed = filtered.map((s, idx) => ({
            ...s,
            sort_order: idx,
        }));
        onChange(reindexed);
    };

    const handleMoveSkill = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= skills.length) return;

        const updated = [...skills];
        const [movedItem] = updated.splice(index, 1);
        updated.splice(targetIndex, 0, movedItem);

        const reindexed = updated.map((s, idx) => ({
            ...s,
            sort_order: idx,
        }));
        onChange(reindexed);
    };

    const isSkillAdded = (name: string) => {
        return skills.some(
            (s) => s.name.trim().toLowerCase() === name.trim().toLowerCase(),
        );
    };

    const handleSuggestionClick = (name: string) => {
        if (isSkillAdded(name)) {
            const filtered = skills.filter(
                (s) => s.name.trim().toLowerCase() !== name.trim().toLowerCase(),
            );
            onChange(filtered.map((s, idx) => ({ ...s, sort_order: idx })));
        } else {
            handleAddSkill(name);
        }
    };

    const displayJobTitle = desiredJobTitle?.trim() || 'full';

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                            Keahlian
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
                        <span>Tips keterampilan</span>
                        <ChevronDown
                            className={`h-3 w-3 text-amber-600 transition-transform ${
                                showTips ? 'rotate-180' : ''
                            }`}
                        />
                    </button>
                </div>

                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    Tambahkan keahlian profesional yang paling relevan.
                </p>

                {/* Collapsible Tips Content */}
                {showTips && (
                    <div className="mt-3.5 animate-in rounded-xl border border-amber-200/90 bg-amber-50/60 p-4 text-xs leading-relaxed text-amber-900 duration-200 fade-in slide-in-from-top-2">
                        <p className="mb-1 font-semibold text-amber-950">
                            💡 Tips Menuliskan Keahlian yang Efektif:
                        </p>
                        <ul className="list-inside list-disc space-y-1 text-amber-900/90">
                            <li>
                                Cantumkan 5–10 keahlian yang paling relevan dengan posisi pekerjaan yang Anda tuju.
                            </li>
                            <li>
                                Padukan antara <em>hard skills</em> (teknis/keahlian alat kerja) dan <em>soft skills</em> (komunikasi, kerja sama tim).
                            </li>
                            <li>
                                Gunakan istilah industri standar yang sering dicari oleh recruiter dan sistem ATS (Applicant Tracking System).
                            </li>
                            <li>
                                Aktifkan toggle <em>"Tampilkan level pengalaman"</em> untuk menampilkan rating kemahiran 5 tingkat.
                            </li>
                        </ul>
                    </div>
                )}

                {/* Level Toggle Switch */}
                <div className="mt-4 flex items-center gap-3">
                    <button
                        type="button"
                        role="switch"
                        aria-checked={isLevelActive}
                        onClick={handleToggleLevel}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                            isLevelActive ? 'bg-sky-500' : 'bg-slate-300'
                        }`}
                    >
                        <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                isLevelActive ? 'translate-x-5' : 'translate-x-0'
                            }`}
                        />
                    </button>
                    <label
                        onClick={handleToggleLevel}
                        className="cursor-pointer text-sm font-medium text-slate-700 select-none"
                    >
                        Tampilkan level pengalaman
                    </label>
                </div>
            </div>

            {/* Suggested Skills Box */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Sparkles className="h-4 w-4 text-sky-500 fill-sky-100" />
                        <span>
                            keahlian yang disarankan untuk{' '}
                            <span className="font-semibold text-sky-600">
                                {displayJobTitle}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Suggested Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                    {DEFAULT_SUGGESTIONS.map((suggestion) => {
                        const added = isSkillAdded(suggestion);
                        return (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className={`group inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all sm:text-sm ${
                                    added
                                        ? 'border-sky-300 bg-sky-50/80 text-sky-700 shadow-xs'
                                        : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50/40 hover:text-sky-700'
                                }`}
                            >
                                {added ? (
                                    <Check className="h-3.5 w-3.5 text-sky-600" />
                                ) : (
                                    <Plus className="h-3.5 w-3.5 text-slate-400 group-hover:text-sky-600" />
                                )}
                                <span>{suggestion}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Skills List */}
            <div className="space-y-3">
                {skills.map((skill, index) => {
                    const currentScore = getLevelScore(skill.level);
                    const currentLabel = getLevelLabel(currentScore);

                    return (
                        <div
                            key={index}
                            className="group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:border-slate-300"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                {/* Left Section: Drag Grip & Keahlian Input */}
                                <div className="flex flex-1 items-center gap-2.5">
                                    {/* Drag Grip Handle */}
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <span className="cursor-grab hover:text-slate-600">
                                            <GripVertical className="h-4 w-4" />
                                        </span>
                                        {skills.length > 1 && (
                                            <div className="hidden group-hover:flex items-center gap-0.5 mt-1">
                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMoveSkill(index, 'up')}
                                                        className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                                                        title="Pindah ke atas"
                                                    >
                                                        <ArrowUp className="h-3 w-3" />
                                                    </button>
                                                )}
                                                {index < skills.length - 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMoveSkill(index, 'down')}
                                                        className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                                                        title="Pindah ke bawah"
                                                    >
                                                        <ArrowDown className="h-3 w-3" />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Input Field */}
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-slate-600 mb-1">
                                            Keahlian
                                        </label>
                                        <input
                                            type="text"
                                            value={skill.name}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    index,
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Office 365"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
                                        />
                                    </div>
                                </div>

                                {/* Right Section: Level Bar & Delete Button */}
                                {isLevelActive && (
                                    <div className="flex items-center gap-3 pl-6 sm:pl-0">
                                        <div className="space-y-1">
                                            <label className="block text-xs text-slate-600">
                                                Tingkat —{' '}
                                                <span className="font-semibold text-sky-500">
                                                    {currentLabel}
                                                </span>
                                            </label>

                                            {/* 5-Segment Level Bar */}
                                            <div className="relative flex h-10 w-48 sm:w-52 items-center rounded-xl bg-sky-50/70 border border-sky-100 p-1">
                                                <div className="grid grid-cols-5 w-full h-full items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((score) => {
                                                        const isSelected = score === currentScore;
                                                        const levelItem = SKILL_LEVELS[score - 1];

                                                        return (
                                                            <button
                                                                key={score}
                                                                type="button"
                                                                onClick={() =>
                                                                    handleFieldChange(
                                                                        index,
                                                                        'level',
                                                                        levelItem.label,
                                                                    )
                                                                }
                                                                title={`Tingkat: ${levelItem.label} (${score}/5)`}
                                                                className={`relative h-full w-full rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                                                                    isSelected
                                                                        ? 'bg-sky-500 shadow-xs'
                                                                        : 'hover:bg-sky-200/50'
                                                                }`}
                                                            >
                                                                {!isSelected && score < 5 && (
                                                                    <span className="absolute right-0 top-1.5 bottom-1.5 w-px bg-sky-200/70 pointer-events-none" />
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delete Button */}
                                        <div className="self-end pb-1.5">
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteSkill(index)}
                                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                                title="Hapus keahlian"
                                                aria-label="Hapus keahlian"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Delete Button when level toggle is OFF */}
                                {!isLevelActive && (
                                    <div className="self-center">
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteSkill(index)}
                                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                            title="Hapus keahlian"
                                            aria-label="Hapus keahlian"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {skills.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-slate-500">
                        <p className="text-sm">
                            Belum ada keahlian yang ditambahkan.
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            Pilih keahlian yang disarankan di atas atau klik tombol tambah di bawah.
                        </p>
                    </div>
                )}
            </div>

            {/* Add Skill Button */}
            <button
                type="button"
                onClick={() => handleAddSkill('')}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/30 py-3 text-sm font-semibold text-sky-600 transition-all hover:border-sky-400 hover:bg-sky-50/80 hover:text-sky-700 cursor-pointer"
            >
                <Plus className="h-4 w-4" />
                <span>+ Tambah satu keahlian lagi</span>
            </button>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between pt-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-50 cursor-pointer"
                >
                    Kembali
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    className="rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-sky-600 cursor-pointer"
                >
                    Berikutnya: Ringkasan
                </button>
            </div>
        </div>
    );
}
