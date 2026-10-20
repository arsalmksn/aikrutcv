<?php

use App\Models\Template;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('guests are redirected from profile web route', function () {
    $response = $this->get(route('profile.index'));
    $response->assertRedirect(route('login'));
});

test('guests cannot access api profile endpoint', function () {
    $response = $this->getJson(route('api.profile.show'));
    $response->assertUnauthorized();
});

test('authenticated user can view profile inertia page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('profile.index'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('profile/index')->has('initialProfile'));
});

test('authenticated user can get profile data with calculated fields via api', function () {
    $user = User::factory()->create([
        'name' => 'Budi Santoso',
        'email' => 'budi@example.com',
    ]);
    $this->actingAs($user);

    $response = $this->getJson(route('api.profile.show'));
    $response->assertOk()
        ->assertJson([
            'status' => 'success',
            'data' => [
                'full_name' => 'Budi Santoso',
                'email' => 'budi@example.com',
                'total_experience' => 'Belum ada pengalaman',
            ],
        ]);
});

test('user can update basic profile info partially', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->patchJson(route('api.profile.update'), [
        'section' => 'profile',
        'full_name' => 'Ahmad Pratama',
        'whatsapp_number' => '+628123456789',
        'location' => 'Jakarta, Indonesia',
        'age' => 25,
        'gender' => 'Laki-laki',
    ]);

    $response->assertOk();
    expect($response->json('data.full_name'))->toBe('Ahmad Pratama')
        ->and($response->json('data.whatsapp_number'))->toBe('+628123456789')
        ->and($response->json('data.location'))->toBe('Jakarta, Indonesia')
        ->and($response->json('data.age'))->toBe(25)
        ->and($response->json('data.gender'))->toBe('Laki-laki');
});

test('user can update summary and job preferences', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->patchJson(route('api.profile.update'), [
        'section' => 'summary',
        'about_me' => 'Fullstack developer dengan pengalaman 3 tahun.',
    ])->assertOk();

    $prefResponse = $this->patchJson(route('api.profile.update'), [
        'section' => 'preferences',
        'field_of_interest' => ['Web Development', 'Cloud Computing'],
        'employment_type' => ['Full-time', 'Remote'],
        'expected_monthly_salary' => [
            'currency' => 'IDR',
            'amount' => 12000000,
            'is_negotiable' => true,
        ],
    ]);

    $prefResponse->assertOk();
    expect($prefResponse->json('data.about_me'))->toBe('Fullstack developer dengan pengalaman 3 tahun.')
        ->and($prefResponse->json('data.field_of_interest'))->toBe(['Web Development', 'Cloud Computing'])
        ->and($prefResponse->json('data.employment_type'))->toBe(['Full-time', 'Remote'])
        ->and($prefResponse->json('data.expected_monthly_salary.amount'))->toBe(12000000);
});

test('user can sync experiences with bullet points and auto calculate total experience', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->patchJson(route('api.profile.update'), [
        'section' => 'experiences',
        'experiences' => [
            [
                'company' => 'Tech Corp',
                'position' => 'Backend Engineer',
                'location' => 'Jakarta',
                'start_date' => '2023-01',
                'end_date' => '2024-01',
                'is_current' => false,
                'description' => [
                    'Membangun REST API performa tinggi.',
                    'Mengoptimalkan database query postgres.',
                ],
            ],
        ],
    ]);

    $response->assertOk();
    expect($response->json('data.experiences'))->toHaveCount(1)
        ->and($response->json('data.experiences.0.company'))->toBe('Tech Corp')
        ->and($response->json('data.experiences.0.description'))->toHaveCount(2)
        ->and($response->json('data.total_experience'))->toBe('1 tahun 1 bulan');
});

test('user can upload resume file and delete it', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $this->actingAs($user);

    $file = UploadedFile::fake()->create('my_resume.pdf', 150, 'application/pdf');

    $uploadResponse = $this->postJson(route('api.profile.upload'), [
        'file' => $file,
        'type' => 'resume',
    ]);

    $uploadResponse->assertOk()
        ->assertJson([
            'status' => 'success',
            'data' => [
                'file_name' => 'my_resume.pdf',
            ],
        ]);

    $resumeId = $uploadResponse->json('data.id');

    // Test delete
    $deleteResponse = $this->deleteJson(route('api.profile.item.destroy', [
        'type' => 'resume',
        'id' => $resumeId,
    ]));

    $deleteResponse->assertOk();
});

test('user can create a new CV pre-populated from master profile data with chosen template', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    // Setup master profile data
    $profile = $user->profile()->create([
        'full_name' => 'Budi Pratama',
        'email' => 'budi.pratama@example.com',
        'whatsapp_number' => '+628123456789',
        'location' => 'Jakarta Selatan',
        'about_me' => 'Fullstack Developer berpengalaman dengan Laravel dan React.',
        'field_of_interest' => ['Software Engineer'],
        'tools' => ['PHP', 'Laravel', 'React', 'TypeScript'],
    ]);

    $profile->experiences()->create([
        'company' => 'PT Maju Bersama',
        'position' => 'Senior Developer',
        'location' => 'Jakarta',
        'start_date' => '2022-01',
        'end_date' => '2024-01',
        'is_current' => false,
        'description' => ['Membangun microservices.', 'Optimasi query database.'],
        'sort_order' => 0,
    ]);

    $profile->educations()->create([
        'institution' => 'Institut Teknologi Bandung',
        'degree' => 'Sarjana 1 (S1)',
        'major' => 'Teknik Informatika',
        'start_date' => '2017-08',
        'end_date' => '2021-07',
        'gpa' => '3.85',
        'sort_order' => 0,
    ]);

    $template = Template::create([
        'name' => 'Modern Minimalist',
        'category' => 'ATS',
        'is_active' => true,
    ]);

    $response = $this->post(route('cv.create-from-profile'), [
        'template_id' => $template->id,
    ]);

    $response->assertRedirect();
    $user->refresh();

    expect($user->cvs)->toHaveCount(1);
    $cv = $user->cvs->first();
    expect($cv->title)->toContain('Budi Pratama')
        ->and($cv->contact)->not->toBeNull()
        ->and($cv->contact->first_name)->toBe('Budi')
        ->and($cv->contact->last_name)->toBe('Pratama')
        ->and($cv->contact->phone)->toBe('+628123456789')
        ->and($cv->summary->content)->toBe('Fullstack Developer berpengalaman dengan Laravel dan React.')
        ->and($cv->experiences)->toHaveCount(1)
        ->and($cv->experiences->first()->company_name)->toBe('PT Maju Bersama')
        ->and($cv->educations)->toHaveCount(1)
        ->and($cv->educations->first()->institution_name)->toBe('Institut Teknologi Bandung')
        ->and($cv->skills)->toHaveCount(4);
});

test('profile completeness achieves 100 percent when 6 core sections are filled without requiring certificates, portfolio, or resumes', function () {
    $user = User::factory()->create();
    $profile = $user->profile()->create([
        'full_name' => 'Siti Nurhaliza',
        'whatsapp_number' => '+628111222333',
        'location' => 'Bandung, Indonesia',
        'about_me' => 'UI/UX Designer berpengalaman dalam design system.',
        'field_of_interest' => ['UI/UX Design'],
        'employment_type' => ['Full-time'],
        'tools' => ['Figma', 'Adobe XD'],
    ]);

    $profile->experiences()->create([
        'company' => 'Design Studio',
        'position' => 'Product Designer',
        'start_date' => '2022-01',
        'sort_order' => 0,
    ]);

    $profile->educations()->create([
        'institution' => 'Universitas Indonesia',
        'degree' => 'S1 Desain Grafis',
        'sort_order' => 0,
    ]);

    $completeness = $profile->calculateCompleteness();

    expect($completeness['percentage'])->toBe(100)
        ->and($completeness['completed_sections']['profile'])->toBeTrue()
        ->and($completeness['completed_sections']['summary'])->toBeTrue()
        ->and($completeness['completed_sections']['preferences'])->toBeTrue()
        ->and($completeness['completed_sections']['experiences'])->toBeTrue()
        ->and($completeness['completed_sections']['educations'])->toBeTrue()
        ->and($completeness['completed_sections']['skills'])->toBeTrue()
        ->and($completeness['completed_sections']['certifications'])->toBeFalse()
        ->and($completeness['completed_sections']['portfolio'])->toBeFalse()
        ->and($completeness['completed_sections']['resumes'])->toBeFalse();
});

test('optional sections (certifications, portfolio, resumes) are accurately tracked without altering percentage score', function () {
    $user = User::factory()->create();
    $profile = $user->profile()->create([
        'full_name' => 'Siti Nurhaliza',
        'whatsapp_number' => '+628111222333',
        'location' => 'Bandung, Indonesia',
        'about_me' => 'UI/UX Designer berpengalaman dalam design system.',
        'field_of_interest' => ['UI/UX Design'],
        'tools' => ['Figma', 'Adobe XD'],
        'portfolio_link' => 'https://dribbble.com/sitinur',
    ]);

    $profile->experiences()->create([
        'company' => 'Design Studio',
        'position' => 'Product Designer',
        'start_date' => '2022-01',
        'sort_order' => 0,
    ]);

    $profile->educations()->create([
        'institution' => 'Universitas Indonesia',
        'degree' => 'S1 Desain Grafis',
        'sort_order' => 0,
    ]);

    $profile->certifications()->create([
        'name' => 'Google UX Design Professional Certificate',
        'issuer' => 'Coursera / Google',
        'sort_order' => 0,
    ]);

    $profile->resumes()->create([
        'file_name' => 'cv_siti.pdf',
        'file_path' => 'resumes/cv_siti.pdf',
        'file_size' => 120000,
    ]);

    $completeness = $profile->calculateCompleteness();

    expect($completeness['percentage'])->toBe(100)
        ->and($completeness['completed_sections']['certifications'])->toBeTrue()
        ->and($completeness['completed_sections']['portfolio'])->toBeTrue()
        ->and($completeness['completed_sections']['resumes'])->toBeTrue();
});
