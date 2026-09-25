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

export function CvLivePreview({
    contact,
    experiences = [],
    educations = [],
    skills = [],
    summary,
    showSkillsLevel,
    additionalData,
}: CvLivePreviewProps) {
    const fullName = [contact.first_name, contact.last_name]
        .filter(Boolean)
        .join(' ')
        .trim();

    return (
        <div className="flex h-full w-full items-start justify-center overflow-y-auto p-4 sm:p-6 lg:p-8">
            {/* A4 Paper Document */}
            <div className="relative min-h-[842px] w-full max-w-[595px] rounded-sm border border-slate-100 bg-white p-8 text-slate-900 shadow-[0_4px_25px_rgba(0,0,0,0.08)] transition-all sm:p-12">
                {/* Header: Desired Job Title */}
                <div className="mb-2 text-center">
                    <span className="text-[11px] font-bold tracking-wider text-slate-700 uppercase">
                        {contact.desired_job_title || 'DESIRED JOB TITLE'}
                    </span>
                </div>

                {/* Candidate Full Name */}
                <div className="mb-3 text-center">
                    <h1 className="font-serif text-2xl font-bold tracking-normal text-slate-900 lowercase first-letter:capitalize sm:text-3xl">
                        {fullName || 'Nama Lengkap'}
                    </h1>
                </div>

                {/* Contact Line */}
                <div className="mb-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[10px] text-slate-600 sm:text-[11px]">
                    {contact.email && (
                        <span>
                            <strong className="font-semibold text-slate-800">
                                Alamat email:
                            </strong>{' '}
                            {contact.email}
                        </span>
                    )}

                    {contact.email && contact.phone && <span>·</span>}

                    {contact.phone && (
                        <span>
                            <strong className="font-semibold text-slate-800">
                                Nomor telepon:
                            </strong>{' '}
                            {contact.phone}
                        </span>
                    )}

                    {(contact.city || contact.address) && (
                        <>
                            <span>·</span>
                            <span>
                                <strong className="font-semibold text-slate-800">
                                    Lokasi:
                                </strong>{' '}
                                {[contact.city, contact.address]
                                    .filter(Boolean)
                                    .join(', ')}
                            </span>
                        </>
                    )}

                    {contact.linkedin_url && (
                        <>
                            <span>·</span>
                            <span className="text-sky-700 underline">
                                {contact.linkedin_url.replace(
                                    /^https?:\/\//,
                                    '',
                                )}
                            </span>
                        </>
                    )}

                    {contact.website_url && (
                        <>
                            <span>·</span>
                            <span className="text-sky-700 underline">
                                {contact.website_url.replace(
                                    /^https?:\/\//,
                                    '',
                                )}
                            </span>
                        </>
                    )}
                </div>

                {/* Subtle Divider */}
                <div className="mb-6 border-b border-slate-200/80" />

                {/* Section: Ringkasan */}
                {summary && summary.trim().length > 0 && (
                    <div className="mb-6 space-y-2">
                        <div>
                            <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                                RINGKASAN
                            </h2>
                            <div className="mt-1.5 border-b border-slate-300" />
                        </div>
                        {summary.includes('<') ? (
                            <div
                                className="text-justify text-[11px] leading-relaxed text-slate-700 [&_a]:text-sky-600 [&_a]:underline [&_em]:italic [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:my-0.5 [&_s]:line-through [&_strong]:font-bold [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4"
                                dangerouslySetInnerHTML={{
                                    __html: summary,
                                }}
                            />
                        ) : (
                            <p className="text-justify text-[11px] leading-relaxed text-slate-700">
                                {summary}
                            </p>
                        )}
                    </div>
                )}

                {/* Section: Pengalaman */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                            PENGALAMAN
                        </h2>
                        <div className="mt-1.5 border-b border-slate-300" />
                    </div>

                    {experiences.length > 0 ? (
                        <div className="space-y-3.5">
                            {experiences.map((exp, idx) => {
                                const dateFormatted = formatPreviewDate(
                                    exp.start_date,
                                    exp.end_date,
                                    exp.is_current,
                                );

                                const companyAndLocation = [
                                    exp.company_name,
                                    exp.city,
                                ]
                                    .filter(Boolean)
                                    .join(' - ');

                                return (
                                    <div
                                        key={exp.id || idx}
                                        className="space-y-1 text-xs"
                                    >
                                        <div className="flex items-center justify-between font-bold text-slate-900">
                                            <span>
                                                {exp.position || 'Posisi'}
                                            </span>
                                            {dateFormatted && (
                                                <span className="font-normal text-slate-600">
                                                    {dateFormatted}
                                                </span>
                                            )}
                                        </div>

                                        {companyAndLocation && (
                                            <div className="text-slate-600">
                                                {companyAndLocation}
                                            </div>
                                        )}

                                        {exp.description &&
                                            (exp.description.includes('<') ? (
                                                <div
                                                    className="mt-1.5 text-justify text-[11px] leading-relaxed text-slate-600 [&_a]:text-sky-600 [&_a]:underline [&_em]:italic [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:my-0.5 [&_s]:line-through [&_strong]:font-bold [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4"
                                                    dangerouslySetInnerHTML={{
                                                        __html: exp.description,
                                                    }}
                                                />
                                            ) : (
                                                <div className="mt-1.5 space-y-0.5 text-justify text-[11px] leading-relaxed text-slate-600">
                                                    {exp.description
                                                        .split('\n')
                                                        .filter(
                                                            (line) =>
                                                                line.trim()
                                                                    .length > 0,
                                                        )
                                                        .map((line, lIdx) => (
                                                            <p key={lIdx}>
                                                                {line.startsWith(
                                                                    '•',
                                                                )
                                                                    ? line
                                                                    : `• ${line}`}
                                                            </p>
                                                        ))}
                                                </div>
                                            ))}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="space-y-1 text-xs">
                            <div className="flex items-center justify-between font-bold text-slate-900">
                                <span>RPL</span>
                                <span className="font-normal text-slate-600">
                                    Feb 2026
                                </span>
                            </div>
                            <div className="text-slate-600">
                                UDB - Surakarta
                            </div>
                            <p className="mt-2 text-justify text-[11px] leading-relaxed text-slate-600">
                                • Membantu laporan keuangan bulanan dan entri
                                data
                                <br />• Mengawasi anggaran tim dan melaporkan
                                masalah
                            </p>
                        </div>
                    )}
                </div>

                {/* Section: Pendidikan */}
                <div className="mt-6 space-y-4">
                    <div>
                        <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                            PENDIDIKAN
                        </h2>
                        <div className="mt-1.5 border-b border-slate-300" />
                    </div>

                    {educations && educations.length > 0 ? (
                        <div className="space-y-4">
                            {educations.map((edu, idx) => {
                                const dateRange = formatPreviewDate(
                                    edu.start_date,
                                    edu.end_date,
                                    edu.is_current,
                                );
                                const degreeAndField = [
                                    edu.degree,
                                    edu.field_of_study,
                                ]
                                    .filter(Boolean)
                                    .join(' — ');

                                return (
                                    <div
                                        key={idx}
                                        className="space-y-1 text-xs"
                                    >
                                        <div className="flex items-center justify-between font-bold text-slate-900">
                                            <span>
                                                {edu.institution_name ||
                                                    'Nama Universitas/Sekolah'}
                                            </span>
                                            {dateRange && (
                                                <span className="font-normal text-slate-600">
                                                    {dateRange}
                                                </span>
                                            )}
                                        </div>
                                        {(degreeAndField || edu.city) && (
                                            <div className="text-slate-600">
                                                {[degreeAndField, edu.city]
                                                    .filter(Boolean)
                                                    .join(', ')}
                                            </div>
                                        )}
                                        {edu.description &&
                                            (edu.description.includes('<') ? (
                                                <div
                                                    className="mt-1.5 text-justify text-[11px] leading-relaxed text-slate-600 [&_a]:text-sky-600 [&_a]:underline [&_em]:italic [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:my-0.5 [&_s]:line-through [&_strong]:font-bold [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4"
                                                    dangerouslySetInnerHTML={{
                                                        __html: edu.description,
                                                    }}
                                                />
                                            ) : (
                                                <p className="mt-1 text-justify text-[11px] leading-relaxed text-slate-600">
                                                    {edu.description}
                                                </p>
                                            ))}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="space-y-1 text-xs">
                            <div className="flex items-center justify-between font-bold text-slate-900">
                                <span>Universitas Duta Bangsa</span>
                                <span className="font-normal text-slate-600">
                                    2022 — 2026
                                </span>
                            </div>
                            <div className="text-slate-600">
                                Sarjana Teknik Informatika — IPK 3.85 / 4.00
                            </div>
                        </div>
                    )}
                </div>

                {/* Section: Keahlian (Skills) */}
                {(() => {
                    const validSkills = skills.filter(
                        (s) => s.name?.trim().length > 0,
                    );
                    if (validSkills.length === 0) return null;

                    const hasLevel =
                        showSkillsLevel !== undefined
                            ? showSkillsLevel
                            : validSkills.some((s) => Boolean(s.level));

                    return (
                        <div className="mt-6 space-y-3">
                            <div>
                                <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                                    KEAHLIAN
                                </h2>
                                <div className="mt-1.5 border-b border-slate-300" />
                            </div>

                            {hasLevel ? (
                                <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-1">
                                    {validSkills.map((s, idx) => {
                                        const score = getLevelScore(s.level);
                                        return (
                                            <div
                                                key={idx}
                                                className="space-y-1"
                                            >
                                                <div className="text-xs font-medium text-slate-800">
                                                    {s.name}
                                                </div>
                                                <div className="flex h-1.5 w-24 gap-1">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (seg) => (
                                                            <div
                                                                key={seg}
                                                                className={`h-full flex-1 rounded-xs transition-colors ${
                                                                    seg <= score
                                                                        ? 'bg-slate-900'
                                                                        : 'bg-slate-200'
                                                                }`}
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="pt-1 text-xs leading-relaxed text-slate-700">
                                    {validSkills
                                        .map((s) => s.name.trim())
                                        .join(' • ')}
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* Section: Bahasa */}
                {additionalData?.languages &&
                    additionalData.languages.filter((l) => l.name?.trim())
                        .length > 0 && (
                        <div className="mt-6 space-y-2">
                            <div>
                                <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                                    BAHASA
                                </h2>
                                <div className="mt-1.5 border-b border-slate-300" />
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-700">
                                {additionalData.languages
                                    .filter((l) => l.name?.trim())
                                    .map((lang, idx) => (
                                        <div
                                            key={idx}
                                            className="flex justify-between pr-4"
                                        >
                                            <span className="font-semibold text-slate-800">
                                                {lang.name}
                                            </span>
                                            <span className="text-[11px] text-slate-500">
                                                {lang.level}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                {/* Section: Sertifikasi & Lisensi */}
                {additionalData?.certifications &&
                    additionalData.certifications.filter((c) => c.name?.trim())
                        .length > 0 && (
                        <div className="mt-6 space-y-2">
                            <div>
                                <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                                    SERTIFIKASI & LISENSI
                                </h2>
                                <div className="mt-1.5 border-b border-slate-300" />
                            </div>
                            <div className="space-y-2 text-xs">
                                {additionalData.certifications
                                    .filter((c) => c.name?.trim())
                                    .map((cert, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between"
                                        >
                                            <div>
                                                <span className="font-semibold text-slate-900">
                                                    {cert.name}
                                                </span>
                                                {cert.issuer && (
                                                    <span className="text-slate-600">
                                                        {' '}
                                                        — {cert.issuer}
                                                    </span>
                                                )}
                                            </div>
                                            {cert.year && (
                                                <span className="font-mono text-[11px] text-slate-500">
                                                    {cert.year}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                {/* Section: Referensi */}
                {additionalData?.references &&
                    additionalData.references.filter((r) => r.name?.trim())
                        .length > 0 && (
                        <div className="mt-6 space-y-2">
                            <div>
                                <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                                    REFERENSI
                                </h2>
                                <div className="mt-1.5 border-b border-slate-300" />
                            </div>
                            <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                                {additionalData.references
                                    .filter((r) => r.name?.trim())
                                    .map((ref, idx) => (
                                        <div key={idx} className="space-y-0.5">
                                            <div className="font-semibold text-slate-900">
                                                {ref.name}
                                            </div>
                                            {ref.company && (
                                                <div className="text-[11px] text-slate-600">
                                                    {ref.company}
                                                </div>
                                            )}
                                            {ref.contact && (
                                                <div className="text-[11px] text-slate-500">
                                                    {ref.contact}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
}
