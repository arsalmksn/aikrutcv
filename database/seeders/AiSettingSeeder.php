<?php

namespace Database\Seeders;

use App\Models\AiModel;
use App\Models\AiProvider;
use Illuminate\Database\Seeder;

class AiSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $providers = [
            [
                'name' => 'Groq Cloud',
                'slug' => 'groq',
                'driver' => 'openai-compatible',
                'base_url' => 'https://api.groq.com/openai/v1',
                'api_key' => env('GROQ_API_KEY', ''),
                'is_active' => true,
                'models' => [
                    [
                        'name' => 'Llama 3.3 70B Versatile',
                        'model_id' => 'llama-3.3-70b-versatile',
                        'priority' => 1,
                        'is_active' => true,
                        'is_default' => true,
                        'max_tokens' => 4096,
                        'temperature' => 0.7,
                    ],
                    [
                        'name' => 'Mixtral 8x7B 32k',
                        'model_id' => 'mixtral-8x7b-32768',
                        'priority' => 4,
                        'is_active' => false,
                        'is_default' => false,
                        'max_tokens' => 4096,
                        'temperature' => 0.7,
                    ],
                ],
            ],
            [
                'name' => 'Google Gemini',
                'slug' => 'gemini',
                'driver' => 'openai-compatible',
                'base_url' => 'https://generativelanguage.googleapis.com/v1beta/openai/',
                'api_key' => env('GEMINI_API_KEY', ''),
                'is_active' => true,
                'models' => [
                    [
                        'name' => 'Gemini 1.5 Flash',
                        'model_id' => 'gemini-1.5-flash',
                        'priority' => 2,
                        'is_active' => true,
                        'is_default' => false,
                        'max_tokens' => 4096,
                        'temperature' => 0.7,
                    ],
                    [
                        'name' => 'Gemini 1.5 Pro',
                        'model_id' => 'gemini-1.5-pro',
                        'priority' => 5,
                        'is_active' => false,
                        'is_default' => false,
                        'max_tokens' => 8192,
                        'temperature' => 0.7,
                    ],
                ],
            ],
            [
                'name' => 'DeepSeek',
                'slug' => 'deepseek',
                'driver' => 'openai-compatible',
                'base_url' => 'https://api.deepseek.com/v1',
                'api_key' => env('DEEPSEEK_API_KEY', ''),
                'is_active' => true,
                'models' => [
                    [
                        'name' => 'DeepSeek V3 (Chat)',
                        'model_id' => 'deepseek-chat',
                        'priority' => 3,
                        'is_active' => true,
                        'is_default' => false,
                        'max_tokens' => 4096,
                        'temperature' => 0.7,
                    ],
                ],
            ],
            [
                'name' => 'OpenAI Official',
                'slug' => 'openai',
                'driver' => 'openai-compatible',
                'base_url' => 'https://api.openai.com/v1',
                'api_key' => env('OPENAI_API_KEY', ''),
                'is_active' => true,
                'models' => [
                    [
                        'name' => 'GPT-4o Mini',
                        'model_id' => 'gpt-4o-mini',
                        'priority' => 6,
                        'is_active' => true,
                        'is_default' => false,
                        'max_tokens' => 4096,
                        'temperature' => 0.7,
                    ],
                ],
            ],
            [
                'name' => 'Ollama Local / Self-Hosted',
                'slug' => 'ollama',
                'driver' => 'openai-compatible',
                'base_url' => 'http://localhost:11434/v1',
                'api_key' => null,
                'is_active' => false,
                'models' => [
                    [
                        'name' => 'Llama 3.2 Local',
                        'model_id' => 'llama3.2',
                        'priority' => 7,
                        'is_active' => false,
                        'is_default' => false,
                        'max_tokens' => 2048,
                        'temperature' => 0.7,
                    ],
                ],
            ],
        ];

        foreach ($providers as $providerData) {
            $models = $providerData['models'];
            unset($providerData['models']);

            $provider = AiProvider::firstOrCreate(
                ['slug' => $providerData['slug']],
                $providerData
            );

            foreach ($models as $modelData) {
                AiModel::firstOrCreate(
                    [
                        'ai_provider_id' => $provider->id,
                        'model_id' => $modelData['model_id'],
                    ],
                    $modelData
                );
            }
        }
    }
}
