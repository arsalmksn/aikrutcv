import React from 'react';
import {
    CAREER_CATEGORIES,
    type CareerCategoryItem,
} from '@/data/career-categories';
import { UserOnboardingWizard } from './UserOnboardingWizard';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose?: () => void;
    savedPeminatan?: string[];
    careerCategories?: CareerCategoryItem[];
}

export function OnboardingModal({
    isOpen,
    onClose,
    savedPeminatan = [],
    careerCategories = CAREER_CATEGORIES,
}: OnboardingModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
            <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh]">
                <UserOnboardingWizard
                    careerCategories={careerCategories}
                    savedPeminatan={savedPeminatan}
                    onClose={onClose}
                    isModal={true}
                />
            </div>
        </div>
    );
}
