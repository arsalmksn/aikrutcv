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

        /* ATS Classic Header (Centered) */
        .header {
            text-align: center;
            margin-bottom: 16px;
        }

        .name {
            font-family: Georgia, 'Times New Roman', Times, serif;
            font-size: 24pt;
            font-weight: normal;
            color: #000000;
            letter-spacing: -0.5px;
            margin-bottom: 4px;
        }

        .desired-title {
            font-size: 10.5pt;
            color: #000000;
            font-weight: bold;
            margin-bottom: 4px;
            letter-spacing: 0.5px;
        }

        .contact-line {
            font-size: 8.5pt;
            color: #222222;
            line-height: 1.4;
        }

        .contact-label {
            font-weight: bold;
            color: #000000;
        }

        .divider {
            border-bottom: 1px dotted #cccccc;
            margin: 10px 0 14px 0;
        }

        /* ATS Section Headings */
        .section {
            margin-bottom: 14px;
        }

        .section-title {
            font-size: 10pt;
            font-weight: bold;
            color: #000000;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }

        /* Content Styling */
        .summary-text {
            font-size: 9.5pt;
            line-height: 1.45;
            text-align: justify;
            margin: 0;
        }

        .item {
            margin-bottom: 10px;
            page-break-inside: avoid;
        }

        .item-role {
            font-size: 10pt;
            font-weight: bold;
            font-style: italic;
            color: #000000;
        }

        .item-institution {
            font-size: 10pt;
            font-weight: bold;
            color: #000000;
        }

        .item-meta {
            font-size: 9pt;
            color: #333333;
            font-style: italic;
            margin-bottom: 3px;
        }

        ul.bullet-list {
            margin: 3px 0 6px 18px;
            padding: 0;
            font-size: 9.5pt;
            line-height: 1.4;
        }

        ul.bullet-list li {
            margin-bottom: 2px;
        }

        .skills-list {
            margin: 0;
            padding-left: 18px;
            font-size: 9.5pt;
        }

        .skills-list li {
            margin-bottom: 3px;
        }

        .skill-name {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <!-- Header (Centered ATS Classic) -->
    <div class="header">
        @if($cv->contact?->desired_job_title)
            <div class="desired-title">{{ $cv->contact->desired_job_title }}</div>
        @endif

        @php
            $fullName = trim(($cv->contact?->first_name ?? '') . ' ' . ($cv->contact?->last_name ?? ''));
        @endphp
        <div class="name">{{ $fullName ?: 'Ayu Sutanto' }}</div>

        <div class="contact-line">
            @php
                $contacts = [];
                $location = trim(($cv->contact?->city ?? '') . ($cv->contact?->city && $cv->contact?->address ? ', ' : '') . ($cv->contact?->address ?? ''));
                if ($location) {
                    $contacts[] = '<span class="contact-label">Alamat:</span> ' . e($location);
                }
                if ($cv->contact?->email) {
                    $contacts[] = '<span class="contact-label">Alamat email:</span> ' . e($cv->contact->email);
                }
                if ($cv->contact?->phone) {
                    $contacts[] = '<span class="contact-label">Nomor telepon:</span> ' . e($cv->contact->phone);
                }
                if ($cv->contact?->linkedin_url) {
                    $contacts[] = e(preg_replace('/^https?:\/\//', '', $cv->contact->linkedin_url));
                }
                if ($cv->contact?->website_url) {
                    $contacts[] = e(preg_replace('/^https?:\/\//', '', $cv->contact->website_url));
                }
            @endphp
            {!! implode(' &nbsp;·&nbsp; ', $contacts) !!}
        </div>
        <div class="divider"></div>
    </div>

    <!-- Professional Objective / Summary -->
    @if($cv->summary?->content)
        <div class="section">
            <div class="section-title">PROFESSIONAL OBJECTIVE</div>
            <div class="summary-text">
                {!! strip_tags($cv->summary->content, '<p><br><b><strong><i><em>') !!}
            </div>
        </div>
    @endif

    <!-- Technical Skills -->
    @if($cv->skills && $cv->skills->count() > 0)
        <div class="section">
            <div class="section-title">TECHNICAL SKILLS</div>
            <ul class="skills-list">
                @foreach($cv->skills as $skill)
                    <li>
                        <span class="skill-name">{{ $skill->name }}</span>
                        @if($skill->level)
                            — <span>{{ $skill->level }}</span>
                        @endif
                    </li>
                @endforeach
            </ul>
        </div>
    @endif

    <!-- Professional Experience & Projects -->
    @if($cv->experiences && $cv->experiences->count() > 0)
        <div class="section">
            <div class="section-title">PROFESSIONAL EXPERIENCE & PROJECTS</div>
            @foreach($cv->experiences as $exp)
                <div class="item">
                    <div class="item-role">{{ $exp->position }}</div>
                    <div class="item-meta">
                        {{ $exp->company_name }}{{ $exp->city ? ', ' . $exp->city : '' }} | 
                        @php
                            $start = $exp->start_date ? \Illuminate\Support\Carbon::parse($exp->start_date)->translatedFormat('M Y') : '';
                            $end = $exp->is_current ? 'Present' : ($exp->end_date ? \Illuminate\Support\Carbon::parse($exp->end_date)->translatedFormat('M Y') : '');
                        @endphp
                        {{ $start }}{{ $start && $end ? ' – ' : '' }}{{ $end }}
                    </div>

                    @if($exp->description)
                        @if(str_contains($exp->description, '<li'))
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

    <!-- Education -->
    @if($cv->educations && $cv->educations->count() > 0)
        <div class="section">
            <div class="section-title">EDUCATION</div>
            @foreach($cv->educations as $edu)
                <div class="item">
                    <div class="item-institution">
                        {{ $edu->degree }}{{ $edu->field_of_study ? ', ' . $edu->field_of_study : '' }}
                    </div>
                    <div class="item-meta">
                        {{ $edu->institution_name }}{{ $edu->city ? ', ' . $edu->city : '' }} | 
                        @php
                            $eduStart = $edu->start_date ? \Illuminate\Support\Carbon::parse($edu->start_date)->translatedFormat('M Y') : '';
                            $eduEnd = $edu->is_current ? 'Present' : ($edu->end_date ? \Illuminate\Support\Carbon::parse($edu->end_date)->translatedFormat('M Y') : '');
                        @endphp
                        {{ $eduStart }}{{ $eduStart && $eduEnd ? ' – ' : '' }}{{ $eduEnd }}
                    </div>

                    @if($edu->description)
                        <ul class="bullet-list">
                            <li>{!! strip_tags($edu->description, '<b><strong><i><em>') !!}</li>
                        </ul>
                    @endif
                </div>
            @endforeach
        </div>
    @endif
</body>
</html>
