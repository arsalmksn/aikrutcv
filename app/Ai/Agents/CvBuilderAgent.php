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

    /**
     * Build prompt for enhancing Experience description.
     *
     * @param  array{
     *     company?: string|null,
     *     position?: string|null,
     *     location?: string|null,
     *     start_date?: string|null,
     *     end_date?: string|null,
     *     is_current?: bool|null,
     *     text?: string|null,
     *     tone?: string|null,
     *     target_role?: string|null,
     *     custom_instruction?: string|null,
     * }  $params
     */
    public function buildExperiencePrompt(array $params, ?UserProfile $profile = null, ?User $user = null): string
    {
        $currentText = trim($params['text'] ?? '');
        $company = trim($params['company'] ?? '');
        $position = trim($params['position'] ?? '');
        $location = trim($params['location'] ?? '');
        $startDate = trim($params['start_date'] ?? '');
        $endDate = trim($params['end_date'] ?? '');
        $isCurrent = (bool) ($params['is_current'] ?? false);
        $tone = $params['tone'] ?? 'impactful';

        $toneDescriptions = [
            'professional' => 'Profesional, berwibawa, dan kredibel dengan tata bahasa resume formal modern.',
            'concise' => 'Ringkas, padat, to-the-point tanpa kata berlebih.',
            'impactful' => 'Berorientasi aksi nyata dan kejelasan kontribusi fungsional yang memikat recruiter.',
            'creative' => 'Dinamis, adaptif, dan modern tanpa menambah klaim fiktif.',
        ];
        $selectedToneDesc = $toneDescriptions[$tone] ?? $toneDescriptions['impactful'];

        $contextLines = [];
        if ($position !== '') {
            $contextLines[] = "- Posisi / Jabatan: {$position}";
        }
        if ($company !== '') {
            $contextLines[] = "- Perusahaan / Instansi: {$company}";
        }
        if ($location !== '') {
            $contextLines[] = "- Lokasi Kerja: {$location}";
        }
        if ($startDate !== '' || $endDate !== '' || $isCurrent) {
            $periodStr = $startDate ?: 'Periode';
            if ($isCurrent) {
                $periodStr .= ' — Saat Ini (Masih aktif bekerja di sini)';
            } elseif ($endDate !== '') {
                $periodStr .= " — {$endDate}";
            }
            $contextLines[] = "- Periode Waktu Kerja: {$periodStr}";
        }

        $jobContext = ! empty($contextLines) ? implode("\n", $contextLines) : '- Informasi umum pekerjaan';

        $customInstructionText = ! empty($params['custom_instruction'])
            ? "\n[Instruksi Khusus dari Kandidat]:\n{$params['custom_instruction']}\n"
            : '';

        $currentDraftDisplay = $currentText !== ''
            ? $currentText
            : '(Belum ada draf. Rangkum lingkup tanggung jawab fungsional umum yang realistis untuk posisi ini tanpa mengklaim proyek spesifik atau hasil terukur palsu)';

        return <<<PROMPT
Tolong buat atau sempurnakan draf deskripsi pengalaman kerja kandidat agar berstandar resume profesional dan ATS-friendly.

[PRINSIP STRICT CONTEXT - ZERO FABRICATION]:
1. HANYA gunakan fakta, tanggung jawab, dan keahlian yang tercantum dalam konteks pekerjaan atau draf kandidat di bawah ini.
2. DILARANG KERAS mengarang atau menambahkan metrik kuantitatif palsu (seperti persentase peningkatan %, angka efisiensi, nilai rupiah/dolar, atau jumlah tim/klien fiktif) jika pengguna tidak menuliskannya di draf.
3. DILARANG mengarang proyek fiktif, nama klien, atau teknologi/tools yang tidak disebutkan kandidat.
4. KONSISTENSI DRAF: Jika teks [Draf / Catatan Kandidat Saat Ini] menyebutkan perusahaan, peran, atau tools yang berbeda/bertentangan dengan [Konteks Pekerjaan] resmi di atas (misalnya sisa teks lama), ABAIKAN dan buang fakta lama tersebut. Fokuskan deskripsi murni pada posisi dan perusahaan terbaru saat ini.
5. FORMAT WAJIB "DESKRIPSI SAJA": Tuliskan dalam 1 paragraf ringkas atau 2 sampai 3 kalimat deskripsi naratif mengalir yang padat dan profesional. DILARANG menggunakan tanda bullet (seperti •, -, *), dan DILARANG menggunakan penomoran baris (1., 2.).
6. Awali kalimat dengan kata kerja aksi aktif kuat (seperti Mengembangkan, Mengoptimalkan, Memimpin, Merancang, Mengelola) berdasarkan lingkup tugas nyata kandidat. Jika kandidat masih aktif bekerja, gunakan bentuk kata kerja sedang berlangsung.
7. HANYA hasilkan teks deskripsi itu sendiri tanpa tanda kutip pembuka/penutup, tanpa pembungkus markdown (seperti ```), dan tanpa kata pengantar atau catatan tambahan.

[Konteks Pekerjaan]:
{$jobContext}

[Gaya Bahasa yang Dipilih]:
{$selectedToneDesc}

[Draf / Catatan Kandidat Saat Ini]:
{$currentDraftDisplay}
{$customInstructionText}
Berikan hasil deskripsi pengalaman kerja terbaik sekarang:
PROMPT;
    }

    /**
     * Build prompt for enhancing Education description.
     *
     * @param  array{
     *     institution?: string|null,
     *     degree?: string|null,
     *     field_of_study?: string|null,
     *     start_date?: string|null,
     *     end_date?: string|null,
     *     is_current?: bool|null,
     *     gpa?: string|null,
     *     text?: string|null,
     *     tone?: string|null,
     *     custom_instruction?: string|null,
     * }  $params
     */
    public function buildEducationPrompt(array $params, ?UserProfile $profile = null, ?User $user = null): string
    {
        $currentText = trim($params['text'] ?? '');
        $institution = trim($params['institution'] ?? '');
        $degree = trim($params['degree'] ?? '');
        $major = trim($params['field_of_study'] ?? ($params['major'] ?? ''));
        $gpa = trim($params['gpa'] ?? '');
        $startDate = trim($params['start_date'] ?? '');
        $endDate = trim($params['end_date'] ?? '');
        $isCurrent = (bool) ($params['is_current'] ?? false);
        $tone = $params['tone'] ?? 'professional';

        $toneDescriptions = [
            'professional' => 'Formal, akademis, kredibel, dan berbobot.',
            'concise' => 'Ringkas, padat 1-2 baris to-the-point mengenai sorotan studi.',
            'impactful' => 'Menonjolkan kejelasan fokus studi akademis dan pencapaian nyata kandidat.',
            'creative' => 'Menarik, antusias, dan modern tanpa menambah klaim fiktif.',
        ];
        $selectedToneDesc = $toneDescriptions[$tone] ?? $toneDescriptions['professional'];

        $contextLines = [];
        if ($institution !== '') {
            $contextLines[] = "- Institusi / Universitas: {$institution}";
        }
        if ($degree !== '') {
            $contextLines[] = "- Jenjang Pendidikan: {$degree}";
        }
        if ($major !== '') {
            $contextLines[] = "- Jurusan / Program Studi: {$major}";
        }
        if ($gpa !== '') {
            $contextLines[] = "- Nilai Akhir / IPK: {$gpa}";
        }
        if ($startDate !== '' || $endDate !== '' || $isCurrent) {
            $periodStr = $startDate ?: 'Tahun';
            if ($isCurrent) {
                $periodStr .= ' — Saat Ini (Masih aktif menempuh studi)';
            } elseif ($endDate !== '') {
                $periodStr .= " — {$endDate}";
            }
            $contextLines[] = "- Periode Waktu Studi: {$periodStr}";
        }

        $eduContext = ! empty($contextLines) ? implode("\n", $contextLines) : '- Informasi umum pendidikan';

        $customInstructionText = ! empty($params['custom_instruction'])
            ? "\n[Instruksi Khusus dari Kandidat]:\n{$params['custom_instruction']}\n"
            : '';

        $currentDraftDisplay = $currentText !== ''
            ? $currentText
            : '(Belum ada draf. Tuliskan ringkasan 1-2 kalimat mengenai fokus keilmuan akademis murni berdasarkan data institusi, jenjang, dan jurusan di atas tanpa mengarang penghargaan atau IPK fiktif)';

        return <<<PROMPT
Tolong buat atau sempurnakan catatan ringkasan deskripsi riwayat pendidikan kandidat agar memikat recruiter secara akademis dan profesional.

[PRINSIP STRICT CONTEXT - ZERO FABRICATION]:
1. HANYA gunakan data resmi yang diberikan di atas (Institusi, Jurusan, Jenjang, Periode Waktu, dan IPK jika tertera).
2. DILARANG KERAS mengarang penghargaan, beasiswa, predikat kelulusan (seperti Cum Laude), kejuaraan lomba, kegiatan kepanitiaan, judul skripsi fiktif, atau nilai IPK jika tidak tercantum secara eksplisit. Jika nilai IPK tidak diberikan, DILARANG menyebutkan angka IPK atau predikat Cum Laude.
3. DILARANG mengarang tahun kelulusan masa lampau jika periode tertera menunjukkan studi berlangsung atau saat ini. Jika kandidat masih aktif menempuh studi, gunakan kata kerja atau konteks studi yang sedang dijalani (misal: "Mendalami keilmuan...", bukan "Telah menyelesaikan studi pada tahun lama").
4. KONSISTENSI DRAF: Jika teks [Draf / Catatan Kandidat Saat Ini] menyebutkan jurusan, institusi, atau tahun yang berbeda/bertentangan dengan [Data Pendidikan] resmi di atas (misalnya sisa teks lama), ABAIKAN dan buang fakta lama yang bertentangan tersebut. Fokuslah secara mutlak pada [Data Pendidikan] terbaru saat ini.
5. FORMAT WAJIB "DESKRIPSI SAJA": Tuliskan dalam 1 paragraf mini atau 1 sampai 2 kalimat deskripsi naratif mengalir (sekitar 25-50 kata). DILARANG menggunakan format poin-poin/bullet (seperti •, -, *) dan DILARANG menggunakan nomor.
6. HANYA hasilkan teks ringkasan itu sendiri tanpa tanda kutip pembuka/penutup, tanpa pembungkus markdown (seperti ```), dan tanpa kata pengantar atau catatan tambahan.

[Data Pendidikan]:
{$eduContext}

[Gaya Bahasa yang Dipilih]:
{$selectedToneDesc}

[Draf / Catatan Kandidat Saat Ini]:
{$currentDraftDisplay}
{$customInstructionText}
Berikan hasil deskripsi pendidikan terbaik sekarang:
PROMPT;
    }
}
