import React from 'react';
import { Wrench, Award, FileCheck2, Edit3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { UserAwardItem, UserCertificationItem } from '@/types/profile';

interface SkillsCertificatesCardProps {
    tools: string[];
    certifications: UserCertificationItem[];
    awards: UserAwardItem[];
    onEdit: () => void;
}

export function SkillsCertificatesCard({
    tools = [],
    certifications = [],
    awards = [],
    onEdit,
}: SkillsCertificatesCardProps) {
    return (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs transition-all dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between">
            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                            <Wrench className="size-4" />
                        </div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                            Keahlian, Sertifikasi & Prestasi
                        </h3>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        className="text-xs text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/40 gap-1.5 h-8"
                    >
                        <Edit3 className="size-3.5" />
                        <span>Edit</span>
                    </Button>
                </div>

                {/* 1. Tools & Skills */}
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Keahlian Teknis & Tools ({tools.length})
                    </h4>
                    {tools.length === 0 ? (
                        <p className="text-xs text-neutral-400 italic">Belum ada tools ditambahkan.</p>
                    ) : (
                        <div className="flex flex-wrap gap-1.5">
                            {tools.map((tool) => (
                                <span
                                    key={tool}
                                    className="rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                                >
                                    {tool}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. Certifications */}
                <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                        <FileCheck2 className="size-3.5 text-emerald-500" />
                        <span>Sertifikasi Profesional ({certifications.length})</span>
                    </h4>
                    {certifications.length === 0 ? (
                        <p className="text-xs text-neutral-400 italic">Belum ada sertifikasi dicatat.</p>
                    ) : (
                        <div className="space-y-2">
                            {certifications.map((cert, idx) => (
                                <div
                                    key={cert.id || idx}
                                    className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-2.5 text-xs dark:border-neutral-800 dark:bg-neutral-800/40 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-bold text-neutral-900 dark:text-neutral-100">
                                            {cert.name}
                                        </p>
                                        <p className="text-[11px] text-neutral-500">
                                            {cert.issuer} {cert.issue_date && `• ${cert.issue_date}`}
                                        </p>
                                    </div>
                                    {(cert.validity_period || cert.expiration_date) && (
                                        <Badge variant="outline" className="text-[10px]">
                                            {cert.validity_period || cert.expiration_date}
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. Awards */}
                <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="size-3.5 text-amber-500" />
                        <span>Penghargaan & Prestasi ({awards.length})</span>
                    </h4>
                    {awards.length === 0 ? (
                        <p className="text-xs text-neutral-400 italic">Belum ada penghargaan dicatat.</p>
                    ) : (
                        <div className="space-y-2">
                            {awards.map((award, idx) => (
                                <div
                                    key={award.id || idx}
                                    className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-2.5 text-xs dark:border-neutral-800 dark:bg-neutral-800/40 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-bold text-neutral-900 dark:text-neutral-100">
                                            {award.title}
                                        </p>
                                        <p className="text-[11px] text-neutral-500">
                                            {award.subtitle} {award.year && `(${award.year})`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
