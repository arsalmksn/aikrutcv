<?php

use App\Models\User;

test('guest can access public api endpoint', function () {
    $response = $this->getJson('/api/v1/health');

    $response->assertOk()
        ->assertJson([
            'status' => 'ok',
            'message' => 'API is running normally.',
        ]);
});

test('guest cannot access authenticated api endpoint', function () {
    $response = $this->getJson('/api/v1/user');

    $response->assertUnauthorized()
        ->assertJson([
            'message' => 'Unauthenticated.',
        ]);
});

test('authenticated regular user can access authenticated api endpoint', function () {
    $user = User::factory()->create([
        'role' => 'user',
    ]);

    $response = $this->actingAs($user)->getJson('/api/v1/user');

    $response->assertOk()
        ->assertJsonPath('data.id', $user->id)
        ->assertJsonPath('data.email', $user->email);
});

test('guest cannot access admin api endpoint', function () {
    $response = $this->getJson('/api/v1/admin/stats');

    $response->assertUnauthorized();
});

test('regular user cannot access admin api endpoint and receives 403 forbidden', function () {
    $user = User::factory()->create([
        'role' => 'user',
    ]);

    $response = $this->actingAs($user)->getJson('/api/v1/admin/stats');

    $response->assertForbidden()
        ->assertJson([
            'message' => 'Forbidden. You do not have permission to access this resource.',
        ]);
});

test('admin user can access admin api endpoint', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->getJson('/api/v1/admin/stats');

    $response->assertOk()
        ->assertJsonStructure([
            'status',
            'data' => [
                'total_users',
                'total_cvs',
                'total_templates',
            ],
        ]);
});

test('user model role helper methods work correctly', function () {
    $user = User::factory()->create(['role' => 'user']);
    $admin = User::factory()->admin()->create();

    expect($user->isAdmin())->toBeFalse()
        ->and($user->hasRole('user'))->toBeTrue()
        ->and($user->hasRole('admin'))->toBeFalse()
        ->and($admin->isAdmin())->toBeTrue()
        ->and($admin->hasRole('admin'))->toBeTrue()
        ->and($admin->hasRole(['admin', 'editor']))->toBeTrue()
        ->and($admin->hasRole('admin,editor'))->toBeTrue();
});
