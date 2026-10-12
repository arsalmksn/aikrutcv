<?php

namespace App\Http\Controllers;

use App\Ai\Agents\CvBuilderAgent;
use App\Services\AiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Throwable;

class AiEnhanceController extends Controller
{
    public function __construct(
        protected AiService $aiService,
        protected CvBuilderAgent $cvBuilderAgent
    ) {}

    /**
     * Check if AI enhancement is available based on active models.
     */
    public function status(): JsonResponse
    {
        $activeModels = $this->aiService->getActiveModels();

        return response()->json([
            'status' => 'success',
            'available' => $activeModels->isNotEmpty(),
            'active_models_count' => $activeModels->count(),
            'models' => $activeModels->map(fn ($m): array => [
                'name' => $m->name,
                'provider' => $m->provider->name,
            ]),
        ]);
    }

    /**
     * Enhance or generate "Tentang Saya" (Professional Summary) using the CvBuilderAgent.
     */
    public function enhanceSummary(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'text' => ['nullable', 'string', 'max:5000'],
            'tone' => ['nullable', 'string', Rule::in(['professional', 'concise', 'impactful', 'creative'])],
            'field_of_interest' => ['nullable', 'array'],
            'field_of_interest.*' => ['string'],
            'target_role' => ['nullable', 'string', 'max:150'],
            'custom_instruction' => ['nullable', 'string', 'max:500'],
        ]);

        $user = $request->user();
        $profile = $user?->profile;

        $userPrompt = $this->cvBuilderAgent->buildSummaryPrompt($validated, $profile, $user);

        try {
            $result = $this->aiService->generateWithAgent($this->cvBuilderAgent, $userPrompt, [
                'temperature' => 0.7,
                'max_tokens' => 400,
            ]);

            $enhanced = trim($result['content']);
            // Strip surrounding markdown code block or quotes if any
            $enhanced = preg_replace('/^```(?:markdown|text)?\s*|\s*```$/i', '', $enhanced);
            $enhanced = trim($enhanced, " \t\n\r\0\x0B\"'");

            return response()->json([
                'status' => 'success',
                'message' => 'Ringkasan berhasil disempurnakan oleh AI.',
                'data' => [
                    'enhanced_text' => $enhanced,
                    'original_text' => trim($validated['text'] ?? ''),
                    'provider_name' => $result['provider_name'],
                    'model_name' => $result['model_name'],
                    'latency_ms' => $result['latency_ms'],
                    'fallback_occurred' => $result['fallback_occurred'],
                ],
            ]);
        } catch (Throwable $e) {
            Log::warning('AI Enhance Summary failed: '.$e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
