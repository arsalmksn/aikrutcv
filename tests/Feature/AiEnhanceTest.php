<?php

use App\Ai\Agents\CvBuilderAgent;
use App\Models\AiModel;
use App\Models\AiProvider;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Http;

test('guests cannot access ai enhance endpoints', function () {
    $this->postJson(route('ai.enhance-summary'), ['text' => 'Halo'])
        ->assertUnauthorized();

    $this->postJson(route('ai.enhance-experience'), ['text' => 'Programmer'])
        ->assertUnauthorized();

    $this->postJson(route('ai.enhance-education'), ['text' => 'Universitas'])
        ->assertUnauthorized();

    $this->getJson(route('ai.status'))
        ->assertUnauthorized();
});

test('authenticated user can check ai availability status', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson(route('ai.status'));

    $response->assertOk()
        ->assertJsonStructure([
            'status',
            'available',
            'active_models_count',
            'models',
        ]);
});

test('user can enhance profile summary with active ai provider and model', function () {
    $user = User::factory()->create();
    $profile = UserProfile::create([
        'user_id' => $user->id,
        'full_name' => 'Budi Santoso',
        'field_of_interest' => ['Backend Developer', 'DevOps'],
        'tools' => ['Laravel', 'PostgreSQL', 'Docker'],
        'about_me' => 'Saya programmer pemula.',
    ]);

    $profile->experiences()->create([
        'company' => 'Tech Nusantara',
        'position' => 'Junior Web Developer',
        'start_date' => '2023-01',
        'is_current' => true,
    ]);

    $provider = AiProvider::create([
        'name' => 'Groq Cloud',
        'slug' => 'groq-test',
        'driver' => 'openai-compatible',
        'base_url' => 'https://api.groq.com/openai/v1',
        'api_key' => 'gsk_dummy_key',
        'is_active' => true,
    ]);

    $model = AiModel::create([
        'ai_provider_id' => $provider->id,
        'name' => 'Llama 3.3 70B',
        'model_id' => 'llama-3.3-70b-versatile',
        'priority' => 1,
        'is_active' => true,
    ]);

    // Deactivate other models so this test is isolated
    AiModel::where('id', '!=', $model->id)->update(['is_active' => false]);

    Http::fake([
        'https://api.groq.com/*' => Http::response([
            'choices' => [
                [
                    'message' => [
                        'content' => 'Backend Developer berorientasi hasil dengan keahlian mendalam pada Laravel, PostgreSQL, dan Docker. Berpengalaman membangun arsitektur sistem yang skalabel dan efisien di Tech Nusantara.',
                    ],
                ],
            ],
        ], 200),
    ]);

    $response = $this->actingAs($user)->postJson(route('ai.enhance-summary'), [
        'text' => 'Saya programmer pemula di Tech Nusantara.',
        'tone' => 'impactful',
    ]);

    $response->assertOk()
        ->assertJson([
            'status' => 'success',
            'data' => [
                'enhanced_text' => 'Backend Developer berorientasi hasil dengan keahlian mendalam pada Laravel, PostgreSQL, dan Docker. Berpengalaman membangun arsitektur sistem yang skalabel dan efisien di Tech Nusantara.',
                'original_text' => 'Saya programmer pemula di Tech Nusantara.',
                'provider_name' => 'Groq Cloud',
                'model_name' => 'Llama 3.3 70B',
                'fallback_occurred' => false,
            ],
        ]);
});

test('user can enhance experience description with active ai provider', function () {
    $user = User::factory()->create();
    UserProfile::create([
        'user_id' => $user->id,
        'full_name' => 'Budi Santoso',
    ]);

    $provider = AiProvider::create([
        'name' => 'Groq Cloud',
        'slug' => 'groq-test-exp',
        'driver' => 'openai-compatible',
        'base_url' => 'https://api.groq.com/openai/v1',
        'api_key' => 'gsk_dummy_key',
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

    $enhancedContent = 'Mengembangkan arsitektur RESTful API berskala besar dan mengoptimalkan performa query database secara andal.';

    Http::fake([
        'https://api.groq.com/*' => Http::response([
            'choices' => [
                [
                    'message' => [
                        'content' => $enhancedContent,
                    ],
                ],
            ],
        ], 200),
    ]);

    $response = $this->actingAs($user)->postJson(route('ai.enhance-experience'), [
        'company' => 'PT Toko Teknologi',
        'position' => 'Backend Engineer',
        'location' => 'Jakarta (Remote)',
        'text' => 'Bikin REST API dan optimasi database.',
        'tone' => 'impactful',
    ]);

    $response->assertOk()
        ->assertJson([
            'status' => 'success',
            'data' => [
                'enhanced_text' => $enhancedContent,
                'original_text' => 'Bikin REST API dan optimasi database.',
                'provider_name' => 'Groq Cloud',
                'model_name' => 'Llama 3.3 70B',
            ],
        ]);
});

test('experience and education prompts contain strict context zero fabrication rules', function () {
    $agent = app(CvBuilderAgent::class);

    $expPrompt = $agent->buildExperiencePrompt([
        'position' => 'Software Engineer',
        'company' => 'PT Solusi Bangsa',
        'text' => 'Mengembangkan backend web.',
    ]);

    expect($expPrompt)->toContain('PRINSIP STRICT CONTEXT - ZERO FABRICATION')
        ->toContain('DILARANG KERAS mengarang atau menambahkan metrik kuantitatif palsu')
        ->toContain('FORMAT WAJIB "DESKRIPSI SAJA"');

    $eduPrompt = $agent->buildEducationPrompt([
        'institution' => 'Universitas Indonesia',
        'degree' => 'S1',
        'field_of_study' => 'Sistem Informasi',
        'text' => 'Fokus rekayasa perangkat lunak.',
    ]);

    expect($eduPrompt)->toContain('PRINSIP STRICT CONTEXT - ZERO FABRICATION')
        ->toContain('DILARANG KERAS mengarang penghargaan, beasiswa')
        ->toContain('FORMAT WAJIB "DESKRIPSI SAJA"');
});

test('user can enhance education description with active ai provider', function () {
    $user = User::factory()->create();
    UserProfile::create([
        'user_id' => $user->id,
        'full_name' => 'Budi Santoso',
    ]);

    $provider = AiProvider::create([
        'name' => 'Groq Cloud',
        'slug' => 'groq-test-edu',
        'driver' => 'openai-compatible',
        'base_url' => 'https://api.groq.com/openai/v1',
        'api_key' => 'gsk_dummy_key',
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

    $enhancedContent = 'Lulus predikat Cum Laude dengan fokus riset pada Artificial Intelligence dan Cloud Computing. Aktif sebagai koordinator asisten laboratorium komputer.';

    Http::fake([
        'https://api.groq.com/*' => Http::response([
            'choices' => [
                [
                    'message' => [
                        'content' => $enhancedContent,
                    ],
                ],
            ],
        ], 200),
    ]);

    $response = $this->actingAs($user)->postJson(route('ai.enhance-education'), [
        'institution' => 'Universitas Indonesia',
        'degree' => 'Sarjana 1 (S1)',
        'field_of_study' => 'Ilmu Komputer',
        'gpa' => '3.88 / 4.00',
        'text' => 'Lulus cumlaude asisten lab.',
    ]);

    $response->assertOk()
        ->assertJson([
            'status' => 'success',
            'data' => [
                'enhanced_text' => $enhancedContent,
                'original_text' => 'Lulus cumlaude asisten lab.',
                'provider_name' => 'Groq Cloud',
                'model_name' => 'Llama 3.3 70B',
            ],
        ]);
});

test('enhance summary returns error if no ai models are active', function () {
    $user = User::factory()->create();

    // Deactivate all models
    AiModel::query()->update(['is_active' => false]);

    $response = $this->actingAs($user)->postJson(route('ai.enhance-summary'), [
        'text' => 'Tolong buatkan summary.',
    ]);

    $response->assertStatus(422)
        ->assertJson([
            'status' => 'error',
        ]);
});

test('user can update profile experiences and educations with string description', function () {
    $user = User::factory()->create();
    $profile = UserProfile::create([
        'user_id' => $user->id,
        'full_name' => 'Budi Santoso',
    ]);

    $response = $this->actingAs($user)->patchJson(route('api.profile.update'), [
        'section' => 'experiences',
        'experiences' => [
            [
                'company' => 'PT Maju Mundur',
                'position' => 'Senior Developer',
                'location' => 'Bandung',
                'start_date' => '2023-01',
                'is_current' => true,
                'description' => 'Memimpin pengembangan arsitektur web berskala besar.',
            ],
        ],
    ]);

    $response->assertOk();
    expect($profile->experiences()->first()->description)->toBe('Memimpin pengembangan arsitektur web berskala besar.');

    $responseEdu = $this->actingAs($user)->patchJson(route('api.profile.update'), [
        'section' => 'educations',
        'educations' => [
            [
                'institution' => 'Institut Teknologi Bandung',
                'degree' => 'Sarjana 1 (S1)',
                'major' => 'Teknik Informatika',
                'start_date' => '2019-08',
                'end_date' => '2023-07',
                'gpa' => '3.90',
                'description' => 'Lulus dengan predikat Cum Laude dan penghargaan skripsi terbaik.',
            ],
        ],
    ]);

    $responseEdu->assertOk();
    expect($profile->educations()->first()->description)->toBe('Lulus dengan predikat Cum Laude dan penghargaan skripsi terbaik.');
});
