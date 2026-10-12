<?php

use App\Models\Template;
use App\Models\User;
use App\Services\AiService;

test('guests cannot access job recommendation endpoint', function () {
    $this->postJson(route('profile.recommend-jobs'))
        ->assertUnauthorized();
});

test('authenticated user can generate and persist job recommendations using ai', function () {
    $user = User::factory()->create();
    $profile = $user->profile()->create([
        'full_name' => 'Budi Santoso',
        'location' => 'Jakarta, Indonesia',
        'about_me' => 'Fullstack developer dengan pengalaman 3 tahun membangun aplikasi web dengan Laravel dan React.',
        'tools' => ['PHP', 'Laravel', 'React', 'MySQL', 'Git'],
        'field_of_interest' => ['Fullstack Developer', 'Backend Developer'],
    ]);

    $profile->experiences()->create([
        'company' => 'PT Solusi Digital',
        'position' => 'Fullstack Web Developer',
        'location' => 'Jakarta',
        'start_date' => '2022-01',
        'end_date' => '2025-01',
        'is_current' => false,
        'description' => ['Membangun REST API dan antarmuka web modern.'],
    ]);

    $mockAiResponse = [
        'profile_summary_insight' => 'Kandidat memiliki fondasi kuat dalam ekosistem fullstack Laravel dan React.',
        'recommendations' => [
            [
                'job_title' => 'Fullstack Web Developer',
                'career_level' => 'Mid-Level',
                'work_mode' => 'Hybrid',
                'match_score' => 95,
                'match_level' => 'Sangat Cocok',
                'salary_estimate' => 'Rp 10.000.000 - Rp 18.000.000 / bulan',
                'match_reason' => 'Pengalaman 3 tahun dan keahlian Laravel/React sangat sesuai dengan kebutuhan industri.',
                'matched_skills' => ['Laravel', 'React', 'PHP', 'MySQL'],
                'skills_to_highlight' => ['Docker', 'CI/CD'],
                'key_responsibilities' => [
                    'Mengembangkan sistem web skala enterprise',
                    'Mengoptimalkan performa database',
                ],
                'search_keywords' => 'Fullstack Developer Laravel React',
            ],
        ],
    ];

    $this->mock(AiService::class, function ($mock) use ($mockAiResponse) {
        $mock->shouldReceive('generateWithAgent')
            ->once()
            ->andReturn([
                'content' => json_encode($mockAiResponse),
            ]);
    });

    $response = $this->actingAs($user)
        ->postJson(route('profile.recommend-jobs'), [
            'career_level' => 'Mid-Level',
            'work_mode' => 'Hybrid',
        ]);

    $response->assertOk()
        ->assertJson([
            'status' => 'success',
            'data' => [
                'recommendations_data' => [
                    'profile_summary_insight' => 'Kandidat memiliki fondasi kuat dalam ekosistem fullstack Laravel dan React.',
                ],
            ],
        ]);

    // Verify search links were generated
    $recommendations = $response->json('data.recommendations_data.recommendations');
    expect($recommendations)->toHaveCount(1)
        ->and($recommendations[0]['search_links'])->toHaveKeys(['linkedin', 'jobstreet', 'glints', 'kalibrr']);

    // Verify persistence in database
    $profile->refresh();
    expect($profile->job_recommendations)->not->toBeNull()
        ->and($profile->job_recommendations['recommendations'][0]['job_title'])->toBe('Fullstack Web Developer')
        ->and($profile->job_recommendations_updated_at)->not->toBeNull();
});

test('profile show endpoint returns persisted job recommendations', function () {
    $user = User::factory()->create();
    $user->profile()->create([
        'full_name' => 'Siti Nurhaliza',
        'job_recommendations' => [
            'profile_summary_insight' => 'Profil menonjol di bidang UI/UX Design.',
            'recommendations' => [
                [
                    'job_title' => 'UI/UX Designer',
                    'match_score' => 92,
                ],
            ],
        ],
        'job_recommendations_updated_at' => now(),
    ]);

    $response = $this->actingAs($user)->getJson(route('api.profile.show'));

    $response->assertOk()
        ->assertJsonPath('data.job_recommendations.recommendations.0.job_title', 'UI/UX Designer');
});

test('create cv from profile sets target_job_title when provided', function () {
    $template = Template::factory()->create([
        'name' => 'Modern Minimalist',
    ]);

    $user = User::factory()->create();
    $user->profile()->create([
        'full_name' => 'Andi Wijaya',
        'field_of_interest' => ['Frontend Developer'],
    ]);

    $response = $this->actingAs($user)->postJson(route('cv.create-from-profile'), [
        'template_id' => $template->id,
        'target_job_title' => 'Lead Frontend Engineer',
    ]);

    $response->assertOk()
        ->assertJson([
            'status' => 'success',
        ]);

    $cv = $user->cvs()->latest()->first();
    expect($cv)->not->toBeNull()
        ->and($cv->title)->toContain('Lead Frontend Engineer')
        ->and($cv->contact->desired_job_title)->toBe('Lead Frontend Engineer');
});
