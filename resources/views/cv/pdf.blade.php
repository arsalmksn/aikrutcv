<!DOCTYPE html>
<html lang="id">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $cv->title ?: 'Curriculum Vitae' }}</title>
    <style>
        @page {
            margin: 20mm 18mm 20mm 18mm;
        }

        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1f2937;
            line-height: 1.45;
            font-size: 11pt;
            margin: 0;
            padding: 0;
        }

        /* Header / Contact */
        .header {
            border-bottom: 2px solid #0284c7;
            padding-bottom: 14px;
            margin-bottom: 18px;
        }

        .name {
            font-size: 22pt;
            font-weight: bold;
            color: #0f172a;
            letter-spacing: -0.5px;
            margin-bottom: 4px;
            text-transform: uppercase;
        }

        .desired-title {
            font-size: 13pt;
            color: #0284c7;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .contact-info {
            font-size: 9.5pt;
            color: #4b5563;
        }

        .contact-item {
            display: inline-block;
            margin-right: 14px;
        }

        /* Section Styling */
        .section {
            margin-bottom: 16px;
        }

        .section-title {
            font-size: 12pt;
            font-weight: bold;
            color: #0369a1;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #e0f2fe;
            padding-bottom: 4px;
            margin-bottom: 8px;
        }

        /* Summary */
        .summary-text {
            font-size: 10pt;
            color: #374151;
            line-height: 1.5;
            text-align: justify;
        }

        /* Items / Timeline */
        .item {
            margin-bottom: 12px;
            page-break-inside: avoid;
        }

        .item-header {
            width: 100%;
            margin-bottom: 2px;
        }

        .item-title {
            font-weight: bold;
            font-size: 10.5pt;
            color: #111827;
        }

        .item-subtitle {
            font-size: 10pt;
            color: #0284c7;
            font-weight: 500;
        }

        .item-meta {
            font-size: 9pt;
            color: #6b7280;
            text-align: right;
            white-space: nowrap;
        }

        .item-desc {
            font-size: 9.5pt;
            color: #4b5563;
            margin-top: 4px;
            line-height: 1.45;
        }

        .item-desc p {
            margin: 3px 0;
        }

        .item-desc ul {
            margin: 4px 0 4px 18px;
            padding: 0;
        }

        .item-desc li {
            margin-bottom: 2px;
        }

        /* Skills */
        .skills-table {
            width: 100%;
            border-collapse: collapse;
        }

        .skill-badge {
            display: inline-block;
            background-color: #f0f9ff;
            border: 1px solid #bae6fd;
            color: #0369a1;
            padding: 3px 8px;
            font-size: 8.5pt;
            font-weight: 500;
            border-radius: 4px;
            margin: 2px 4px 2px 0;
        }

        .skill-level {
            color: #64748b;
            font-size: 7.5pt;
            margin-left: 2px;
        }

        /* Tables layout helper */
        table.layout {
            width: 100%;
            border: none;
            border-collapse: collapse;
        }

        table.layout td {
            vertical-align: top;
            padding: 0;
        }
    </style>
</head>
<body>
    @php
        $contact = $cv->contact;
        $fullName = trim(($contact?->first_name ?? '') . ' ' . ($contact?->last_name ?? ''));
        if (empty($fullName)) {
            $fullName = $cv->user?->name ?? 'Curriculum Vitae';
        }
    @endphp

    <!-- Header Section -->
    <div class="header">
        <div class="name">{{ $fullName }}</div>
        @if(!empty($contact?->desired_job_title))
            <div class="desired-title">{{ $contact->desired_job_title }}</div>
        @endif

        <div class="contact-info">
            @if(!empty($contact?->email))
                <span class="contact-item"><strong>Email:</strong> {{ $contact->email }}</span>
            @endif
            @if(!empty($contact?->phone))
                <span class="contact-item"><strong>Telepon:</strong> {{ $contact->phone }}</span>
            @endif
            @if(!empty($contact?->city) || !empty($contact?->address))
                <span class="contact-item">
                    <strong>Lokasi:</strong> {{ collect([$contact?->address, $contact?->city])->filter()->join(', ') }}
                </span>
            @endif
            @if(!empty($contact?->linkedin_url))
                <span class="contact-item"><strong>LinkedIn:</strong> {{ $contact->linkedin_url }}</span>
            @endif
            @if(!empty($contact?->website_url))
                <span class="contact-item"><strong>Portfolio:</strong> {{ $contact->website_url }}</span>
            @endif
        </div>
    </div>

    <!-- Ringkasan Profesional -->
    @if($cv->summary && filled(trim(strip_tags($cv->summary->content ?? ''))))
        <div class="section">
            <div class="section-title">Ringkasan Profesional</div>
            <div class="summary-text">
                {!! $cv->summary->content !!}
            </div>
        </div>
    @endif

    <!-- Pengalaman Kerja -->
    @if($cv->experiences && $cv->experiences->isNotEmpty())
        <div class="section">
            <div class="section-title">Pengalaman Kerja</div>
            @foreach($cv->experiences as $exp)
                <div class="item">
                    <table class="layout item-header">
                        <tr>
                            <td>
                                <span class="item-title">{{ $exp->position }}</span>
                                @if(!empty($exp->company_name))
                                    <span class="item-subtitle">&bull; {{ $exp->company_name }}</span>
                                @endif
                                @if(!empty($exp->city))
                                    <span style="font-size: 9pt; color: #6b7280;">({{ $exp->city }})</span>
                                @endif
                            </td>
                            <td class="item-meta">
                                {{ $exp->start_date }} - {{ $exp->is_current ? 'Sekarang' : ($exp->end_date ?: '-') }}
                            </td>
                        </tr>
                    </table>

                    @if(!empty($exp->description))
                        <div class="item-desc">
                            @if(str_contains($exp->description, '<p>') || str_contains($exp->description, '<ul>'))
                                {!! $exp->description !!}
                            @else
                                {!! nl2br(e($exp->description)) !!}
                            @endif
                        </div>
                    @endif
                </div>
            @endforeach
        </div>
    @endif

    <!-- Pendidikan -->
    @if($cv->educations && $cv->educations->isNotEmpty())
        <div class="section">
            <div class="section-title">Pendidikan</div>
            @foreach($cv->educations as $edu)
                <div class="item">
                    <table class="layout item-header">
                        <tr>
                            <td>
                                <span class="item-title">{{ $edu->institution_name }}</span>
                                @if(!empty($edu->degree))
                                    <span class="item-subtitle">&bull; {{ $edu->degree }}</span>
                                @endif
                                @if(!empty($edu->field_of_study))
                                    <span style="font-size: 9pt; color: #4b5563;">({{ $edu->field_of_study }})</span>
                                @endif
                                @if(!empty($edu->city))
                                    <span style="font-size: 9pt; color: #6b7280;">- {{ $edu->city }}</span>
                                @endif
                            </td>
                            <td class="item-meta">
                                @if($edu->start_date || $edu->end_date)
                                    {{ $edu->start_date ?: '-' }} - {{ $edu->is_current ? 'Sekarang' : ($edu->end_date ?: '-') }}
                                @endif
                            </td>
                        </tr>
                    </table>

                    @if(!empty($edu->description))
                        <div class="item-desc">
                            @if(str_contains($edu->description, '<p>') || str_contains($edu->description, '<ul>'))
                                {!! $edu->description !!}
                            @else
                                {!! nl2br(e($edu->description)) !!}
                            @endif
                        </div>
                    @endif
                </div>
            @endforeach
        </div>
    @endif

    <!-- Keahlian -->
    @if($cv->skills && $cv->skills->isNotEmpty())
        <div class="section">
            <div class="section-title">Keahlian</div>
            <div>
                @foreach($cv->skills as $skill)
                    <span class="skill-badge">
                        {{ $skill->name }}
                        @if(!empty($skill->level))
                            <span class="skill-level">({{ $skill->level }})</span>
                        @endif
                    </span>
                @endforeach
            </div>
        </div>
    @endif
</body>
</html>
