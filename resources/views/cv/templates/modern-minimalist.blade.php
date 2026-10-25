<!DOCTYPE html>
<html lang="id">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $cv->title ?: 'Curriculum Vitae' }}</title>
    <style>
        @page {
            margin: 16mm 18mm 16mm 18mm;
        }

        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #000000;
            line-height: 1.4;
            font-size: 10pt;
            margin: 0;
            padding: 0;
        }

        /* ATS Sederhana Header (Hendra Wijaya Style: Centered) */
        .header {
            text-align: center;
            margin-bottom: 14px;
        }

        .name {
            font-size: 22pt;
            font-weight: bold;
            color: #000000;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            line-height: 1.1;
            margin-bottom: 4px;
        }

        .desired-title {
            font-size: 11pt;
            color: #1e293b;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        .contact-line {
            font-size: 8.5pt;
            color: #334155;
            line-height: 1.4;
        }

        .header-divider {
            border-bottom: 2px solid #000000;
            margin: 10px 0 14px 0;
        }

        /* Section Headings */
        .section {
            margin-bottom: 14px;
        }

        .section-title {
            font-size: 10.5pt;
            font-weight: bold;
            color: #000000;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }

        /* Content Styling */
        .summary-text {
            font-size: 9.5pt;
            line-height: 1.45;
            text-align: justify;
            margin: 0;
            color: #1e293b;
        }

        .item {
            margin-bottom: 9px;
            page-break-inside: avoid;
        }

        .item-row {
            width: 100%;
        }

        .item-role {
            font-size: 10pt;
            font-weight: bold;
            color: #000000;
        }

        .item-period {
            font-size: 9pt;
            color: #475569;
            text-align: right;
            font-weight: normal;
        }

        ul.bullet-list {
            margin: 3px 0 5px 18px;
            padding: 0;
            font-size: 9.5pt;
            line-height: 1.4;
            color: #1e293b;
        }

        ul.bullet-list li {
            margin-bottom: 2px;
        }

        .bullet-list-container {
            margin: 3px 0 5px 0;
            font-size: 9.5pt;
            line-height: 1.4;
            color: #1e293b;
        }

        .bullet-list-container ul, .bullet-list-container ol {
            margin: 3px 0 5px 18px;
            padding: 0;
        }

        .bullet-list-container li {
            margin-bottom: 2px;
        }

        .bullet-list-container p {
            margin: 2px 0;
        }

        /* 2-column Skills Table for DomPDF */
        .skills-table {
            width: 100%;
            border-collapse: collapse;
        }

        .skills-col {
            width: 50%;
            vertical-align: top;
        }

        .skills-list {
            margin: 0;
            padding-left: 18px;
            font-size: 9.5pt;
            color: #1e293b;
        }

        .skills-list li {
            margin-bottom: 2px;
        }

        .skill-name {
            color: #1e293b;
        }
    </style>
</head>
<body>
    @php
        $fullName = trim(($cv->contact?->first_name ?? '') . ' ' . ($cv->contact?->last_name ?? ''));
        $location = trim(($cv->contact?->city ?? '') . ($cv->contact?->city && $cv->contact?->address ? ', ' : '') . ($cv->contact?->address ?? ''));
    @endphp

    <!-- Header (Hendra Wijaya ATS Centered) -->
    <div class="header">
        <div class="name">{{ $fullName ?: 'HENDRA WIJAYA' }}</div>
        @if($cv->contact?->desired_job_title)
            <div class="desired-title">{{ $cv->contact->desired_job_title }}</div>
        @endif
        @if($location)
            <div class="contact-line">{{ $location }}</div>
        @endif
        <div class="contact-line">
            @php
                $contacts = [];
                if ($cv->contact?->email) $contacts[] = $cv->contact->email;
                if ($cv->contact?->phone) $contacts[] = $cv->contact->phone;
                if ($cv->contact?->linkedin_url) $contacts[] = preg_replace('/^https?:\/\//', '', $cv->contact->linkedin_url);
                if ($cv->contact?->website_url) $contacts[] = preg_replace('/^https?:\/\//', '', $cv->contact->website_url);
            @endphp
            {{ implode(' · ', $contacts) }}
        </div>
        @if(!empty($cv->contact?->expected_salary))
            <div class="contact-line" style="margin-top: 2px; font-weight: 500;">
                Ekspektasi Gaji: {{ $cv->contact->expected_salary }}
            </div>
        @endif
        <div class="header-divider"></div>
    </div>

    <!-- Ringkasan -->
    @if($cv->summary?->content)
        <div class="section">
            <div class="section-title">RINGKASAN</div>
            <div class="summary-text">
                {!! strip_tags($cv->summary->content, '<p><br><b><strong><i><em>') !!}
            </div>
        </div>
    @endif

    <!-- Pengalaman -->
    @if($cv->experiences && $cv->experiences->count() > 0)
        <div class="section">
            <div class="section-title">PENGALAMAN</div>
            @foreach($cv->experiences as $exp)
                <div class="item">
                    <table class="item-row" cellpadding="0" cellspacing="0">
                        <tr>
                            <td class="item-role">
                                {{ $exp->position }}{{ $exp->company_name ? ', ' . $exp->company_name : '' }}
                            </td>
                            <td class="item-period">
                                @php
                                    $start = $exp->start_date ? \Illuminate\Support\Carbon::parse($exp->start_date)->translatedFormat('M Y') : '';
                                    $end = $exp->is_current ? 'Saat Ini' : ($exp->end_date ? \Illuminate\Support\Carbon::parse($exp->end_date)->translatedFormat('M Y') : '');
                                @endphp
                                {{ $start }}{{ $start && $end ? ' — ' : '' }}{{ $end }}{{ $exp->city ? ' | ' . $exp->city : '' }}
                            </td>
                        </tr>
                    </table>

                    @if($exp->description)
                        @if(preg_match('/<[a-z][\s\S]*>/i', $exp->description))
                            <div class="bullet-list-container">
                                {!! $exp->description !!}
                            </div>
                        @else
                            <ul class="bullet-list">
                                @foreach(explode("\n", str_replace(["\r\n", "\r"], "\n", $exp->description)) as $line)
                                    @php $clean = trim(ltrim($line, "•- \t")); @endphp
                                    @if(!empty($clean))
                                        <li>{{ $clean }}</li>
                                    @endif
                                @endforeach
                            </ul>
                        @endif
                    @endif
                </div>
            @endforeach
        </div>
    @endif

    <!-- Pendidikan -->
    @if($cv->educations && $cv->educations->count() > 0)
        <div class="section">
            <div class="section-title">PENDIDIKAN</div>
            @foreach($cv->educations as $edu)
                <div class="item">
                    <table class="item-row" cellpadding="0" cellspacing="0">
                        <tr>
                            <td class="item-role">
                                {{ $edu->institution_name }}{{ $edu->city ? ' - ' . $edu->city : '' }}
                                @if($edu->degree || $edu->field_of_study)
                                    <span style="font-weight: normal; color: #475569;">| {{ implode(' - ', array_filter([$edu->degree, $edu->field_of_study])) }}</span>
                                @endif
                            </td>
                            <td class="item-period">
                                @php
                                    $eduStart = $edu->start_date ? \Illuminate\Support\Carbon::parse($edu->start_date)->translatedFormat('Y') : '';
                                    $eduEnd = $edu->is_current ? 'Saat Ini' : ($edu->end_date ? \Illuminate\Support\Carbon::parse($edu->end_date)->translatedFormat('Y') : '');
                                @endphp
                                {{ $eduStart }}{{ $eduStart && $eduEnd ? ' — ' : '' }}{{ $eduEnd }}
                            </td>
                        </tr>
                    </table>

                    @if($edu->description)
                        @if(preg_match('/<[a-z][\s\S]*>/i', $edu->description))
                            <div class="bullet-list-container">
                                {!! $edu->description !!}
                            </div>
                        @else
                            <ul class="bullet-list">
                                <li>{{ $edu->description }}</li>
                            </ul>
                        @endif
                    @endif
                </div>
            @endforeach
        </div>
    @endif

    <!-- Organisasi -->
    @if($cv->organizations && $cv->organizations->count() > 0)
        <div class="section">
            <div class="section-title">ORGANISASI</div>
            @foreach($cv->organizations as $org)
                <div class="item">
                    <table class="item-row" cellpadding="0" cellspacing="0">
                        <tr>
                            <td class="item-role">
                                {{ $org->role }}{{ $org->organization_name ? ', ' . $org->organization_name : '' }}
                            </td>
                            <td class="item-period">
                                @php
                                    $orgStart = $org->start_date ? \Illuminate\Support\Carbon::parse($org->start_date)->translatedFormat('M Y') : '';
                                    $orgEnd = $org->end_date ? \Illuminate\Support\Carbon::parse($org->end_date)->translatedFormat('M Y') : ($org->duration ?: '');
                                @endphp
                                {{ $orgStart }}{{ $orgStart && $orgEnd ? ' — ' : '' }}{{ $orgEnd }}
                            </td>
                        </tr>
                    </table>

                    @if($org->description)
                        @if(preg_match('/<[a-z][\s\S]*>/i', $org->description))
                            <div class="bullet-list-container">
                                {!! $org->description !!}
                            </div>
                        @else
                            <ul class="bullet-list">
                                @foreach(explode("\n", str_replace(["\r\n", "\r"], "\n", $org->description)) as $line)
                                    @php $clean = trim(ltrim($line, "•- \t")); @endphp
                                    @if(!empty($clean))
                                        <li>{{ $clean }}</li>
                                    @endif
                                @endforeach
                            </ul>
                        @endif
                    @endif
                </div>
            @endforeach
        </div>
    @endif

    <!-- Sertifikasi -->
    @if($cv->certifications && $cv->certifications->count() > 0)
        <div class="section">
            <div class="section-title">SERTIFIKASI & LISENSI</div>
            @foreach($cv->certifications as $cert)
                <div class="item">
                    <table class="item-row" cellpadding="0" cellspacing="0">
                        <tr>
                            <td class="item-role">
                                {{ $cert->name }}
                                @if($cert->issuer)
                                    <span style="font-weight: normal; color: #475569;">| {{ $cert->issuer }}</span>
                                @endif
                            </td>
                            <td class="item-period">
                                @php
                                    $certIssue = $cert->issue_date ? \Illuminate\Support\Carbon::parse($cert->issue_date)->translatedFormat('M Y') : '';
                                    $certExp = $cert->expiration_date ? \Illuminate\Support\Carbon::parse($cert->expiration_date)->translatedFormat('M Y') : ($cert->validity_period ?: '');
                                @endphp
                                {{ $certIssue }}{{ $certIssue && $certExp ? ' — ' : '' }}{{ $certExp }}
                            </td>
                        </tr>
                    </table>
                </div>
            @endforeach
        </div>
    @endif

    <!-- Prestasi & Penghargaan -->
    @if($cv->awards && $cv->awards->count() > 0)
        <div class="section">
            <div class="section-title">PRESTASI & PENGHARGAAN</div>
            @foreach($cv->awards as $award)
                <div class="item">
                    <table class="item-row" cellpadding="0" cellspacing="0">
                        <tr>
                            <td class="item-role">
                                {{ $award->title }}
                                @if($award->subtitle)
                                    <span style="font-weight: normal; color: #475569;">| {{ $award->subtitle }}</span>
                                @endif
                            </td>
                            <td class="item-period">
                                {{ $award->year }}
                            </td>
                        </tr>
                    </table>
                    @if($award->description)
                        @if(preg_match('/<[a-z][\s\S]*>/i', $award->description))
                            <div class="bullet-list-container">
                                {!! $award->description !!}
                            </div>
                        @else
                            <ul class="bullet-list">
                                <li>{{ $award->description }}</li>
                            </ul>
                        @endif
                    @endif
                </div>
            @endforeach
        </div>
    @endif

    <!-- Keahlian (2 Kolom) -->
    @if($cv->skills && $cv->skills->count() > 0)
        @php
            $skillsList = $cv->skills->values();
            $half = (int) ceil($skillsList->count() / 2);
            $col1 = $skillsList->slice(0, $half);
            $col2 = $skillsList->slice($half);
        @endphp
        <div class="section">
            <div class="section-title">KEAHLIAN</div>
            <table class="skills-table" cellpadding="0" cellspacing="0">
                <tr>
                    <td class="skills-col">
                        <ul class="skills-list">
                            @foreach($col1 as $s)
                                <li>
                                    <span class="skill-name">{{ $s->name }}</span>
                                    @if($s->level)
                                        <span style="color: #64748b;">({{ $s->level }})</span>
                                    @endif
                                </li>
                            @endforeach
                        </ul>
                    </td>
                    <td class="skills-col">
                        <ul class="skills-list">
                            @foreach($col2 as $s)
                                <li>
                                    <span class="skill-name">{{ $s->name }}</span>
                                    @if($s->level)
                                        <span style="color: #64748b;">({{ $s->level }})</span>
                                    @endif
                                </li>
                            @endforeach
                        </ul>
                    </td>
                </tr>
            </table>
        </div>
    @endif
</body>
</html>
