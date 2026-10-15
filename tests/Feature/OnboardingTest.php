<?php

use App\Models\Cv;
use App\Models\CvEducation;
use App\Models\CvExperience;
use App\Models\CvSkill;
use App\Models\User;

test('unonboarded user is redirected to onboarding upon login', function () {
    $user = User::factory()->unonboarded()->create();

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('onboarding'));
});

test('admin user is redirected to admin dashboard upon login even if onboarding is null', function () {
    $admin = User::factory()->admin()->unonboarded()->create();

    $response = $this->post(route('login.store'), [
        'email' => $admin->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('admin.dashboard', absolute: false));
});

test('unonboarded user visiting dashboard is redirected to onboarding', function () {
    $user = User::factory()->unonboarded()->create();

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertRedirect(route('onboarding'));
});

test('onboarded user visiting onboarding without reconfigure is redirected to dashboard', function () {
    $user = User::factory()->create(['onboarding_completed_at' => now()]);

    $response = $this->actingAs($user)->get(route('onboarding'));

    $response->assertRedirect(route('dashboard'));
});

test('onboarded user can visit onboarding with reconfigure query param', function () {
    $user = User::factory()->create(['onboarding_completed_at' => now()]);

    $response = $this->actingAs($user)->get(route('onboarding', ['reconfigure' => 1]));

    $response->assertOk();
});

test('onboarding screen renders successfully and detects existing CV data', function () {
    $user = User::factory()->unonboarded()->create();

    // Create an existing CV for this user
    $cv = Cv::factory()->create(['user_id' => $user->id, 'title' => 'CV Software Engineer']);
    CvExperience::create([
        'cv_id' => $cv->id,
        'company_name' => 'PT Teknologi Jaya',
        'position' => 'Backend Developer',
        'city' => 'Jakarta',
        'is_current' => true,
        'start_date' => '2024-01-01',
    ]);
    CvEducation::create([
        'cv_id' => $cv->id,
        'institution_name' => 'Institut Teknologi Bandung',
        'degree' => 'Sarjana Informatika',
        'city' => 'Bandung',
        'is_current' => false,
        'start_date' => '2019-08-01',
        'end_date' => '2023-07-01',
    ]);
    CvSkill::create([
        'cv_id' => $cv->id,
        'name' => 'Laravel',
    ]);

    $response = $this->actingAs($user)->get(route('onboarding'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('onboarding/index')
        ->has('careerCategories')
        ->has('careerLevels')
        ->where('existingData.has_existing_cv', true)
        ->where('existingData.latest_cv_title', 'CV Software Engineer')
        ->where('existingData.experiences.0.position', 'Backend Developer')
        ->where('existingData.tools.0', 'Laravel')
    );
});

test('generate blueprint endpoint returns structured blueprint', function () {
    $user = User::factory()->unonboarded()->create();

    $response = $this->actingAs($user)->postJson(route('onboarding.blueprint'), [
        'field_of_interest' => ['Backend Developer', 'DevOps & Cloud Engineer'],
        'career_level' => 'Junior (1 - 2 tahun)',
        'use_existing_data' => false,
    ]);

    $response->assertOk();
    $response->assertJsonStructure([
        'status',
        'data' => [
            'ai_profile_summary',
            'target_roles',
            'recommended_skills',
            'quick_action_steps',
        ],
    ]);
});

test('complete onboarding persists field of interest, tools, and marks user as completed', function () {
    $user = User::factory()->unonboarded()->create();

    $blueprintData = [
        'ai_profile_summary' => 'Junior Backend Specialist with strong knowledge in API design.',
        'target_roles' => ['Backend Developer', 'API Engineer'],
        'recommended_skills' => ['PHP', 'Laravel', 'Docker', 'PostgreSQL'],
        'quick_action_steps' => ['Fokus pada REST API', 'Tulis metrik kecepatan response'],
        'tailored_tone' => 'professional',
        'career_level' => 'Junior (1 - 2 tahun)',
    ];

    $response = $this->actingAs($user)->postJson(route('onboarding.complete'), [
        'field_of_interest' => ['Backend Developer', 'API Engineer'],
        'career_level' => 'Junior (1 - 2 tahun)',
        'selected_skills' => ['Laravel', 'PostgreSQL'],
        'ai_blueprint' => $blueprintData,
    ]);

    $response->assertOk();
    $response->assertJson([
        'status' => 'success',
        'redirect' => route('dashboard'),
    ]);

    $user->refresh();
    expect($user->hasCompletedOnboarding())->toBeTrue();

    $profile = $user->profile;
    expect($profile)->not->toBeNull();
    expect($profile->field_of_interest)->toEqual(['Backend Developer', 'API Engineer']);
    expect($profile->career_level)->toBe('Junior (1 - 2 tahun)');
    expect($profile->about_me)->toBe('Junior Backend Specialist with strong knowledge in API design.');
    expect($profile->ai_onboarding_context)->not->toBeNull();
    expect($profile->tools)->toContain('Laravel');
});

test('complete onboarding syncs experiences and educations from existing CV to profile', function () {
    $user = User::factory()->unonboarded()->create();

    // Create CV
    $cv = Cv::factory()->create(['user_id' => $user->id]);
    CvExperience::create([
        'cv_id' => $cv->id,
        'company_name' => 'PT Solusi Digital',
        'position' => 'Frontend Engineer',
        'city' => 'Surabaya',
        'is_current' => false,
        'start_date' => '2023-01-01',
        'end_date' => '2024-01-01',
    ]);
    CvEducation::create([
        'cv_id' => $cv->id,
        'institution_name' => 'Universitas Brawijaya',
        'degree' => 'S1 Sistem Informasi',
        'city' => 'Malang',
        'is_current' => false,
        'start_date' => '2019-08-01',
        'end_date' => '2023-06-01',
    ]);

    $response = $this->actingAs($user)->post(route('onboarding.complete'), [
        'field_of_interest' => ['Frontend Developer'],
        'career_level' => 'Junior (1 - 2 tahun)',
        'sync_existing_cv' => true,
    ]);

    $response->assertRedirect(route('dashboard'));

    $user->refresh();
    expect($user->hasCompletedOnboarding())->toBeTrue();

    $profile = $user->profile;
    expect($profile->experiences)->toHaveCount(1);
    expect($profile->experiences->first()->company)->toBe('PT Solusi Digital');
    expect($profile->educations)->toHaveCount(1);
    expect($profile->educations->first()->institution)->toBe('Universitas Brawijaya');
});

test('skip onboarding sets default field of interest and marks user as completed', function () {
    $user = User::factory()->unonboarded()->create();

    $response = $this->actingAs($user)->post(route('onboarding.skip'));

    $response->assertRedirect(route('dashboard'));

    $user->refresh();
    expect($user->hasCompletedOnboarding())->toBeTrue();
});

test('complete onboarding persists profile_data_source as onboarding and locks subsequent cv import in profile', function () {
    $user = User::factory()->unonboarded()->create();

    $response = $this->actingAs($user)->postJson(route('onboarding.complete'), [
        'field_of_interest' => ['Data Analyst'],
        'career_level' => 'Fresh Graduate / Mahasiswa',
        'profile_data_source' => 'onboarding',
    ]);

    $response->assertOk();

    $user->refresh();
    $profile = $user->profile;
    expect($profile->profile_data_source)->toBe('onboarding');
    expect($profile->isCvImportLocked())->toBeTrue();

    // Verify endpoint api/v1/profile/import-cv/parse is rejected with 403
    $importResponse = $this->actingAs($user)->postJson(route('profile.import-cv.parse'), []);
    $importResponse->assertForbidden();
    $importResponse->assertJson([
        'status' => 'error',
    ]);
});

test('complete onboarding persists profile_data_source as cv_import and locks subsequent cv import in profile', function () {
    $user = User::factory()->unonboarded()->create();

    $response = $this->actingAs($user)->postJson(route('onboarding.complete'), [
        'field_of_interest' => ['UI/UX Designer'],
        'career_level' => 'Junior (1 - 2 tahun)',
        'profile_data_source' => 'cv_import',
    ]);

    $response->assertOk();

    $user->refresh();
    $profile = $user->profile;
    expect($profile->profile_data_source)->toBe('cv_import');
    expect($profile->isCvImportLocked())->toBeTrue();

    // Verify endpoint api/v1/profile/import-cv/apply is rejected with 403
    $applyResponse = $this->actingAs($user)->postJson(route('profile.import-cv.apply'), [
        'mode' => 'replace',
    ]);
    $applyResponse->assertForbidden();
});
