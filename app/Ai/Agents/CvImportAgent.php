<?php

namespace App\Ai\Agents;

use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Promptable;

class CvImportAgent implements Agent
{
    use Promptable;

    /**
     * The system instructions defining the agent's persona and parsing/enhancement rules.
     */
    public function instructions(): string
    {
        return <<<'SYS'
Kamu adalah spesialis resume eksekutif berstandar internasional dan parser ATS (Executive Resume Specialist & ATS Optimizer).
Tugas utamamu adalah:
1. Menganalisis dan mengekstrak seluruh data penting dari teks resume/CV mentah yang diberikan.
2. MENYEMPURNAKAN (ENHANCE) konten tersebut ke standar ATS terbaik:
   - "about_me" (ringkasan profesional) disusun padat (2-4 kalimat berbobot) dan memikat.
   - Poin-poin deskripsi pekerjaan ("description" pada experiences) diubah menjadi bullet points berorientasi aksi (menggunakan active verbs kuat seperti Mengembangkan, Memimpin, Mengoptimalkan, Meningkatkan), fokus pada kontribusi dan hasil nyata.
   - Keahlian teknis & tools dikelompokkan dan distandarisasi ke nama industri umum (misal: "Laravel", "React.js", "Docker", "PostgreSQL").
3. Format keluaran WAJIB berupa JSON valid murni (tanpa teks pengantar, tanpa penutup, tanpa format pembungkus markdown).
SYS;
    }

    /**
     * Build the user prompt for parsing and enhancing raw CV text.
     *
     * @param  string  $rawCvText  The extracted raw text from CV document.
     * @param  string  $tone  The selected enhancement tone ('professional', 'concise', 'impactful').
     */
    public function buildImportPrompt(string $rawCvText, string $tone = 'professional'): string
    {
        $toneDescriptions = [
            'professional' => 'Profesional, berwibawa, dan kredibel dengan tata bahasa resume modern berstandar korporat.',
            'concise' => 'Ringkas, tajam, padat, to-the-point tanpa kata bertele-tele.',
            'impactful' => 'Berorientasi hasil nyata, aksi kuat, metrik keberhasilan, dan keunggulan kompetitif yang memikat recruiter.',
        ];

        $selectedToneDesc = $toneDescriptions[$tone] ?? $toneDescriptions['professional'];

        return <<<PROMPT
Analisis dan ekstrak teks resume/CV berikut menjadi data profil terstruktur, sekaligus sempurnakan (enhance) setiap bagian agar lolos standar ATS dan memikat HRD.

[Pedoman Gaya Bahasa (Tone)]:
{$selectedToneDesc}

[Aturan Ekstraksi & Enhance]:
1. personal_info: Ekstrak full_name, email, whatsapp_number, location, linkedin_url, portfolio_link jika ada.
2. about_me: Buat 1 paragraf ringkas (2-4 kalimat) yang memperkenalkan peran, keahlian utama, dan nilai tambah kandidat berdasarkan resume.
3. field_of_interest: Array string 1-3 target posisi / bidang minat yang paling relevan dengan profil ini.
4. experiences:
   - company: Nama perusahaan / organisasi kerja.
   - position: Jabatan / posisi kerja.
   - location: Kota atau lokasi kantor jika ada.
   - start_date: Format YYYY-MM (misal "2022-01") atau YYYY (misal "2022"). Jika tidak ada bulan, gunakan "YYYY-01".
   - end_date: Format YYYY-MM atau YYYY, atau null jika masih bekerja di sana saat ini.
   - is_current: boolean (true jika pekerjaan sekarang / "Present" / "Saat ini").
   - description: Array string (2-4 bullet points per pengalaman) yang SUDAH DI-ENHANCE dengan kata kerja aksi aktif, menonjolkan pencapaian.
5. educations:
   - institution: Nama universitas / sekolah.
   - degree: Gelar (misal "Sarjana Komputer", "S1", "Diploma", "SMK").
   - major: Jurusan / bidang studi.
   - start_date: Format YYYY-MM atau YYYY atau null.
   - end_date: Format YYYY-MM atau YYYY atau null.
   - gpa: Nilai IPK/GPA jika disebutkan.
   - description: Catatan prestasi akademis jika ada, atau null.
6. tools: Array string daftar keahlian, teknologi, tools, atau bahasa pemrograman yang spesifik dan relevan.
7. organizations: Array objek jika kandidat memiliki riwayat organisasi (organizations_name, role, start_date, end_date, duration, description sebagai array string).
8. certifications: Array objek sertifikasi jika ada (name, issuer, issue_date, expiration_date, validity_period).
9. awards: Array objek penghargaan / kejuaraan jika ada (title, subtitle, year, description).

Format JSON yang WAJIB dihasilkan persis seperti struktur ini:
{
  "personal_info": {
    "full_name": "Nama Lengkap",
    "email": "email@example.com",
    "whatsapp_number": "+62812345678",
    "location": "Jakarta, Indonesia",
    "linkedin_url": null,
    "portfolio_link": null
  },
  "about_me": "Teks ringkasan profesional yang telah di-enhance...",
  "field_of_interest": ["Backend Developer", "Software Engineer"],
  "tools": ["PHP", "Laravel", "MySQL", "Git"],
  "experiences": [
    {
      "company": "PT Contoh",
      "position": "Software Engineer",
      "location": "Jakarta",
      "start_date": "2022-01",
      "end_date": null,
      "is_current": true,
      "description": [
        "Mengembangkan arsitektur backend REST API yang melayani 50.000 pengguna aktif harian.",
        "Mengoptimalkan query database sehingga mengurangi latency rata-rata sebesar 35%."
      ]
    }
  ],
  "educations": [
    {
      "institution": "Universitas Contoh",
      "degree": "Sarjana Komputer",
      "major": "Teknik Informatika",
      "start_date": "2018-08",
      "end_date": "2022-07",
      "gpa": "3.80",
      "description": null
    }
  ],
  "organizations": [],
  "certifications": [],
  "awards": []
}

HANYA BERIKAN JSON MURNI TANPA KATA PENGANTAR DAN TANPA BLOK MARKDOWN.

[Teks Dokumen Resume]:
{$rawCvText}
PROMPT;
    }
}
