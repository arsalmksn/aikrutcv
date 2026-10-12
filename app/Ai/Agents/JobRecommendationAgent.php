<?php

namespace App\Ai\Agents;

use App\Models\UserProfile;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Promptable;

class JobRecommendationAgent implements Agent
{
    use Promptable;

    /**
     * The system instructions defining the agent's persona and matching guidelines.
     */
    public function instructions(): string
    {
        return <<<'SYS'
Kamu adalah konsultan karier senior, headhunter, dan AI Career Matcher berpengalaman (Senior Talent Acquisition & Career Strategist).
Tugas utamamu adalah menganalisis profil profesional pencari kerja (ringkasan, riwayat pengalaman kerja, keahlian/tools, pendidikan, lokasi, serta preferensi karier) dan menghasilkan daftar rekomendasi posisi lowongan kerja yang PALING RELEVAN dan realistis untuk dilamar kandidat saat ini.

Pedoman Analisis:
1. Analisis menyeluruh: Perhatikan kesinambungan riwayat pengalaman kerja, kedalaman keahlian teknis/soft skills, serta aspirasi minat kandidat.
2. Realistis & Bernilai Tinggi: Berikan posisi yang relevan dengan level kematangan kandidat (misal Fresh Grad/Junior, Mid-Level, atau Senior).
3. Berikan saran taktis: Sebutkan alasan spesifik mengapa profil cocok, keahlian apa yang sudah pas, dan keahlian penting apa yang perlu ditonjolkan atau dipelajari (Skill Gap) agar probabilitas lolos wawancara tinggi.
4. Format output: Keluaran WAJIB berupa JSON murni yang valid tanpa teks pembungkus markdown (tanpa ```json ... ```), langsung dimulai dengan karakter { dan diakhiri dengan }.
SYS;
    }

    /**
     * Build the user prompt for generating personalized job recommendations.
     *
     * @param  array{career_level?: string, work_mode?: string}  $filters
     */
    public function buildPrompt(UserProfile $profile, array $filters = []): string
    {
        $name = $profile->full_name ?: ($profile->user?->name ?? 'Kandidat');
        $aboutMe = trim($profile->about_me ?? '') ?: 'Belum diisi';
        $location = trim($profile->location ?? '') ?: 'Indonesia';
        $totalExp = $profile->calculateTotalExperience();

        // Experiences
        $experiencesFormatted = [];
        if ($profile->relationLoaded('experiences') && $profile->experiences->isNotEmpty()) {
            foreach ($profile->experiences as $exp) {
                $descList = is_array($exp->description) ? implode('; ', array_filter($exp->description)) : ($exp->description ?? '');
                $period = $exp->start_date.($exp->is_current ? ' - Sekarang' : ($exp->end_date ? " - {$exp->end_date}" : ''));
                $experiencesFormatted[] = "- {$exp->position} di {$exp->company} ({$period}, {$exp->location}): {$descList}";
            }
        }
        $expText = ! empty($experiencesFormatted) ? implode("\n", $experiencesFormatted) : 'Belum ada riwayat pengalaman kerja formal.';

        // Educations
        $educationsFormatted = [];
        if ($profile->relationLoaded('educations') && $profile->educations->isNotEmpty()) {
            foreach ($profile->educations as $edu) {
                $educationsFormatted[] = "- {$edu->degree} {$edu->major} di {$edu->institution} ({$edu->start_date} - {$edu->end_date})";
            }
        }
        $eduText = ! empty($educationsFormatted) ? implode("\n", $educationsFormatted) : 'Tidak ada data pendidikan khusus.';

        // Skills & Tools
        $tools = is_array($profile->tools) ? implode(', ', $profile->tools) : 'Belum diisi';

        // Interests & Preferences
        $fieldsOfInterest = is_array($profile->field_of_interest) && ! empty($profile->field_of_interest)
            ? implode(', ', $profile->field_of_interest)
            : 'Sesuai dengan keahlian dan riwayat pengalaman';

        $employmentType = is_array($profile->employment_type) && ! empty($profile->employment_type)
            ? implode(', ', $profile->employment_type)
            : 'Full-time / Kontrak';

        $expectedSalaryText = 'Tidak ditentukan';
        if (! empty($profile->expected_monthly_salary)) {
            $sal = $profile->expected_monthly_salary;
            if (! empty($sal['range_text'])) {
                $expectedSalaryText = $sal['range_text'];
            } elseif (! empty($sal['amount'])) {
                $currency = $sal['currency'] ?? 'IDR';
                $expectedSalaryText = "{$currency} ".number_format((float) $sal['amount'], 0, ',', '.');
            }
        }

        $careerLevelFilter = $filters['career_level'] ?? 'all';
        $workModeFilter = $filters['work_mode'] ?? 'all';

        $filterInstructions = [];
        if ($careerLevelFilter !== 'all') {
            $filterInstructions[] = "Fokuskan pada level karier: {$careerLevelFilter}.";
        }
        if ($workModeFilter !== 'all') {
            $filterInstructions[] = "Prioritaskan tipe kerja: {$workModeFilter}.";
        }
        $filterSection = ! empty($filterInstructions)
            ? "[Filter Tambahan dari Pengguna]\n".implode("\n", $filterInstructions)
            : '[Filter Tambahan]: Bebas / optimalkan yang paling relevan dengan profil.';

        return <<<PROMPT
Analisis profil pencari kerja di bawah ini dan hasilkan 3 hingga 5 rekomendasi posisi/peran lowongan kerja yang paling cocok dan memiliki peluang diterimanya tinggi.

[Data Profil Kandidat]
- Nama: {$name}
- Lokasi Domisili: {$location}
- Total Pengalaman Kerja: {$totalExp}
- Ringkasan Diri (About Me):
{$aboutMe}

- Riwayat Pengalaman Kerja:
{$expText}

- Riwayat Pendidikan:
{$eduText}

- Keahlian Teknis & Tools:
{$tools}

- Minat Bidang / Posisi yang Diminati:
{$fieldsOfInterest}

- Preferensi Tipe Pekerjaan:
{$employmentType}

- Ekspektasi Gaji:
{$expectedSalaryText}

{$filterSection}

[Persyaratan Respon JSON]
Berikan respon HANYA berupa JSON valid dengan skema berikut:
{
  "profile_summary_insight": "Ringkasan penilaian profil kandidat dalam 1-2 kalimat (kelebihan utama dan daya saing di pasar kerja saat ini).",
  "recommendations": [
    {
      "job_title": "Nama Posisi / Job Title (misal: Frontend Developer)",
      "career_level": "Level karier (misal: Junior / Mid-Level / Senior)",
      "work_mode": "Mode kerja (misal: Hybrid, Remote, atau Onsite)",
      "match_score": 92,
      "match_level": "Sangat Cocok",
      "salary_estimate": "Estimasi rentang gaji pasar (misal: Rp 8.000.000 - Rp 14.000.000 / bulan)",
      "match_reason": "Alasan spesifik mengapa profil kandidat ini sangat cocok untuk posisi ini berdasarkan pengalaman dan keahliannya.",
      "matched_skills": ["Skill 1", "Skill 2", "Skill 3"],
      "skills_to_highlight": ["Skill/kualifikasi penting yang disarankan ditonjolkan atau dipelajari untuk posisi ini"],
      "key_responsibilities": ["2 poin utama tanggung jawab peran ini di perusahaan"],
      "search_keywords": "Kata kunci pencarian yang efektif untuk mencari lowongan ini"
    }
  ]
}

Pastikan:
1. match_score berupa angka integer antara 60 hingga 98.
2. Rekomendasi diurutkan dari skor kecocokan tertinggi.
3. Seluruh teks penjelasan menggunakan Bahasa Indonesia yang profesional dan memotivasi.
PROMPT;
    }
}
