<?php

namespace App\Ai\Agents;

use App\Models\User;
use App\Models\UserProfile;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Promptable;

class CvBuilderAgent implements Agent
{
    use Promptable;

    /**
     * The system instructions defining the agent's persona and guidelines.
     */
    public function instructions(): string
    {
        return <<<'SYS'
Kamu adalah konsultan karier profesional dan spesialis penulisan CV berstandar internasional & ATS (Executive Resume Writer & Career Coach).
Tugas utamamu adalah membantu pengguna menyusun, menyempurnakan, dan mengoptimalkan setiap seksi profil profesional dan CV mereka agar memikat recruiter (HRD) dan lolos seleksi ATS.

Pedoman Umum:
1. Komunikasi: Gunakan bahasa yang profesional, percaya diri, dan berbobot.
2. Relevansi: Utamakan kejelasan, pencapaian nyata, dan nilai tambah yang ditawarkan kandidat.
3. Gaya Penulisan: Hindari frasa klise tanpa bukti ("pekerja keras", "bisa bekerja di bawah tekanan").
4. Bahasa: Sesuaikan dengan bahasa draf input pengguna (Bahasa Indonesia formal atau Bahasa Inggris profesional).
SYS;
    }

    /**
     * Build prompt for enhancing "Tentang Saya" (Professional Summary).
     *
     * @param  array{
     *     text?: string|null,
     *     tone?: string|null,
     *     target_role?: string|null,
     *     custom_instruction?: string|null,
     * }  $params
     */
    public function buildSummaryPrompt(array $params, ?UserProfile $profile = null, ?User $user = null): string
    {
        $currentText = trim($params['text'] ?? '');
        $tone = $params['tone'] ?? 'professional';

        $toneDescriptions = [
            'professional' => 'Profesional, berwibawa, dan kredibel dengan gaya bahasa resume formal modern.',
            'concise' => 'Ringkas, padat, to-the-point (2-3 kalimat tajam tanpa kata berlebih).',
            'impactful' => 'Berorientasi hasil nyata dan pencapaian, menonjolkan aksi serta keunggulan kompetitif.',
            'creative' => 'Dinamis, antusias, dan modern (cocok untuk startup & industri kreatif/teknologi).',
        ];
        $selectedToneDesc = $toneDescriptions[$tone] ?? $toneDescriptions['professional'];

        $fullName = $profile?->full_name ?: ($user?->name ?? 'Kandidat');

        $targetRole = $params['target_role']
            ?? (! empty($profile?->field_of_interest) ? implode(', ', $profile->field_of_interest) : null);

        $totalExp = $profile?->calculateTotalExperience();

        $experiences = [];
        if ($profile) {
            $exps = $profile->experiences()->latest('start_date')->take(3)->get();
            foreach ($exps as $e) {
                $experiences[] = "{$e->position} di {$e->company}";
            }
        }

        $education = null;
        if ($profile) {
            $edu = $profile->educations()->latest('start_date')->first();
            if ($edu) {
                $education = "{$edu->degree} {$edu->major} di {$edu->institution}";
            }
        }

        $tools = (! empty($profile?->tools) && is_array($profile->tools))
            ? implode(', ', array_slice($profile->tools, 0, 8))
            : null;

        $contextLines = [];
        $contextLines[] = "- Nama: {$fullName}";
        if ($targetRole) {
            $contextLines[] = "- Bidang Minat / Target Posisi: {$targetRole}";
        }
        if ($totalExp && $totalExp !== '0 thn') {
            $contextLines[] = "- Total Pengalaman Kerja: {$totalExp}";
        }
        if (! empty($experiences)) {
            $contextLines[] = '- Riwayat Pekerjaan Terakhir: '.implode('; ', $experiences);
        }
        if ($education) {
            $contextLines[] = "- Pendidikan Terakhir: {$education}";
        }
        if ($tools) {
            $contextLines[] = "- Keahlian & Tools: {$tools}";
        }

        $profileContext = implode("\n", $contextLines);

        $customInstructionText = ! empty($params['custom_instruction'])
            ? "\n[Instruksi Khusus dari Kandidat]:\n{$params['custom_instruction']}\n"
            : '';

        $currentDraftDisplay = $currentText !== ''
            ? $currentText
            : '(Belum ada draf. Buatkan ringkasan profesional baru yang menarik dari informasi profil di bawah)';

        return <<<PROMPT
Tolong susun / sempurnakan ringkasan "Tentang Saya" (Professional Summary) untuk profil CV kandidat.

Aturan Khusus:
1. Buat dalam 1 paragraf ringkas berisi 2 sampai 4 kalimat padat (sekitar 40-85 kata).
2. Tampilkan identitas peran, keahlian utama, dan kontribusi nilai tambah.
3. HANYA hasilkan teks ringkasan itu sendiri tanpa tanda kutip pembuka/penutup dan tanpa kata pengantar atau catatan tambahan.

[Draf Teks Saat Ini]:
{$currentDraftDisplay}

[Gaya Bahasa yang Dipilih]:
{$selectedToneDesc}

[Informasi Profil Kandidat]:
{$profileContext}
{$customInstructionText}
Berikan hasil ringkasan "Tentang Saya" terbaik sekarang:
PROMPT;
    }
}
