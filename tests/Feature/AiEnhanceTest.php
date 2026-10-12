<?php

use App\Models\AiModel;
use App\Models\AiProvider;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Http;

test('guests cannot access ai enhance endpoints', function () {
    $this->postJson(route('ai.enhance-summary'), ['text' => 'Halo'])
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
