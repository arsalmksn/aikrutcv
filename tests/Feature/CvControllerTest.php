<?php

use App\Models\Cv;
use App\Models\User;

test('guests are redirected to the login page from cv builder', function () {
    $response = $this->get(route('cv.builder'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can access the cv builder', function () {
    $user = User::factory()->create(['name' => 'Arsa Aji', 'email' => 'arsa@example.com']);
    $this->actingAs($user);

    $response = $this->get(route('cv.builder'));
    $response->assertOk();

    $this->assertDatabaseHas('cvs', [
        'user_id' => $user->id,
    ]);

    $this->assertDatabaseHas('cv_contacts', [
        'first_name' => 'Arsa',
        'last_name' => 'Aji',
    ]);
});

test('authenticated users can auto-save contact information', function () {
    $user = User::factory()->create();
    $cv = Cv::factory()->for($user)->create();

    $this->actingAs($user);

    $response = $this->postJson(route('cv.contact.update', $cv), [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'desired_job_title' => 'Senior Laravel Developer',
        'phone' => '+628123456789',
        'email' => 'john@example.com',
        'address' => 'Jl. Sudirman No. 12',
        'city' => 'Jakarta',
        'linkedin_url' => 'https://linkedin.com/in/johndoe',
        'website_url' => 'https://johndoe.dev',
    ]);

    $response->assertOk();
    $response->assertJsonPath('status', 'success');

    $this->assertDatabaseHas('cv_contacts', [
        'cv_id' => $cv->id,
        'first_name' => 'John',
        'last_name' => 'Doe',
        'desired_job_title' => 'Senior Laravel Developer',
        'phone' => '+628123456789',
        'email' => 'john@example.com',
        'city' => 'Jakarta',
    ]);
});

test('users cannot update contact info of another users cv', function () {
    $owner = User::factory()->create();
    $attacker = User::factory()->create();
    $cv = Cv::factory()->for($owner)->create();

    $this->actingAs($attacker);

    $response = $this->postJson(route('cv.contact.update', $cv), [
        'first_name' => 'Hacker',
    ]);

    $response->assertForbidden();
});
