import React from 'react';
import type {
    CvContactData,
    CvEducationData,
    CvExperienceData,
    CvSkillData,
} from '@/types/cv';
import { getLevelScore } from '@/components/cv/steps/skills-step';
import type { AdditionalSectionsData } from '@/components/cv/steps/additional-step';

interface CvLivePreviewProps {
    contact: CvContactData;
    experiences?: CvExperienceData[];
    educations?: CvEducationData[];
    skills?: CvSkillData[];
    summary?: string | null;
    showSkillsLevel?: boolean;
    additionalData?: AdditionalSectionsData;
    templateId?: number | null;
    templateName?: string | null;
    templateCategory?: string | null;
}

function formatPreviewDate(
    startDate?: string | null,
    endDate?: string | null,
    isCurrent?: boolean,
) {
    const formatSingle = (d?: string | null) => {
        if (!d) return '';
        if (/^\d{2}\/\d{4}$/.test(d)) {
            const [m, y] = d.split('/');
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
            const idx = parseInt(m, 10) - 1;
            return `${monthNames[idx] || m} ${y}`;
        }
        if (/^\d{4}-\d{2}/.test(d)) {
            const [y, m] = d.split('-');
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
            const idx = parseInt(m, 10) - 1;
            return `${monthNames[idx] || m} ${y}`;
        }
        return d;
    };

    const start = formatSingle(startDate);
    if (!start) return '';

    if (isCurrent) {
        return `${start} — Saat Ini`;
    }

    const end = formatSingle(endDate);
    if (end) {
        return `${start} — ${end}`;
    }

    return start;
}

function renderDescriptionBullets(description?: string | null, bulletColorClass = 'text-slate-800') {
    if (!description) return null;

    if (description.includes('<li')) {
        return (
            <div
                className={`mt-1 text-justify text-[11px] leading-relaxed ${bulletColorClass} [&_a]:text-sky-600 [&_a]:underline [&_em]:italic [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:my-0.5 [&_s]:line-through [&_strong]:font-bold [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4`}
                dangerouslySetInnerHTML={{ __html: description }}
            />
        );
    }

    const lines = description
        .split('\n')
        .map((l) => l.trim().replace(/^[•\-\*]\s*/, ''))
        .filter((l) => l.length > 0);

    if (lines.length === 0) return null;

    return (
        <ul className={`list-disc ml-5 mt-1 space-y-0.5 text-[11px] leading-relaxed ${bulletColorClass}`}>
            {lines.map((line, idx) => (
                <li key={idx}>{line}</li>
            ))}
        </ul>
    );
}

export function CvLivePreview({
    contact,
    experiences = [],
    educations = [],
    skills = [],
    summary,
    showSkillsLevel,
    additionalData,
    templateId,
    templateName,
    templateCategory,
}: CvLivePreviewProps) {
    const fullName = [contact.first_name, contact.last_name]
        .filter(Boolean)
        .join(' ')
        .trim();

    // Determine layout: Modern if templateName or templateCategory indicates modern
    const isModern =
        (templateCategory && templateCategory.toLowerCase() === 'modern') ||
        (templateName && templateName.toLowerCase().includes('modern'));

    const locationText = [contact.city, contact.address].filter(Boolean).join(', ');
    const linkedinClean = contact.linkedin_url ? contact.linkedin_url.replace(/^https?:\/\//, '') : '';
    const websiteClean = contact.website_url ? contact.website_url.replace(/^https?:\/\//, '') : '';

    const validSkills = skills.filter((s) => s.name?.trim().length > 0);
    const hasSkillLevel =
        showSkillsLevel !== undefined
            ? showSkillsLevel
            : validSkills.some((s) => Boolean(s.level));

    const hasCertifications = Boolean(additionalData?.certifications && additionalData.certifications.length > 0);
    const hasLanguages = Boolean(additionalData?.languages && additionalData.languages.length > 0);
    const hasReferences = Boolean(additionalData?.references && additionalData.references.length > 0);

    return (
        <div className="flex h-full w-full items-start justify-center overflow-y-auto p-4 sm:p-6 lg:p-8 font-sans">
            {/* A4 Paper Document */}
            <div className="relative min-h-[842px] w-full max-w-[595px] rounded-sm bg-white p-8 sm:p-12 text-slate-900 shadow-[0_4px_25px_rgba(0,0,0,0.08)] border border-slate-200/80 transition-all">
                {isModern ? (
                    /* ========================================== */
                    /* TEMPLATE ATS MODERN (Hendra Wijaya Style)  */
                    /* ========================================== */
                    <div>
                        {/* Header ATS Sederhana (Hendra Wijaya): Centered */}
                        <div className="text-center mb-4">
                            <h1 className="text-2xl sm:text-[26px] font-bold text-black uppercase tracking-wider mb-1">
                                {fullName || 'HENDRA WIJAYA'}
                            </h1>
                            <div className="text-[12px] font-semibold text-slate-800 mb-1">
                                {contact.desired_job_title || 'PENGACARA'}
                            </div>
                            {locationText && (
                                <div className="text-[11px] text-slate-600">
                                    {locationText}
                                </div>
                            )}
                            <div className="text-[11px] text-slate-600 mt-0.5 flex flex-wrap justify-center items-center gap-x-2">
                                {contact.email && <span>{contact.email}</span>}
                                {contact.phone && <span>· {contact.phone}</span>}
                                {linkedinClean && <span>· {linkedinClean}</span>}
                                {websiteClean && <span>· {websiteClean}</span>}
                            </div>
                            <div className="border-b-2 border-slate-900 mt-2.5 mb-3.5" />
                        </div>

                        {/* Ringkasan */}
                        {summary && summary.trim().length > 0 && (
                            <div className="mb-4">
                                <div className="font-bold text-[12px] text-black uppercase tracking-wider mb-1">
                                    RINGKASAN
                                </div>
                                {summary.includes('<') ? (
                                    <div
                                        className="text-justify text-[11px] leading-relaxed text-slate-800 [&_a]:text-sky-600 [&_a]:underline [&_em]:italic [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:my-0.5 [&_s]:line-through [&_strong]:font-bold [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4"
                                        dangerouslySetInnerHTML={{ __html: summary }}
                                    />
                                ) : (
                                    <p className="text-justify text-[11px] leading-relaxed text-slate-800">
                                        {summary}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Pengalaman */}
                        {experiences.length > 0 && (
                            <div className="mb-4">
                                <div className="font-bold text-[12px] text-black uppercase tracking-wider mb-1.5">
                                    PENGALAMAN
                                </div>
                                <div className="space-y-3">
                                    {experiences.map((exp, idx) => {
                                        const dateFormatted = formatPreviewDate(exp.start_date, exp.end_date, exp.is_current);
                                        return (
                                            <div key={exp.id || idx}>
                                                <div className="flex justify-between items-baseline font-bold text-[11.5px] text-black">
                                                    <span>{exp.position}{exp.company_name ? `, ${exp.company_name}` : ''}</span>
                                                    {dateFormatted && (
                                                        <span className="text-[10.5px] font-normal text-slate-600">
                                                            {dateFormatted}{exp.city ? ` | ${exp.city}` : ''}
                                                        </span>
                                                    )}
                                                </div>
                                                {renderDescriptionBullets(exp.description, 'text-slate-800')}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Pendidikan */}
                        {educations.length > 0 && (
                            <div className="mb-4">
                                <div className="font-bold text-[12px] text-black uppercase tracking-wider mb-1">
                                    PENDIDIKAN
                                </div>
                                <div className="space-y-2">
                                    {educations.map((edu, idx) => {
                                        const dateRange = formatPreviewDate(edu.start_date, edu.end_date, edu.is_current);
                                        const degreeLine = [edu.degree, edu.field_of_study].filter(Boolean).join(' | ');
                                        return (
                                            <div key={idx}>
                                                <div className="font-bold text-[11.5px] text-black">
                                                    {edu.institution_name} {edu.city ? `- ${edu.city} ` : ''}
                                                    {degreeLine && <span className="font-normal text-slate-700">| {degreeLine}</span>}
                                                </div>
                                                {dateRange && (
                                                    <div className="text-[10.5px] text-slate-600">
                                                        {dateRange}
                                                    </div>
                                                )}
                                                {renderDescriptionBullets(edu.description, 'text-slate-700')}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Keahlian (2 Kolom Bullet List Sesuai Kartu Hendra) */}
                        {validSkills.length > 0 && (
                            <div className="mb-4">
                                <div className="font-bold text-[12px] text-black uppercase tracking-wider mb-1">
                                    KEAHLIAN
                                </div>
                                <div className="grid grid-cols-2 gap-x-6 text-[11px] text-slate-800">
                                    <ul className="list-disc ml-4 space-y-1">
                                        {validSkills.slice(0, Math.ceil(validSkills.length / 2)).map((s, idx) => (
                                            <li key={idx}>
                                                {s.name}{s.level ? ` (${s.level})` : ''}
                                            </li>
                                        ))}
                                    </ul>
                                    <ul className="list-disc ml-4 space-y-1">
                                        {validSkills.slice(Math.ceil(validSkills.length / 2)).map((s, idx) => (
                                            <li key={idx}>
                                                {s.name}{s.level ? ` (${s.level})` : ''}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Informasi Tambahan */}
                        {(hasCertifications || hasLanguages || hasReferences) && (
                            <div className="mb-4">
                                <div className="font-bold text-[12px] text-black uppercase tracking-wider mb-1">
                                    INFORMASI TAMBAHAN
                                </div>
                                <ul className="list-disc ml-4 space-y-1 text-[11px] text-slate-800">
                                    {hasCertifications && (
                                        <li>
                                            <strong>Sertifikasi:</strong>{' '}
                                            {additionalData!.certifications
                                                .map((c) => `${c.name}${c.issuer ? ` (${c.issuer})` : ''}`)
                                                .join(', ')}
                                        </li>
                                    )}
                                    {hasLanguages && (
                                        <li>
                                            <strong>Bahasa:</strong>{' '}
                                            {additionalData!.languages
                                                .map((l) => `${l.name} (${l.level})`)
                                                .join(', ')}
                                        </li>
                                    )}
                                    {hasReferences && (
                                        <li>
                                            <strong>Referensi:</strong>{' '}
                                            {additionalData!.references
                                                .map((r) => `${r.name} - ${r.company}`)
                                                .join('; ')}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    /* ========================================== */
                    /* TEMPLATE ATS CLASSIC (Header Tengah)       */
                    /* ========================================== */
                    <div>
                        {/* Header Classic: Centered with Job Title on top and Serif Name */}
                        <div className="text-center mb-4">
                            {contact.desired_job_title && (
                                <div className="text-[11px] font-bold text-slate-900 tracking-wide mb-1 uppercase">
                                    {contact.desired_job_title}
                                </div>
                            )}
                            <h1 className="font-serif text-3xl sm:text-[32px] font-semibold tracking-tight text-slate-900 mb-1.5 leading-none">
                                {fullName || 'Ayu Sutanto'}
                            </h1>
                            <div className="text-[10px] sm:text-[10.5px] text-slate-700 flex flex-wrap justify-center items-center gap-x-1.5 gap-y-0.5 leading-snug">
                                {locationText && (
                                    <span>
                                        <strong className="font-bold text-slate-900">Alamat:</strong> {locationText}
                                    </span>
                                )}
                                {locationText && contact.email && <span>·</span>}
                                {contact.email && (
                                    <span>
                                        <strong className="font-bold text-slate-900">Alamat email:</strong> {contact.email}
                                    </span>
                                )}
                                {(contact.email || locationText) && contact.phone && <span>·</span>}
                                {contact.phone && (
                                    <span>
                                        <strong className="font-bold text-slate-900">Nomor telepon:</strong> {contact.phone}
                                    </span>
                                )}
                                {linkedinClean && (
                                    <>
                                        <span>·</span>
                                        <span className="text-sky-700 underline">{linkedinClean}</span>
                                    </>
                                )}
                                {websiteClean && (
                                    <>
                                        <span>·</span>
                                        <span className="text-sky-700 underline">{websiteClean}</span>
                                    </>
                                )}
                            </div>
                            <div className="border-b border-dotted border-slate-300 mt-3 mb-4" />
                        </div>

                        {/* Professional Objective / Ringkasan */}
                        {summary && summary.trim().length > 0 && (
                            <div className="mb-4">
                                <div className="font-bold text-[11px] uppercase tracking-wider text-black mb-1.5">
                                    RINGKASAN
                                </div>
                                {summary.includes('<') ? (
                                    <div
                                        className="text-justify text-[11px] leading-relaxed text-slate-800 [&_a]:text-black [&_a]:underline [&_em]:italic [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:my-0.5 [&_s]:line-through [&_strong]:font-bold [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4"
                                        dangerouslySetInnerHTML={{ __html: summary }}
                                    />
                                ) : (
                                    <p className="text-justify text-[11px] leading-relaxed text-slate-800">
                                        {summary}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Professional Experience & Projects */}
                        {experiences.length > 0 && (
                            <div className="mb-4">
                                <div className="font-bold text-[11px] uppercase tracking-wider text-black mb-2">
                                    PENGALAMAN
                                </div>
                                <div className="space-y-3">
                                    {experiences.map((exp, idx) => {
                                        const dateFormatted = formatPreviewDate(exp.start_date, exp.end_date, exp.is_current);
                                        const companyLocation = [exp.company_name, exp.city].filter(Boolean).join(' - ');
                                        return (
                                            <div key={exp.id || idx}>
                                                <div className="font-bold text-[11px] text-black">
                                                    {exp.position?.toUpperCase()}
                                                    {dateFormatted && (
                                                        <span className="font-normal text-slate-700"> | {dateFormatted}</span>
                                                    )}
                                                </div>
                                                {companyLocation && (
                                                    <div className="text-[10.5px] text-slate-700 mb-0.5">
                                                        {companyLocation}
                                                    </div>
                                                )}
                                                {renderDescriptionBullets(exp.description, 'text-slate-800')}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {educations.length > 0 && (
                            <div className="mb-4">
                                <div className="font-bold text-[11px] uppercase tracking-wider text-black mb-1.5">
                                    PENDIDIKAN
                                </div>
                                <div className="space-y-2">
                                    {educations.map((edu, idx) => {
                                        const dateRange = formatPreviewDate(edu.start_date, edu.end_date, edu.is_current);
                                        const institutionCity = [edu.institution_name, edu.city].filter(Boolean).join(' - ');
                                        return (
                                            <div key={idx}>
                                                <div className="font-bold text-[11px] text-black">
                                                    {institutionCity || 'Universitas Indonesia'}
                                                    {edu.degree && (
                                                        <span className="font-normal text-slate-700"> | {edu.degree}</span>
                                                    )}
                                                </div>
                                                {(edu.field_of_study || dateRange) && (
                                                    <div className="text-[10px] text-slate-700">
                                                        {edu.field_of_study}
                                                        {edu.field_of_study && dateRange ? ' | ' : ''}
                                                        {dateRange}
                                                    </div>
                                                )}
                                                {renderDescriptionBullets(edu.description, 'text-slate-800')}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Technical Skills */}
                        {validSkills.length > 0 && (
                            <div className="mb-4">
                                <div className="font-bold text-[11px] uppercase tracking-wider text-black mb-1.5">
                                    KEAHLIAN
                                </div>
                                {hasSkillLevel ? (
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-1 text-[11px]">
                                        {validSkills.map((s, idx) => {
                                            const score = getLevelScore(s.level);
                                            return (
                                                <div key={idx} className="flex items-center justify-between">
                                                    <span className="font-medium text-slate-900">{s.name}</span>
                                                    <div className="flex h-1.5 w-16 gap-1">
                                                        {[1, 2, 3, 4, 5].map((seg) => (
                                                            <div
                                                                key={seg}
                                                                className={`h-full flex-1 rounded-2xs ${
                                                                    seg <= score ? 'bg-slate-900' : 'bg-slate-200'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-x-4 text-[11px] leading-relaxed text-slate-800">
                                        <ul className="list-disc ml-5 space-y-0.5">
                                            {validSkills.slice(0, Math.ceil(validSkills.length / 2)).map((s, idx) => (
                                                <li key={idx}>{s.name}</li>
                                            ))}
                                        </ul>
                                        <ul className="list-disc ml-5 space-y-0.5">
                                            {validSkills.slice(Math.ceil(validSkills.length / 2)).map((s, idx) => (
                                                <li key={idx}>{s.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Certifications & Additional Info */}
                        {(hasCertifications || hasLanguages || hasReferences) && (
                            <div className="mb-4">
                                <div className="font-bold text-[11px] uppercase tracking-wider text-black mb-1.5">
                                    INFORMASI TAMBAHAN
                                </div>
                                <ul className="list-disc ml-5 space-y-1 text-[11px] leading-relaxed text-slate-800">
                                    {hasCertifications && (
                                        <li>
                                            <strong className="font-semibold text-slate-900">Sertifikasi:</strong>{' '}
                                            {additionalData!.certifications
                                                .map((c) => `${c.name}${c.issuer ? ` (${c.issuer})` : ''}`)
                                                .join(', ')}
                                        </li>
                                    )}
                                    {hasLanguages && (
                                        <li>
                                            <strong className="font-semibold text-slate-900">Bahasa:</strong>{' '}
                                            {additionalData!.languages
                                                .map((l) => `${l.name} (${l.level})`)
                                                .join(', ')}
                                        </li>
                                    )}
                                    {hasReferences && (
                                        <li>
                                            <strong className="font-semibold text-slate-900">Referensi:</strong>{' '}
                                            {additionalData!.references
                                                .map((r) => `${r.name} - ${r.company}`)
                                                .join('; ')}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
