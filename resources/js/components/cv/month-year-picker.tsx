import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthYearPickerProps {
    value?: string | null;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    disabledText?: string;
    className?: string;
    id?: string;
    align?: 'left' | 'right';
}

const MONTHS = [
    { num: '01', short: 'Jan' },
    { num: '02', short: 'Feb' },
    { num: '03', short: 'Mar' },
    { num: '04', short: 'Apr' },
    { num: '05', short: 'Mei' },
    { num: '06', short: 'Jun' },
    { num: '07', short: 'Jul' },
    { num: '08', short: 'Agt' },
    { num: '09', short: 'Sep' },
    { num: '10', short: 'Okt' },
    { num: '11', short: 'Nov' },
    { num: '12', short: 'Des' },
];

/**
 * Format ISO (YYYY-MM-DD) or other formats to MM/YYYY
 */
function toMonthYearString(val?: string | null): string {
    if (!val) return '';
    const trimmed = val.trim();
    if (/^\d{2}\/\d{4}$/.test(trimmed)) {
        return trimmed;
    }
    if (/^\d{4}-\d{2}/.test(trimmed)) {
        const [y, m] = trimmed.split('-');
        return `${m}/${y}`;
    }
    return trimmed;
}

/**
 * Parse date string into month and year numbers
 */
function parseMonthYear(val?: string | null): {
    month: string | null;
    year: number | null;
} {
    if (!val) return { month: null, year: null };
    const str = toMonthYearString(val);
    if (/^\d{2}\/\d{4}$/.test(str)) {
        const [m, y] = str.split('/');
        return { month: m, year: parseInt(y, 10) };
    }
    return { month: null, year: null };
}

export function MonthYearPicker({
    value,
    onChange,
    placeholder = 'YYYY',
    disabled = false,
    disabledText = '—',
    className = '',
    id,
    align = 'left',
}: MonthYearPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'months' | 'years'>('months');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const now = new Date();
    const currentCalYear = now.getFullYear();

    const displayValue = disabled ? disabledText : toMonthYearString(value);
    const parsed = parseMonthYear(value);

    // Year currently being browsed in popover
    const [browsingYear, setBrowsingYear] = useState<number>(() => {
        return parsed.year || currentCalYear;
    });

    // 12-year window for year selector view
    const [yearWindowStart, setYearWindowStart] = useState<number>(() => {
        const base = parsed.year || currentCalYear;
        return Math.floor(base / 12) * 12;
    });

    // Keep browsingYear in sync if value changes externally
    useEffect(() => {
        if (parsed.year) {
            setBrowsingYear(parsed.year);
            setYearWindowStart(Math.floor(parsed.year / 12) * 12);
        }
    }, [value]);

    // Handle outside click & escape
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
                setViewMode('months');
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
                setViewMode('months');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleSelectMonth = (mNum: string) => {
        const formatted = `${mNum}/${browsingYear}`;
        onChange(formatted);
        setIsOpen(false);
        setViewMode('months');
    };

    const handleSelectYear = (yr: number) => {
        setBrowsingYear(yr);
        setViewMode('months');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/[^\d/]/g, '');
        // Auto-insert slash if user types 2 digits
        if (
            val.length === 2 &&
            !val.includes('/') &&
            e.target.value.length > (displayValue.length || 0)
        ) {
            val = `${val}/`;
        }
        if (val.length <= 7) {
            onChange(val);
        }
    };

    const isFilledAndValid = Boolean(
        !disabled &&
        value &&
        (/^\d{2}\/\d{4}$/.test(value.trim()) ||
            /^\d{4}-\d{2}/.test(value.trim())),
    );

    const years = Array.from({ length: 12 }, (_, i) => yearWindowStart + i);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <div className="relative">
                <input
                    ref={inputRef}
                    id={id}
                    type="text"
                    disabled={disabled}
                    value={displayValue}
                    placeholder={placeholder}
                    onFocus={() => {
                        if (!disabled) {
                            setIsOpen(true);
                            setViewMode('months');
                        }
                    }}
                    onClick={() => {
                        if (!disabled) {
                            setIsOpen(true);
                        }
                    }}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none ${
                        disabled
                            ? 'cursor-not-allowed border-dashed border-slate-200 bg-slate-100/70 text-slate-400'
                            : isOpen
                              ? 'border-sky-500 bg-white ring-2 ring-sky-100'
                              : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100'
                    } ${isFilledAndValid ? 'pr-10' : ''}`}
                />

                {isFilledAndValid && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                            <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                    </div>
                )}
            </div>

            {/* Popover Calendar */}
            {isOpen && !disabled && (
                <div
                    className={`absolute top-full z-50 mt-2 w-64 animate-in rounded-2xl border border-slate-100 bg-white p-5 shadow-xl duration-150 zoom-in-95 fade-in ${
                        align === 'right' ? 'right-0' : 'left-0'
                    }`}
                >
                    {/* Header: Year & Toggle */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        {viewMode === 'months' ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setYearWindowStart(
                                        Math.floor(browsingYear / 12) * 12,
                                    );
                                    setViewMode('years');
                                }}
                                className="group flex w-full cursor-pointer items-center justify-between text-sm font-medium text-slate-700 transition-colors hover:text-sky-600"
                            >
                                <span className="font-semibold text-slate-800 group-hover:text-sky-600">
                                    {browsingYear}
                                </span>
                                <ChevronDown className="h-4 w-4 text-slate-400 transition-colors group-hover:text-sky-600" />
                            </button>
                        ) : (
                            <div className="flex w-full items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setYearWindowStart((y) => y - 12)
                                    }
                                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <span className="text-xs font-semibold text-slate-700">
                                    {yearWindowStart} – {yearWindowStart + 11}
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setYearWindowStart((y) => y + 12)
                                    }
                                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Months Grid or Years Grid */}
                    {viewMode === 'months' ? (
                        <div className="grid grid-cols-3 gap-x-3 gap-y-6 pt-4 pb-1 text-center">
                            {MONTHS.map((m) => {
                                const isSelected =
                                    parsed.month === m.num &&
                                    parsed.year === browsingYear;

                                return (
                                    <button
                                        key={m.num}
                                        type="button"
                                        onClick={() => handleSelectMonth(m.num)}
                                        className={`cursor-pointer rounded-lg px-2 py-1.5 text-sm font-medium transition-colors ${
                                            isSelected
                                                ? 'bg-sky-50 font-bold text-sky-600'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-sky-600'
                                        }`}
                                    >
                                        {m.short}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2 pt-3">
                            {years.map((yr) => {
                                const isSelected = yr === browsingYear;
                                return (
                                    <button
                                        key={yr}
                                        type="button"
                                        onClick={() => handleSelectYear(yr)}
                                        className={`cursor-pointer rounded-lg py-2 text-xs font-semibold transition-all ${
                                            isSelected
                                                ? 'bg-sky-50 font-bold text-sky-600'
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                    >
                                        {yr}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
