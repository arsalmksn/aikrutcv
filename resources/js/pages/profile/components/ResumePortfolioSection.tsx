import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import {
    Download,
    ExternalLink,
    FileText,
    Globe,
    Paperclip,
    Plus,
    Trash2,
    Upload,
    Check,
    Share2,
    CheckCircle2,
    Sparkles,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
    UserAttachmentItem,
    UserProfileData,
    UserResumeItem,
    ProfileSectionRef,
} from '@/types/profile';

interface ResumePortfolioSectionProps {
    profile: UserProfileData;
    onSaveSection: (section: string, payload: Partial<UserProfileData>) => Promise<boolean>;
    onUploadFile: (
        file: File,
        type: 'resume' | 'attachment',
        title?: string
    ) => Promise<{ id: number; file_name: string; file_url: string } | null>;
    onDeleteItem: (type: 'resume' | 'attachment', id: number) => Promise<boolean>;
}

export const ResumePortfolioSection = forwardRef<ProfileSectionRef, ResumePortfolioSectionProps>(
    function ResumePortfolioSection(
        {
            profile,
            onSaveSection,
            onUploadFile,
            onDeleteItem,
        },
        ref
    ) {
        const [portfolioLink, setPortfolioLink] = useState(profile.portfolio_link || '');
        const [linkedinLink, setLinkedinLink] = useState(profile.linkedin_url || '');
        const [resumes, setResumes] = useState<UserResumeItem[]>(profile.resumes || []);
        const [attachments, setAttachments] = useState<UserAttachmentItem[]>(
            profile.attachments || []
        );

        // Upload state
        const [isUploadingResume, setIsUploadingResume] = useState(false);
        const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
        const [deletingId, setDeletingId] = useState<string | null>(null);
        const [attachmentTitle, setAttachmentTitle] = useState('');

        const resumeInputRef = useRef<HTMLInputElement>(null);
        const attachmentInputRef = useRef<HTMLInputElement>(null);

        const handleSave = async (): Promise<boolean> => {
            return await onSaveSection('portfolio', {
                portfolio_link: portfolioLink.trim(),
                linkedin_url: linkedinLink.trim(),
            });
        };

        useImperativeHandle(ref, () => ({
            save: handleSave,
        }));

        const handleResumeFileSelect = async (
            e: React.ChangeEvent<HTMLInputElement>
        ) => {
            const file = e.target.files?.[0];
            if (!file) return;

            setIsUploadingResume(true);
            const result = await onUploadFile(file, 'resume');
            setIsUploadingResume(false);

            if (result) {
                setResumes((prev) => [
                    {
                        id: result.id,
                        file_name: result.file_name,
                        file_url: result.file_url,
                        uploaded_at: 'Baru saja',
                    },
                    ...prev,
                ]);
            }

            if (resumeInputRef.current) {
                resumeInputRef.current.value = '';
            }
        };

        const handleAttachmentFileSelect = async (
            e: React.ChangeEvent<HTMLInputElement>
        ) => {
            const file = e.target.files?.[0];
            if (!file) return;

            setIsUploadingAttachment(true);
            const result = await onUploadFile(
                file,
                'attachment',
                attachmentTitle.trim() || undefined
            );
            setIsUploadingAttachment(false);

            if (result) {
                setAttachments((prev) => [
                    {
                        id: result.id,
                        title: attachmentTitle.trim() || result.file_name,
                        file_name: result.file_name,
                        file_url: result.file_url,
                        file_type: file.name.split('.').pop() || '',
                        uploaded_at: 'Baru saja',
                    },
                    ...prev,
                ]);
                setAttachmentTitle('');
            }

            if (attachmentInputRef.current) {
                attachmentInputRef.current.value = '';
            }
        };

        const handleDeleteResume = async (id: number) => {
            setDeletingId(`resume_${id}`);
            const success = await onDeleteItem('resume', id);
            setDeletingId(null);
            if (success) {
                setResumes((prev) => prev.filter((r) => r.id !== id));
            }
        };

        const handleDeleteAttachment = async (id: number) => {
            setDeletingId(`attachment_${id}`);
            const success = await onDeleteItem('attachment', id);
            setDeletingId(null);
            if (success) {
                setAttachments((prev) => prev.filter((a) => a.id !== id));
            }
        };

        return (
            <div className="space-y-6">
                {/* 1. Portfolio & Social Media Links */}
                <div className="space-y-4 rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                                <Globe className="size-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                    Tautan Portofolio & Profil Online
                                </h3>
                                <p className="text-[11px] text-neutral-400">
                                    Tautkan situs portofolio publik, repositori GitHub, atau profil LinkedIn Anda
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* LinkedIn */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                    Profil LinkedIn
                                </Label>
                                {linkedinLink && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            window.open(
                                                linkedinLink.startsWith('http')
                                                    ? linkedinLink
                                                    : `https://${linkedinLink}`,
                                                '_blank'
                                            )
                                        }
                                        className="text-[11px] text-sky-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                                    >
                                        <span>Buka Link</span>
                                        <ExternalLink className="size-2.5" />
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <Input
                                    type="url"
                                    value={linkedinLink}
                                    onChange={(e) => setLinkedinLink(e.target.value)}
                                    placeholder="https://linkedin.com/in/username"
                                    className="rounded-xl text-xs sm:text-sm pl-9"
                                />
                                <Share2 className="absolute left-3 top-2.5 size-4 text-neutral-400" />
                            </div>
                        </div>

                        {/* Portfolio Web */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                    Website Portofolio / GitHub / Dribbble
                                </Label>
                                {portfolioLink && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            window.open(
                                                portfolioLink.startsWith('http')
                                                    ? portfolioLink
                                                    : `https://${portfolioLink}`,
                                                '_blank'
                                            )
                                        }
                                        className="text-[11px] text-sky-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                                    >
                                        <span>Buka Link</span>
                                        <ExternalLink className="size-2.5" />
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <Input
                                    type="url"
                                    value={portfolioLink}
                                    onChange={(e) => setPortfolioLink(e.target.value)}
                                    placeholder="https://myportfolio.com atau https://github.com/..."
                                    className="rounded-xl text-xs sm:text-sm pl-9"
                                />
                                <Globe className="absolute left-3 top-2.5 size-4 text-neutral-400" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500 pt-1">
                        <CheckCircle2 className="size-3 text-sky-500 shrink-0" />
                        <span>Tautan portofolio dan profil otomatis tersimpan saat Anda menekan tombol <strong>Simpan & Selesai</strong> di bagian bawah.</span>
                    </div>
                </div>

                {/* 2. Upload Resumes (PDF/DOCX) */}
                <div className="space-y-4 rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3 dark:border-neutral-800">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                                <FileText className="size-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                    Berkas CV Manual (Master Resume)
                                </h3>
                                <p className="text-xs text-neutral-400">
                                    Unggah berkas fisik CV Anda (PDF/DOCX, maks 5 MB) untuk opsi unduhan langsung bagi rekruter
                                </p>
                            </div>
                        </div>

                        <div>
                            <input
                                ref={resumeInputRef}
                                type="file"
                                accept=".pdf,.docx,.doc"
                                onChange={handleResumeFileSelect}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                disabled={isUploadingResume}
                                onClick={() => resumeInputRef.current?.click()}
                                className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white gap-1.5 text-xs font-semibold cursor-pointer shadow-xs"
                            >
                                {isUploadingResume ? (
                                    <>
                                        <Loader2 className="size-3.5 animate-spin" />
                                        <span>Mengunggah...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="size-3.5" />
                                        <span>Unggah Berkas CV</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {resumes.length === 0 ? (
                        <div className="py-6 text-center text-xs text-neutral-400 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/30">
                            Belum ada berkas resume fisik yang diunggah.
                        </div>
                    ) : (
                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {resumes.map((resume) => (
                                <div
                                    key={resume.id}
                                    className="flex items-center justify-between py-3 group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100 dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-900/40">
                                            <FileText className="size-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                                                {resume.file_name}
                                            </p>
                                            <p className="text-[11px] text-neutral-400">
                                                Diunggah: {resume.uploaded_at || 'Terdaftar'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0 pl-2">
                                        {resume.file_url && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => window.open(resume.file_url, '_blank')}
                                                className="text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/40 h-8 px-2.5 rounded-lg text-xs cursor-pointer font-medium"
                                            >
                                                <Download className="size-3.5" />
                                                <span className="hidden sm:inline ml-1">Unduh</span>
                                            </Button>
                                        )}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            disabled={deletingId === `resume_${resume.id}`}
                                            onClick={() => handleDeleteResume(resume.id)}
                                            className="text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 h-8 w-8 p-0 rounded-lg cursor-pointer"
                                            title="Hapus berkas ini"
                                        >
                                            {deletingId === `resume_${resume.id}` ? (
                                                <Loader2 className="size-3.5 animate-spin" />
                                            ) : (
                                                <Trash2 className="size-3.5" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. Upload Attachments / Supporting Documents */}
                <div className="space-y-4 rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60">
                    <div className="border-b border-neutral-100 pb-3 dark:border-neutral-800">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                                <Paperclip className="size-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                    Dokumen Pendukung & Lampiran Karya
                                </h3>
                                <p className="text-xs text-neutral-400">
                                    Sertifikat kelulusan, portofolio PDF desain/koding, surat referensi, atau transkrip nilai (PDF/DOCX maks 5 MB)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Upload Form Box */}
                    <div className="flex flex-col sm:flex-row gap-3 rounded-xl border border-dashed border-neutral-200 bg-neutral-50/60 p-4 dark:border-neutral-800 dark:bg-neutral-850/40">
                        <div className="flex-1 space-y-1">
                            <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                Judul / Label Dokumen
                            </Label>
                            <Input
                                value={attachmentTitle}
                                onChange={(e) => setAttachmentTitle(e.target.value)}
                                placeholder="Contoh: Portofolio Proyek Desain UI/UX 2024"
                                className="rounded-xl text-xs sm:text-sm bg-white dark:bg-neutral-900"
                            />
                        </div>
                        <div className="flex items-end">
                            <input
                                ref={attachmentInputRef}
                                type="file"
                                accept=".pdf,.docx,.doc"
                                onChange={handleAttachmentFileSelect}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                disabled={isUploadingAttachment}
                                onClick={() => attachmentInputRef.current?.click()}
                                className="w-full sm:w-auto rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-semibold cursor-pointer shadow-xs"
                            >
                                {isUploadingAttachment ? (
                                    <>
                                        <Loader2 className="size-3.5 animate-spin" />
                                        <span>Mengunggah...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="size-3.5" />
                                        <span>Pilih & Unggah Berkas</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Attachments List */}
                    {attachments.length === 0 ? (
                        <div className="py-6 text-center text-xs text-neutral-400 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/30">
                            Belum ada dokumen portofolio atau sertifikat tambahan yang diunggah.
                        </div>
                    ) : (
                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {attachments.map((att) => (
                                <div
                                    key={att.id}
                                    className="flex items-center justify-between py-3 group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900/40">
                                            <Paperclip className="size-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                                                {att.title || att.file_name}
                                            </p>
                                            <p className="text-[11px] text-neutral-400 truncate">
                                                {att.file_name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0 pl-2">
                                        {att.file_url && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => window.open(att.file_url, '_blank')}
                                                className="text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40 h-8 px-2.5 rounded-lg text-xs cursor-pointer font-medium"
                                            >
                                                <Download className="size-3.5" />
                                                <span className="hidden sm:inline ml-1">Unduh</span>
                                            </Button>
                                        )}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            disabled={deletingId === `attachment_${att.id}`}
                                            onClick={() => handleDeleteAttachment(att.id)}
                                            className="text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 h-8 w-8 p-0 rounded-lg cursor-pointer"
                                            title="Hapus lampiran ini"
                                        >
                                            {deletingId === `attachment_${att.id}` ? (
                                                <Loader2 className="size-3.5 animate-spin" />
                                            ) : (
                                                <Trash2 className="size-3.5" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }
);
