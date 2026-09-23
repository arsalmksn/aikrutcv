import React from 'react';
import type { CvContactData } from '@/types/cv';

interface CvLivePreviewProps {
    contact: CvContactData;
}

export function CvLivePreview({ contact }: CvLivePreviewProps) {
    const fullName = [contact.first_name, contact.last_name]
        .filter(Boolean)
        .join(' ')
        .trim();

    return (
        <div className="flex h-full w-full items-start justify-center overflow-y-auto p-4 sm:p-6 lg:p-8">
            {/* A4 Paper Document */}
            <div className="relative min-h-[842px] w-full max-w-[595px] bg-white p-8 sm:p-12 shadow-[0_4px_25px_rgba(0,0,0,0.08)] border border-slate-100 rounded-sm text-slate-900 transition-all">
                {/* Header: Desired Job Title */}
                <div className="mb-2 text-center">
                    <span className="text-[11px] font-bold tracking-wider text-slate-700 uppercase">
                        {contact.desired_job_title || 'DESIRED JOB TITLE'}
                    </span>
                </div>

                {/* Candidate Full Name */}
                <div className="mb-3 text-center">
                    <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-normal text-slate-900 lowercase first-letter:capitalize">
                        {fullName || 'Nama Lengkap'}
                    </h1>
                </div>

                {/* Contact Line */}
                <div className="mb-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[10px] sm:text-[11px] text-slate-600">
                    {contact.email && (
                        <span>
                            <strong className="font-semibold text-slate-800">Alamat email:</strong>{' '}
                            {contact.email}
                        </span>
                    )}

                    {contact.email && contact.phone && <span>·</span>}

                    {contact.phone && (
                        <span>
                            <strong className="font-semibold text-slate-800">Nomor telepon:</strong>{' '}
                            {contact.phone}
                        </span>
                    )}

                    {(contact.city || contact.address) && (
                        <>
                            <span>·</span>
                            <span>
                                <strong className="font-semibold text-slate-800">Lokasi:</strong>{' '}
                                {[contact.city, contact.address].filter(Boolean).join(', ')}
                            </span>
                        </>
                    )}

                    {contact.linkedin_url && (
                        <>
                            <span>·</span>
                            <span className="text-sky-700 underline">
                                {contact.linkedin_url.replace(/^https?:\/\//, '')}
                            </span>
                        </>
                    )}

                    {contact.website_url && (
                        <>
                            <span>·</span>
                            <span className="text-sky-700 underline">
                                {contact.website_url.replace(/^https?:\/\//, '')}
                            </span>
                        </>
                    )}
                </div>

                {/* Subtle Divider */}
                <div className="mb-6 border-b border-slate-200/80" />

                {/* Section: Pengalaman */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                            PENGALAMAN
                        </h2>
                        <div className="mt-1.5 border-b border-slate-300" />
                    </div>

                    <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                            <span>KPL</span>
                            <span className="text-slate-600 font-normal">Feb 2026 — Saat Ini</span>
                        </div>
                        <div className="text-slate-600">
                            UDB - Surakarta
                        </div>
                        <p className="mt-2 text-justify text-[11px] text-slate-600 leading-relaxed">
                            Mengembangkan dan mengelola aplikasi web modern, memastikan performansi tinggi, dan menerapkan praktik terbaik dalam pengembangan perangkat lunak.
                        </p>
                    </div>
                </div>

                {/* Section: Pendidikan (Optional ATS preview) */}
                <div className="mt-6 space-y-4">
                    <div>
                        <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                            PENDIDIKAN
                        </h2>
                        <div className="mt-1.5 border-b border-slate-300" />
                    </div>

                    <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                            <span>Universitas Duta Bangsa</span>
                            <span className="text-slate-600 font-normal">2022 — 2026</span>
                        </div>
                        <div className="text-slate-600">
                            Sarjana Teknik Informatika — IPK 3.85 / 4.00
                        </div>
                    </div>
                </div>

                {/* Section: Keahlian (Optional ATS preview) */}
                <div className="mt-6 space-y-4">
                    <div>
                        <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                            KEAHLIAN
                        </h2>
                        <div className="mt-1.5 border-b border-slate-300" />
                    </div>

                    <div className="text-xs text-slate-700 leading-relaxed">
                        <span className="font-semibold text-slate-800">Teknis:</span> Laravel, React.js, TypeScript, Tailwind CSS, PostgreSQL, Git, RESTful API
                    </div>
                </div>
            </div>
        </div>
    );
}
