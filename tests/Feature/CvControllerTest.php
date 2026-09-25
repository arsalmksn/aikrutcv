<?php

use App\Models\Cv;
use App\Models\User;

test('guests are redirected to the login page from cv builder', function () {
    $response = $this->get(route('cv.builder'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can access the cv builder', function () {
    $user = User::factory()->create(['name' => 'Arsa Aji', 'email' => 'arsa@example.com']);
    $this->actingAs($user);

    $response = $this->get(route('cv.builder'));
    $response->assertOk();

    $this->assertDatabaseHas('cvs', [
        'user_id' => $user->id,
    ]);

    $this->assertDatabaseHas('cv_contacts', [
        'first_name' => 'Arsa',
        'last_name' => 'Aji',
    ]);
});

test('authenticated users can auto-save contact information', function () {
    $user = User::factory()->create();
    $cv = Cv::factory()->for($user)->create();

    $this->actingAs($user);

    $response = $this->postJson(route('cv.contact.update', $cv), [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'desired_job_title' => 'Senior Laravel Developer',
        'phone' => '+628123456789',
        'email' => 'john@example.com',
        'address' => 'Jl. Sudirman No. 12',
        'city' => 'Jakarta',
        'linkedin_url' => 'https://linkedin.com/in/johndoe',
        'website_url' => 'https://johndoe.dev',
    ]);

    $response->assertOk();
    $response->assertJsonPath('status', 'success');

    $this->assertDatabaseHas('cv_contacts', [
        'cv_id' => $cv->id,
        'first_name' => 'John',
        'last_name' => 'Doe',
        'desired_job_title' => 'Senior Laravel Developer',
        'phone' => '+628123456789',
        'email' => 'john@example.com',
        'city' => 'Jakarta',
    ]);
});

test('users cannot update contact info of another users cv', function () {
    $owner = User::factory()->create();
    $attacker = User::factory()->create();
    $cv = Cv::factory()->for($owner)->create();

    $this->actingAs($attacker);

    $response = $this->postJson(route('cv.contact.update', $cv), [
        'first_name' => 'Hacker',
    ]);

    $response->assertForbidden();
});

test('authenticated users can auto-save experiences', function () {
    $user = User::factory()->create();
    $cv = Cv::factory()->for($user)->create();

    $this->actingAs($user);

    $response = $this->postJson(route('cv.experiences.update', $cv), [
        'experiences' => [
            [
                'company_name' => 'UDB',
                'position' => 'RPL',
                'city' => 'Surakarta',
                'start_date' => '02/2026',
                'end_date' => '',
                'is_current' => true,
                'description' => '• Membantu laporan keuangan',
                'sort_order' => 0,
            ],
        ],
    ]);

    $response->assertOk();
    $response->assertJsonPath('status', 'success');

    $this->assertDatabaseHas('cv_experiences', [
        'cv_id' => $cv->id,
        'company_name' => 'UDB',
        'position' => 'RPL',
        'city' => 'Surakarta',
        'is_current' => true,
        'start_date' => '2026-02-01',
    ]);
});

test('users cannot update experiences of another users cv', function () {
    $owner = User::factory()->create();
    $attacker = User::factory()->create();
    $cv = Cv::factory()->for($owner)->create();

    $this->actingAs($attacker);

    $response = $this->postJson(route('cv.experiences.update', $cv), [
        'experiences' => [],
    ]);

    $response->assertForbidden();
});

test('authenticated users can auto-save educations', function () {
    $user = User::factory()->create();
    $cv = Cv::factory()->for($user)->create();

    $this->actingAs($user);

    $response = $this->postJson(route('cv.educations.update', $cv), [
        'educations' => [
            [
                'institution_name' => 'Universitas Indonesia',
                'degree' => 'Sarjana di Keuangan dan Perbankan',
                'field_of_study' => 'Keuangan dan Perbankan',
                'city' => 'Jakarta',
                'start_date' => '08/2020',
                'end_date' => '07/2024',
                'is_current' => false,
                'description' => '<p>Lulus dengan predikat cumlaude, IPK 3.85 (2022)</p>',
                'sort_order' => 0,
            ],
        ],
    ]);

    $response->assertOk();
    $response->assertJsonPath('status', 'success');

    $this->assertDatabaseHas('cv_educations', [
        'cv_id' => $cv->id,
        'institution_name' => 'Universitas Indonesia',
        'degree' => 'Sarjana di Keuangan dan Perbankan',
        'city' => 'Jakarta',
        'is_current' => false,
        'start_date' => '2020-08-01',
        'end_date' => '2024-07-01',
    ]);
});

test('users cannot update educations of another users cv', function () {
    $owner = User::factory()->create();
    $attacker = User::factory()->create();
    $cv = Cv::factory()->for($owner)->create();

    $this->actingAs($attacker);

    $response = $this->postJson(route('cv.educations.update', $cv), [
        'educations' => [],
    ]);

    $response->assertForbidden();
});

test('authenticated users can auto-save skills', function () {
    $user = User::factory()->create();
    $cv = Cv::factory()->for($user)->create();

    $this->actingAs($user);

    $response = $this->postJson(route('cv.skills.update', $cv), [
        'skills' => [
            [
                'name' => 'Office 365',
                'level' => 'Advanced',
                'sort_order' => 0,
            ],
            [
                'name' => 'Komunikasi Efektif',
                'level' => null,
                'sort_order' => 1,
            ],
        ],
    ]);

    $response->assertOk();
    $response->assertJsonPath('status', 'success');

    $this->assertDatabaseHas('cv_skills', [
        'cv_id' => $cv->id,
        'name' => 'Office 365',
        'level' => 'Advanced',
        'sort_order' => 0,
    ]);

    $this->assertDatabaseHas('cv_skills', [
        'cv_id' => $cv->id,
        'name' => 'Komunikasi Efektif',
        'level' => null,
        'sort_order' => 1,
    ]);
});

test('users cannot update skills of another users cv', function () {
    $owner = User::factory()->create();
    $attacker = User::factory()->create();
    $cv = Cv::factory()->for($owner)->create();

    $this->actingAs($attacker);

    $response = $this->postJson(route('cv.skills.update', $cv), [
        'skills' => [],
    ]);

    $response->assertForbidden();
});

test('authenticated users can auto-save summary', function () {
    $user = User::factory()->create();
    $cv = Cv::factory()->for($user)->create();

    $this->actingAs($user);

    $summaryContent = 'Profesional berorientasi detail dengan pengalaman 3+ tahun di bidang IT.';

    $response = $this->postJson(route('cv.summary.update', $cv), [
        'content' => $summaryContent,
    ]);

    $response->assertOk();
    $response->assertJsonPath('status', 'success');

    $this->assertDatabaseHas('cv_summaries', [
        'cv_id' => $cv->id,
        'content' => $summaryContent,
    ]);
});

test('users cannot update summary of another users cv', function () {
    $owner = User::factory()->create();
    $attacker = User::factory()->create();
    $cv = Cv::factory()->for($owner)->create();

    $this->actingAs($attacker);

    $response = $this->postJson(route('cv.summary.update', $cv), [
        'content' => 'Hacked summary',
    ]);

    $response->assertForbidden();
});

test('guests can view the cv templates page', function () {
    $response = $this->get(route('cv.templates'));
    $response->assertOk();
});

test('authenticated users can view the cv templates page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('cv.templates'));
    $response->assertOk();
});
