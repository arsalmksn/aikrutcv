/**
 * CV & Profile Scoring Engine
 * Intelligent client-side rule evaluation to calculate ATS readiness and provide actionable checklist feedback.
 */

export interface ChecklistItem {
    id: string;
    label: string;
    tip: string;
    isCompleted: boolean;
    group?: string;
    targetStep: 'contact' | 'experience' | 'education' | 'skills' | 'summary' | 'finalize';
    targetSection: 'profile' | 'summary' | 'experiences' | 'educations' | 'skills' | 'resumes';
}

export interface ChecklistCategory {
    id: string;
    title: string;
    subtitle?: string;
    completedCount: number;
    totalCount: number;
    items: ChecklistItem[];
}

export interface CvScoreResult {
    score: number; // 0 - 100
    userName: string;
    headline: string;
    motivationalText: string;
    totalCompleted: number;
    totalItems: number;
    categories: ChecklistCategory[];
}

export interface ScoringCandidateInput {
    fullName?: string | null;
    summary?: string | null;
    photoUrl?: string | null;
    hasPhoto?: boolean | null;
    linkedinUrl?: string | null;
    portfolioUrl?: string | null;
    educations?: Array<{
        institution?: string | null;
        degree?: string | null;
        major?: string | null;
        start_date?: string | null;
        end_date?: string | null;
        is_current?: boolean | null;
    }>;
    experiences?: Array<{
        company?: string | null;
        position?: string | null;
        description?: string | string[] | null;
        is_current?: boolean | null;
    }>;
    skills?: Array<string | { name?: string | null; skill_name?: string | null }>;
}

const ACTION_VERB_REGEX = /^(meng|mem|men|meny|mer|di|ter|ber|develop|build|design|creat|manag|lead|optimiz|implement|deliv|analyz|execut)/i;
const NUMBER_METRIC_REGEX = /(\d+%|\d+\s*(ribu|juta|miliar|k|m|b)?|\b\d{1,4}\b|rp\.?\s*\d+|\$\s*\d+|\b\d+x\b)/i;
const IMPACT_KEYWORDS = [
    'meningkatkan', 'mengoptimalkan', 'mengembangkan', 'berhasil', 'efisiensi',
    'menghemat', 'mencapai', 'pertumbuhan', 'revenue', 'omzet', 'keberhasilan',
    'improve', 'increased', 'optimized', 'boosted', 'reduced', 'achieved', 'launched',
    'delivered', 'spearheaded', 'pencapaian', 'solusi'
];
const CLICHE_PHRASES = [
    'pekerja keras', 'bisa bekerja di bawah tekanan', 'bertanggung jawab atas',
    'hard worker', 'team player', 'responsible for', 'detail oriented'
];

/**
 * Calculate comprehensive CV / Profile score and breakdown
 */
export function calculateCvScore(input: ScoringCandidateInput): CvScoreResult {
    const fullName = (input.fullName ?? '').trim();
    const summary = (input.summary ?? '').replace(/<[^>]*>?/gm, '').trim();
    const linkedinUrl = (input.linkedinUrl ?? '').trim();
    const portfolioUrl = (input.portfolioUrl ?? '').trim();

    // Experiences helper extraction
    const experiences = input.experiences ?? [];
    const validExperiences = experiences.filter((e) => (e.company ?? '').trim() !== '' || (e.position ?? '').trim() !== '');

    const allBulletPoints: string[] = [];
    validExperiences.forEach((e) => {
        if (Array.isArray(e.description)) {
            e.description.forEach((d) => {
                const cleaned = d.replace(/^[•\-\*\s]+/, '').trim();
                if (cleaned.length > 0) allBulletPoints.push(cleaned);
            });
        } else if (typeof e.description === 'string' && e.description.trim() !== '') {
            const lines = e.description
                .split(/\r?\n/)
                .map((l) => l.replace(/^[•\-\*\s]+/, '').trim())
                .filter((l) => l.length > 0);
            allBulletPoints.push(...lines);
        }
    });

    const totalBulletPoints = allBulletPoints.length;
    const combinedExpText = allBulletPoints.join(' ');

    // Educations helper extraction
    const educations = input.educations ?? [];
    const validEducations = educations.filter((edu) => (edu.institution ?? '').trim() !== '');

    // Skills helper extraction
    const skills = input.skills ?? [];
    const normalizedSkills = skills.map((s) => (typeof s === 'string' ? s : s.name ?? s.skill_name ?? '')).filter((s) => s.trim().length > 0);

    // ----------------------------------------------------
    // Category 1: Informasi CV (6 items)
    // ----------------------------------------------------
    const infoItems: ChecklistItem[] = [
        {
            id: 'info_name',
            group: 'Informasi Pribadi',
            label: 'Nama: Sertakan nama yang biasa kamu gunakan (misalnya nama di LinkedIn)',
            tip: 'Pastikan nama lengkap jelas dan mudah dikenali recruiter.',
            isCompleted: fullName.length >= 2,
            targetStep: 'contact',
            targetSection: 'profile',
        },
        {
            id: 'info_desc',
            group: 'Informasi Pribadi',
            label: 'Deskripsi: Berikan deskripsi singkat tentang diri kamu (maksimal 3 baris)',
            tip: 'Ringkasan profesional 2-3 kalimat yang menonjolkan fokus karier Anda.',
            isCompleted: summary.length >= 25,
            targetStep: 'summary',
            targetSection: 'summary',
        },
        {
            id: 'info_photo',
            group: 'Informasi Pribadi',
            label: 'Foto Profil: Opsional, tetapi direkomendasikan untuk membangun kepercayaan',
            tip: 'Gunakan foto formal/semi-formal yang jelas dengan pencahayaan baik.',
            isCompleted: Boolean(input.hasPhoto || input.photoUrl),
            targetStep: 'contact',
            targetSection: 'profile',
        },
        {
            id: 'info_linkedin',
            group: 'Informasi Pribadi',
            label: 'LinkedIn: Bagikan profil LinkedIn kamu untuk menunjukkan jaringan profesional kamu',
            tip: 'Tautan URL profil LinkedIn aktif (misal linkedin.com/in/nama).',
            isCompleted: linkedinUrl.length >= 6 && linkedinUrl.toLowerCase().includes('linkedin'),
            targetStep: 'contact',
            targetSection: 'profile',
        },
        {
            id: 'info_portfolio',
            group: 'Informasi Pribadi',
            label: 'Portfolio/Website: Sertakan jika relevan dengan lamaran pekerjaan',
            tip: 'Tautan GitHub, Dribbble, Medium, atau web portofolio pribadi.',
            isCompleted: portfolioUrl.length >= 6,
            targetStep: 'contact',
            targetSection: 'resumes',
        },
        {
            id: 'info_education',
            group: 'Pendidikan',
            label: 'Cantumkan tanggal kelulusan Kamu dengan benar sehingga HR mudah merekrut Kamu sesuai posisi yang cocok',
            tip: 'Sertakan nama institusi serta tahun masuk dan tahun kelulusan.',
            isCompleted: validEducations.some((edu) => Boolean(edu.end_date || edu.is_current || edu.start_date)),
            targetStep: 'education',
            targetSection: 'educations',
        },
    ];

    // ----------------------------------------------------
    // Category 2: Dampak Kuantitatif (2 items)
    // ----------------------------------------------------
    const hasNumbers = NUMBER_METRIC_REGEX.test(combinedExpText);
    const hasImpactWords = IMPACT_KEYWORDS.some((kw) => combinedExpText.toLowerCase().includes(kw));

    const impactItems: ChecklistItem[] = [
        {
            id: 'impact_numbers',
            label: 'Metrik Angka & Persentase: Cantumkan angka terukur dalam pekerjaan',
            tip: 'Contoh: "Meningkatkan penjualan 25%", "Memproses 150+ transaksi per hari", "Menghemat waktu 30%".',
            isCompleted: hasNumbers,
            targetStep: 'experience',
            targetSection: 'experiences',
        },
        {
            id: 'impact_outcomes',
            label: 'Orientasi Hasil: Jelaskan dampak nyata dari kontribusi Anda',
            tip: 'Gunakan kata kerja yang fokus pada pencapaian dan perbaikan sistem/proses nyata.',
            isCompleted: hasImpactWords,
            targetStep: 'experience',
            targetSection: 'experiences',
        },
    ];

    // ----------------------------------------------------
    // Category 3: Panjang CV (2 items)
    // ----------------------------------------------------
    const summaryWords = summary.split(/\s+/).filter(Boolean).length;
    const isSummaryLengthIdeal = summaryWords >= 15 && summaryWords <= 120;
    const hasAdequateExpDepth = validExperiences.some((e) => {
        if (Array.isArray(e.description)) return e.description.length >= 2;
        if (typeof e.description === 'string') return e.description.split(/\r?\n/).length >= 2 || e.description.length > 50;
        return false;
    });

    const lengthItems: ChecklistItem[] = [
        {
            id: 'length_summary',
            label: 'Panjang Ringkasan Ideal: Tidak terlalu panjang atau terlalu pendek (20-100 kata)',
            tip: 'Deskripsi yang padat mudah dipindai HR dalam 6 detik pertama.',
            isCompleted: isSummaryLengthIdeal,
            targetStep: 'summary',
            targetSection: 'summary',
        },
        {
            id: 'length_experience',
            label: 'Kedalaman Pengalaman: Minimal 2-3 poin deskripsi per posisi kerja',
            tip: 'Hindari hanya menulis nama jabatan tanpa rincian tanggung jawab dan aksi.',
            isCompleted: hasAdequateExpDepth,
            targetStep: 'experience',
            targetSection: 'experiences',
        },
    ];

    // ----------------------------------------------------
    // Category 4: Keringkasan Bullet Point (3 items)
    // ----------------------------------------------------
    const bulletWithActionVerbs = allBulletPoints.filter((bp) => ACTION_VERB_REGEX.test(bp)).length;
    const hasActionVerbs = totalBulletPoints > 0 && bulletWithActionVerbs >= Math.ceil(totalBulletPoints * 0.4);

    const hasNoExtremelyLongBullets = totalBulletPoints > 0 && allBulletPoints.every((bp) => bp.split(/\s+/).length <= 40);

    const containsCliche = CLICHE_PHRASES.some((cl) => combinedExpText.toLowerCase().includes(cl) || summary.toLowerCase().includes(cl));
    const noCliches = !containsCliche;

    const bulletItems: ChecklistItem[] = [
        {
            id: 'bullet_verbs',
            label: 'Kata Kerja Aksi: Awali poin pekerjaan dengan action verbs aktif',
            tip: 'Gunakan kata seperti: Mengembangkan, Memimpin, Merancang, Mengkoordinasi, Mengoptimalkan.',
            isCompleted: hasActionVerbs,
            targetStep: 'experience',
            targetSection: 'experiences',
        },
        {
            id: 'bullet_length',
            label: 'Keringkasan Poin: Maksimal 2-3 baris (di bawah 35 kata) per butir poin',
            tip: 'Poin yang ringkas meningkatkan keterbacaan (readability) pada ATS.',
            isCompleted: hasNoExtremelyLongBullets,
            targetStep: 'experience',
            targetSection: 'experiences',
        },
        {
            id: 'bullet_no_cliches',
            label: 'Bebas Klise: Hindari frasa klise tanpa bukti nyata',
            tip: 'Ganti "pekerja keras" atau "bertanggung jawab atas" dengan bukti aksi nyata Anda.',
            isCompleted: noCliches,
            targetStep: 'experience',
            targetSection: 'experiences',
        },
    ];

    // ----------------------------------------------------
    // Category 5: Kelengkapan Bagian (2 items)
    // ----------------------------------------------------
    const hasValidExperience = validExperiences.length >= 1;
    const hasAdequateSkills = normalizedSkills.length >= 3;

    const completenessItems: ChecklistItem[] = [
        {
            id: 'section_experience',
            label: 'Pengalaman Kerja Relevan: Minimal 1 riwayat pengalaman kerja/proyek',
            tip: 'Dapat berupa pekerjaan full-time, magang, part-time, atau proyek lepas.',
            isCompleted: hasValidExperience,
            targetStep: 'experience',
            targetSection: 'experiences',
        },
        {
            id: 'section_skills',
            label: 'Keahlian & Tools: Minimal 3 keahlian atau perangkat lunak terdaftar',
            tip: 'Cantumkan teknologi, tools industri, atau soft skill utama yang Anda kuasai.',
            isCompleted: hasAdequateSkills,
            targetStep: 'skills',
            targetSection: 'skills',
        },
    ];

    // Build categories structure
    const categories: ChecklistCategory[] = [
        {
            id: 'info',
            title: 'Informasi CV',
            subtitle: 'CV yang lengkap memberi HR informasi yang perlu mereka ketahui tentang Kamu',
            completedCount: infoItems.filter((i) => i.isCompleted).length,
            totalCount: infoItems.length,
            items: infoItems,
        },
        {
            id: 'impact',
            title: 'Dampak Kuantitatif',
            completedCount: impactItems.filter((i) => i.isCompleted).length,
            totalCount: impactItems.length,
            items: impactItems,
        },
        {
            id: 'length',
            title: 'Panjang CV',
            completedCount: lengthItems.filter((i) => i.isCompleted).length,
            totalCount: lengthItems.length,
            items: lengthItems,
        },
        {
            id: 'bullets',
            title: 'Keringkasan Bullet Point',
            completedCount: bulletItems.filter((i) => i.isCompleted).length,
            totalCount: bulletItems.length,
            items: bulletItems,
        },
        {
            id: 'sections',
            title: 'Kelengkapan Bagian',
            completedCount: completenessItems.filter((i) => i.isCompleted).length,
            totalCount: completenessItems.length,
            items: completenessItems,
        },
    ];

    const totalItems = categories.reduce((acc, cat) => acc + cat.totalCount, 0);
    const totalCompleted = categories.reduce((acc, cat) => acc + cat.completedCount, 0);
    const score = Math.round((totalCompleted / totalItems) * 100);

    const displayName = fullName.split(' ')[0] || 'Kandidat';

    let headline = `Kerja Bagus ${displayName}!`;
    if (score >= 85) headline = `Luar Biasa, ${displayName}!`;
    else if (score >= 65) headline = `Bagus Sekali, ${displayName}!`;
    else if (score < 40) headline = `Semangat Memulai, ${displayName}!`;

    return {
        score,
        userName: displayName,
        headline,
        motivationalText: 'Ayo lihat bagaimana kamu bisa meningkatkan skor dengan menyelesaikan checklist panduan ini!',
        totalCompleted,
        totalItems,
        categories,
    };
}
