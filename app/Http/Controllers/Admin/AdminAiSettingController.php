<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiModel;
use App\Models\AiProvider;
use App\Services\AiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminAiSettingController extends Controller
{
    /**
     * Display the AI configuration page with providers, models, and fallback chain.
     */
    public function index(): Response
    {
        $providers = AiProvider::query()
            ->with(['models' => function ($query): void {
                $query->orderBy('priority', 'asc')->orderBy('id', 'asc');
            }])
            ->latest('id')
            ->get()
            ->map(fn (AiProvider $provider): array => [
                'id' => $provider->id,
                'name' => $provider->name,
                'slug' => $provider->slug,
                'driver' => $provider->driver,
                'base_url' => $provider->base_url,
                'has_api_key' => $provider->has_api_key,
                'masked_api_key' => $provider->masked_api_key,
                'custom_headers' => $provider->custom_headers,
                'is_active' => $provider->is_active,
                'models_count' => $provider->models->count(),
                'active_models_count' => $provider->models->where('is_active', true)->count(),
                'models' => $provider->models->map(fn (AiModel $m): array => [
                    'id' => $m->id,
                    'ai_provider_id' => $m->ai_provider_id,
                    'name' => $m->name,
                    'model_id' => $m->model_id,
                    'priority' => $m->priority,
                    'is_active' => $m->is_active,
                    'is_default' => $m->is_default,
                    'max_tokens' => $m->max_tokens,
                    'temperature' => (float) $m->temperature,
                ]),
            ]);

        // Flat fallback chain ordered by priority
        $fallbackChain = AiModel::query()
            ->with('provider:id,name,slug,driver,is_active,base_url')
            ->orderedByPriority()
            ->get()
            ->map(fn (AiModel $m): array => [
                'id' => $m->id,
                'name' => $m->name,
                'model_id' => $m->model_id,
                'priority' => $m->priority,
                'is_active' => $m->is_active,
                'is_default' => $m->is_default,
                'temperature' => (float) $m->temperature,
                'provider' => [
                    'id' => $m->provider->id,
                    'name' => $m->provider->name,
                    'slug' => $m->provider->slug,
                    'is_active' => $m->provider->is_active,
                ],
            ]);

        return Inertia::render('admin/ai/index', [
            'providers' => $providers,
            'fallbackChain' => $fallbackChain,
            'presetDrivers' => [
                ['value' => 'openai-compatible', 'label' => 'OpenAI-Compatible (Custom / Any Endpoint)'],
                ['value' => 'groq', 'label' => 'Groq Cloud'],
                ['value' => 'deepseek', 'label' => 'DeepSeek Official'],
                ['value' => 'gemini', 'label' => 'Google Gemini'],
                ['value' => 'openai', 'label' => 'OpenAI Official'],
                ['value' => 'ollama', 'label' => 'Ollama (Local / Self-Hosted)'],
                ['value' => 'anthropic', 'label' => 'Anthropic Claude'],
                ['value' => 'openrouter', 'label' => 'OpenRouter'],
            ],
        ]);
    }

    /**
     * Store a newly created AI provider.
     */
    public function storeProvider(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['nullable', 'string', 'max:100', 'unique:ai_providers,slug'],
            'driver' => ['required', 'string', 'max:50'],
            'base_url' => ['required', 'url', 'max:255'],
            'api_key' => ['nullable', 'string', 'max:1000'],
            'custom_headers' => ['nullable', 'array'],
            'is_active' => ['boolean'],
        ]);

        $validated['slug'] = ! empty($validated['slug'])
            ? Str::slug($validated['slug'])
            : Str::slug($validated['name']).'-'.Str::random(4);

        // Ensure unique slug
        $originalSlug = $validated['slug'];
        $count = 1;
        while (AiProvider::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = "{$originalSlug}-{$count}";
            $count++;
        }

        $validated['is_active'] = $request->boolean('is_active', true);

        AiProvider::create($validated);

        return back()->with('success', 'Provider AI baru berhasil ditambahkan.');
    }

    /**
     * Update the specified AI provider.
     */
    public function updateProvider(Request $request, AiProvider $provider): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['required', 'string', 'max:100', Rule::unique('ai_providers', 'slug')->ignore($provider->id)],
            'driver' => ['required', 'string', 'max:50'],
            'base_url' => ['required', 'url', 'max:255'],
            'api_key' => ['nullable', 'string', 'max:1000'],
            'custom_headers' => ['nullable', 'array'],
            'is_active' => ['boolean'],
        ]);

        $validated['slug'] = Str::slug($validated['slug']);
        $validated['is_active'] = $request->boolean('is_active');

        // Keep current API key if empty in update payload
        if (empty($validated['api_key'])) {
            unset($validated['api_key']);
        }

        $provider->update($validated);

        return back()->with('success', "Provider [{$provider->name}] berhasil diperbarui.");
    }

    /**
     * Remove the specified AI provider.
     */
    public function destroyProvider(AiProvider $provider): RedirectResponse
    {
        $name = $provider->name;
        $provider->delete();

        return back()->with('success', "Provider [{$name}] beserta modelnya berhasil dihapus.");
    }

    /**
     * Store a new model for a provider.
     */
    public function storeModel(Request $request, AiProvider $provider): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'model_id' => ['required', 'string', 'max:150'],
            'priority' => ['required', 'integer', 'min:1', 'max:9999'],
            'is_active' => ['boolean'],
            'is_default' => ['boolean'],
            'max_tokens' => ['nullable', 'integer', 'min:1', 'max:128000'],
            'temperature' => ['required', 'numeric', 'min:0', 'max:2'],
        ]);

        $validated['ai_provider_id'] = $provider->id;
        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['is_default'] = $request->boolean('is_default', false);

        if ($validated['is_default']) {
            AiModel::where('is_default', true)->update(['is_default' => false]);
        }

        AiModel::create($validated);

        return back()->with('success', "Model [{$validated['name']}] berhasil ditambahkan ke {$provider->name}.");
    }

    /**
     * Update a model.
     */
    public function updateModel(Request $request, AiModel $model): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'model_id' => ['required', 'string', 'max:150'],
            'priority' => ['required', 'integer', 'min:1', 'max:9999'],
            'is_active' => ['boolean'],
            'is_default' => ['boolean'],
            'max_tokens' => ['nullable', 'integer', 'min:1', 'max:128000'],
            'temperature' => ['required', 'numeric', 'min:0', 'max:2'],
        ]);

        $validated['is_active'] = $request->boolean('is_active');
        $validated['is_default'] = $request->boolean('is_default');

        if ($validated['is_default']) {
            AiModel::where('id', '!=', $model->id)
                ->where('is_default', true)
                ->update(['is_default' => false]);
        }

        $model->update($validated);

        return back()->with('success', "Model [{$model->name}] berhasil diperbarui.");
    }

    /**
     * Remove a model.
     */
    public function destroyModel(AiModel $model): RedirectResponse
    {
        $name = $model->name;
        $model->delete();

        return back()->with('success', "Model [{$name}] berhasil dihapus.");
    }

    /**
     * Update priorities for multiple models (e.g. from priority chain manager).
     */
    public function reorderPriorities(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'priorities' => ['required', 'array'],
            'priorities.*.id' => ['required', 'integer', 'exists:ai_models,id'],
            'priorities.*.priority' => ['required', 'integer', 'min:1'],
        ]);

        foreach ($validated['priorities'] as $item) {
            AiModel::where('id', $item['id'])->update(['priority' => $item['priority']]);
        }

        return back()->with('success', 'Urutan prioritas fallback berhasil diperbarui.');
    }

    /**
     * Test connection to a specific model.
     */
    public function testModel(Request $request, AiModel $model, AiService $aiService): JsonResponse
    {
        $model->load('provider');
        $prompt = $request->input('prompt');

        $result = $aiService->testConnection($model, $prompt);

        return response()->json($result);
    }
}
