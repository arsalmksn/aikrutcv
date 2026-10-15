<?php

namespace App\Ai\Agents;

use App\Models\User;
use App\Models\UserProfile;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Promptable;

class CareerOnboardingAgent implements Agent
{
    use Promptable;

    /**
     * The system instructions defining the agent's persona and onboarding methodology.
     */
    public function instructions(): string
    {
        return <<<'SYS'
Kamu adalah konsultan karier senior, Executive Talent Strategist, dan AI Career Onboarding Architect berpengalaman.
Tugas utamamu adalah menganalisis peminatan awal (field of interest) dan level karier pengguna, memadukannya dengan riwayat data profil/CV yang sudah existing (jika ada), lalu merumuskan blueprint profil karier terpersonalisasi yang akan menjadi acuan dasar bagi seluruh sistem AI (CV Builder, ATS Scorer, dan Job Matching).

Pedoman Analisis:
1. Relevan & Terarah: Sesuaikan rekomendasi peran dan keahlian dengan peminatan yang dipilih pengguna dan jenjang pengalaman mereka (Fresh Graduate, Junior, Mid-Level, Senior, atau Career Switcher).
2. Maksimalkan Data Existing: Jika pengguna memiliki riwayat kerja, organisasi, atau keahlian sebelumnya, integrasikan dan tonjolkan benang merah ke dalam peminatan yang dituju.
3. Bernilai Taktis: Berikan langkah aksi konkret yang dapat langsung diaplikasikan dalam pembuatan CV ATS.
4. Format Output WAJIB berupa JSON murni yang valid tanpa pembungkus markdown (tanpa ```json ... ```), dimulai langsung dengan karakter { dan diakhiri dengan }.

Skema JSON yang harus dihasilkan:
{
  "ai_profile_summary": "Pernyataan ringkasan profil profesional 2-3 kalimat yang menjual dan kredibel sesuai peminatan.",
  "target_roles": ["Peran 1", "Peran 2", "Peran 3"],
  "recommended_skills": ["Skill/Tool 1", "Skill/Tool 2", "Skill/Tool 3", "Skill/Tool 4", "Skill/Tool 5"],
  "quick_action_steps": [
    "Saran taktis 1 untuk CV atau profil",
    "Saran taktis 2 untuk CV atau profil",
    "Saran taktis 3 untuk CV atau profil"
  ],
  "tailored_tone": "professional",
  "career_level": "Level karier yang telah dianalisis",
  "readiness_note": "Catatan singkat 1 kalimat mengenai kesiapan profil untuk melamar pekerjaan impian"
}
SYS;
    }

    /**
     * Build the prompt for AI onboarding synthesis.
     *
     * @param  array{
     *     field_of_interest: array<int, string>,
     *     career_level?: string|null,
     *     existing_data?: array<string, mixed>|null,
     *     additional_notes?: string|null
     * }  $input
     */
    public function buildOnboardingPrompt(array $input, ?UserProfile $profile = null, ?User $user = null): string
    {
        $name = $profile?->full_name ?: ($user?->name ?? 'Kandidat');
        $fieldOfInterest = ! empty($input['field_of_interest'])
            ? implode(', ', $input['field_of_interest'])
            : 'Belum ditentukan spesifik';
        $careerLevel = $input['career_level'] ?? 'Fresh Graduate / Entry Level';

        // Extract existing context if provided
        $existing = $input['existing_data'] ?? [];
        $existingExperiences = $existing['experiences'] ?? [];
        $existingEducations = $existing['educations'] ?? [];
        $existingTools = $existing['tools'] ?? [];
        $existingSummary = $existing['summary'] ?? ($profile?->about_me ?? null);

        $experiencesText = 'Belum ada data pengalaman kerja.';
        if (! empty($existingExperiences) && is_array($existingExperiences)) {
            $expLines = [];
            foreach ($existingExperiences as $exp) {
                if (is_array($exp)) {
                    $pos = $exp['position'] ?? ($exp['role'] ?? 'Peran');
                    $comp = $exp['company'] ?? ($exp['company_name'] ?? 'Perusahaan');
                    $expLines[] = "- {$pos} di {$comp}";
                }
            }
            if (! empty($expLines)) {
                $experiencesText = implode("\n", $expLines);
            }
        }

        $educationsText = 'Tidak ada catatan pendidikan khusus.';
        if (! empty($existingEducations) && is_array($existingEducations)) {
            $eduLines = [];
            foreach ($existingEducations as $edu) {
                if (is_array($edu)) {
                    $deg = $edu['degree'] ?? '';
                    $inst = $edu['institution'] ?? ($edu['institution_name'] ?? '');
                    $eduLines[] = "- {$deg} di {$inst}";
                }
            }
            if (! empty($eduLines)) {
                $educationsText = implode("\n", $eduLines);
            }
        }

        $toolsText = ! empty($existingTools) && is_array($existingTools)
            ? implode(', ', array_filter($existingTools))
            : 'Belum ada daftar keahlian/tools tersimpan.';

        $summaryText = $existingSummary ? trim((string) $existingSummary) : 'Belum ada ringkasan.';

        return <<<PROMPT
Nama Kandidat: {$name}
Peminatan Awal (Field of Interest): {$fieldOfInterest}
Tingkat Karier (Career Level): {$careerLevel}

=== DATA EXISTING PENGGUNA YANG TERSEDIA ===
Ringkasan Saat Ini:
{$summaryText}

Riwayat Pengalaman Kerja:
{$experiencesText}

Riwayat Pendidikan:
{$educationsText}

Daftar Keahlian / Tools yang Sudah Ada:
{$toolsText}

Instruksi Analisis:
Sintesiskan peminatan awal kandidat di atas bersama data existing yang sudah ada. Buatlah AI Career Blueprint lengkap sesuai dengan format JSON yang ditentukan dalam instruksi sistem.
PROMPT;
    }
}
