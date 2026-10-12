<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Smalot\PdfParser\Parser as PdfParser;
use Throwable;
use ZipArchive;

class DocumentTextExtractorService
{
    /**
     * Maximum character count allowed for resume text to fit AI model prompt safely.
     */
    protected const MAX_TEXT_LENGTH = 25000;

    public function __construct(
        protected ?PdfParser $pdfParser = null
    ) {
        $this->pdfParser = $pdfParser ?? new PdfParser;
    }

    /**
     * Extract plain text content from an uploaded resume file (PDF or DOCX).
     *
     * @throws \RuntimeException
     */
    public function extract(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $realPath = $file->getRealPath();

        if (! $realPath || ! file_exists($realPath)) {
            throw new \RuntimeException('Berkas yang diunggah tidak ditemukan pada sistem penyimpanan sementara.');
        }

        $text = match ($extension) {
            'pdf' => $this->extractFromPdf($realPath),
            'docx' => $this->extractFromDocx($realPath),
            default => throw new \RuntimeException("Format berkas .{$extension} tidak didukung. Harap unggah dokumen PDF atau DOCX."),
        };

        $normalized = $this->normalizeText($text);

        if (blank($normalized)) {
            throw new \RuntimeException('Tidak ada teks yang dapat diekstraksi dari dokumen. Jika menggunakan file PDF, pastikan dokumen memiliki lapisan teks digital (bukan hasil pindaian/scan foto tanpa teks).');
        }

        if (mb_strlen($normalized) > self::MAX_TEXT_LENGTH) {
            $normalized = mb_substr($normalized, 0, self::MAX_TEXT_LENGTH)."\n\n[Konten dipotong karena melebihi batas karakter]";
        }

        return $normalized;
    }

    /**
     * Extract text from a PDF file using Smalot PdfParser.
     *
     * @throws \RuntimeException
     */
    protected function extractFromPdf(string $filePath): string
    {
        try {
            $pdf = $this->pdfParser->parseFile($filePath);

            return $pdf->getText();
        } catch (Throwable $e) {
            throw new \RuntimeException('Gagal mengekstrak teks dari berkas PDF: '.$e->getMessage(), 0, $e);
        }
    }

    /**
     * Extract text from a DOCX file by reading word/document.xml.
     *
     * @throws \RuntimeException
     */
    protected function extractFromDocx(string $filePath): string
    {
        if (! class_exists(ZipArchive::class)) {
            throw new \RuntimeException('Ekstensi PHP ZipArchive tidak aktif pada server.');
        }

        $zip = new ZipArchive;
        $openResult = $zip->open($filePath);

        if ($openResult !== true) {
            throw new \RuntimeException('Tidak dapat membuka berkas DOCX. Pastikan berkas tidak rusak atau terenkripsi.');
        }

        $documentXml = $zip->getFromName('word/document.xml');
        $zip->close();

        if ($documentXml === false) {
            throw new \RuntimeException('Format DOCX tidak valid (komponen word/document.xml tidak ditemukan).');
        }

        // Convert paragraph and break tags into newlines
        $formatted = preg_replace('/<\/w:p>/i', "\n", $documentXml);
        $formatted = preg_replace('/<w:br[^>]*\/>/i', "\n", (string) $formatted);

        $text = strip_tags((string) $formatted);

        return html_entity_decode($text, ENT_QUOTES | ENT_XML1, 'UTF-8');
    }

    /**
     * Clean and normalize raw extracted text.
     */
    protected function normalizeText(string $text): string
    {
        // Replace multiple consecutive empty lines or whitespaces
        $text = str_replace(["\r\n", "\r"], "\n", $text);
        $text = preg_replace("/[ \t]+/", ' ', $text);
        $text = preg_replace("/\n{3,}/", "\n\n", (string) $text);

        return trim((string) $text);
    }
}
