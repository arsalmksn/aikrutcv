import React, { useState } from 'react';
import {
    X,
    ChevronUp,
    ChevronDown,
    Check,
    ArrowUpRight,
    Sparkles,
    MessageSquare,
    Zap,
} from 'lucide-react';
import {
    calculateCvScore,
    type ChecklistCategory,
    type ChecklistItem,
    type CvScoreResult,
    type ScoringCandidateInput,
} from '@/lib/cv-scoring';

interface CvAssistantDrawerProps {
    data: ScoringCandidateInput;
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
    onNavigateItem?: (item: ChecklistItem) => void;
}

export function CvAssistantDrawer({
    data,
    isOpen,
    onClose,
    onOpen,
    onNavigateItem,
}: CvAssistantDrawerProps) {
    const scoreResult: CvScoreResult = calculateCvScore(data);

    // Keep the first category expanded by default, or track expanded state per category
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
        info: true,
        impact: false,
        length: false,
        bullets: false,
        sections: false,
    });

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    // Circular progress stroke calculation
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (scoreResult.score / 100) * circumference;

    const getScoreColor = (score: number) => {
        if (score >= 80) return '#10b981'; // emerald-500
        if (score >= 50) return '#eab308'; // yellow-500
        return '#f97316'; // orange-500
    };

    const getScoreColorClass = (score: number) => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 50) return 'text-amber-500';
        return 'text-orange-500';
    };

    return (
        <>
            {/* Floating Trigger Button (Bottom-Right, matching reference screenshot) */}
            {!isOpen && (
                <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onOpen}
                        className="group flex items-center gap-2.5 rounded-full border border-sky-300/40 bg-white/95 px-3.5 py-2 text-xs font-semibold text-neutral-800 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-sky-400 hover:shadow-xl dark:border-sky-700/50 dark:bg-neutral-900/95 dark:text-neutral-100"
                    >
                        <div className="relative flex size-7 items-center justify-center rounded-full bg-sky-500 text-white shadow-xs">
                            <MessageSquare className="size-3.5" />
                            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-neutral-900 animate-pulse" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 leading-none">
                                Asisten CV
                            </span>
                            <span className="text-xs font-bold leading-tight mt-0.5">
                                Skor {scoreResult.score}%
                            </span>
                        </div>
                    </button>
                </div>
            )}

            {/* Backdrop Overlay */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
                />
            )}

            {/* Slide-over Right Drawer Panel */}
            <aside
                className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[380px] sm:max-w-[420px] flex-col bg-white text-neutral-900 shadow-2xl transition-transform duration-300 ease-in-out dark:bg-neutral-950 dark:text-neutral-100 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Drawer Header */}
                <div className="flex h-14 items-center justify-between border-b border-neutral-200/80 px-5 dark:border-neutral-800/80">
                    <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-sky-600 dark:text-sky-400" />
                        <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                            Asisten CV
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                        aria-label="Tutup Asisten CV"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Drawer Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {/* Header Score Card with Circular Progress Ring */}
                    <div className="flex items-center gap-4 rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/60">
                        {/* Circular Progress Ring */}
                        <div className="relative flex size-18 shrink-0 items-center justify-center">
                            <svg className="size-full -rotate-90" viewBox="0 0 64 64">
                                {/* Background Track Circle */}
                                <circle
                                    cx="32"
                                    cy="32"
                                    r={radius}
                                    stroke="#e5e7eb"
                                    strokeWidth="5"
                                    fill="transparent"
                                    className="dark:stroke-neutral-800"
                                />
                                {/* Dynamic Score Progress Circle */}
                                <circle
                                    cx="32"
                                    cy="32"
                                    r={radius}
                                    stroke={getScoreColor(scoreResult.score)}
                                    strokeWidth="5"
                                    fill="transparent"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    className="transition-all duration-700 ease-out"
                                />
                            </svg>
                            {/* Inner Percentage Text */}
                            <span
                                className={`absolute text-sm font-extrabold ${getScoreColorClass(
                                    scoreResult.score
                                )}`}
                            >
                                {scoreResult.score}%
                            </span>
                        </div>

                        {/* Motivational Greeting & Headline */}
                        <div className="flex-1 text-xs">
                            <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm leading-snug">
                                {scoreResult.headline}
                            </h3>
                            <p className="font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">
                                Skor CV Kamu {scoreResult.score}%.
                            </p>
                            <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed italic">
                                {scoreResult.motivationalText}
                            </p>
                        </div>
                    </div>

                    {/* Accordion Categories List */}
                    <div className="divide-y divide-neutral-200/80 border-y border-neutral-200/80 dark:divide-neutral-800 dark:border-neutral-800">
                        {scoreResult.categories.map((category) => {
                            const isExpanded = Boolean(expandedCategories[category.id]);
                            const progressPercent = Math.round(
                                (category.completedCount / category.totalCount) * 100
                            );

                            // Group items by sub-group if exists
                            const groupedItems: Record<string, ChecklistItem[]> = {};
                            category.items.forEach((item) => {
                                const groupKey = item.group || 'Umum';
                                if (!groupedItems[groupKey]) groupedItems[groupKey] = [];
                                groupedItems[groupKey].push(item);
                            });

                            return (
                                <div key={category.id} className="py-3.5">
                                    {/* Accordion Row Header */}
                                    <button
                                        type="button"
                                        onClick={() => toggleCategory(category.id)}
                                        className="flex w-full items-center justify-between gap-3 text-left group"
                                    >
                                        <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                            {category.title}
                                        </span>

                                        <div className="flex items-center gap-2.5">
                                            {/* Progress Bar & Counter */}
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-14 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                                                    <div
                                                        className="h-full bg-sky-500 rounded-full transition-all duration-500"
                                                        style={{ width: `${progressPercent}%` }}
                                                    />
                                                </div>
                                                <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 min-w-7 text-right">
                                                    {category.completedCount} / {category.totalCount}
                                                </span>
                                            </div>

                                            {isExpanded ? (
                                                <ChevronUp className="size-4 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
                                            ) : (
                                                <ChevronDown className="size-4 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Accordion Content Panel */}
                                    {isExpanded && (
                                        <div className="mt-3 space-y-3.5 pt-1 text-xs">
                                            {category.subtitle && (
                                                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                                    {category.subtitle}
                                                </p>
                                            )}

                                            {/* Render Subgroups and Checklist Items */}
                                            {Object.entries(groupedItems).map(([groupName, items]) => (
                                                <div
                                                    key={groupName}
                                                    className="rounded-xl bg-neutral-50/80 p-3.5 dark:bg-neutral-900/40 space-y-2.5 border border-neutral-100 dark:border-neutral-800/60"
                                                >
                                                    {groupName !== 'Umum' && (
                                                        <h4 className="text-xs font-bold text-sky-700 dark:text-sky-400 mb-1">
                                                            {groupName}
                                                        </h4>
                                                    )}

                                                    <div className="space-y-2.5">
                                                        {items.map((item) => (
                                                            <div
                                                                key={item.id}
                                                                onClick={() => onNavigateItem?.(item)}
                                                                role={onNavigateItem ? 'button' : undefined}
                                                                className={`group/item flex items-start gap-2.5 text-left transition-all rounded-lg p-1 -m-1 ${
                                                                    onNavigateItem
                                                                        ? 'cursor-pointer hover:bg-white dark:hover:bg-neutral-800/80'
                                                                        : ''
                                                                }`}
                                                            >
                                                                {/* Custom Checkbox Box */}
                                                                <div
                                                                    className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                                                        item.isCompleted
                                                                            ? 'border-sky-500 bg-sky-500 text-white shadow-xs'
                                                                            : 'border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-800'
                                                                    }`}
                                                                >
                                                                    {item.isCompleted && (
                                                                        <Check className="size-3 stroke-[3]" />
                                                                    )}
                                                                </div>

                                                                {/* Label & Details */}
                                                                <div className="flex-1 text-[11px] leading-snug">
                                                                    <div className="flex items-center justify-between gap-1">
                                                                        <span
                                                                            className={`font-medium ${
                                                                                item.isCompleted
                                                                                    ? 'text-neutral-800 dark:text-neutral-200'
                                                                                    : 'text-neutral-700 dark:text-neutral-300'
                                                                            }`}
                                                                        >
                                                                            {item.label}
                                                                        </span>
                                                                        {onNavigateItem && (
                                                                            <ArrowUpRight className="size-3 shrink-0 text-neutral-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                                                        )}
                                                                    </div>
                                                                    {item.tip && !item.isCompleted && (
                                                                        <p className="mt-0.5 text-[10px] text-neutral-400 dark:text-neutral-500 leading-tight">
                                                                            💡 {item.tip}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Drawer Footer with Quick Tip */}
                <div className="border-t border-neutral-200/80 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                        <Zap className="size-3.5 text-amber-500 shrink-0" />
                        <span>
                            Selesaikan setiap checklist untuk memaksimalkan peluang lolos seleksi ATS.
                        </span>
                    </div>
                </div>
            </aside>
        </>
    );
}
