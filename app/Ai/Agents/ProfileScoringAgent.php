<?php

namespace App\Ai\Agents;

use App\Models\UserProfile;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Promptable;

class ProfileScoringAgent implements Agent
{
    use Promptable;

    /**
     * The system instructions defining the agent's persona and scoring methodology.
     */
    public function instructions(): string
    {
        return <<<'SYS'
Kamu adalah konsultan karier senior, VP of Talent Acquisition, dan spesialis audit profil profesional & CV berstandar internasional (Senior Executive Recruiter & Career Strategist).
Tugas utamamu adalah melakukan audit menyeluruh terhadap profil profesional pencari kerja, memberikan penilaian objektif (skor 0-100), menganalisis 4 pilar utama profil, serta memberikan umpan balik taktis dan rekomendasi konkret yang dapat segera diterapkan pengguna untuk melipatgandakan daya saing mereka di hadapan rekruter dan sistem ATS.

Pedoman Penilaian:
1. Objektif & Konstruktif: Berikan skor yang realistis sesuai kedalaman dan kelengkapan data. Jangan memberi skor sempurna (100) jika masih ada kekurangan metrik atau ringkasan yang terlalu umum.
   - 85-100: Sangat Kompetitif (Profil solid, pencapaian terukur, keahlian jelas).
   - 70-84: Kompetitif / Baik (Fondasi bagus, namun butuh penajaman dampak atau metrik).
   - 50-69: Cukup / Butuh Optimasi (Informasi mendasar ada, namun minim narasi pencapaian atau seksi belum lengkap).
   - < 50: Belum Siap Melamar (Banyak seksi kosong atau hanya berisi data minimal).
2. Empat Pilar Evaluasi (Rubrik 0-100 per pilar):
   - Kualitas & Dampak Pengalaman Kerja (experience_impact): Apakah pengalaman menggunakan action verbs kuat, menyebutkan lingkup kerja, dan memiliki metrik pencapaian (angka/persentase/efisiensi)?
   - Relevansi Keahlian & Tools (skills_relevance): Apakah keahlian teknis/soft skills sejalan dengan target peran dan industri saat ini?
   - Kekuatan Ringkasan Profesional (summary_clarity): Apakah ringkasan diri (About Me) mampu menjual *value proposition* kandidat secara tajam dan tidak klise?
   - Kelengkapan Kredensial & Portofolio (credentials_completeness): Apakah pendidikan, sertifikasi, penghargaan, tautan portofolio/LinkedIn terisi dengan baik?
3. Format Output:
   Keluaran WAJIB berupa JSON murni yang valid tanpa pembungkus markdown (tanpa ```json ... ```), langsung dimulai dengan karakter { dan diakhiri dengan }.
SYS;
    }

    /**
     * Build the evaluation prompt based on comprehensive UserProfile data.
     */
    public function buildPrompt(UserProfile $profile): string
    {
        $name = $profile->full_name ?: ($profile->user?->name ?? 'Kandidat');
        $aboutMe = trim((string) ($profile->about_me ?? '')) ?: 'Belum diisi';
        $location = trim((string) ($profile->location ?? '')) ?: 'Indonesia';
        $totalExp = $profile->calculateTotalExperience();
        $portfolioLink = trim((string) ($profile->portfolio_link ?? '')) ?: 'Tidak ada';
        $linkedinUrl = trim((string) ($profile->linkedin_url ?? '')) ?: 'Tidak ada';

        // Experiences
        $experiencesFormatted = [];
        if ($profile->relationLoaded('experiences') && $profile->experiences->isNotEmpty()) {
            foreach ($profile->experiences as $exp) {
                $descList = is_array($exp->description) ? implode('; ', array_filter($exp->description)) : ($exp->description ?? '');
                $period = $exp->start_date.($exp->is_current ? ' - Sekarang' : ($exp->end_date ? " - {$exp->end_date}" : ''));
                $experiencesFormatted[] = "- {$exp->position} di {$exp->company} ({$period}, {$exp->location}): {$descList}";
            }
        }
        $expText = ! empty($experiencesFormatted) ? implode("\n", $experiencesFormatted) : 'Belum ada riwayat pengalaman kerja.';

        // Educations
        $educationsFormatted = [];
        if ($profile->relationLoaded('educations') && $profile->educations->isNotEmpty()) {
            foreach ($profile->educations as $edu) {
                $gpa = filled($edu->gpa) ? " (IPK: {$edu->gpa})" : '';
                $educationsFormatted[] = "- {$edu->degree} {$edu->major} di {$edu->institution} ({$edu->start_date} - {$edu->end_date}){$gpa}";
            }
        }
        $eduText = ! empty($educationsFormatted) ? implode("\n", $educationsFormatted) : 'Tidak ada data pendidikan khusus.';

        // Tools & Skills
        $tools = is_array($profile->tools) && ! empty($profile->tools) ? implode(', ', $profile->tools) : 'Belum diisi';

        // Organizations
        $orgsFormatted = [];
        if ($profile->relationLoaded('organizations') && $profile->organizations->isNotEmpty()) {
            foreach ($profile->organizations as $org) {
                $orgsFormatted[] = "- {$org->role} di {$org->organizations_name} ({$org->duration})";
            }
        }
        $orgText = ! empty($orgsFormatted) ? implode("\n", $orgsFormatted) : 'Tidak ada';

        // Certifications
        $certsFormatted = [];
        if ($profile->relationLoaded('certifications') && $profile->certifications->isNotEmpty()) {
            foreach ($profile->certifications as $cert) {
                $certsFormatted[] = "- {$cert->name} oleh {$cert->issuer} ({$cert->issue_date})";
            }
        }
        $certText = ! empty($certsFormatted) ? implode("\n", $certsFormatted) : 'Tidak ada';

        // Awards
        $awardsFormatted = [];
        if ($profile->relationLoaded('awards') && $profile->awards->isNotEmpty()) {
            foreach ($profile->awards as $aw) {
                $awardsFormatted[] = "- {$aw->title} ({$aw->year}): {$aw->subtitle}";
            }
        }
        $awardText = ! empty($awardsFormatted) ? implode("\n", $awardsFormatted) : 'Tidak ada';

        // Interests & Preferences
        $fieldsOfInterest = is_array($profile->field_of_interest) && ! empty($profile->field_of_interest)
            ? implode(', ', $profile->field_of_interest)
            : 'Belum ditentukan';

        $employmentType = is_array($profile->employment_type) && ! empty($profile->employment_type)
            ? implode(', ', $profile->employment_type)
            : 'Belum ditentukan';

        // Resumes & Attachments count
        $resumeCount = $profile->relationLoaded('resumes') ? $profile->resumes->count() : $profile->resumes()->count();
        $attachmentCount = $profile->relationLoaded('attachments') ? $profile->attachments->count() : $profile->attachments()->count();

        return <<<PROMPT
Analisis secara teliti dan profesional profil kandidat berikut:

[DATA PROFIL KANDIDAT]
- Nama: {$name}
- Lokasi: {$location}
- Total Pengalaman Kerja: {$totalExp}
- Minat Karier/Bidang: {$fieldsOfInterest}
- Preferensi Tipe Kerja: {$employmentType}
- Tautan Portofolio: {$portfolioLink}
- Tautan LinkedIn: {$linkedinUrl}
- Jumlah File Resume Terunggah: {$resumeCount}
- Jumlah File Portofolio/Attachment: {$attachmentCount}

[TENTANG SAYA / RINGKASAN PROFESIONAL]
{$aboutMe}

[RIWAYAT PENGALAMAN KERJA]
{$expText}

[RIWAYAT PENDIDIKAN]
{$eduText}

[KEAHLIAN & TOOLS]
{$tools}

[PENGALAMAN ORGANISASI]
{$orgText}

[SERTIFIKASI & PELATIHAN]
{$certText}

[PENGHARGAAN & PRESTASI]
{$awardText}

[PETUNJUK OUTPUT JSON]
Hasilkan output HANYA berupa JSON valid dengan struktur persis seperti berikut (Bahasa Indonesia):
{
  "overall_score": 82,
  "grade": "A- (Sangat Kompetitif)",
  "headline": "Satu kalimat ringkas dan memikat mengenai keunggulan profil dan hal utama yang perlu ditingkatkan.",
  "executive_summary": "2-3 kalimat rangkuman pandangan rekruter mengenai kesiapan kandidat di pasar kerja saat ini.",
  "rubric_scores": {
    "experience_impact": {
      "score": 80,
      "label": "Dampak Pengalaman Kerja",
      "feedback": "Ulasan singkat kekuatan dan celah pada seksi pengalaman kerja."
    },
    "skills_relevance": {
      "score": 85,
      "label": "Relevansi Keahlian & Tools",
      "feedback": "Ulasan singkat mengenai kecukupan dan relevansi keahlian dengan industri."
    },
    "summary_clarity": {
      "score": 80,
      "label": "Kekuatan Ringkasan Profesional",
      "feedback": "Ulasan singkat mengenai efektivitas bagian Tentang Saya."
    },
    "credentials_completeness": {
      "score": 85,
      "label": "Kredensial & Kelengkapan Berkas",
      "feedback": "Ulasan singkat mengenai kelengkapan pendidikan, sertifikat, dan tautan portofolio."
    }
  },
  "strengths": [
    "Poin keunggulan 1 yang menonjol dari profil",
    "Poin keunggulan 2 yang disukai rekruter",
    "Poin keunggulan 3"
  ],
  "improvements": [
    "Poin kekurangan 1 atau area yang belum optimal",
    "Poin kekurangan 2",
    "Poin kekurangan 3"
  ],
  "actionable_tips": [
    {
      "title": "Judul Saran Taktis 1",
      "tip": "Instruksi konkret apa yang harus diubah atau ditambahkan.",
      "target_section": "experiences"
    },
    {
      "title": "Judul Saran Taktis 2",
      "tip": "Instruksi konkret apa yang harus diubah atau ditambahkan.",
      "target_section": "summary"
    },
    {
      "title": "Judul Saran Taktis 3",
      "tip": "Instruksi konkret apa yang harus diubah atau ditambahkan.",
      "target_section": "skills"
    }
  ]
}
PROMPT;
    }
}
