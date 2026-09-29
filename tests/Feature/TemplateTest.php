<?php

use App\Models\Template;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;

test('guests are redirected from templates management page', function () {
    $response = $this->get(route('templates.index'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can view templates management page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('templates.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('templates/index')
        ->has('templates')
        ->has('categories')
    );
});

test('authenticated users can store a new template with file upload', function () {
    $user = User::factory()->create();

    $file = UploadedFile::fake()->createWithContent('custom-resume.html', '<html><body>Test CV</body></html>');

    $response = $this->actingAs($user)->post(route('templates.store'), [
        'name' => 'Custom Executive Template',
        'category' => 'Modern',
        'is_active' => true,
        'template_file' => $file,
    ]);

    $response->assertRedirect(route('templates.index'));
    $response->assertSessionHas('success');

    $template = Template::where('name', 'Custom Executive Template')->first();
    expect($template)->not->toBeNull()
        ->and($template->category)->toBe('Modern')
        ->and($template->is_active)->toBeTrue()
        ->and($template->file_path)->not->toBeNull();

    // Clean up created file in public/cv-templates
    if ($template->file_path && File::exists(public_path($template->file_path))) {
        File::delete(public_path($template->file_path));
    }
});

test('authenticated users can update an existing template', function () {
    $user = User::factory()->create();

    $template = Template::create([
        'name' => 'Template to Edit',
        'category' => 'ATS',
        'is_active' => true,
        'file_path' => 'cv-templates/old-template.html',
    ]);

    $newFile = UploadedFile::fake()->createWithContent('updated.html', '<html><body>Updated Template</body></html>');

    $response = $this->actingAs($user)->post(route('templates.update', $template), [
        'name' => 'Updated Template Name',
        'category' => 'Classic',
        'is_active' => false,
        'template_file' => $newFile,
    ]);

    $response->assertRedirect(route('templates.index'));
    $response->assertSessionHas('success');

    $template->refresh();
    expect($template->name)->toBe('Updated Template Name')
        ->and($template->category)->toBe('Classic')
        ->and($template->is_active)->toBeFalse();

    // Clean up
    if ($template->file_path && File::exists(public_path($template->file_path))) {
        File::delete(public_path($template->file_path));
    }
});

test('authenticated users can delete a template', function () {
    $user = User::factory()->create();

    $template = Template::create([
        'name' => 'Template to Delete',
        'category' => 'Sederhana',
        'is_active' => true,
        'file_path' => 'cv-templates/temp-delete-test.html',
    ]);

    // Create temporary file
    File::put(public_path('cv-templates/temp-delete-test.html'), '<html><body>To be deleted</body></html>');

    $response = $this->actingAs($user)->delete(route('templates.destroy', $template));

    $response->assertRedirect(route('templates.index'));
    $response->assertSessionHas('success');

    expect(Template::find($template->id))->toBeNull()
        ->and(File::exists(public_path('templates/temp-delete-test.html')))->toBeFalse();
});
