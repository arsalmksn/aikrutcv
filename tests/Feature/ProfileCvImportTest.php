<?php

use App\Models\AiModel;
use App\Models\AiProvider;
use App\Models\User;
use App\Models\UserProfile;
use App\Services\DocumentTextExtractorService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;

test('guests cannot access import cv endpoints', function () {
    $this->postJson(route('profile.import-cv.parse'))
        ->assertUnauthorized();

    $this->postJson(route('profile.import-cv.apply'))
        ->assertUnauthorized();
});

test('parse endpoint validates uploaded file', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson(route('profile.import-cv.parse'), [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['file']);

    $invalidFile = UploadedFile::fake()->create('document.exe', 100);

    $this->actingAs($user)
        ->postJson(route('profile.import-cv.parse'), [
            'file' => $invalidFile,
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['file']);
});

test('user can parse and enhance cv document using active ai model', function () {
    $user = User::factory()->create();

    // Set up active AI provider and model
    $provider = AiProvider::create([
        'name' => 'Groq Cloud',
        'slug' => 'groq-test',
        'driver' => 'openai-compatible',
        'base_url' => 'https://api.groq.com/openai/v1',
        'api_key' => 'gsk_dummy_test_key',
        'is_active' => true,
    ]);

    $model = AiModel::create([
        'ai_provider_id' => $provider->id,
        'name' => 'Llama 3.3 70B',
        'model_id' => 'llama-3.3-70b-versatile',
        'priority' => 1,
        'is_active' => true,
    ]);

    AiModel::where('id', '!=', $model->id)->update(['is_active' => false]);

    // Mock DocumentTextExtractorService so test does not depend on actual PDF binary parser
    $this->mock(DocumentTextExtractorService::class, function ($mock) {
        $mock->shouldReceive('extract')
            ->once()
            ->andReturn("John Doe\nSoftware Engineer\nPengalaman di PT Maju Mundur (2022-2024)\nKeahlian: PHP, Laravel");
    });

    $fakeAiJsonResponse = json_encode([
        'personal_info' => [
            'full_name' => 'John Doe',
            'email' => 'johndoe@example.com',
            'whatsapp_number' => '+628123456789',
            'location' => 'Jakarta, Indonesia',
            'linkedin_url' => 'https://linkedin.com/in/johndoe',
            'portfolio_link' => null,
        ],
        'about_me' => 'Software Engineer profesional dengan rekam jejak terbukti dalam membangun aplikasi web skalabel menggunakan PHP dan Laravel.',
        'field_of_interest' => ['Backend Developer', 'Software Engineer'],
        'tools' => ['PHP', 'Laravel', 'MySQL', 'Docker'],
        'experiences' => [
            [
                'company' => 'PT Maju Mundur',
                'position' => 'Senior Backend Engineer',
                'location' => 'Jakarta',
                'start_date' => '2022-01',
                'end_date' => '2024-03',
                'is_current' => false,
                'description' => [
                    'Mengembangkan sistem microservices backend yang meningkatkan reliabilitas sistem sebesar 99.9%.',
                    'Mengoptimalkan throughput API sebesar 40% menggunakan indexing database canggih.',
                ],
            ],
        ],
        'educations' => [
            [
                'institution' => 'Universitas Indonesia',
                'degree' => 'Sarjana Komputer',
                'major' => 'Ilmu Komputer',
                'start_date' => '2017-08',
                'end_date' => '2021-07',
                'gpa' => '3.85',
            ],
        ],
        'organizations' => [],
        'certifications' => [],
        'awards' => [],
    ]);

    Http::fake([
        'https://api.groq.com/*' => Http::response([
            'choices' => [
                [
                    'message' => [
                        'content' => "```json\n".$fakeAiJsonResponse."\n```",
                    ],
                ],
            ],
        ], 200),
    ]);

    $file = UploadedFile::fake()->create('resume.pdf', 500, 'application/pdf');

    $response = $this->actingAs($user)->postJson(route('profile.import-cv.parse'), [
        'file' => $file,
        'tone' => 'impactful',
    ]);

    $response->assertOk()
        ->assertJson([
            'status' => 'success',
            'data' => [
                'provider_name' => 'Groq Cloud',
                'model_name' => 'Llama 3.3 70B',
                'tone' => 'impactful',
                'parsed' => [
                    'personal_info' => [
                        'full_name' => 'John Doe',
                        'email' => 'johndoe@example.com',
                        'location' => 'Jakarta, Indonesia',
                    ],
                    'about_me' => 'Software Engineer profesional dengan rekam jejak terbukti dalam membangun aplikasi web skalabel menggunakan PHP dan Laravel.',
                    'field_of_interest' => ['Backend Developer', 'Software Engineer'],
                    'tools' => ['PHP', 'Laravel', 'MySQL', 'Docker'],
                ],
            ],
        ]);
});

test('user can apply parsed cv data to profile in replace mode', function () {
    $user = User::factory()->create();
    $profile = UserProfile::create([
        'user_id' => $user->id,
        'full_name' => 'Old Name',
        'about_me' => 'Old summary',
        'tools' => ['OldSkill'],
    ]);

    // Create an old experience that should be wiped in replace mode
    $profile->experiences()->create([
        'company' => 'Old Company',
        'position' => 'Old Position',
        'start_date' => '2020-01',
    ]);

    $payload = [
        'mode' => 'replace',
        'personal_info' => [
            'full_name' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'whatsapp_number' => '+628111222333',
            'location' => 'Bandung, Indonesia',
            'linkedin_url' => 'https://linkedin.com/in/budisantoso',
            'portfolio_link' => 'https://budi.dev',
        ],
        'about_me' => 'Ringkasan profesional yang disempurnakan AI.',
        'field_of_interest' => ['Full Stack Developer'],
        'tools' => ['React', 'Laravel', 'TypeScript'],
        'experiences' => [
            [
                'company' => 'PT Teknologi Baru',
                'position' => 'Lead Developer',
                'location' => 'Bandung',
                'start_date' => '2023-01',
                'end_date' => null,
                'is_current' => true,
                'description' => ['Memimpin 5 insinyur perangkat lunak.'],
            ],
        ],
        'educations' => [
            [
                'institution' => 'Institut Teknologi Bandung',
                'degree' => 'S1',
                'major' => 'Informatika',
                'start_date' => '2018',
                'end_date' => '2022',
                'gpa' => '3.90',
            ],
        ],
        'organizations' => [],
        'certifications' => [],
        'awards' => [],
    ];

    $response = $this->actingAs($user)->postJson(route('profile.import-cv.apply'), $payload);

    $response->assertOk()
        ->assertJson([
            'status' => 'success',
            'data' => [
                'full_name' => 'Budi Santoso',
                'whatsapp_number' => '+628111222333',
                'location' => 'Bandung, Indonesia',
                'about_me' => 'Ringkasan profesional yang disempurnakan AI.',
                'tools' => ['React', 'Laravel', 'TypeScript'],
            ],
        ]);

    $profile->refresh();

    expect($profile->full_name)->toBe('Budi Santoso');
    expect($profile->tools)->toBe(['React', 'Laravel', 'TypeScript']);
    expect($profile->experiences)->toHaveCount(1);
    expect($profile->experiences->first()->company)->toBe('PT Teknologi Baru');
    expect($profile->educations)->toHaveCount(1);
    expect($profile->educations->first()->institution)->toBe('Institut Teknologi Bandung');
});

test('user can apply parsed cv data to profile in merge mode', function () {
    $user = User::factory()->create();
    $profile = UserProfile::create([
        'user_id' => $user->id,
        'full_name' => 'Budi Existing',
        'whatsapp_number' => '+62899999999',
        'about_me' => 'Ringkasan lama yang berharga.',
        'tools' => ['PHP', 'Git'],
    ]);

    $profile->experiences()->create([
        'company' => 'Perusahaan Pertama',
        'position' => 'Junior Developer',
        'start_date' => '2021-01',
        'sort_order' => 0,
    ]);

    $payload = [
        'mode' => 'merge',
        'personal_info' => [
            'full_name' => 'Budi Baru',
            'location' => 'Surabaya',
            'linkedin_url' => 'https://linkedin.com/in/budi-new',
        ],
        'about_me' => 'Ringkasan baru dari CV',
        'field_of_interest' => ['Backend Developer'],
        'tools' => ['PHP', 'Laravel', 'Docker'], // PHP is duplicate, should be deduplicated
        'experiences' => [
            [
                'company' => 'Perusahaan Kedua',
                'position' => 'Mid Developer',
                'start_date' => '2023-01',
                'is_current' => true,
                'description' => ['Membangun fitur baru.'],
            ],
        ],
        'educations' => [],
        'organizations' => [],
        'certifications' => [],
        'awards' => [],
    ];

    $response = $this->actingAs($user)->postJson(route('profile.import-cv.apply'), $payload);

    $response->assertOk();

    $profile->refresh();

    // In merge mode, existing non-blank fields are preserved
    expect($profile->full_name)->toBe('Budi Existing');
    expect($profile->about_me)->toBe('Ringkasan lama yang berharga.');
    // Blank fields are populated
    expect($profile->location)->toBe('Surabaya');
    expect($profile->linkedin_url)->toBe('https://linkedin.com/in/budi-new');

    // Tools merged without duplicates
    expect($profile->tools)->toEqualCanonicalizing(['PHP', 'Git', 'Laravel', 'Docker']);

    // Experiences appended
    expect($profile->experiences)->toHaveCount(2);
    expect($profile->experiences->pluck('company')->all())->toContain('Perusahaan Pertama', 'Perusahaan Kedua');
});

test('parse returns error when no ai models are active', function () {
    $user = User::factory()->create();

    // Deactivate all models
    AiModel::query()->update(['is_active' => false]);

    $this->mock(DocumentTextExtractorService::class, function ($mock) {
        $mock->shouldReceive('extract')
            ->once()
            ->andReturn('Isi resume');
    });

    $file = UploadedFile::fake()->create('resume.pdf', 200, 'application/pdf');

    $response = $this->actingAs($user)->postJson(route('profile.import-cv.parse'), [
        'file' => $file,
    ]);

    $response->assertStatus(422)
        ->assertJson([
            'status' => 'error',
        ]);
});

test('user can apply experiences with null start_date without not null constraint error', function () {
    $user = User::factory()->create();
    $profile = UserProfile::create([
        'user_id' => $user->id,
        'full_name' => 'Test User',
    ]);

    $payload = [
        'mode' => 'replace',
        'personal_info' => [
            'full_name' => 'Test User',
        ],
        'experiences' => [
            [
                'company' => 'Universitas Duta Bangsa Surakarta – Academic Project',
                'position' => 'Full Stack Developer',
                'location' => 'Surakarta, Indonesia',
                'start_date' => null,
                'end_date' => null,
                'is_current' => false,
                'description' => ['Mengembangkan sistem manajemen thrift berbasis web.'],
            ],
        ],
        'educations' => [],
        'organizations' => [],
        'certifications' => [],
        'awards' => [],
    ];

    $response = $this->actingAs($user)->postJson(route('profile.import-cv.apply'), $payload);

    $response->assertOk();

    $profile->refresh();
    expect($profile->experiences)->toHaveCount(1);
    expect($profile->experiences->first()->company)->toBe('Universitas Duta Bangsa Surakarta – Academic Project');
    expect($profile->experiences->first()->start_date)->toBeNull();
});

test('applying cv import updates profile_data_source to cv_import and locks subsequent cv imports', function () {
    $user = User::factory()->create();
    $profile = $user->profile()->create([
        'full_name' => 'Original Name',
        'profile_data_source' => 'onboarding',
    ]);

    expect($profile->isCvImportLocked())->toBeFalse();

    $payload = [
        'mode' => 'merge',
        'personal_info' => [
            'full_name' => 'Imported Name',
        ],
        'experiences' => [],
        'educations' => [],
        'organizations' => [],
        'certifications' => [],
        'awards' => [],
    ];

    $response = $this->actingAs($user)->postJson(route('profile.import-cv.apply'), $payload);
    $response->assertOk();

    $profile->refresh();
    expect($profile->profile_data_source)->toBe('cv_import');
    expect($profile->isCvImportLocked())->toBeTrue();

    // Subsequent call should be forbidden
    $secondResponse = $this->actingAs($user)->postJson(route('profile.import-cv.apply'), $payload);
    $secondResponse->assertForbidden();
});
