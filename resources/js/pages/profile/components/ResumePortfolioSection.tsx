import React, { useRef, useState } from 'react';
import {
    Download,
    ExternalLink,
    FileText,
    Globe,
    Paperclip,
    Plus,
    Save,
    Trash2,
    Upload,
    Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
    UserAttachmentItem,
    UserProfileData,
    UserResumeItem,
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

export function ResumePortfolioSection({
    profile,
    onSaveSection,
    onUploadFile,
    onDeleteItem,
}: ResumePortfolioSectionProps) {
    const [portfolioLink, setPortfolioLink] = useState(profile.portfolio_link || '');
    const [resumes, setResumes] = useState<UserResumeItem[]>(profile.resumes || []);
    const [attachments, setAttachments] = useState<UserAttachmentItem[]>(
        profile.attachments || []
    );

    const [savingLink, setSavingLink] = useState(false);
    const [linkSavedSuccess, setLinkSavedSuccess] = useState(false);

    // Upload state
    const [isUploadingResume, setIsUploadingResume] = useState(false);
    const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
    const [attachmentTitle, setAttachmentTitle] = useState('');

    const resumeInputRef = useRef<HTMLInputElement>(null);
    const attachmentInputRef = useRef<HTMLInputElement>(null);

    const handleSavePortfolioLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingLink(true);
        setLinkSavedSuccess(false);

        const success = await onSaveSection('portfolio', {
            portfolio_link: portfolioLink,
        });

        setSavingLink(false);
        if (success) {
            setLinkSavedSuccess(true);
            setTimeout(() => setLinkSavedSuccess(false), 3000);
        }
    };

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
        const success = await onDeleteItem('resume', id);
        if (success) {
            setResumes((prev) => prev.filter((r) => r.id !== id));
        }
    };

    const handleDeleteAttachment = async (id: number) => {
        const success = await onDeleteItem('attachment', id);
        if (success) {
            setAttachments((prev) => prev.filter((a) => a.id !== id));
        }
    };

    return (
        <div className="space-y-8">
            <div className="border-b border-neutral-100 pb-4 dark:border-neutral-800">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    Resume & Lampiran Berkas Portofolio
                </h2>
                <p className="text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
                    Simpan berkas CV manual dan dokumen pendukung portofolio (maksimal 5 MB dalam format PDF atau DOCX).
                </p>
            </div>

            {/* 1. Portfolio Link */}
            <form
                onSubmit={handleSavePortfolioLink}
                className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60"
            >
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 dark:border-neutral-800">
                    <Globe className="size-4 text-sky-500" />
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        Tautan Portofolio / Repositori Proyek
                    </h3>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Input
                            type="url"
                            value={portfolioLink}
                            onChange={(e) => setPortfolioLink(e.target.value)}
                            placeholder="https://github.com/username atau https://myportfolio.com"
                            className="rounded-xl text-xs sm:text-sm pl-9"
                        />
                        <Globe className="absolute left-3 top-2.5 size-4 text-neutral-400" />
                    </div>

                    <div className="flex gap-2">
                        {portfolioLink && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.open(portfolioLink, '_blank')}
                                className="rounded-xl gap-1.5"
                            >
                                <ExternalLink className="size-3.5" />
                                Buka
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={savingLink}
                            className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white gap-2 font-medium"
                        >
                            {savingLink ? (
                                <>Menyimpan...</>
                            ) : linkSavedSuccess ? (
                                <>
                                    <Check className="size-4 text-white" />
                                    Tersimpan
                                </>
                            ) : (
                                <>
                                    <Save className="size-4" />
                                    Simpan Link
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>

            {/* 2. Upload Resumes (PDF/DOCX) */}
            <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                        <FileText className="size-4 text-purple-500" />
                        <div>
                            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                Berkas CV Buatan Sendiri (Resumes)
                            </h3>
                            <p className="text-xs text-neutral-400">
                                Berkas fisik unduhan untuk perekrut (PDF/DOCX, maks 5 MB).
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
                            className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white gap-1.5 text-xs"
                        >
                            <Upload className="size-3.5" />
                            {isUploadingResume ? 'Mengunggah...' : 'Unggah Resume'}
                        </Button>
                    </div>
                </div>

                {resumes.length === 0 ? (
                    <div className="py-6 text-center text-xs text-neutral-400">
                        Belum ada berkas resume yang diunggah.
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {resumes.map((resume) => (
                            <div
                                key={resume.id}
                                className="flex items-center justify-between py-3"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                                        <FileText className="size-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                            {resume.file_name}
                                        </p>
                                        <p className="text-[11px] text-neutral-400">
                                            Diunggah: {resume.uploaded_at || '-'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    {resume.file_url && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => window.open(resume.file_url, '_blank')}
                                            className="text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/40"
                                        >
                                            <Download className="size-4" />
                                            <span className="hidden sm:inline text-xs">Unduh</span>
                                        </Button>
                                    )}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteResume(resume.id)}
                                        className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 3. Upload Attachments / Supporting Documents */}
            <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60">
                <div className="border-b border-neutral-100 pb-3 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                        <Paperclip className="size-4 text-emerald-500" />
                        <div>
                            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                Dokumen Pendukung & Lampiran Portofolio
                            </h3>
                            <p className="text-xs text-neutral-400">
                                Sertifikat penghargaan fisik, surat referensi, atau dokumen portofolio (PDF/DOCX maks 5 MB).
                            </p>
                        </div>
                    </div>
                </div>

                {/* Upload Form */}
                <div className="flex flex-col sm:flex-row gap-3 rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-800/30">
                    <div className="flex-1 space-y-1">
                        <Label className="text-xs text-neutral-600 dark:text-neutral-300">
                            Judul Dokumen (Opsional)
                        </Label>
                        <Input
                            value={attachmentTitle}
                            onChange={(e) => setAttachmentTitle(e.target.value)}
                            placeholder="Contoh: Portofolio Desain UI/UX 2024"
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
                            className="w-full sm:w-auto rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs"
                        >
                            <Upload className="size-3.5" />
                            {isUploadingAttachment ? 'Mengunggah...' : 'Pilih & Unggah Berkas'}
                        </Button>
                    </div>
                </div>

                {attachments.length === 0 ? (
                    <div className="py-6 text-center text-xs text-neutral-400">
                        Belum ada dokumen portofolio pendukung yang diunggah.
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {attachments.map((att) => (
                            <div
                                key={att.id}
                                className="flex items-center justify-between py-3"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                        <Paperclip className="size-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                            {att.title || att.file_name}
                                        </p>
                                        <p className="text-[11px] text-neutral-400">
                                            {att.file_name} • Diunggah: {att.uploaded_at || '-'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    {att.file_url && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => window.open(att.file_url, '_blank')}
                                            className="text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/40"
                                        >
                                            <Download className="size-4" />
                                            <span className="hidden sm:inline text-xs">Unduh</span>
                                        </Button>
                                    )}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteAttachment(att.id)}
                                        className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                    >
                                        <Trash2 className="size-4" />
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
