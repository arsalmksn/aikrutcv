<?php

use App\Models\Cv;
use App\Models\CvContact;
use App\Models\CvEducation;
use App\Models\CvExperience;
use App\Models\Template;
use App\Models\User;
use Carbon\CarbonInterface;

test('cv belongs to a user and has many cvs on user model', function () {
    $user = User::factory()->create();
    $cv = Cv::factory()->for($user)->create([
        'title' => 'Software Engineer Resume',
    ]);

    expect($cv->user->id)->toBe($user->id);
    expect($user->cvs)->toHaveCount(1);
    expect($user->cvs->first()->title)->toBe('Software Engineer Resume');
});

test('cv can optionally belong to a template', function () {
    $template = Template::factory()->create(['name' => 'Modern Clean']);
    $cv = Cv::factory()->for($template)->create();

    expect($cv->template->id)->toBe($template->id);
    expect($template->cvs)->toHaveCount(1);
});

test('cv has one contact and contact belongs to cv', function () {
    $cv = Cv::factory()->create();
    $contact = CvContact::factory()->for($cv)->create([
        'first_name' => 'John',
        'last_name' => 'Doe',
        'desired_job_title' => 'Senior Backend Developer',
        'email' => 'john.doe@example.com',
        'phone' => '+628123456789',
        'address' => 'Jakarta, Indonesia',
    ]);

    expect($cv->contact)->not->toBeNull();
    expect($cv->contact->id)->toBe($contact->id);
    expect($contact->cv->id)->toBe($cv->id);
    expect($contact->first_name)->toBe('John');
    expect($contact->email)->toBe('john.doe@example.com');
});

test('deleting a cv cascades and deletes its contact', function () {
    $cv = Cv::factory()->create();
    $contact = CvContact::factory()->for($cv)->create();

    $this->assertDatabaseHas('cv_contacts', ['id' => $contact->id]);

    $cv->delete();

    $this->assertDatabaseMissing('cvs', ['id' => $cv->id]);
    $this->assertDatabaseMissing('cv_contacts', ['id' => $contact->id]);
});

test('deleting a user cascades and deletes their cvs and contacts', function () {
    $user = User::factory()->create();
    $cv = Cv::factory()->for($user)->create();
    $contact = CvContact::factory()->for($cv)->create();

    $user->delete();

    $this->assertDatabaseMissing('users', ['id' => $user->id]);
    $this->assertDatabaseMissing('cvs', ['id' => $cv->id]);
    $this->assertDatabaseMissing('cv_contacts', ['id' => $contact->id]);
});

test('deleting a template sets template_id to null on cv', function () {
    $template = Template::factory()->create();
    $cv = Cv::factory()->for($template)->create();

    expect($cv->template_id)->toBe($template->id);

    $template->delete();
    $cv->refresh();

    expect($cv->template_id)->toBeNull();
});

test('cv has many experiences ordered by sort_order ascending', function () {
    $cv = Cv::factory()->create();

    $exp2 = CvExperience::factory()->for($cv)->create([
        'company_name' => 'Company Beta',
        'sort_order' => 2,
    ]);
    $exp0 = CvExperience::factory()->for($cv)->create([
        'company_name' => 'Company Alpha',
        'sort_order' => 0,
    ]);
    $exp1 = CvExperience::factory()->for($cv)->create([
        'company_name' => 'Company Gamma',
        'sort_order' => 1,
    ]);

    $experiences = $cv->experiences;

    expect($experiences)->toHaveCount(3);
    expect($experiences->pluck('sort_order')->all())->toBe([0, 1, 2]);
    expect($experiences->first()->company_name)->toBe('Company Alpha');
    expect($exp0->cv->id)->toBe($cv->id);
});

test('cv experience casts is_current to boolean and sort_order to integer and dates to carbon', function () {
    $cv = Cv::factory()->create();
    $experience = CvExperience::factory()->for($cv)->create([
        'is_current' => 1,
        'sort_order' => '3',
        'start_date' => '2023-01-15',
        'end_date' => '2024-06-30',
    ]);

    expect($experience->is_current)->toBeTrue();
    expect($experience->sort_order)->toBe(3);
    expect($experience->start_date)->toBeInstanceOf(CarbonInterface::class);
    expect($experience->end_date)->toBeInstanceOf(CarbonInterface::class);
    expect($experience->start_date->format('Y-m-d'))->toBe('2023-01-15');
});

test('cv experience factory current state sets is_current true and end_date null', function () {
    $experience = CvExperience::factory()->current()->create();

    expect($experience->is_current)->toBeTrue();
    expect($experience->end_date)->toBeNull();
});

test('deleting a cv cascades and deletes its experiences', function () {
    $cv = Cv::factory()->create();
    $experience = CvExperience::factory()->for($cv)->create();

    $this->assertDatabaseHas('cv_experiences', ['id' => $experience->id]);

    $cv->delete();

    $this->assertDatabaseMissing('cvs', ['id' => $cv->id]);
    $this->assertDatabaseMissing('cv_experiences', ['id' => $experience->id]);
});

test('cv has many educations ordered by sort_order ascending', function () {
    $cv = Cv::factory()->create();

    $edu2 = CvEducation::factory()->for($cv)->create([
        'institution_name' => 'Universitas C',
        'sort_order' => 2,
    ]);
    $edu0 = CvEducation::factory()->for($cv)->create([
        'institution_name' => 'Universitas A',
        'sort_order' => 0,
    ]);
    $edu1 = CvEducation::factory()->for($cv)->create([
        'institution_name' => 'Universitas B',
        'sort_order' => 1,
    ]);

    $educations = $cv->educations;

    expect($educations)->toHaveCount(3);
    expect($educations->pluck('sort_order')->all())->toBe([0, 1, 2]);
    expect($educations->first()->institution_name)->toBe('Universitas A');
    expect($edu0->cv->id)->toBe($cv->id);
});

test('cv education casts is_current to boolean and sort_order to integer and dates to carbon', function () {
    $cv = Cv::factory()->create();
    $education = CvEducation::factory()->for($cv)->create([
        'is_current' => 1,
        'sort_order' => '4',
        'start_date' => '2020-08-01',
        'end_date' => '2024-07-31',
    ]);

    expect($education->is_current)->toBeTrue();
    expect($education->sort_order)->toBe(4);
    expect($education->start_date)->toBeInstanceOf(CarbonInterface::class);
    expect($education->end_date)->toBeInstanceOf(CarbonInterface::class);
    expect($education->start_date->format('Y-m-d'))->toBe('2020-08-01');
});

test('cv education factory current state sets is_current true and end_date null', function () {
    $education = CvEducation::factory()->current()->create();

    expect($education->is_current)->toBeTrue();
    expect($education->end_date)->toBeNull();
});

test('deleting a cv cascades and deletes its educations', function () {
    $cv = Cv::factory()->create();
    $education = CvEducation::factory()->for($cv)->create();

    $this->assertDatabaseHas('cv_educations', ['id' => $education->id]);

    $cv->delete();

    $this->assertDatabaseMissing('cvs', ['id' => $cv->id]);
    $this->assertDatabaseMissing('cv_educations', ['id' => $education->id]);
});
