import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
    Wrench,
    Award,
    FileCheck2,
    Plus,
    Trash2,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
    UserAwardItem,
    UserCertificationItem,
    UserProfileData,
    ProfileSectionRef,
} from '@/types/profile';

interface SkillsCertificatesSectionProps {
    profile: UserProfileData;
    onSaveSection: (section: string, payload: Partial<UserProfileData>) => Promise<boolean>;
}

export const SkillsCertificatesSection = forwardRef<ProfileSectionRef, SkillsCertificatesSectionProps>(
    function SkillsCertificatesSection({ profile, onSaveSection }, ref) {
        const [tools, setTools] = useState<string[]>(profile.tools || []);
        const [newToolInput, setNewToolInput] = useState('');

        const [certifications, setCertifications] = useState<UserCertificationItem[]>(
            profile.certifications?.length ? profile.certifications : []
        );

        const [awards, setAwards] = useState<UserAwardItem[]>(
            profile.awards?.length ? profile.awards : []
        );

        // Tools handling
        const handleAddTool = () => {
            const trimmed = newToolInput.trim();
            if (trimmed && !tools.includes(trimmed)) {
                setTools((prev) => [...prev, trimmed]);
                setNewToolInput('');
            }
        };

        const handleRemoveTool = (tool: string) => {
            setTools((prev) => prev.filter((t) => t !== tool));
        };

        // Certifications handling
        const handleAddCert = () => {
            setCertifications((prev) => [
                ...prev,
                {
                    name: '',
                    issuer: '',
                    issue_date: '',
                    expiration_date: '',
                    validity_period: '',
                    sort_order: prev.length,
                },
            ]);
        };

        const handleRemoveCert = (index: number) => {
            setCertifications((prev) => prev.filter((_, i) => i !== index));
        };

        const handleCertChange = (
            index: number,
            field: keyof UserCertificationItem,
            value: string
        ) => {
            setCertifications((prev) => {
                const next = [...prev];
                next[index] = { ...next[index], [field]: value };
                return next;
            });
        };

        // Awards handling
        const handleAddAward = () => {
            setAwards((prev) => [
                ...prev,
                {
                    title: '',
                    subtitle: '',
                    year: '',
                    description: '',
                    sort_order: prev.length,
                },
            ]);
        };

        const handleRemoveAward = (index: number) => {
            setAwards((prev) => prev.filter((_, i) => i !== index));
        };

        const handleAwardChange = (
            index: number,
            field: keyof UserAwardItem,
            value: string
        ) => {
            setAwards((prev) => {
                const next = [...prev];
                next[index] = { ...next[index], [field]: value };
                return next;
            });
        };

        const handleSave = async (): Promise<boolean> => {
            // Save skills
            const s1 = await onSaveSection('skills', { tools });

            // Save certifications
            const s2 = await onSaveSection('certifications', {
                certifications: certifications.filter((c) => c.name.trim() && c.issuer.trim()),
            });

            // Save awards
            const s3 = await onSaveSection('awards', {
                awards: awards.filter((a) => a.title.trim()),
            });

            return s1 && s2 && s3;
        };

        useImperativeHandle(ref, () => ({
            save: handleSave,
        }));

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            await handleSave();
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-6">

            {/* Sub-Section 1: Skills & Tools */}
            <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 dark:border-neutral-800">
                    <Wrench className="size-4 text-sky-500" />
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        Daftar Keahlian Teknis & Tools (Skills)
                    </h3>
                </div>

                <div className="flex gap-2">
                    <Input
                        value={newToolInput}
                        onChange={(e) => setNewToolInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTool();
                            }
                        }}
                        placeholder="Contoh: React, TypeScript, Docker, Figma, PostgreSQL..."
                        className="rounded-xl text-xs sm:text-sm"
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleAddTool}
                        className="rounded-xl shrink-0 gap-1.5"
                    >
                        <Plus className="size-4" />
                        Tambah Tool
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                    {tools.length === 0 ? (
                        <p className="text-xs text-neutral-400 italic">
                            Belum ada tools atau keahlian yang ditambahkan.
                        </p>
                    ) : (
                        tools.map((tool) => (
                            <span
                                key={tool}
                                className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                            >
                                {tool}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTool(tool)}
                                    className="rounded-full p-0.5 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                                >
                                    <X className="size-3" />
                                </button>
                            </span>
                        ))
                    )}
                </div>
            </div>

            {/* Sub-Section 2: Certifications */}
            <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                        <FileCheck2 className="size-4 text-emerald-500" />
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                            Sertifikasi & Lisensi Profesional
                        </h3>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddCert}
                        className="gap-1.5 rounded-xl border-dashed text-xs"
                    >
                        <Plus className="size-3.5" />
                        Tambah Sertifikasi
                    </Button>
                </div>

                {certifications.length === 0 ? (
                    <p className="py-4 text-center text-xs text-neutral-400 italic">
                        Belum ada lisensi atau sertifikasi profesional yang ditambahkan.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {certifications.map((cert, idx) => (
                            <div
                                key={idx}
                                className="grid grid-cols-1 gap-3 rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 sm:grid-cols-2 md:grid-cols-4 dark:border-neutral-800 dark:bg-neutral-800/40"
                            >
                                <div className="space-y-1">
                                    <Label className="text-[11px] text-neutral-500">Nama Sertifikasi *</Label>
                                    <Input
                                        value={cert.name}
                                        onChange={(e) => handleCertChange(idx, 'name', e.target.value)}
                                        placeholder="AWS Certified Solutions Architect"
                                        className="rounded-xl text-xs"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[11px] text-neutral-500">Penerbit (Issuer) *</Label>
                                    <Input
                                        value={cert.issuer}
                                        onChange={(e) => handleCertChange(idx, 'issuer', e.target.value)}
                                        placeholder="Amazon Web Services"
                                        className="rounded-xl text-xs"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[11px] text-neutral-500">Tanggal Terbit (YYYY-MM)</Label>
                                    <Input
                                        value={cert.issue_date}
                                        onChange={(e) => handleCertChange(idx, 'issue_date', e.target.value)}
                                        placeholder="2023-05"
                                        className="rounded-xl font-mono text-xs"
                                    />
                                </div>
                                <div className="flex items-end justify-between gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-[11px] text-neutral-500">Masa Berlaku / Exp</Label>
                                        <Input
                                            value={cert.validity_period || cert.expiration_date}
                                            onChange={(e) => handleCertChange(idx, 'validity_period', e.target.value)}
                                            placeholder="Seumur Hidup / 2026-05"
                                            className="rounded-xl text-xs"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveCert(idx)}
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

            {/* Sub-Section 3: Awards */}
            <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                        <Award className="size-4 text-amber-500" />
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                            Penghargaan & Prestasi (Awards)
                        </h3>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddAward}
                        className="gap-1.5 rounded-xl border-dashed text-xs"
                    >
                        <Plus className="size-3.5" />
                        Tambah Penghargaan
                    </Button>
                </div>

                {awards.length === 0 ? (
                    <p className="py-4 text-center text-xs text-neutral-400 italic">
                        Belum ada penghargaan atau kejuaraan yang ditambahkan.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {awards.map((award, idx) => (
                            <div
                                key={idx}
                                className="grid grid-cols-1 gap-3 rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 sm:grid-cols-2 md:grid-cols-4 dark:border-neutral-800 dark:bg-neutral-800/40"
                            >
                                <div className="space-y-1">
                                    <Label className="text-[11px] text-neutral-500">Judul Penghargaan *</Label>
                                    <Input
                                        value={award.title}
                                        onChange={(e) => handleAwardChange(idx, 'title', e.target.value)}
                                        placeholder="Juara 1 Hackathon Nasional"
                                        className="rounded-xl text-xs"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[11px] text-neutral-500">Pemberi / Kategori</Label>
                                    <Input
                                        value={award.subtitle || ''}
                                        onChange={(e) => handleAwardChange(idx, 'subtitle', e.target.value)}
                                        placeholder="Kementerian Kominfo"
                                        className="rounded-xl text-xs"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[11px] text-neutral-500">Tahun</Label>
                                    <Input
                                        value={award.year || ''}
                                        onChange={(e) => handleAwardChange(idx, 'year', e.target.value)}
                                        placeholder="2023"
                                        className="rounded-xl text-xs font-mono"
                                    />
                                </div>
                                <div className="flex items-end justify-between gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-[11px] text-neutral-500">Deskripsi Singkat</Label>
                                        <Input
                                            value={award.description || ''}
                                            onChange={(e) => handleAwardChange(idx, 'description', e.target.value)}
                                            placeholder="Deskripsi..."
                                            className="rounded-xl text-xs"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveAward(idx)}
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
        </form>
    );
});
