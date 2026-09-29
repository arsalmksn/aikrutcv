<?php

namespace App\Http\Controllers;

use App\Models\Template;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TemplateController extends Controller
{
    /**
     * Display a listing of templates.
     */
    public function index(Request $request): Response
    {
        $templates = Template::withCount('cvs')
            ->orderBy('id', 'asc')
            ->get()
            ->map(function (Template $template) {
                $filePath = $template->file_path;

                // Auto-resolve known template files if null or disconnected
                if (! $filePath || ! File::exists(public_path($filePath))) {
                    if (Str::contains(strtolower($template->name), 'modern')) {
                        $candidate = 'cv-templates/template-hendra.html';
                    } elseif (Str::contains(strtolower($template->name), 'classic')) {
                        $candidate = 'cv-templates/template-ayu.html';
                    } else {
                        $candidate = 'cv-templates/'.Str::slug($template->name).'.html';
                    }

                    if (File::exists(public_path($candidate))) {
                        $filePath = $candidate;
                        $template->update(['file_path' => $candidate]);
                    }
                }

                $fullPath = $filePath ? public_path($filePath) : null;
                $fileExists = $fullPath ? File::exists($fullPath) : false;
                $fileSize = $fileExists ? File::size($fullPath) : null;

                return [
                    'id' => $template->id,
                    'name' => $template->name,
                    'category' => $template->category,
                    'is_active' => $template->is_active,
                    'file_path' => $filePath,
                    'file_url' => $filePath ? asset($filePath) : null,
                    'file_exists' => $fileExists,
                    'file_size_formatted' => $fileSize !== null ? $this->formatFileSize($fileSize) : null,
                    'cvs_count' => $template->cvs_count,
                    'created_at' => $template->created_at?->format('d M Y, H:i'),
                    'updated_at' => $template->updated_at?->format('d M Y, H:i'),
                ];
            });

        return Inertia::render('templates/index', [
            'templates' => $templates,
            'categories' => ['ATS', 'Modern', 'Classic', 'Sederhana', 'Profesional'],
        ]);
    }

    /**
     * Store a newly created template in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'is_active' => ['boolean'],
            'template_file' => ['required', 'file', 'mimes:html,htm,txt', 'max:5120'],
        ]);

        $file = $request->file('template_file');
        $fileName = Str::slug($validated['name']).'-'.time().'.'.$file->getClientOriginalExtension();
        $targetDir = public_path('cv-templates');

        if (! File::isDirectory($targetDir)) {
            File::makeDirectory($targetDir, 0755, true);
        }

        $file->move($targetDir, $fileName);
        $relativePath = 'cv-templates/'.$fileName;

        Template::create([
            'name' => $validated['name'],
            'category' => $validated['category'] ?? 'ATS',
            'is_active' => $request->boolean('is_active', true),
            'file_path' => $relativePath,
        ]);

        return redirect()->route('templates.index')->with('success', 'Template baru berhasil ditambahkan.');
    }

    /**
     * Update the specified template in storage.
     */
    public function update(Request $request, Template $template): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'is_active' => ['boolean'],
            'template_file' => ['nullable', 'file', 'mimes:html,htm,txt', 'max:5120'],
        ]);

        $filePath = $template->file_path;

        if ($request->hasFile('template_file')) {
            $file = $request->file('template_file');
            $fileName = Str::slug($validated['name']).'-'.time().'.'.$file->getClientOriginalExtension();
            $targetDir = public_path('cv-templates');

            if (! File::isDirectory($targetDir)) {
                File::makeDirectory($targetDir, 0755, true);
            }

            // Remove old uploaded file if in public/cv-templates and not shared default
            if ($filePath && Str::startsWith($filePath, 'cv-templates/') && File::exists(public_path($filePath))) {
                // Keep the default sample files untouched if reused, otherwise delete
                if (! in_array(basename($filePath), ['template-hendra.html', 'template-ayu.html'], true)) {
                    File::delete(public_path($filePath));
                }
            }

            $file->move($targetDir, $fileName);
            $filePath = 'cv-templates/'.$fileName;
        }

        $template->update([
            'name' => $validated['name'],
            'category' => $validated['category'] ?? $template->category,
            'is_active' => $request->boolean('is_active'),
            'file_path' => $filePath,
        ]);

        return redirect()->route('templates.index')->with('success', 'Template berhasil diperbarui.');
    }

    /**
     * Remove the specified template from storage.
     */
    public function destroy(Template $template): RedirectResponse
    {
        $filePath = $template->file_path;

        if ($filePath && Str::startsWith($filePath, 'cv-templates/') && File::exists(public_path($filePath))) {
            if (! in_array(basename($filePath), ['template-hendra.html', 'template-ayu.html'], true)) {
                File::delete(public_path($filePath));
            }
        }

        $template->delete();

        return redirect()->route('templates.index')->with('success', 'Template berhasil dihapus.');
    }

    /**
     * Format bytes into human readable format.
     */
    private function formatFileSize(int $bytes): string
    {
        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2).' MB';
        }

        if ($bytes >= 1024) {
            return number_format($bytes / 1024, 1).' KB';
        }

        return $bytes.' B';
    }
}
