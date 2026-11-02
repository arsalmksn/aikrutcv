import React from 'react';
import { Eye, Edit3, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatPreviewDate, renderDescriptionBullets } from '@/components/cv/cv-live-preview';
import type {
    CvData,
    CvExperienceData,
    CvEducationData,
    CvSkillData,
    CvOrganizationData,
    CvCertificationData,
    CvAwardData,
} from '@/types/cv';

export interface SampleTemplateData {
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

// Data sampel kurasi resmi (persis seperti pada gambar referensi)
export const OFFICIAL_SAMPLE_DATA: Record<'modern' | 'classic', SampleTemplateData> = {
    modern: {
        fullName: 'ARSA LUMAKSANA AJI',
        desiredJobTitle: 'Frontend Development',
        location: 'Jalan Pandley 55, Surabaya, Indonesia, 60223',
        email: 'arsalumaksana@gmail.com',
        phone: '+62 815 555 2671',
        summary:
            'Pengacara berpengalaman dan inovatif dengan semangat dan dedikasi pada keadilan. Sangat terorganisir, dan terampil dalam berpikir kritis cepat dan tepat. Membantu klien yang terlibat dalam masalah hukum yang menguntungkan bagi klien. Mahir dalam mempersiapkan persidangan, merangkum dokumen, dan mengikuti kasus di pengadilan secara efektif.',
        experiences: [
            {
                id: 1,
                position: 'Pengacara',
                company_name: 'PT Pengacara Madiun & Timber',
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
                institution_name: 'UDB',
                degree: 'Sarjana 1 (S1)',
                field_of_study: 'Teknik Informatika',
                city: 'Surakarta',
                start_date: '2020',
                end_date: '2024',
                is_current: false,
                description: '2020 — 2024',
                sort_order: 0,
            },
        ],
        skills: [
            { id: 1, name: 'React', sort_order: 0 },
            { id: 2, name: 'Next.js', sort_order: 1 },
            { id: 3, name: 'Vue.js', sort_order: 2 },
            { id: 4, name: 'JavaScript', sort_order: 3 },
            { id: 5, name: 'TypeScript', sort_order: 4 },
            { id: 6, name: 'Tailwind CSS', sort_order: 5 },
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
                position: 'ANALIS SENIOR',
                company_name: 'PT Lentera & Lampu',
                city: 'Jakarta, 10110',
                start_date: '06/2021',
                end_date: '',
                is_current: true,
                description:
                    '• Mengarahkan analisis data dan pelaporan fungsi bisnis kunci.\n• Melakukan benchmarking kompetitif untuk keputusan strategis.',
                sort_order: 0,
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
            { id: 1, name: 'Manajemen Proyek', sort_order: 0 },
            { id: 2, name: 'SQL & Excel', sort_order: 1 },
            { id: 3, name: 'Keputusan Berbasis Data', sort_order: 2 },
            { id: 4, name: 'Analisis Keuangan', sort_order: 3 },
        ],
    },
};

export interface TemplatePreviewProps {
    template?: {
        id?: number;
        name?: string;
        category?: string | null;
    } | null;
    templateType?: 'modern' | 'classic' | 'hendra' | 'ayu' | string;
    data?: Partial<CvData> | any | null;
    useSample?: boolean;
    variant?: 'thumbnail' | 'card' | 'full';
    floatingType?: 'select' | 'actions' | 'none';
    selectButtonText?: string;
    onSelect?: () => void;
    onQuickPreview?: () => void;
    builderHref?: string;
    className?: string;
}

export function TemplatePreview({
    template,
    templateType,
    data,
    useSample = false,
    variant = 'card',
    floatingType = 'actions',
    selectButtonText = 'Pilih Template',
    onSelect,
    onQuickPreview,
    builderHref,
    className = '',
}: TemplatePreviewProps) {
    // 1. Tentukan layout template: Modern Minimalist (gambar referensi) vs Classic
    const isModern = React.useMemo(() => {
        if (templateType) {
            const lower = templateType.toLowerCase();
            return lower === 'modern' || lower === 'hendra';
        }
        if (template?.category) {
            return template.category.toLowerCase() === 'modern';
        }
        if (template?.name) {
            return template.name.toLowerCase().includes('modern');
        }
        return true;
    }, [template, templateType]);

    const sample = isModern ? OFFICIAL_SAMPLE_DATA.modern : OFFICIAL_SAMPLE_DATA.classic;

    // 2. Data dinamis vs Data sampel
    // Halaman /cv/templates -> useSample=true (murni data template resmi)
    // Halaman Dashboard & CV Saya -> useSample=false (data nyata per template yang sedang dibuat)
    const activeFullName = useSample
        ? sample.fullName
        : data?.contact
          ? [data.contact.first_name, data.contact.last_name].filter(Boolean).join(' ').trim() ||
            'NAMA LENGKAP ANDA'
          : 'NAMA LENGKAP ANDA';

    const activeJobTitle = useSample
        ? sample.desiredJobTitle
        : data?.contact?.desired_job_title || null;

    const activeLocation = useSample
        ? sample.location
        : data?.contact
          ? [data.contact.city, data.contact.address].filter(Boolean).join(', ').trim() || null
          : null;

    const activeEmail = useSample ? sample.email : data?.contact?.email || null;
    const activePhone = useSample ? sample.phone : data?.contact?.phone || null;

    const rawSummary =
        typeof data?.summary === 'string'
            ? data.summary
            : data?.summary?.content;
    const activeSummary = useSample
        ? sample.summary
        : rawSummary && rawSummary.trim().length > 0
          ? rawSummary
          : null;

    const activeExperiences: CvExperienceData[] = useSample
        ? sample.experiences
        : (data?.experiences || []).filter(
              (e: CvExperienceData) =>
                  (e.company_name && e.company_name.trim().length > 0) ||
                  (e.position && e.position.trim().length > 0)
          );

    const activeEducations: CvEducationData[] = useSample
        ? sample.educations
        : (data?.educations || []).filter(
              (e: CvEducationData) =>
                  (e.institution_name && e.institution_name.trim().length > 0) ||
                  (e.degree && e.degree.trim().length > 0)
          );

    const activeSkills: CvSkillData[] = useSample
        ? sample.skills
        : (data?.skills || []).filter((s: CvSkillData) => s.name && s.name.trim().length > 0);

    const activeOrganizations: CvOrganizationData[] = useSample
        ? []
        : (data?.organizations || []).filter(
              (o: CvOrganizationData) => o.organization_name && o.organization_name.trim().length > 0
          );

    const activeCertifications: CvCertificationData[] = useSample
        ? []
        : (data?.certifications || []).filter(
              (c: CvCertificationData) => c.name && c.name.trim().length > 0
          );

    const activeAwards: CvAwardData[] = useSample
        ? []
        : (data?.awards || []).filter(
              (a: CvAwardData) => a.title && a.title.trim().length > 0
          );

    // Limit tampilan per variant agar rapi dan tidak meluber
    const expLimit = variant === 'thumbnail' ? 1 : variant === 'card' ? 1 : 4;
    const eduLimit = variant === 'thumbnail' ? 1 : variant === 'card' ? 1 : 3;

    // Split skills ke dalam 2 kolom sejajar persis seperti pada gambar
    const leftSkills = React.useMemo(() => {
        if (activeSkills.length === 0) return [];
        const half = Math.ceil(activeSkills.length / 2);
        return activeSkills.slice(0, half);
    }, [activeSkills]);

    const rightSkills = React.useMemo(() => {
        if (activeSkills.length === 0) return [];
        const half = Math.ceil(activeSkills.length / 2);
        return activeSkills.slice(half);
    }, [activeSkills]);

    // Skala pembungkus dokumen
    // 'thumbnail' = skala proporsional untuk kartu dashboard (tinggi ~280px)
    // 'card'      = skala untuk kartu CV Saya / Dashboard (tinggi seragam ~350px agar tidak memanjang)
    // 'full'      = ukuran A4 penuh untuk halaman templates & modal (tinggi 650px+)
    const cardHeightClass =
        variant === 'thumbnail'
            ? 'h-[280px] overflow-hidden'
            : variant === 'card'
              ? 'h-[350px] overflow-hidden'
              : 'min-h-[640px]';

    const paddingClass = variant === 'full' ? 'p-6 sm:p-8' : 'p-5 sm:p-6';

    return (
        <div
            className={`group/paper relative w-full rounded-[26px] bg-white text-slate-900 border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] ${paddingClass} flex flex-col select-none transition-all duration-300 ${cardHeightClass} ${className}`}
        >
            {/* ======================================================== */}
            {/* PAPER RESUME CONTENT (100% PERSIS GAMBAR REFERENSI)      */}
            {/* ======================================================== */}
            <div className="flex flex-col w-full flex-1">
                {isModern ? (
                    /* ---------------------------------------------------- */
                    /* TEMPLATE ATS MODERN MINIMALIST (Sesuai Gambar)       */
                    /* ---------------------------------------------------- */
                    <div className="flex flex-col text-slate-900 leading-tight">
                        {/* Header: Nama Bold Uppercase, Posisi, Kontak 2 Baris */}
                        <div className="text-center mb-3">
                            <h2 className="text-lg sm:text-[22px] font-bold text-black uppercase tracking-wider mb-1">
                                {activeFullName}
                            </h2>

                            {activeJobTitle ? (
                                <div className="text-[11px] sm:text-[12px] font-semibold text-slate-800 mb-1">
                                    {activeJobTitle}
                                </div>
                            ) : !useSample ? (
                                <div className="text-[10px] italic text-slate-400 mb-1">
                                    Posisi belum ditentukan
                                </div>
                            ) : null}

                            {/* Baris 1: Alamat */}
                            {activeLocation ? (
                                <div className="text-[9px] sm:text-[10px] text-slate-600">
                                    {activeLocation}
                                </div>
                            ) : !useSample ? (
                                <div className="text-[8.5px] italic text-slate-400">
                                    Alamat belum ditambahkan
                                </div>
                            ) : null}

                            {/* Baris 2: Email · Telepon */}
                            {activeEmail || activePhone ? (
                                <div className="text-[9px] sm:text-[10px] text-slate-600 mt-0.5">
                                    {activeEmail && <span>{activeEmail}</span>}
                                    {activeEmail && activePhone && <span> · </span>}
                                    {activePhone && <span>{activePhone}</span>}
                                </div>
                            ) : !useSample ? (
                                <div className="text-[8.5px] italic text-slate-400 mt-0.5">
                                    Email dan nomor telepon belum ditambahkan
                                </div>
                            ) : null}

                            {/* Garis Hitam Solid Pembatas Header */}
                            <div className="border-b-[1.5px] border-slate-900 mt-3 mb-3.5" />
                        </div>

                        {/* Bagian 1: RINGKASAN */}
                        <div className="mb-3">
                            <div className="font-bold text-[10px] sm:text-[11px] text-black uppercase tracking-wider mb-1">
                                RINGKASAN
                            </div>
                            {activeSummary ? (
                                <p className={`text-[9px] sm:text-[10px] text-slate-800 leading-relaxed text-justify ${variant === 'card' ? 'line-clamp-3' : ''}`}>
                                    {activeSummary.replace(/<[^>]*>?/gm, '')}
                                </p>
                            ) : (
                                <p className="italic text-slate-400 text-[9px] sm:text-[9.5px]">
                                    Belum ada ringkasan profil ditambahkan.
                                </p>
                            )}
                        </div>

                        {/* Bagian 2: PENGALAMAN */}
                        <div className="mb-3">
                            <div className="font-bold text-[10px] sm:text-[11px] text-black uppercase tracking-wider mb-1.5">
                                PENGALAMAN
                            </div>
                            {activeExperiences.length > 0 ? (
                                <div className="space-y-2">
                                    {activeExperiences.slice(0, expLimit).map((exp, idx) => {
                                        const dateFormatted = formatPreviewDate(
                                            exp.start_date,
                                            exp.end_date,
                                            exp.is_current
                                        );
                                        return (
                                            <div key={idx}>
                                                <div className="font-bold text-[9.5px] sm:text-[10px] text-black flex justify-between items-baseline">
                                                    <span className="truncate pr-2">
                                                        {exp.position}
                                                        {exp.company_name ? `, ${exp.company_name}` : ''}
                                                    </span>
                                                    {dateFormatted && (
                                                        <span className="font-normal text-slate-600 text-[8.5px] sm:text-[9px] shrink-0">
                                                            {dateFormatted}
                                                            {exp.city ? ` | ${exp.city}` : ''}
                                                        </span>
                                                    )}
                                                </div>
                                                {exp.description ? (
                                                    renderDescriptionBullets(
                                                        exp.description,
                                                        'text-slate-800',
                                                        'text-[9px] sm:text-[9.5px]'
                                                    )
                                                ) : (
                                                    <ul className="list-disc ml-4 mt-0.5 space-y-0.5 text-[8.5px] text-slate-700">
                                                        <li>Melaksanakan tanggung jawab operasional pekerjaan secara profesional</li>
                                                    </ul>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="italic text-slate-400 text-[9px] sm:text-[9.5px]">
                                    Belum ada pengalaman kerja ditambahkan.
                                </p>
                            )}
                        </div>

                        {/* Bagian 3: PENDIDIKAN */}
                        <div className="mb-3">
                            <div className="font-bold text-[10px] sm:text-[11px] text-black uppercase tracking-wider mb-1">
                                PENDIDIKAN
                            </div>
                            {activeEducations.length > 0 ? (
                                <div className="space-y-1">
                                    {activeEducations.slice(0, eduLimit).map((edu, idx) => {
                                        const dateRange = formatPreviewDate(
                                            edu.start_date,
                                            edu.end_date,
                                            edu.is_current
                                        );
                                        const degreeLine = [edu.degree, edu.field_of_study]
                                            .filter(Boolean)
                                            .join(' | ');
                                        return (
                                            <div key={idx}>
                                                <div className="font-bold text-[9.5px] sm:text-[10px] text-black">
                                                    {edu.institution_name}
                                                    {degreeLine && (
                                                        <span className="font-normal text-slate-700">
                                                            {' '}| {degreeLine}
                                                        </span>
                                                    )}
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
                            ) : (
                                <p className="italic text-slate-400 text-[9px] sm:text-[9.5px]">
                                    Belum ada riwayat pendidikan ditambahkan.
                                </p>
                            )}
                        </div>

                        {/* Bagian 4: KEAHLIAN (2 Kolom Sejajar Persis Gambar) */}
                        <div className="mb-2">
                            <div className="font-bold text-[10px] sm:text-[11px] text-black uppercase tracking-wider mb-1">
                                KEAHLIAN
                            </div>
                            {activeSkills.length > 0 ? (
                                <div className="grid grid-cols-2 gap-x-4 text-[9px] sm:text-[9.5px] text-slate-800">
                                    <ul className="list-disc ml-4 space-y-0.5">
                                        {leftSkills.map((s, idx) => (
                                            <li key={idx} className="truncate">
                                                {s.name}
                                            </li>
                                        ))}
                                    </ul>
                                    <ul className="list-disc ml-4 space-y-0.5">
                                        {rightSkills.map((s, idx) => (
                                            <li key={idx} className="truncate">
                                                {s.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="italic text-slate-400 text-[9px] sm:text-[9.5px]">
                                    Belum ada keahlian ditambahkan.
                                </p>
                            )}
                        </div>

                        {/* Bagian Tambahan jika sudah diisi (Organisasi / Sertifikasi / Penghargaan) */}
                        {activeOrganizations.length > 0 && variant === 'full' && (
                            <div className="mt-3">
                                <div className="font-bold text-[10px] sm:text-[11px] text-black uppercase tracking-wider mb-1">
                                    ORGANISASI
                                </div>
                                {activeOrganizations.map((org, idx) => (
                                    <div key={idx} className="mb-1 text-[9px]">
                                        <div className="font-bold text-black flex justify-between">
                                            <span>{org.role}, {org.organization_name}</span>
                                            <span className="font-normal text-slate-600">
                                                {formatPreviewDate(org.start_date, org.end_date)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    /* ---------------------------------------------------- */
                    /* TEMPLATE ATS CLASSIC PROFESSIONAL (Ayu Sutanto)      */
                    /* ---------------------------------------------------- */
                    <div className="flex flex-col text-slate-900 leading-tight">
                        <div className="text-center mb-3">
                            {activeJobTitle && (
                                <div className="text-[10.5px] font-bold text-black mb-1 tracking-wide">
                                    {activeJobTitle}
                                </div>
                            )}
                            <h2 className="font-serif text-xl sm:text-[24px] font-medium text-slate-900 tracking-tight mb-1.5 leading-none">
                                {activeFullName}
                            </h2>
                            <div className="text-[9px] text-slate-800 flex flex-wrap justify-center items-center gap-x-1.5 gap-y-0.5 leading-snug">
                                {activeLocation && (
                                    <span><strong className="font-bold text-black">Alamat:</strong> {activeLocation}</span>
                                )}
                                {activeLocation && activeEmail && <span>·</span>}
                                {activeEmail && (
                                    <span><strong className="font-bold text-black">Email:</strong> {activeEmail}</span>
                                )}
                                {(activeEmail || activeLocation) && activePhone && <span>·</span>}
                                {activePhone && (
                                    <span><strong className="font-bold text-black">Telepon:</strong> {activePhone}</span>
                                )}
                            </div>
                            <div className="border-b border-dotted border-slate-300 mt-2.5 mb-3" />
                        </div>

                        {/* Ringkasan */}
                        <div className="mb-3">
                            <div className="font-bold text-[10px] text-black uppercase tracking-wider mb-1">
                                RINGKASAN
                            </div>
                            {activeSummary ? (
                                <p className={`text-[9px] text-slate-800 leading-relaxed text-justify ${variant === 'card' ? 'line-clamp-3' : ''}`}>
                                    {activeSummary.replace(/<[^>]*>?/gm, '')}
                                </p>
                            ) : (
                                <p className="italic text-slate-400 text-[9px]">
                                    Belum ada ringkasan profil ditambahkan.
                                </p>
                            )}
                        </div>

                        {/* Pengalaman */}
                        <div className="mb-3">
                            <div className="font-bold text-[10px] text-black uppercase tracking-wider mb-1.5">
                                PENGALAMAN
                            </div>
                            {activeExperiences.length > 0 ? (
                                <div className="space-y-1.5">
                                    {activeExperiences.slice(0, expLimit).map((exp, idx) => {
                                        const dateFormatted = formatPreviewDate(exp.start_date, exp.end_date, exp.is_current);
                                        const companyLocation = [exp.company_name, exp.city].filter(Boolean).join(' - ');
                                        return (
                                            <div key={idx}>
                                                <div className="font-bold text-[9.5px] text-black">
                                                    {exp.position?.toUpperCase()}{' '}
                                                    {dateFormatted && <span className="font-normal text-slate-700">| {dateFormatted}</span>}
                                                </div>
                                                {companyLocation && (
                                                    <div className="text-[8.5px] text-slate-700 mb-0.5">
                                                        {companyLocation}
                                                    </div>
                                                )}
                                                {renderDescriptionBullets(exp.description, 'text-slate-800', 'text-[9px]')}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="italic text-slate-400 text-[9px]">
                                    Belum ada pengalaman kerja ditambahkan.
                                </p>
                            )}
                        </div>

                        {/* Pendidikan */}
                        <div className="mb-3">
                            <div className="font-bold text-[10px] text-black uppercase tracking-wider mb-1">
                                PENDIDIKAN
                            </div>
                            {activeEducations.length > 0 ? (
                                <div>
                                    {activeEducations.slice(0, eduLimit).map((edu, idx) => {
                                        const dateRange = formatPreviewDate(edu.start_date, edu.end_date, edu.is_current);
                                        return (
                                            <div key={idx} className="mb-1">
                                                <div className="font-bold text-[9.5px] text-black">
                                                    {edu.institution_name}{' '}
                                                    {edu.degree && <span className="font-normal text-slate-700">| {edu.degree}</span>}
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
                            ) : (
                                <p className="italic text-slate-400 text-[9px]">
                                    Belum ada riwayat pendidikan ditambahkan.
                                </p>
                            )}
                        </div>

                        {/* Keahlian */}
                        <div>
                            <div className="font-bold text-[10px] text-black uppercase tracking-wider mb-1">
                                KEAHLIAN
                            </div>
                            {activeSkills.length > 0 ? (
                                <div className="grid grid-cols-2 gap-x-4 text-[9px] text-slate-800">
                                    <ul className="list-disc ml-4 space-y-0.5">
                                        {leftSkills.map((s, idx) => (
                                            <li key={idx}>{s.name}</li>
                                        ))}
                                    </ul>
                                    <ul className="list-disc ml-4 space-y-0.5">
                                        {rightSkills.map((s, idx) => (
                                            <li key={idx}>{s.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="italic text-slate-400 text-[9px]">
                                    Belum ada keahlian ditambahkan.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Fade-out gradien halus di bagian bawah untuk varian card agar tidak memanjang */}
            {variant === 'card' && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent rounded-b-[26px] z-10" />
            )}

            {/* ======================================================== */}
            {/* FLOATING CENTER BUTTON: EXACT MATCH DENGAN GAMBAR        */}
            {/* ======================================================== */}
            {floatingType !== 'none' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-20">
                    {floatingType === 'select' ? (
                        /* Mode 1: Halaman Pemilihan Template (/cv/templates) -> Persis Gambar */
                        onSelect ? (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect();
                                }}
                                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#5025D1] hover:bg-[#401DA8] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 shadow-lg shadow-violet-500/25 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-violet-300"
                            >
                                <span>{selectButtonText}</span>
                            </button>
                        ) : builderHref ? (
                            <a
                                href={builderHref}
                                className="inline-flex items-center justify-center rounded-xl bg-[#5025D1] hover:bg-[#401DA8] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 shadow-lg shadow-violet-500/25 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-violet-300"
                            >
                                {selectButtonText}
                            </a>
                        ) : null
                    ) : (
                        /* Mode 2: Halaman Dashboard & CV Saya -> Lanjut Edit + Pratinjau */
                        <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-900/15 backdrop-blur-[2px] p-2 rounded-2xl border border-white/40 shadow-xl opacity-90 sm:opacity-0 sm:group-hover/paper:opacity-100 transition-all duration-200">
                            {builderHref && (
                                <a
                                    href={builderHref}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#5025D1] hover:bg-[#401DA8] text-white text-xs font-semibold px-4 py-2 shadow-md shadow-violet-500/30 transition-all duration-150 hover:scale-105 active:scale-95"
                                >
                                    <Edit3 className="size-3.5" />
                                    <span>Lanjut Edit</span>
                                </a>
                            )}
                            {onQuickPreview && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onQuickPreview();
                                    }}
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold px-3.5 py-2 shadow-md border border-slate-200 transition-all duration-150 hover:scale-105 active:scale-95"
                                >
                                    <Eye className="size-3.5 text-[#5025D1]" />
                                    <span>Pratinjau Layar Penuh</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

