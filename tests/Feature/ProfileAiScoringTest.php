<?php

use App\Models\User;
use App\Services\AiService;

test('guests cannot access profile ai scoring endpoint', function () {
    $this->postJson(route('profile.ai-score'))
        ->assertUnauthorized();
});

test('authenticated user can generate and persist ai profile score', function () {
    $user = User::factory()->create();
    $profile = $user->profile()->create([
        'full_name' => 'Budi Santoso',
        'location' => 'Jakarta, Indonesia',
        'about_me' => 'Senior Fullstack developer dengan pengalaman 5 tahun membangun aplikasi berskala besar.',
        'tools' => ['PHP', 'Laravel', 'React', 'TypeScript', 'PostgreSQL', 'Docker'],
        'field_of_interest' => ['Fullstack Developer', 'Backend Architect'],
        'employment_type' => ['Full-time'],
    ]);

    $profile->experiences()->create([
        'company' => 'PT Solusi Teknologi',
        'position' => 'Senior Fullstack Developer',
        'location' => 'Jakarta',
        'start_date' => '2021-01',
        'end_date' => '2024-06',
        'is_current' => false,
        'description' => [
            'Mendesain arsitektur microservices yang meningkatkan throughput sistem sebesar 35%.',
            'Memimpin tim engineer beranggotakan 4 orang dalam implementasi frontend React modern.',
        ],
    ]);

    $profile->educations()->create([
        'institution' => 'Universitas Indonesia',
        'degree' => 'S1',
        'major' => 'Ilmu Komputer',
        'start_date' => '2016-08',
        'end_date' => '2020-07',
        'gpa' => '3.85',
    ]);

    $mockAiScoringResponse = [
        'overall_score' => 88,
        'grade' => 'A (Sangat Kompetitif)',
        'headline' => 'Profil sangat solid dengan pencapaian terukur dan keahlian teknologi terkini.',
        'executive_summary' => 'Kandidat menunjukkan kematangan teknis dan kepemimpinan yang kuat. Portofolio pengalaman terdokumentasi dengan baik.',
        'rubric_scores' => [
            'experience_impact' => [
                'score' => 90,
                'label' => 'Dampak Pengalaman Kerja',
                'feedback' => 'Penggunaan metrik 35% throughput sangat kuat dan menarik bagi rekruter.',
            ],
            'skills_relevance' => [
                'score' => 92,
                'label' => 'Relevansi Keahlian & Tools',
                'feedback' => 'Kombinasi Laravel, React, dan Docker sangat diminati industri.',
            ],
            'summary_clarity' => [
                'score' => 85,
                'label' => 'Kekuatan Ringkasan Profesional',
                'feedback' => 'Tentang Saya padat dan langsung merefleksikan spesialisasi.',
            ],
            'credentials_completeness' => [
                'score' => 85,
                'label' => 'Kredensial & Kelengkapan Berkas',
                'feedback' => 'Pendidikan top-tier dengan IPK tinggi.',
            ],
        ],
        'strengths' => [
            'Memiliki metrik kuantitatif yang jelas pada pengalaman kerja.',
            'Tech stack relevan dan modern untuk kebutuhan pasar.',
        ],
        'improvements' => [
            'Dapat menambahkan sertifikasi cloud (AWS/GCP) untuk memperkuat aspek arsitektur.',
        ],
        'actionable_tips' => [
            [
                'title' => 'Tambahkan Sertifikasi Cloud',
                'tip' => 'Cantumkan sertifikasi arsitektur cloud untuk melengkapi riwayat backend.',
                'target_section' => 'skills',
            ],
        ],
    ];

    $this->mock(AiService::class, function ($mock) use ($mockAiScoringResponse) {
        $mock->shouldReceive('generateWithAgent')
            ->once()
            ->andReturn([
                'content' => json_encode($mockAiScoringResponse),
            ]);
    });

    $response = $this->actingAs($user)
        ->postJson(route('profile.ai-score'));

    $response->assertOk()
        ->assertJsonPath('status', 'success')
        ->assertJsonPath('data.scoring_data.overall_score', 88)
        ->assertJsonPath('data.scoring_data.grade', 'A (Sangat Kompetitif)')
        ->assertJsonPath('data.profile.ai_scoring.overall_score', 88);

    $profile->refresh();
    expect($profile->ai_scoring)->not->toBeNull();
    expect($profile->ai_scoring['overall_score'])->toBe(88);
    expect($profile->ai_scoring_updated_at)->not->toBeNull();
});

test('returns 422 if ai returns invalid json format', function () {
    $user = User::factory()->create();
    $user->profile()->create([
        'full_name' => 'Test User',
    ]);

    $this->mock(AiService::class, function ($mock) {
        $mock->shouldReceive('generateWithAgent')
            ->once()
            ->andReturn([
                'content' => 'Bukan format JSON yang valid',
            ]);
    });

    $response = $this->actingAs($user)
        ->postJson(route('profile.ai-score'));

    $response->assertStatus(422)
        ->assertJsonPath('status', 'error');
});
