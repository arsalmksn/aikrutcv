<?php

use App\Models\AiModel;
use App\Models\AiProvider;
use App\Models\User;
use App\Services\AiService;
use Illuminate\Support\Facades\Http;

test('guests are redirected from admin ai settings page', function () {
    $response = $this->get(route('admin.ai-settings.index'));
    $response->assertRedirect(route('admin.login'));
});

test('regular users cannot access admin ai settings page', function () {
    $user = User::factory()->create(['role' => 'user']);

    $response = $this->actingAs($user)->get(route('admin.ai-settings.index'));
    $response->assertForbidden();
});

test('admin can view ai settings page with providers and fallback chain', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->get(route('admin.ai-settings.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/ai/index')
        ->has('providers')
        ->has('fallbackChain')
        ->has('presetDrivers')
    );
});

test('admin can create a custom ai provider', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post(route('admin.ai-settings.providers.store'), [
        'name' => 'Custom Endpoint Ollama',
        'slug' => 'custom-ollama',
        'driver' => 'openai-compatible',
        'base_url' => 'https://ollama.mycompany.com/v1',
        'api_key' => 'secret-custom-key',
        'is_active' => true,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $provider = AiProvider::where('slug', 'custom-ollama')->first();
    expect($provider)->not->toBeNull()
        ->and($provider->name)->toBe('Custom Endpoint Ollama')
        ->and($provider->base_url)->toBe('https://ollama.mycompany.com/v1')
        ->and($provider->api_key)->toBe('secret-custom-key')
        ->and($provider->has_api_key)->toBeTrue();
});

test('admin can update an ai provider', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $provider = AiProvider::create([
        'name' => 'Test Provider',
        'slug' => 'test-provider',
        'driver' => 'openai-compatible',
        'base_url' => 'https://test.ai/v1',
        'api_key' => 'initial-key',
        'is_active' => true,
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.ai-settings.providers.update', $provider), [
        'name' => 'Updated Test Provider',
        'slug' => 'test-provider-updated',
        'driver' => 'openai-compatible',
        'base_url' => 'https://updated.ai/v1',
        'is_active' => false,
    ]);

    $response->assertRedirect();
    $provider->refresh();

    expect($provider->name)->toBe('Updated Test Provider')
        ->and($provider->slug)->toBe('test-provider-updated')
        ->and($provider->base_url)->toBe('https://updated.ai/v1')
        ->and($provider->is_active)->toBeFalse()
        // API key should be preserved if not provided in update
        ->and($provider->api_key)->toBe('initial-key');
});

test('admin can delete an ai provider and its models cascade', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $provider = AiProvider::create([
        'name' => 'Deletable Provider',
        'slug' => 'deletable',
        'driver' => 'openai-compatible',
        'base_url' => 'https://deletable.ai/v1',
        'api_key' => 'test-key',
        'is_active' => true,
    ]);

    $model = AiModel::create([
        'ai_provider_id' => $provider->id,
        'name' => 'Deletable Model',
        'model_id' => 'del-model',
        'priority' => 99,
        'is_active' => true,
    ]);

    $response = $this->actingAs($admin)->delete(route('admin.ai-settings.providers.destroy', $provider));
    $response->assertRedirect();

    expect(AiProvider::find($provider->id))->toBeNull()
        ->and(AiModel::find($model->id))->toBeNull();
});

test('admin can add a model to a provider', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $provider = AiProvider::create([
        'name' => 'Qwen Provider',
        'slug' => 'qwen-provider',
        'driver' => 'openai-compatible',
        'base_url' => 'https://qwen.ai/v1',
        'api_key' => 'qwen-key',
        'is_active' => true,
    ]);

    $response = $this->actingAs($admin)->post(route('admin.ai-settings.models.store', $provider), [
        'name' => 'Qwen 2.5 72B',
        'model_id' => 'qwen-2.5-72b-instruct',
        'priority' => 8,
        'temperature' => 0.5,
        'max_tokens' => 2048,
        'is_active' => true,
        'is_default' => false,
    ]);

    $response->assertRedirect();
    $created = AiModel::where('model_id', 'qwen-2.5-72b-instruct')->first();
    expect($created)->not->toBeNull()
        ->and($created->name)->toBe('Qwen 2.5 72B')
        ->and($created->ai_provider_id)->toBe($provider->id)
        ->and($created->priority)->toBe(8)
        ->and($created->temperature)->toBe(0.5);
});

test('admin can update priorities of models in bulk', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $provider = AiProvider::create([
        'name' => 'Bulk Test Provider',
        'slug' => 'bulk-test',
        'driver' => 'openai-compatible',
        'base_url' => 'https://bulk.ai/v1',
        'is_active' => true,
    ]);
    $model1 = AiModel::create([
        'ai_provider_id' => $provider->id,
        'name' => 'Model 1',
        'model_id' => 'm1',
        'priority' => 1,
        'is_active' => true,
    ]);
    $model2 = AiModel::create([
        'ai_provider_id' => $provider->id,
        'name' => 'Model 2',
        'model_id' => 'm2',
        'priority' => 2,
        'is_active' => true,
    ]);

    $response = $this->actingAs($admin)->post(route('admin.ai-settings.priorities.update'), [
        'priorities' => [
            ['id' => $model1->id, 'priority' => 10],
            ['id' => $model2->id, 'priority' => 20],
        ],
    ]);

    $response->assertRedirect();

    expect($model1->fresh()->priority)->toBe(10)
        ->and($model2->fresh()->priority)->toBe(20);
});

test('ai service executes fallback to secondary model when primary fails', function () {
    // Set up test providers
    $provider1 = AiProvider::create([
        'name' => 'Failing Primary Provider',
        'slug' => 'failing-primary',
        'driver' => 'openai-compatible',
        'base_url' => 'https://failing-api.com/v1',
        'api_key' => 'fail-key',
        'is_active' => true,
    ]);

    $model1 = AiModel::create([
        'ai_provider_id' => $provider1->id,
        'name' => 'Primary Model (Will Fail)',
        'model_id' => 'fail-model',
        'priority' => 1,
        'is_active' => true,
    ]);

    $provider2 = AiProvider::create([
        'name' => 'Healthy Secondary Provider',
        'slug' => 'healthy-secondary',
        'driver' => 'openai-compatible',
        'base_url' => 'https://healthy-api.com/v1',
        'api_key' => 'healthy-key',
        'is_active' => true,
    ]);

    $model2 = AiModel::create([
        'ai_provider_id' => $provider2->id,
        'name' => 'Secondary Model (Will Succeed)',
        'model_id' => 'succeed-model',
        'priority' => 2,
        'is_active' => true,
    ]);

    // Deactivate other models so our test chain is clean
    AiModel::whereNotIn('id', [$model1->id, $model2->id])->update(['is_active' => false]);

    // Fake HTTP requests
    Http::fake([
        'https://failing-api.com/*' => Http::response(['error' => ['message' => 'Rate limit exceeded (429)']], 429),
        'https://healthy-api.com/*' => Http::response([
            'choices' => [
                [
                    'message' => [
                        'content' => 'Halo dari secondary provider!',
                    ],
                ],
            ],
        ], 200),
    ]);

    $service = new AiService;
    $result = $service->generateText('Halo');

    expect($result['fallback_occurred'])->toBeTrue()
        ->and($result['content'])->toBe('Halo dari secondary provider!')
        ->and($result['provider_name'])->toBe('Healthy Secondary Provider')
        ->and($result['model_id'])->toBe('succeed-model')
        ->and($result['attempts'])->toHaveCount(1)
        ->and($result['attempts'][0]['provider'])->toBe('Failing Primary Provider');
});

test('test connection endpoint returns latency and response via json', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $provider = AiProvider::create([
        'name' => 'Ping Provider',
        'slug' => 'ping-provider',
        'driver' => 'openai-compatible',
        'base_url' => 'https://ping.ai/v1',
        'api_key' => 'ping-key',
        'is_active' => true,
    ]);

    $model = AiModel::create([
        'ai_provider_id' => $provider->id,
        'name' => 'Ping Model',
        'model_id' => 'ping-model-id',
        'priority' => 999,
        'is_active' => true,
    ]);

    Http::fake([
        'https://ping.ai/*' => Http::response([
            'choices' => [
                [
                    'message' => [
                        'content' => 'OK',
                    ],
                ],
            ],
        ], 200),
    ]);

    $response = $this->actingAs($admin)->postJson(route('admin.ai-settings.models.test', $model), [
        'prompt' => 'Ping test',
    ]);

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'provider' => 'Ping Provider',
            'model' => 'Ping Model',
            'response' => 'OK',
        ]);
});
