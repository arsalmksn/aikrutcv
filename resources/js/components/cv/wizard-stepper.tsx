import React from 'react';

export type StepId =
    | 'contact'
    | 'experience'
    | 'education'
    | 'skills'
    | 'summary'
    | 'finalize';

export interface StepItem {
    id: StepId;
    label: string;
}

export const STEPS: StepItem[] = [
    { id: 'contact', label: 'Kontak' },
    { id: 'experience', label: 'Pengalaman' },
    { id: 'education', label: 'Pendidikan' },
    { id: 'skills', label: 'Keahlian' },
    { id: 'summary', label: 'Ringkasan' },
    { id: 'finalize', label: 'Finalisasi' },
];

interface WizardStepperProps {
    currentStep: StepId;
    onStepChange: (step: StepId) => void;
}

export function WizardStepper({
    currentStep,
    onStepChange,
}: WizardStepperProps) {
    const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

    return (
        <div className="w-full border-b border-slate-200/90 bg-white/85 px-4 pt-4 pb-2 backdrop-blur-xs sm:px-6 dark:border-neutral-800 dark:bg-neutral-900/85">
            <div className="relative mx-auto flex max-w-4xl items-center justify-between">
                {/* Connecting Line Track */}
                <div className="absolute top-[28px] right-0 left-0 -z-0 h-[2px] bg-slate-200 dark:bg-neutral-800" />

                {/* Active Progress Line */}
                <div
                    className="absolute top-[28px] left-0 -z-0 h-[2px] bg-[#5025D1] transition-all duration-300 ease-out"
                    style={{
                        width: `${(currentIndex / (STEPS.length - 1)) * 100}%`,
                    }}
                />

                {STEPS.map((step, index) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = index < currentIndex;

                    return (
                        <button
                            key={step.id}
                            type="button"
                            onClick={() => onStepChange(step.id)}
                            className="group relative z-10 flex flex-col items-center focus:outline-none cursor-pointer"
                        >
                            {/* Step Label */}
                            <span
                                className={`mb-2 text-xs font-semibold tracking-tight transition-colors duration-200 sm:text-sm ${
                                    isActive
                                        ? 'text-[#5025D1] font-bold dark:text-indigo-400'
                                        : isCompleted
                                          ? 'text-[#172554] hover:text-[#5025D1] dark:text-neutral-200 dark:hover:text-indigo-400'
                                          : 'text-[#64748B] hover:text-[#172554] dark:text-neutral-400'
                                }`}
                            >
                                {step.label}
                            </span>

                            {/* Circle Indicator */}
                            <div className="relative flex h-5 w-5 items-center justify-center">
                                {isActive ? (
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#5025D1] bg-white shadow-xs">
                                        <div className="h-2 w-2 rounded-full bg-[#5025D1]" />
                                    </div>
                                ) : isCompleted ? (
                                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#5025D1] text-white">
                                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                    </div>
                                ) : (
                                    <div className="h-3.5 w-3.5 rounded-full border-2 border-slate-300 bg-white transition-colors group-hover:border-[#5025D1] dark:border-neutral-700 dark:bg-neutral-800" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
