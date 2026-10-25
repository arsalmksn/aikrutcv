import React from 'react';
import type {
    CvContactData,
    CvEducationData,
    CvExperienceData,
    CvSkillData,
    CvOrganizationData,
    CvCertificationData,
    CvAwardData,
    CvSummaryData,
} from '@/types/cv';
import { getLevelScore } from '@/components/cv/steps/skills-step';
import type { AdditionalSectionsData } from '@/components/cv/steps/additional-step';

export interface SampleTemplateProfile {
    fullName: string;
    desiredJobTitle: string;
    location: string;
    email: string;
    phone: string;
    summary: string;
    experiences: CvExperienceData[];
    educations: CvEducationData[];
    skills: CvSkillData[];
}

export const SAMPLE_TEMPLATE_DATA: Record<'modern' | 'classic', SampleTemplateProfile> = {
    modern: {
        fullName: 'HENDRA WIJAYA',
        desiredJobTitle: 'Pengacara',
        location: 'Jalan Pandley 55, Surabaya, Indonesia, 60223',
        email: 'hendra.jawas@email.id',
        phone: '+62 815 555 2671',
        summary:
            'Pengacara berpengalaman dan inovatif dengan semangat dan dedikasi pada keadilan. Sangat terorganisir, dan terampil dalam berpikir kritis cepat dan tepat. Membantu klien yang terlibat dalam masalah hukum yang menguntungkan bagi klien. Mahir dalam mempersiapkan persidangan, merangkum dokumen, dan mengikuti kasus di pengadilan secara efektif.',
        experiences: [
            {
                id: 1,
                company_name: 'PT Pengacara Madiun & Timber',
                position: 'Pengacara',
                city: 'Surabaya',
                start_date: '05/2018',
                end_date: '07/2021',
                is_current: false,
                description:
                    '• Melakukan riset mendalam untuk memastikan pemahaman tentang kasus.\n• Menyiapkan dokumen legal tanpa kesalahan dan tepat waktu.\n• Menganalisis berkas perkara sesuai situasi dan regulasi hukum.\n• Mengajukan bukti dan mempresentasikan kasus kepada hakim.',
                sort_order: 0,
            },
        ],
        educations: [
            {
                id: 1,
                institution_name: 'Universitas Airlangga',
                degree: 'Sarjana Hukum',
                field_of_study: 'Hukum Bisnis',
                city: 'Surabaya',
                start_date: '2013',
                end_date: '2017',
                is_current: false,
                description: 'Hukum Bisnis | 2013 - 2017',
                sort_order: 0,
            },
        ],
        skills: [
            { id: 1, name: 'Litigasi Perdata & Pidana', level: null, sort_order: 0 },
            { id: 2, name: 'Penyusunan Kontrak Bisnis', level: null, sort_order: 1 },
            { id: 3, name: 'Negosiasi & Mediasi Hukum', level: null, sort_order: 2 },
            { id: 4, name: 'Riset Yurisprudensi', level: null, sort_order: 3 },
        ],
    },
    classic: {
        fullName: 'Ayu Sutanto',
        desiredJobTitle: 'Asosiasi Penjualan Senior',
        location: 'Jakarta, JK, 10220',
        email: 'ayu.sutanto@example.id',
        phone: '+62 812-789-1234',
        summary:
            'Analis Senior dengan pengalaman lebih dari 5 tahun dalam analisis data, intelijen bisnis, dan optimisasi proses. Terampil dalam mendorong efisiensi operasional, peramalan, dan memimpin strategi berbasis data untuk mendukung keputusan bisnis.',
        experiences: [
            {
                id: 1,
                company_name: 'PT Lentera & Lampu',
                position: 'ANALIS SENIOR',
                city: 'Jakarta, 10110',
                start_date: '06/2021',
                end_date: '',
                is_current: true,
                description:
                    '• Mengarahkan analisis data dan pelaporan fungsi bisnis kunci.\n• Melakukan benchmarking kompetitif untuk keputusan strategis.',
                sort_order: 0,
            },
            {
                id: 2,
                company_name: 'PT Willow & Wren',
                position: 'ANALIS BISNIS',
                city: 'Jakarta, 10220',
                start_date: '01/2019',
                end_date: '05/2021',
                is_current: false,
                description:
                    '• Menganalisis data besar untuk peluang optimasi proses bisnis.\n• Membuat dasbor metrik KPI antar-departemen.',
                sort_order: 1,
            },
        ],
        educations: [
            {
                id: 1,
                institution_name: 'Universitas Indonesia',
                degree: 'Sarjana Sains',
                field_of_study: 'Ekonomi',
                city: 'Jakarta',
                start_date: '2013',
                end_date: '2017',
                is_current: false,
                description: 'Ekonomi | 2013 - 2017',
                sort_order: 0,
            },
        ],
        skills: [
            { id: 1, name: 'Manajemen Proyek', level: null, sort_order: 0 },
            { id: 2, name: 'SQL & Excel', level: null, sort_order: 1 },
            { id: 3, name: 'Keputusan Berbasis Data', level: null, sort_order: 2 },
            { id: 4, name: 'Analisis Keuangan', level: null, sort_order: 3 },
        ],
    },
};

interface CvLivePreviewProps {
    contact: CvContactData;
    experiences?: CvExperienceData[];
    educations?: CvEducationData[];
    skills?: CvSkillData[];
    summary?: string | null;
    showSkillsLevel?: boolean;
    additionalData?: AdditionalSectionsData;
    organizations?: CvOrganizationData[];
    certifications?: CvCertificationData[];
    awards?: CvAwardData[];
    templateId?: number | null;
    templateName?: string | null;
    templateCategory?: string | null;
}

export function formatPreviewDate(
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

export function renderDescriptionBullets(
    description?: string | null,
    bulletColorClass = 'text-slate-800',
    textSizeClass = 'text-[11px]'
) {
    if (!description) return null;

    const textOnly = description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    if (!textOnly) return null;

    if (/<[a-z][\s\S]*>/i.test(description)) {
        return (
            <div
                className={`mt-1 text-justify ${textSizeClass} leading-relaxed ${bulletColorClass} [&_a]:text-sky-600 [&_a]:underline [&_em]:italic [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:my-0.5 [&_s]:line-through [&_strong]:font-bold [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4`}
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
        <ul className={`list-disc ml-4 mt-1 space-y-0.5 ${textSizeClass} leading-relaxed ${bulletColorClass}`}>
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
    organizations = [],
    certifications = [],
    awards = [],
    templateId,
    templateName,
    templateCategory,
}: CvLivePreviewProps) {
    const fullName = [contact?.first_name, contact?.last_name]
        .filter(Boolean)
        .join(' ')
        .trim();

    // Determine layout: Modern if templateName or templateCategory indicates modern
    const isModern =
        (templateCategory && templateCategory.toLowerCase() === 'modern') ||
        (templateName && templateName.toLowerCase().includes('modern'));

    const sample = isModern ? SAMPLE_TEMPLATE_DATA.modern : SAMPLE_TEMPLATE_DATA.classic;

    const activeFullName = fullName || sample.fullName;
    const activeJobTitle = contact?.desired_job_title || sample.desiredJobTitle;
    const rawLocation = [contact?.city, contact?.address].filter(Boolean).join(', ');
    const activeLocation = rawLocation || sample.location;
    const activeEmail = contact?.email || sample.email;
    const activePhone = contact?.phone || sample.phone;
    const activeSummary = summary && summary.trim().length > 0 ? summary : sample.summary;

    const validUserExperiences = (experiences || []).filter(
        (e) => (e.company_name && e.company_name.trim().length > 0) || (e.position && e.position.trim().length > 0)
    );
    const activeExperiences = validUserExperiences.length > 0 ? validUserExperiences : sample.experiences;

    const validUserEducations = (educations || []).filter(
        (e) => (e.institution_name && e.institution_name.trim().length > 0) || (e.degree && e.degree.trim().length > 0)
    );
    const activeEducations = validUserEducations.length > 0 ? validUserEducations : sample.educations;

    const validSkills = (skills || []).filter((s) => s.name && s.name.trim().length > 0);
    const activeSkills = validSkills.length > 0 ? validSkills : sample.skills;

    const linkedinClean = contact?.linkedin_url ? contact.linkedin_url.replace(/^https?:\/\//, '') : '';
    const websiteClean = contact?.website_url ? contact.website_url.replace(/^https?:\/\//, '') : '';

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
                                {activeFullName}
                            </h1>
                            <div className="text-[12px] font-semibold text-slate-800 mb-1">
                                {activeJobTitle}
                            </div>
                            {activeLocation && (
                                <div className="text-[11px] text-slate-600">
                                    {activeLocation}
                                </div>
                            )}
                            <div className="text-[11px] text-slate-600 mt-0.5 flex flex-wrap justify-center items-center gap-x-2">
                                {activeEmail && <span>{activeEmail}</span>}
                                {activePhone && <span>· {activePhone}</span>}
                                {linkedinClean && <span>· {linkedinClean}</span>}
                                {websiteClean && <span>· {websiteClean}</span>}
                            </div>
                            {contact?.expected_salary && (
                                <div className="text-[11px] text-slate-700 font-medium mt-1">
                                    Ekspektasi Gaji: {contact.expected_salary}
                                </div>
                            )}
                            <div className="border-b-2 border-slate-900 mt-2.5 mb-3.5" />
                        </div>

                        {/* Ringkasan */}
                        {activeSummary && (
                            <div className="mb-4">
                                <div className="font-bold text-[12px] text-black uppercase tracking-wider mb-1">
                                    RINGKASAN
                                </div>
                                {activeSummary.includes('<') ? (
                                    <div
                                        className="text-justify text-[11px] leading-relaxed text-slate-800 [&_a]:text-sky-600 [&_a]:underline [&_em]:italic [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:my-0.5 [&_s]:line-through [&_strong]:font-bold [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4"
                                        dangerouslySetInnerHTML={{ __html: activeSummary }}
                                    />
                                ) : (
                                    <p className="text-justify text-[11px] leading-relaxed text-slate-800">
                                        {activeSummary}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Pengalaman */}
                        {activeExperiences.length > 0 && (
                            <div className="mb-4">
                                <div className="font-bold text-[12px] text-black uppercase tracking-wider mb-1.5">
                                    PENGALAMAN
                                </div>
                                <div className="space-y-3">
                                    {activeExperiences.map((exp, idx) => {
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
                        {activeEducations.length > 0 && (
                            <div className="mb-4">
                                <div className="font-bold text-[12px] text-black uppercase tracking-wider mb-1">
                                    PENDIDIKAN
                                </div>
                                <div className="space-y-2">
                                    {activeEducations.map((edu, idx) => {
                                        const dateRange = formatPreviewDate(edu.start_date, edu.end_date, edu.is_current);
                                        const degreeLine = [edu.degree, edu.field_of_study].filter(Boolean).join(' | ');
                                        return (
                                            <div key={edu.id || idx}>
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

                        {/* Organisasi */}
                        {organizations && organizations.length > 0 && (
                            <div className="mb-4">
                                <div className="font-bold text-[12px] text-black uppercase tracking-wider mb-2">
                                    ORGANISASI
                                </div>
                                <div className="space-y-3">
                                    {organizations.map((org, index) => (
                                        <div key={org.id || index} className="text-[11px] leading-snug">
                                            <div className="font-bold text-[11.5px] text-black">
                                                {org.role}{org.organization_name ? `, ${org.organization_name}` : ''}
                                            </div>
                                            {(org.start_date || org.end_date || org.duration) && (
                                                <div className="text-[10.5px] text-slate-600">
                                                    {org.start_date || ''}{org.start_date && (org.end_date || org.duration) ? ' — ' : ''}{org.end_date || org.duration || ''}
                                                </div>
                                            )}
                                            {renderDescriptionBullets(org.description, 'text-slate-700')}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sertifikasi */}
                        {((certifications && certifications.length > 0) || (additionalData?.certifications && additionalData.certifications.length > 0)) && (
                            <div className="mb-4">
                                <div className="font-bold text-[12px] text-black uppercase tracking-wider mb-2">
                                    SERTIFIKASI & LISENSI
                                </div>
                                <div className="space-y-2 text-[11px] text-slate-800">
                                    {certifications && certifications.length > 0 ? (
                                        certifications.map((c, idx) => (
                                            <div key={c.id || idx} className="flex justify-between items-start">
                                                <div>
                                                    <span className="font-semibold text-black">{c.name}</span>
                                                    {c.issuer && <span className="text-slate-600"> | {c.issuer}</span>}
                                                </div>
                                                <div className="text-[10.5px] text-slate-500">
                                                    {c.issue_date}{c.issue_date && (c.expiration_date || c.validity_period) ? ' — ' : ''}{c.expiration_date || c.validity_period || ''}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        additionalData?.certifications.map((c, idx) => (
                                            <div key={idx} className="flex justify-between items-start">
                                                <div>
                                                    <span className="font-semibold text-black">{c.name}</span>
                                                    {c.issuer && <span className="text-slate-600"> | {c.issuer}</span>}
                                                </div>
                                                <div className="text-[10.5px] text-slate-500">
                                                    {c.year}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Prestasi / Awards */}
                        {awards && awards.length > 0 && (
                            <div className="mb-4">
                                <div className="font-bold text-[12px] text-black uppercase tracking-wider mb-2">
                                    PRESTASI & PENGHARGAAN
                                </div>
                                <div className="space-y-2 text-[11px] text-slate-800">
                                    {awards.map((a, idx) => (
                                        <div key={a.id || idx} className="leading-snug">
                                            <div className="flex justify-between items-start">
                                                <div className="font-semibold text-black">
                                                    {a.title}
                                                    {a.subtitle && <span className="font-normal text-slate-600"> | {a.subtitle}</span>}
                                                </div>
                                                {a.year && <span className="text-[10.5px] text-slate-500">{a.year}</span>}
                                            </div>
                                            {renderDescriptionBullets(a.description, 'text-slate-700')}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Keahlian (2 Kolom Bullet List) */}
                        {activeSkills.length > 0 && (
                            <div className="mb-4">
                                <div className="font-bold text-[12px] text-black uppercase tracking-wider mb-1">
                                    KEAHLIAN
                                </div>
                                <div className="grid grid-cols-2 gap-x-6 text-[11px] text-slate-800">
                                    <ul className="list-disc ml-4 space-y-1">
                                        {activeSkills.slice(0, Math.ceil(activeSkills.length / 2)).map((s, idx) => (
                                            <li key={idx}>
                                                {s.name}{s.level ? ` (${s.level})` : ''}
                                            </li>
                                        ))}
                                    </ul>
                                    <ul className="list-disc ml-4 space-y-1">
                                        {activeSkills.slice(Math.ceil(activeSkills.length / 2)).map((s, idx) => (
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
                            {activeJobTitle && (
                                <div className="text-[11px] font-bold text-slate-900 tracking-wide mb-1 uppercase">
                                    {activeJobTitle}
                                </div>
                            )}
                            <h1 className="font-serif text-3xl sm:text-[32px] font-semibold tracking-tight text-slate-900 mb-1.5 leading-none">
                                {activeFullName}
                            </h1>
                            <div className="text-[10px] sm:text-[10.5px] text-slate-700 flex flex-wrap justify-center items-center gap-x-1.5 gap-y-0.5 leading-snug">
                                {activeLocation && (
                                    <span>
                                        <strong className="font-bold text-slate-900">Alamat:</strong> {activeLocation}
                                    </span>
                                )}
                                {activeLocation && activeEmail && <span>·</span>}
                                {activeEmail && (
                                    <span>
                                        <strong className="font-bold text-slate-900">Alamat email:</strong> {activeEmail}
                                    </span>
                                )}
                                {(activeEmail || activeLocation) && activePhone && <span>·</span>}
                                {activePhone && (
                                    <span>
                                        <strong className="font-bold text-slate-900">Nomor telepon:</strong> {activePhone}
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
                            {contact?.expected_salary && (
                                <div className="text-[10.5px] text-slate-800 mt-1">
                                    <strong className="font-bold text-slate-900">Ekspektasi Gaji:</strong> {contact.expected_salary}
                                </div>
                            )}
                            <div className="border-b border-dotted border-slate-300 mt-3 mb-4" />
                        </div>

                        {/* Professional Objective / Ringkasan */}
                        {activeSummary && (
                            <div className="mb-4">
                                <div className="font-bold text-[11px] uppercase tracking-wider text-black mb-1.5">
                                    RINGKASAN
                                </div>
                                {activeSummary.includes('<') ? (
                                    <div
                                        className="text-justify text-[11px] leading-relaxed text-slate-800 [&_a]:text-black [&_a]:underline [&_em]:italic [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:my-0.5 [&_s]:line-through [&_strong]:font-bold [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4"
                                        dangerouslySetInnerHTML={{ __html: activeSummary }}
                                    />
                                ) : (
                                    <p className="text-justify text-[11px] leading-relaxed text-slate-800">
                                        {activeSummary}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Professional Experience & Projects */}
                        {activeExperiences.length > 0 && (
                            <div className="mb-4">
                                <div className="font-bold text-[11px] uppercase tracking-wider text-black mb-2">
                                    PENGALAMAN
                                </div>
                                <div className="space-y-3">
                                    {activeExperiences.map((exp, idx) => {
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
                        {activeEducations.length > 0 && (
                            <div className="mb-4">
                                <div className="font-bold text-[11px] uppercase tracking-wider text-black mb-1.5">
                                    PENDIDIKAN
                                </div>
                                <div className="space-y-2">
                                    {activeEducations.map((edu, idx) => {
                                        const dateRange = formatPreviewDate(edu.start_date, edu.end_date, edu.is_current);
                                        const institutionCity = [edu.institution_name, edu.city].filter(Boolean).join(' - ');
                                        return (
                                            <div key={edu.id || idx}>
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

                        {/* Organizations */}
                        {organizations && organizations.length > 0 && (
                            <div className="mb-4">
                                <div className="font-bold text-[11px] uppercase tracking-wider text-black mb-1.5">
                                    ORGANISASI
                                </div>
                                <div className="space-y-2">
                                    {organizations.map((org, idx) => (
                                        <div key={org.id || idx} className="text-[11px]">
                                            <div className="font-bold text-[11px] text-black">
                                                {org.role}{org.organization_name ? `, ${org.organization_name}` : ''}
                                            </div>
                                            {(org.start_date || org.end_date || org.duration) && (
                                                <div className="text-[10px] text-slate-600">
                                                    {org.start_date || ''}{org.start_date && (org.end_date || org.duration) ? ' – ' : ''}{org.end_date || org.duration || ''}
                                                </div>
                                            )}
                                            {renderDescriptionBullets(org.description, 'text-slate-800')}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Certifications */}
                        {((certifications && certifications.length > 0) || (additionalData?.certifications && additionalData.certifications.length > 0)) && (
                            <div className="mb-4">
                                <div className="font-bold text-[11px] uppercase tracking-wider text-black mb-1.5">
                                    SERTIFIKASI & LISENSI
                                </div>
                                <div className="space-y-1 text-[11px]">
                                    {certifications && certifications.length > 0 ? (
                                        certifications.map((c, idx) => (
                                            <div key={c.id || idx} className="flex justify-between items-start">
                                                <div>
                                                    <span className="font-semibold text-black">{c.name}</span>
                                                    {c.issuer && <span className="text-slate-700"> | {c.issuer}</span>}
                                                </div>
                                                <div className="text-[10px] text-slate-600">
                                                    {c.issue_date}{c.issue_date && (c.expiration_date || c.validity_period) ? ' – ' : ''}{c.expiration_date || c.validity_period || ''}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        additionalData?.certifications.map((c, idx) => (
                                            <div key={idx} className="flex justify-between items-start">
                                                <div>
                                                    <span className="font-semibold text-black">{c.name}</span>
                                                    {c.issuer && <span className="text-slate-700"> | {c.issuer}</span>}
                                                </div>
                                                <div className="text-[10px] text-slate-600">
                                                    {c.year}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Honors & Awards */}
                        {awards && awards.length > 0 && (
                            <div className="mb-4">
                                <div className="font-bold text-[11px] uppercase tracking-wider text-black mb-1.5">
                                    PRESTASI & PENGHARGAAN
                                </div>
                                <div className="space-y-1.5 text-[11px]">
                                    {awards.map((a, idx) => (
                                        <div key={a.id || idx}>
                                            <div className="flex justify-between items-start">
                                                <div className="font-semibold text-black">
                                                    {a.title}
                                                    {a.subtitle && <span className="font-normal text-slate-700"> | {a.subtitle}</span>}
                                                </div>
                                                {a.year && <span className="text-[10px] text-slate-600">{a.year}</span>}
                                            </div>
                                            {renderDescriptionBullets(a.description, 'text-slate-800')}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Technical Skills */}
                        {activeSkills.length > 0 && (
                            <div className="mb-4">
                                <div className="font-bold text-[11px] uppercase tracking-wider text-black mb-1.5">
                                    KEAHLIAN
                                </div>
                                {hasSkillLevel ? (
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-1 text-[11px]">
                                        {activeSkills.map((s, idx) => {
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
                                            {activeSkills.slice(0, Math.ceil(activeSkills.length / 2)).map((s, idx) => (
                                                <li key={idx}>{s.name}</li>
                                            ))}
                                        </ul>
                                        <ul className="list-disc ml-5 space-y-0.5">
                                            {activeSkills.slice(Math.ceil(activeSkills.length / 2)).map((s, idx) => (
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

/**
 * Scaled card live preview component specifically designed for Template Cards in /cv/templates.
 * Automatically prefills from user profile data if provided, or falls back to template sample data.
 */
export function CvCardLivePreview({
    templateType,
    data,
}: {
    templateType: 'hendra' | 'ayu';
    data?: {
        contact?: CvContactData | null;
        experiences?: CvExperienceData[];
        educations?: CvEducationData[];
        skills?: CvSkillData[];
        summary?: string | CvSummaryData | null;
        organizations?: CvOrganizationData[];
        certifications?: CvCertificationData[];
        awards?: CvAwardData[];
    } | null;
}) {
    const isHendra = templateType === 'hendra';
    const sample = isHendra ? SAMPLE_TEMPLATE_DATA.modern : SAMPLE_TEMPLATE_DATA.classic;

    const userFullName = data?.contact
        ? [data.contact.first_name, data.contact.last_name].filter(Boolean).join(' ').trim()
        : '';
    const activeFullName = userFullName || sample.fullName;
    const activeJobTitle = data?.contact?.desired_job_title || sample.desiredJobTitle;

    const rawLocation = data?.contact
        ? [data.contact.city, data.contact.address].filter(Boolean).join(', ')
        : '';
    const activeLocation = rawLocation || sample.location;
    const activeEmail = data?.contact?.email || sample.email;
    const activePhone = data?.contact?.phone || sample.phone;
    const rawSummary =
        typeof data?.summary === 'string'
            ? data.summary
            : data?.summary?.content;
    const activeSummary =
        rawSummary && rawSummary.trim().length > 0 ? rawSummary : sample.summary;

    const validUserExperiences = (data?.experiences || []).filter(
        (e) => (e.company_name && e.company_name.trim().length > 0) || (e.position && e.position.trim().length > 0)
    );
    const activeExperiences = validUserExperiences.length > 0 ? validUserExperiences : sample.experiences;

    const validUserEducations = (data?.educations || []).filter(
        (e) => (e.institution_name && e.institution_name.trim().length > 0) || (e.degree && e.degree.trim().length > 0)
    );
    const activeEducations = validUserEducations.length > 0 ? validUserEducations : sample.educations;

    const validSkills = (data?.skills || []).filter((s) => s.name && s.name.trim().length > 0);
    const activeSkills = validSkills.length > 0 ? validSkills : sample.skills;

    if (isHendra) {
        return (
            <div className="w-full text-slate-900 text-[10px] leading-tight flex flex-col pointer-events-none">
                <div className="text-center mb-3">
                    <h2 className="text-xl sm:text-[22px] font-bold text-black uppercase tracking-wider mb-1">
                        {activeFullName}
                    </h2>
                    <div className="text-[10.5px] font-semibold text-slate-800 mb-1">
                        {activeJobTitle}
                    </div>
                    {activeLocation && (
                        <div className="text-[8.5px] text-slate-600">
                            {activeLocation}
                        </div>
                    )}
                    <div className="text-[8.5px] text-slate-600 mt-0.5">
                        {activeEmail} · {activePhone}
                    </div>
                    <div className="border-b-2 border-slate-900 mt-2.5 mb-3" />
                </div>

                {activeSummary && (
                    <div className="mb-3">
                        <div className="font-bold text-[10px] text-black uppercase tracking-wider mb-1">
                            RINGKASAN
                        </div>
                        {activeSummary.includes('<') ? (
                            <div
                                className="text-[8.5px] text-slate-800 leading-relaxed text-justify [&_a]:text-sky-600 [&_a]:underline [&_em]:italic [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:my-0.5 [&_s]:line-through [&_strong]:font-bold [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4"
                                dangerouslySetInnerHTML={{ __html: activeSummary }}
                            />
                        ) : (
                            <p className="text-[8.5px] text-slate-800 leading-relaxed text-justify">
                                {activeSummary}
                            </p>
                        )}
                    </div>
                )}

                {activeExperiences.length > 0 && (
                    <div className="mb-3">
                        <div className="font-bold text-[10px] text-black uppercase tracking-wider mb-1.5">
                            PENGALAMAN
                        </div>
                        <div className="space-y-2">
                            {activeExperiences.slice(0, 2).map((exp, idx) => {
                                const dateFormatted = formatPreviewDate(exp.start_date, exp.end_date, exp.is_current);
                                return (
                                    <div key={idx}>
                                        <div className="font-bold text-[9px] text-black flex justify-between">
                                            <span>{exp.position}{exp.company_name ? `, ${exp.company_name}` : ''}</span>
                                            {dateFormatted && (
                                                <span className="font-normal text-slate-600">
                                                    {dateFormatted}{exp.city ? ` | ${exp.city}` : ''}
                                                </span>
                                            )}
                                        </div>
                                        {renderDescriptionBullets(exp.description, 'text-slate-800', 'text-[8.5px]')}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeEducations.length > 0 && (
                    <div className="mb-3">
                        <div className="font-bold text-[10px] text-black uppercase tracking-wider mb-1">
                            PENDIDIKAN
                        </div>
                        <div>
                            {activeEducations.slice(0, 2).map((edu, idx) => {
                                const dateRange = formatPreviewDate(edu.start_date, edu.end_date, edu.is_current);
                                const degreeLine = [edu.degree, edu.field_of_study].filter(Boolean).join(' | ');
                                return (
                                    <div key={idx} className="mb-1">
                                        <div className="font-bold text-[9px] text-black">
                                            {edu.institution_name} {edu.city ? `- ${edu.city} ` : ''}
                                            {degreeLine && <span className="font-normal text-slate-700">| {degreeLine}</span>}
                                        </div>
                                        {dateRange && (
                                            <div className="text-[8.5px] text-slate-600">
                                                {dateRange}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeSkills.length > 0 && (
                    <div>
                        <div className="font-bold text-[10px] text-black uppercase tracking-wider mb-1">
                            KEAHLIAN
                        </div>
                        <div className="grid grid-cols-2 gap-x-3 text-[8.5px] text-slate-800">
                            <ul className="list-disc ml-4 space-y-0.5">
                                {activeSkills.slice(0, Math.ceil(activeSkills.length / 2)).slice(0, 3).map((s, idx) => (
                                    <li key={idx}>{s.name}</li>
                                ))}
                            </ul>
                            <ul className="list-disc ml-4 space-y-0.5">
                                {activeSkills.slice(Math.ceil(activeSkills.length / 2)).slice(0, 3).map((s, idx) => (
                                    <li key={idx}>{s.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Ayu (Classic) Layout
    return (
        <div className="w-full text-slate-900 text-[10px] leading-tight flex flex-col pointer-events-none">
            <div className="text-center mb-3">
                {activeJobTitle && (
                    <div className="text-[10px] font-bold text-black mb-1 tracking-wide">
                        {activeJobTitle}
                    </div>
                )}
                <h2 className="font-serif text-2xl sm:text-[26px] font-medium text-slate-900 tracking-tight mb-1.5 leading-none">
                    {activeFullName}
                </h2>
                <div className="text-[8.5px] text-slate-800 flex flex-wrap justify-center items-center gap-x-1.5 gap-y-0.5 leading-snug">
                    {activeLocation && (
                        <span><strong className="font-bold text-black">Alamat:</strong> {activeLocation}</span>
                    )}
                    {activeLocation && activeEmail && <span>·</span>}
                    {activeEmail && (
                        <span><strong className="font-bold text-black">Alamat email:</strong> {activeEmail}</span>
                    )}
                    {(activeEmail || activeLocation) && activePhone && <span>·</span>}
                    {activePhone && (
                        <span><strong className="font-bold text-black">Nomor telepon:</strong> {activePhone}</span>
                    )}
                </div>
                <div className="border-b border-dotted border-slate-300 mt-2.5 mb-3" />
            </div>

            {activeSummary && (
                <div className="mb-3">
                    <div className="font-bold text-[10px] text-black uppercase tracking-wider mb-1">
                        RINGKASAN
                    </div>
                    {activeSummary.includes('<') ? (
                        <div
                            className="text-[8.5px] text-slate-800 leading-relaxed text-justify [&_a]:text-black [&_a]:underline [&_em]:italic [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:my-0.5 [&_s]:line-through [&_strong]:font-bold [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4"
                            dangerouslySetInnerHTML={{ __html: activeSummary }}
                        />
                    ) : (
                        <p className="text-[8.5px] text-slate-800 leading-relaxed text-justify">
                            {activeSummary}
                        </p>
                    )}
                </div>
            )}

            {activeExperiences.length > 0 && (
                <div className="mb-3">
                    <div className="font-bold text-[10px] text-black uppercase tracking-wider mb-1.5">
                        PENGALAMAN
                    </div>
                    <div className="space-y-2">
                        {activeExperiences.slice(0, 2).map((exp, idx) => {
                            const dateFormatted = formatPreviewDate(exp.start_date, exp.end_date, exp.is_current);
                            const companyLocation = [exp.company_name, exp.city].filter(Boolean).join(' - ');
                            return (
                                <div key={idx}>
                                    <div className="font-bold text-[9px] text-black">
                                        {exp.position?.toUpperCase()}{' '}
                                        {dateFormatted && <span className="font-normal text-slate-700">| {dateFormatted}</span>}
                                    </div>
                                    {companyLocation && (
                                        <div className="text-[8.5px] text-slate-700 mb-0.5">
                                            {companyLocation}
                                        </div>
                                    )}
                                    {renderDescriptionBullets(exp.description, 'text-slate-800', 'text-[8.5px]')}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeEducations.length > 0 && (
                <div className="mb-3">
                    <div className="font-bold text-[10px] text-black uppercase tracking-wider mb-1">
                        PENDIDIKAN
                    </div>
                    <div>
                        {activeEducations.slice(0, 2).map((edu, idx) => {
                            const dateRange = formatPreviewDate(edu.start_date, edu.end_date, edu.is_current);
                            const degreeLine = [edu.degree, edu.field_of_study].filter(Boolean).join(' | ');
                            return (
                                <div key={idx} className="mb-1">
                                    <div className="font-bold text-[9px] text-black">
                                        {edu.institution_name}{' '}
                                        {degreeLine && <span className="font-normal text-slate-700">| {degreeLine}</span>}
                                    </div>
                                    {dateRange && (
                                        <div className="text-[8.5px] text-slate-700">
                                            {dateRange}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeSkills.length > 0 && (
                <div>
                    <div className="font-bold text-[10px] text-black uppercase tracking-wider mb-1">
                        KEAHLIAN
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 text-[8.5px] text-slate-800">
                        <ul className="list-disc ml-4 space-y-0.5">
                            {activeSkills.slice(0, Math.ceil(activeSkills.length / 2)).slice(0, 3).map((s, idx) => (
                                <li key={idx}>{s.name}</li>
                            ))}
                        </ul>
                        <ul className="list-disc ml-4 space-y-0.5">
                            {activeSkills.slice(Math.ceil(activeSkills.length / 2)).slice(0, 3).map((s, idx) => (
                                <li key={idx}>{s.name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
