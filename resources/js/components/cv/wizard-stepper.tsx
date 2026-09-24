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
        <div className="w-full border-b border-sky-100 bg-white/70 px-4 pt-4 pb-2 backdrop-blur-sm sm:px-6">
            <div className="relative mx-auto flex max-w-4xl items-center justify-between">
                {/* Connecting Line Track */}
                <div className="absolute top-[28px] right-0 left-0 -z-0 h-[2px] bg-sky-100" />

                {/* Active Progress Line */}
                <div
                    className="absolute top-[28px] left-0 -z-0 h-[2px] bg-sky-500 transition-all duration-300 ease-out"
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
                            className="group relative z-10 flex flex-col items-center focus:outline-none"
                        >
                            {/* Step Label */}
                            <span
                                className={`mb-2 text-xs font-semibold tracking-tight transition-colors duration-200 sm:text-sm ${
                                    isActive
                                        ? 'text-sky-600'
                                        : isCompleted
                                          ? 'text-gray-700 hover:text-sky-600'
                                          : 'text-gray-500 hover:text-gray-800'
                                }`}
                            >
                                {step.label}
                            </span>

                            {/* Circle Indicator */}
                            <div className="relative flex h-5 w-5 items-center justify-center">
                                {isActive ? (
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-sky-500 bg-white shadow-sm">
                                        <div className="h-2 w-2 rounded-full bg-sky-500" />
                                    </div>
                                ) : isCompleted ? (
                                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-white">
                                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                    </div>
                                ) : (
                                    <div className="h-3.5 w-3.5 rounded-full border-2 border-sky-200 bg-white transition-colors group-hover:border-sky-400" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
