<?php

namespace App\Services;

use App\Models\AiModel;
use App\Models\AiProvider;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Laravel\Ai\Ai;
use Laravel\Ai\Contracts\Agent;
use Throwable;

use function Laravel\Ai\agent;

class AiService
{
    /**
     * Get all active models ordered by priority.
     *
     * @return Collection<int, AiModel>
     */
    public function getActiveModels(): Collection
    {
        return AiModel::with('provider')
            ->whereHas('provider', function ($query) {
                $query->where('is_active', true);
            })
            ->where('is_active', true)
            ->orderedByPriority()
            ->get();
    }

    /**
     * Generate text using the prioritized fallback chain.
     *
     * @param  string  $prompt  The user prompt.
     * @param  array{system?: string, temperature?: float, max_tokens?: int}  $options
     * @return array{
     *     content: string,
     *     provider_id: int,
     *     provider_name: string,
     *     model_id: string,
     *     model_name: string,
     *     latency_ms: int,
     *     fallback_occurred: bool,
     *     attempts: array<int, array{provider: string, model: string, error: string}>
     * }
     *
     * @throws \RuntimeException
     */
    public function generateText(string $prompt, array $options = []): array
    {
        $systemPrompt = $options['system'] ?? 'Kamu adalah asisten AI yang profesional dan ramah.';
        $agent = agent(instructions: $systemPrompt);

        return $this->generateWithAgent($agent, $prompt, $options);
    }

    /**
     * Generate text using a Laravel AI Agent through the prioritized fallback chain.
     *
     * @param  Agent  $agent  The Laravel AI Agent instance.
     * @param  string  $prompt  The user prompt.
     * @param  array{system?: string, temperature?: float, max_tokens?: int}  $options
     * @return array{
     *     content: string,
     *     provider_id: int,
     *     provider_name: string,
     *     model_id: string,
     *     model_name: string,
     *     latency_ms: int,
     *     fallback_occurred: bool,
     *     attempts: array<int, array{provider: string, model: string, error: string}>
     * }
     *
     * @throws \RuntimeException
     */
    public function generateWithAgent(Agent $agent, string $prompt, array $options = []): array
    {
        $models = $this->getActiveModels();

        if ($models->isEmpty()) {
            throw new \RuntimeException('Tidak ada AI Model aktif yang tersedia. Silakan aktifkan provider dan model di Panel Admin.');
        }

        $attempts = [];
        $fallbackOccurred = false;

        foreach ($models as $index => $model) {
            if ($index > 0) {
                $fallbackOccurred = true;
            }

            $startTime = microtime(true);
            try {
                $result = $this->callModelWithAgent($agent, $model, $prompt, $options);
                $latencyMs = (int) round((microtime(true) - $startTime) * 1000);

                return [
                    'content' => $result,
                    'provider_id' => $model->provider->id,
                    'provider_name' => $model->provider->name,
                    'model_id' => $model->model_id,
                    'model_name' => $model->name,
                    'latency_ms' => $latencyMs,
                    'fallback_occurred' => $fallbackOccurred,
                    'attempts' => $attempts,
                ];
            } catch (Throwable $e) {
                $latencyMs = (int) round((microtime(true) - $startTime) * 1000);
                $errorMessage = $e->getMessage();

                Log::warning("AI Provider [{$model->provider->name}] Model [{$model->name}] failed after {$latencyMs}ms: {$errorMessage}");

                $attempts[] = [
                    'provider' => $model->provider->name,
                    'model' => $model->name,
                    'error' => $errorMessage,
                    'latency_ms' => $latencyMs,
                ];
            }
        }

        $lastError = ! empty($attempts) ? end($attempts)['error'] : 'Unknown error';
        throw new \RuntimeException("Semua model AI dalam rantai fallback gagal dieksekusi. Error terakhir: {$lastError}");
    }

    /**
     * Test connection for a specific AI model.
     *
     * @return array{
     *     success: bool,
     *     latency_ms: int,
     *     provider: string,
     *     model: string,
     *     model_id: string,
     *     response?: string,
     *     error?: string
     * }
     */
    public function testConnection(AiModel $model, ?string $testPrompt = null): array
    {
        $prompt = $testPrompt ?: "Koneksi berhasil. Jawab hanya 'OK' jika kamu membaca ini.";
        $startTime = microtime(true);

        try {
            $response = $this->callModel($model, $prompt, [
                'system' => 'Kamu adalah asisten tes latency AI. Berikan respon singkat.',
                'max_tokens' => 50,
            ]);
            $latencyMs = (int) round((microtime(true) - $startTime) * 1000);

            return [
                'success' => true,
                'latency_ms' => $latencyMs,
                'provider' => $model->provider->name,
                'model' => $model->name,
                'model_id' => $model->model_id,
                'response' => trim($response),
            ];
        } catch (Throwable $e) {
            $latencyMs = (int) round((microtime(true) - $startTime) * 1000);

            return [
                'success' => false,
                'latency_ms' => $latencyMs,
                'provider' => $model->provider->name,
                'model' => $model->name,
                'model_id' => $model->model_id,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Execute a prompt on a specific model using a Laravel AI Agent or OpenAI compatible API.
     */
    protected function callModelWithAgent(Agent $agent, AiModel $model, string $prompt, array $options = []): string
    {
        $provider = $model->provider;

        if (empty($provider->base_url)) {
            throw new \InvalidArgumentException("Provider [{$provider->name}] belum memiliki Base URL API.");
        }

        // Check if API key is required (Ollama local may not need one)
        if ($provider->slug !== 'ollama' && empty($provider->api_key)) {
            throw new \InvalidArgumentException("Provider [{$provider->name}] belum memiliki API Key.");
        }

        $systemPrompt = method_exists($agent, 'instructions')
            ? $agent->instructions()
            : ($options['system'] ?? 'Kamu adalah asisten AI yang profesional dan ramah.');
        $temperature = $options['temperature'] ?? (float) $model->temperature;
        $maxTokens = $options['max_tokens'] ?? $model->max_tokens;

        // Register dynamic provider configuration into Laravel AI
        $runtimeProviderKey = 'dynamic_'.$provider->id.'_'.$provider->slug;

        Config::set("ai.providers.{$runtimeProviderKey}", [
            'driver' => 'openai-compatible',
            'url' => rtrim($provider->base_url, '/'),
            'key' => $provider->api_key ?: '',
            'headers' => $provider->custom_headers ?? [],
            'models' => [
                'text' => [
                    'default' => $model->model_id,
                ],
            ],
        ]);

        try {
            // Attempt execution via Laravel AI SDK Agent
            $response = $agent->prompt($prompt, provider: $runtimeProviderKey, model: $model->model_id);

            return (string) $response;
        } catch (Throwable $sdkException) {
            // Direct HTTP fallback for custom OpenAI-compatible endpoints if SDK driver encounters formatting differences
            return $this->callDirectHttp($provider, $model, $prompt, $systemPrompt, $temperature, $maxTokens, $sdkException);
        }
    }

    /**
     * Legacy wrapper for callModel.
     */
    protected function callModel(AiModel $model, string $prompt, array $options = []): string
    {
        $systemPrompt = $options['system'] ?? 'Kamu adalah asisten AI yang profesional dan ramah.';
        $agent = agent(instructions: $systemPrompt);

        return $this->callModelWithAgent($agent, $model, $prompt, $options);
    }

    /**
     * Direct HTTP call fallback to standard OpenAI-compatible `/chat/completions` endpoint.
     */
    protected function callDirectHttp(
        AiProvider $provider,
        AiModel $model,
        string $prompt,
        string $systemPrompt,
        float $temperature,
        ?int $maxTokens,
        Throwable $originalException
    ): string {
        $baseUrl = rtrim($provider->base_url, '/');
        $endpoint = str_ends_with($baseUrl, '/chat/completions')
            ? $baseUrl
            : (str_ends_with($baseUrl, '/v1') ? "{$baseUrl}/chat/completions" : "{$baseUrl}/v1/chat/completions");

        // If baseUrl already contains full path or custom host
        if (! str_contains($endpoint, 'chat/completions')) {
            $endpoint = "{$baseUrl}/chat/completions";
        }

        $headers = [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ];

        if (! empty($provider->api_key)) {
            $headers['Authorization'] = 'Bearer '.$provider->api_key;
        }

        if (! empty($provider->custom_headers) && is_array($provider->custom_headers)) {
            $headers = array_merge($headers, $provider->custom_headers);
        }

        $payload = [
            'model' => $model->model_id,
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $prompt],
            ],
            'temperature' => $temperature,
        ];

        if ($maxTokens) {
            $payload['max_tokens'] = $maxTokens;
        }

        $response = Http::withHeaders($headers)
            ->timeout(45)
            ->post($endpoint, $payload);

        if ($response->failed()) {
            $errorBody = $response->json('error.message')
                ?? $response->json('message')
                ?? $response->body();

            throw new \RuntimeException(
                "HTTP {$response->status()}: ".(is_string($errorBody) ? substr($errorBody, 0, 300) : json_encode($errorBody)),
                $response->status(),
                $originalException
            );
        }

        $content = $response->json('choices.0.message.content');

        if ($content === null) {
            throw new \RuntimeException('Respon dari provider tidak memiliki atribut choices[0].message.content.', 0, $originalException);
        }

        return (string) $content;
    }
}
