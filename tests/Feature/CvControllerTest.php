<?php

use App\Models\Cv;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('guests can access the cv builder without logging in', function () {
    $response = $this->get(route('cv.builder'));
    $response->assertOk();
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
    ]);
    expect($cv->fresh()->experiences->first()->start_date->format('Y-m-d'))->toBe('2026-02-01');
    expect((bool) $cv->fresh()->experiences->first()->is_current)->toBeTrue();
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
    ]);
    expect($cv->fresh()->educations->first()->start_date->format('Y-m-d'))->toBe('2020-08-01');
    expect($cv->fresh()->educations->first()->end_date->format('Y-m-d'))->toBe('2024-07-01');
    expect((bool) $cv->fresh()->educations->first()->is_current)->toBeFalse();
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

test('guests can view the cv options page', function () {
    $response = $this->get(route('cv.options'));
    $response->assertOk();
});

test('authenticated users can view the cv options page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('cv.options'));
    $response->assertOk();
});

test('authenticated users can create and export cv directly from master profile with all sections', function () {
    $user = User::factory()->create(['name' => 'Budi Santoso', 'email' => 'budi@example.com']);
    $profile = $user->profile()->create([
        'full_name' => 'Budi Santoso',
        'whatsapp_number' => '+6281234567890',
        'email' => 'budi@example.com',
        'location' => 'Jakarta Selatan',
        'about_me' => 'Software Engineer berpengalaman.',
        'portfolio_link' => 'https://budisantoso.dev',
        'linkedin_url' => 'https://linkedin.com/in/budisantoso',
        'field_of_interest' => ['Full Stack Developer'],
        'tools' => ['Laravel', 'React', 'TypeScript'],
        'expected_monthly_salary' => [
            'currency' => 'IDR',
            'range_text' => '10jt - 15jt',
        ],
    ]);

    $profile->experiences()->create([
        'company' => 'PT Maju Bersama',
        'position' => 'Senior Developer',
        'location' => 'Jakarta',
        'start_date' => '2023-01',
        'end_date' => '2024-05',
        'is_current' => false,
        'description' => ['Membangun REST API', 'Mengoptimalkan performa database'],
        'sort_order' => 0,
    ]);

    $profile->educations()->create([
        'institution' => 'Institut Teknologi Bandung',
        'degree' => 'Sarjana Komputer',
        'major' => 'Teknik Informatika',
        'start_date' => '2018-08',
        'end_date' => '2022-07',
        'gpa' => '3.80',
        'sort_order' => 0,
    ]);

    $profile->organizations()->create([
        'organizations_name' => 'Himpunan Mahasiswa Informatika',
        'role' => 'Ketua Divisi Kominfo',
        'start_date' => '2020-01',
        'end_date' => '2021-01',
        'duration' => '1 Tahun',
        'description' => ['Mengelola publikasi dan sistem informasi organisasi'],
        'sort_order' => 0,
    ]);

    $profile->certifications()->create([
        'name' => 'AWS Certified Solutions Architect',
        'issuer' => 'Amazon Web Services',
        'issue_date' => '2023-06',
        'expiration_date' => '2026-06',
        'validity_period' => '3 Tahun',
        'sort_order' => 0,
    ]);

    $profile->awards()->create([
        'title' => 'Juara 1 Hackathon Nasional',
        'subtitle' => 'Kementerian Kominfo',
        'year' => '2023',
        'description' => 'Menciptakan aplikasi solusi rekrutmen berbasis AI',
        'sort_order' => 0,
    ]);

    $this->actingAs($user);

    $response = $this->postJson(route('cv.create-from-profile'), [
        'template_id' => null,
    ]);

    $response->assertOk();
    $response->assertJsonStructure([
        'status',
        'message',
        'cv_id',
        'cv_title',
        'template_name',
        'download_url',
        'builder_url',
    ]);

    $cvId = $response->json('cv_id');
    $this->assertDatabaseHas('cvs', ['id' => $cvId, 'user_id' => $user->id]);
    $this->assertDatabaseHas('cv_contacts', [
        'cv_id' => $cvId,
        'first_name' => 'Budi',
        'last_name' => 'Santoso',
        'phone' => '+6281234567890',
        'linkedin_url' => 'https://linkedin.com/in/budisantoso',
        'website_url' => 'https://budisantoso.dev',
        'expected_salary' => '10jt - 15jt',
    ]);
    $this->assertDatabaseHas('cv_summaries', [
        'cv_id' => $cvId,
        'content' => 'Software Engineer berpengalaman.',
    ]);
    $this->assertDatabaseHas('cv_experiences', [
        'cv_id' => $cvId,
        'company_name' => 'PT Maju Bersama',
        'position' => 'Senior Developer',
    ]);
    $this->assertDatabaseHas('cv_educations', [
        'cv_id' => $cvId,
        'institution_name' => 'Institut Teknologi Bandung',
        'field_of_study' => 'Teknik Informatika',
    ]);
    $this->assertDatabaseHas('cv_skills', [
        'cv_id' => $cvId,
        'name' => 'Laravel',
    ]);
    $this->assertDatabaseHas('cv_organizations', [
        'cv_id' => $cvId,
        'organization_name' => 'Himpunan Mahasiswa Informatika',
        'role' => 'Ketua Divisi Kominfo',
    ]);
    $this->assertDatabaseHas('cv_certifications', [
        'cv_id' => $cvId,
        'name' => 'AWS Certified Solutions Architect',
        'issuer' => 'Amazon Web Services',
    ]);
    $this->assertDatabaseHas('cv_awards', [
        'cv_id' => $cvId,
        'title' => 'Juara 1 Hackathon Nasional',
    ]);
});

test('templates page passes profileData when user has profile', function () {
    $user = User::factory()->create();
    $profile = $user->profile()->create([
        'full_name' => 'Aditya Pratama',
        'email' => 'aditya@example.com',
        'whatsapp_number' => '+628111222333',
        'about_me' => 'Senior Frontend Engineer.',
    ]);
    $profile->experiences()->create([
        'company' => 'Tech Corp',
        'position' => 'Lead Engineer',
        'start_date' => '2022-01',
        'is_current' => true,
        'sort_order' => 0,
    ]);

    $this->actingAs($user);

    $response = $this->get(route('cv.templates'));
    $response->assertOk();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('cv/templates')
        ->has('profileData')
        ->where('profileData.contact.first_name', 'Aditya')
        ->where('profileData.contact.last_name', 'Pratama')
        ->where('profileData.summary', 'Senior Frontend Engineer.')
        ->has('profileData.experiences', 1)
        ->where('profileData.experiences.0.company_name', 'Tech Corp')
    );
});

test('templates page passes null profileData when user has no profile', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('cv.templates'));
    $response->assertOk();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('cv/templates')
        ->where('profileData', null)
    );
});

test('cv builder automatically prefills all relations from user profile', function () {
    $user = User::factory()->create(['name' => 'Citra Lestari', 'email' => 'citra@example.com']);
    $profile = $user->profile()->create([
        'full_name' => 'Citra Lestari',
        'email' => 'citra@example.com',
        'whatsapp_number' => '+628999888777',
        'location' => 'Bandung',
        'about_me' => 'UI/UX Designer dan Creative Thinker.',
        'linkedin_url' => 'https://linkedin.com/in/citralestari',
        'portfolio_link' => 'https://citra.design',
        'tools' => ['Figma'],
    ]);

    $profile->experiences()->create([
        'company' => 'Studio Kreatif',
        'position' => 'Lead UI Designer',
        'start_date' => '2021-03',
        'is_current' => true,
        'sort_order' => 0,
    ]);

    $profile->educations()->create([
        'institution' => 'Telkom University',
        'degree' => 'Sarjana Desain',
        'major' => 'Desain Komunikasi Visual',
        'start_date' => '2016-08',
        'end_date' => '2020-07',
        'sort_order' => 0,
    ]);

    $this->actingAs($user);

    $response = $this->get(route('cv.builder'));
    $response->assertOk();

    $cv = Cv::where('user_id', $user->id)->first();
    expect($cv)->not->toBeNull();

    $this->assertDatabaseHas('cv_contacts', [
        'cv_id' => $cv->id,
        'first_name' => 'Citra',
        'last_name' => 'Lestari',
        'phone' => '+628999888777',
        'city' => 'Bandung',
        'linkedin_url' => 'https://linkedin.com/in/citralestari',
        'website_url' => 'https://citra.design',
    ]);

    $this->assertDatabaseHas('cv_summaries', [
        'cv_id' => $cv->id,
        'content' => 'UI/UX Designer dan Creative Thinker.',
    ]);

    $this->assertDatabaseHas('cv_experiences', [
        'cv_id' => $cv->id,
        'company_name' => 'Studio Kreatif',
        'position' => 'Lead UI Designer',
    ]);

    $this->assertDatabaseHas('cv_educations', [
        'cv_id' => $cv->id,
        'institution_name' => 'Telkom University',
        'degree' => 'Sarjana Desain',
        'field_of_study' => 'Desain Komunikasi Visual',
    ]);

    $this->assertDatabaseHas('cv_skills', [
        'cv_id' => $cv->id,
        'name' => 'Figma',
    ]);
});

test('cv builder creates clean empty cv without fake dummy records when user has no profile', function () {
    $user = User::factory()->create(['name' => 'Dimas Anggara', 'email' => 'dimas@example.com']);
    $this->actingAs($user);

    $response = $this->get(route('cv.builder'));
    $response->assertOk();

    $cv = Cv::where('user_id', $user->id)->first();
    expect($cv)->not->toBeNull();

    $this->assertDatabaseHas('cv_contacts', [
        'cv_id' => $cv->id,
        'first_name' => 'Dimas',
        'last_name' => 'Anggara',
        'email' => 'dimas@example.com',
    ]);

    // Ensure no fake dummy experiences, educations, or skills are created
    expect($cv->experiences()->count())->toBe(0);
    expect($cv->educations()->count())->toBe(0);
    expect($cv->skills()->count())->toBe(0);
    $this->assertDatabaseMissing('cv_experiences', ['company_name' => 'UDB Surakarta']);
    $this->assertDatabaseMissing('cv_educations', ['institution_name' => 'Universitas Indonesia']);
    $this->assertDatabaseMissing('cv_skills', ['name' => 'Office 365']);
});
