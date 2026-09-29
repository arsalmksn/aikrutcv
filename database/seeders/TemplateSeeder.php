<?php

namespace Database\Seeders;

use App\Models\Template;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Modern Minimalist',
                'category' => 'Modern',
                'is_active' => true,
                'file_path' => 'cv-templates/template-hendra.html',
            ],
            [
                'name' => 'Classic Professional',
                'category' => 'Classic',
                'is_active' => true,
                'file_path' => 'cv-templates/template-ayu.html',
            ],
        ];

        foreach ($templates as $template) {
            Template::updateOrCreate(
                ['name' => $template['name']],
                $template
            );
        }

        // Hapus template seeder dummy yang view blade-nya belum dibuat
        Template::whereNotIn('name', array_column($templates, 'name'))->delete();
    }
}
