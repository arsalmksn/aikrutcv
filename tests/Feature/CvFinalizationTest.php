<?php

use App\Models\Cv;
use App\Models\CvContact;
use App\Models\CvEducation;
use App\Models\CvExperience;
use App\Models\CvSkill;
use App\Models\CvSummary;
use App\Models\Template;
use App\Models\User;

test('cv isComplete helper returns true when all required sections are present and filled', function () {
    $user = User::factory()->create();
    $template = Template::factory()->create();
    $cv = Cv::factory()->for($user)->create([
        'template_id' => $template->id,
    ]);

    // Initially incomplete
    expect($cv->isComplete())->toBeFalse();

    CvContact::factory()->for($cv)->create([
        'first_name' => 'Budi',
        'email' => 'budi@example.com',
    ]);
    expect($cv->isComplete())->toBeFalse();

    CvExperience::factory()->for($cv)->create([
        'company_name' => 'Tech Corp',
        'position' => 'Developer',
    ]);
    expect($cv->isComplete())->toBeFalse();

    CvEducation::factory()->for($cv)->create([
        'institution_name' => 'Universitas Indonesia',
    ]);
    expect($cv->isComplete())->toBeFalse();

    CvSkill::factory()->for($cv)->create([
        'name' => 'Laravel',
    ]);
    expect($cv->isComplete())->toBeFalse();

    CvSummary::factory()->for($cv)->create([
        'content' => '<p>Experienced developer with passion for building scalable web apps.</p>',
    ]);

    // Now all 5 sections are satisfied
    expect($cv->isComplete())->toBeTrue();
    $checklist = $cv->completenessChecklist();
    expect($checklist['contact'])->toBeTrue();
    expect($checklist['experiences'])->toBeTrue();
    expect($checklist['educations'])->toBeTrue();
    expect($checklist['skills'])->toBeTrue();
    expect($checklist['summary'])->toBeTrue();
    expect($checklist['is_complete'])->toBeTrue();
});

test('cv isComplete returns false if summary contains only empty tags or whitespace', function () {
    $cv = Cv::factory()->create();
    CvContact::factory()->for($cv)->create(['first_name' => 'Budi', 'email' => 'budi@example.com']);
    CvExperience::factory()->for($cv)->create();
    CvEducation::factory()->for($cv)->create();
    CvSkill::factory()->for($cv)->create();
    CvSummary::factory()->for($cv)->create(['content' => '<p>   <br> </p>']);

    expect($cv->isComplete())->toBeFalse();
});

test('guest cannot finalize a cv and is redirected to login', function () {
    $cv = Cv::factory()->create();
    $template = Template::factory()->create();

    $response = $this->post(route('cv.finalize', $cv), [
        'title' => 'My Resume',
        'template_id' => $template->id,
        'is_published' => true,
    ]);

    $response->assertRedirect(route('login'));
});

test('authenticated user can finalize their own cv', function () {
    $user = User::factory()->create();
    $template = Template::factory()->create(['name' => 'Modern Template']);
    $cv = Cv::factory()->for($user)->create([
        'title' => 'Draft CV',
        'is_published' => false,
    ]);

    $this->actingAs($user);

    $response = $this->postJson(route('cv.finalize', $cv), [
        'title' => 'Senior Full Stack Developer CV',
        'template_id' => $template->id,
        'is_published' => true,
    ]);

    $response->assertOk();
    $response->assertJsonPath('status', 'success');
    $response->assertJsonPath('cv.title', 'Senior Full Stack Developer CV');
    $response->assertJsonPath('cv.template_id', $template->id);
    $response->assertJsonPath('cv.is_published', true);

    $this->assertDatabaseHas('cvs', [
        'id' => $cv->id,
        'user_id' => $user->id,
        'title' => 'Senior Full Stack Developer CV',
        'template_id' => $template->id,
        'is_published' => true,
    ]);
});

test('authenticated user can finalize via regular post redirect', function () {
    $user = User::factory()->create();
    $template = Template::factory()->create();
    $cv = Cv::factory()->for($user)->create();

    $this->actingAs($user);

    $response = $this->post(route('cv.finalize', $cv), [
        'title' => 'Published Resume',
        'template_id' => $template->id,
        'is_published' => false,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'CV berhasil difinalisasi.');

    $this->assertDatabaseHas('cvs', [
        'id' => $cv->id,
        'title' => 'Published Resume',
        'is_published' => false,
    ]);
});

test('user cannot finalize another users cv', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $template = Template::factory()->create();
    $cv = Cv::factory()->for($owner)->create([
        'title' => 'Original Title',
    ]);

    $this->actingAs($otherUser);

    $response = $this->postJson(route('cv.finalize', $cv), [
        'title' => 'Hacked Title',
        'template_id' => $template->id,
        'is_published' => true,
    ]);

    $response->assertForbidden();

    $this->assertDatabaseHas('cvs', [
        'id' => $cv->id,
        'title' => 'Original Title',
    ]);
});

test('cv finalization validation rules require title template and publication status', function () {
    $user = User::factory()->create();
    $cv = Cv::factory()->for($user)->create();

    $this->actingAs($user);

    $response = $this->postJson(route('cv.finalize', $cv), [
        'title' => '',
        'template_id' => 999999,
        'is_published' => 'not-a-boolean',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['title', 'template_id', 'is_published']);
});

test('authenticated user can download cv as pdf', function () {
    $user = User::factory()->create(['name' => 'Budi Utomo']);
    $template = Template::factory()->create(['name' => 'Modern Minimalist']);
    $cv = Cv::factory()->for($user)->create([
        'title' => 'Budi Resume',
        'template_id' => $template->id,
    ]);

    CvContact::factory()->for($cv)->create([
        'first_name' => 'Budi',
        'last_name' => 'Utomo',
        'email' => 'budi@example.com',
        'desired_job_title' => 'Software Engineer',
    ]);
    CvExperience::factory()->for($cv)->create([
        'company_name' => 'Acme Corp',
        'position' => 'Senior Developer',
    ]);
    CvEducation::factory()->for($cv)->create([
        'institution_name' => 'Universitas Indonesia',
    ]);
    CvSkill::factory()->for($cv)->create([
        'name' => 'Laravel',
    ]);
    CvSummary::factory()->for($cv)->create([
        'content' => '<p>Experienced backend engineer.</p>',
    ]);

    $this->actingAs($user);

    $response = $this->get(route('cv.download-pdf', $cv));

    $response->assertOk();
    expect($response->headers->get('content-type'))->toBe('application/pdf');
    expect($response->headers->get('content-disposition'))->toContain('attachment');
    expect($response->headers->get('content-disposition'))->toContain('budi-resume.pdf');
});

test('authenticated user can stream cv pdf when stream parameter is passed', function () {
    $user = User::factory()->create();
    $cv = Cv::factory()->for($user)->create(['title' => 'Stream Resume']);

    $this->actingAs($user);

    $response = $this->get(route('cv.download-pdf', ['cv' => $cv, 'stream' => 1]));

    $response->assertOk();
    expect($response->headers->get('content-type'))->toBe('application/pdf');
    expect($response->headers->get('content-disposition'))->toContain('inline');
});

test('user cannot download pdf of another users cv', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $cv = Cv::factory()->for($owner)->create();

    $this->actingAs($intruder);

    $response = $this->get(route('cv.download-pdf', $cv));

    $response->assertForbidden();
});

test('guest cannot download cv pdf and is redirected to login', function () {
    $cv = Cv::factory()->create();

    $response = $this->get(route('cv.download-pdf', $cv));

    $response->assertRedirect(route('login'));
});
