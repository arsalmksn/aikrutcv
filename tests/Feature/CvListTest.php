<?php

use App\Models\Cv;
use App\Models\User;

test('guests are redirected to the login page from cv index', function () {
    $response = $this->get(route('cv.index'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can access the cv index page and see their cvs', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $userCv = Cv::factory()->for($user)->create([
        'title' => 'My Super CV',
    ]);
    $otherUserCv = Cv::factory()->for($otherUser)->create([
        'title' => 'Other Person CV',
    ]);

    $this->actingAs($user);

    $response = $this->get(route('cv.index'));
    $response->assertOk();

    $response->assertInertia(fn ($page) => $page
        ->component('cv/index')
        ->has('cvs', 1)
        ->where('cvs.0.id', $userCv->id)
        ->where('cvs.0.title', 'My Super CV')
    );
});

test('authenticated users can update cv title', function () {
    $user = User::factory()->create();
    $cv = Cv::factory()->for($user)->create([
        'title' => 'Old Title',
    ]);

    $this->actingAs($user);

    $response = $this->patchJson(route('cv.title.update', $cv), [
        'title' => 'New Awesome Title',
    ]);

    $response->assertOk();
    $response->assertJsonPath('status', 'success');

    $this->assertDatabaseHas('cvs', [
        'id' => $cv->id,
        'title' => 'New Awesome Title',
    ]);
});

test('users cannot update title of another users cv', function () {
    $owner = User::factory()->create();
    $attacker = User::factory()->create();
    $cv = Cv::factory()->for($owner)->create([
        'title' => 'Owner CV',
    ]);

    $this->actingAs($attacker);

    $response = $this->patchJson(route('cv.title.update', $cv), [
        'title' => 'Hacked Title',
    ]);

    $response->assertForbidden();

    $this->assertDatabaseHas('cvs', [
        'id' => $cv->id,
        'title' => 'Owner CV',
    ]);
});

test('authenticated users can duplicate their cv', function () {
    $user = User::factory()->create();
    $cv = Cv::factory()->for($user)->create([
        'title' => 'Original CV',
    ]);

    $cv->contact()->create([
        'first_name' => 'John',
        'last_name' => 'Doe',
        'desired_job_title' => 'Engineer',
        'phone' => '123456',
        'email' => 'john@example.com',
    ]);

    $cv->experiences()->create([
        'company_name' => 'Tech Corp',
        'position' => 'Developer',
        'city' => 'Jakarta',
        'start_date' => '2023-01-01',
        'is_current' => true,
        'description' => 'Work details',
        'sort_order' => 0,
    ]);

    $this->actingAs($user);

    $response = $this->post(route('cv.duplicate', $cv));
    $response->assertRedirect(route('cv.index'));

    $this->assertDatabaseHas('cvs', [
        'user_id' => $user->id,
        'title' => 'Salinan - Original CV',
    ]);

    $newCv = Cv::where('title', 'Salinan - Original CV')->first();
    expect($newCv)->not->toBeNull();
    expect($newCv->contact)->not->toBeNull();
    expect($newCv->contact->first_name)->toBe('John');
    expect($newCv->experiences)->toHaveCount(1);
});

test('users cannot duplicate another users cv', function () {
    $owner = User::factory()->create();
    $attacker = User::factory()->create();
    $cv = Cv::factory()->for($owner)->create();

    $this->actingAs($attacker);

    $response = $this->post(route('cv.duplicate', $cv));
    $response->assertForbidden();
});

test('authenticated users can delete their cv', function () {
    $user = User::factory()->create();
    $cv = Cv::factory()->for($user)->create([
        'title' => 'CV to Delete',
    ]);

    $this->actingAs($user);

    $response = $this->delete(route('cv.destroy', $cv));
    $response->assertRedirect(route('cv.index'));

    $this->assertDatabaseMissing('cvs', [
        'id' => $cv->id,
    ]);
});

test('users cannot delete another users cv', function () {
    $owner = User::factory()->create();
    $attacker = User::factory()->create();
    $cv = Cv::factory()->for($owner)->create();

    $this->actingAs($attacker);

    $response = $this->delete(route('cv.destroy', $cv));
    $response->assertForbidden();

    $this->assertDatabaseHas('cvs', [
        'id' => $cv->id,
    ]);
});
