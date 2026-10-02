<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('guests are redirected from admin users page', function () {
    $response = $this->get(route('admin.users.index'));
    $response->assertRedirect(route('admin.login'));
});

test('regular users cannot access admin users page', function () {
    $user = User::factory()->create(['role' => 'user']);

    $response = $this->actingAs($user)->get(route('admin.users.index'));
    $response->assertForbidden();
});

test('admin can view users list', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    User::factory()->count(5)->create(['role' => 'user']);

    $response = $this->actingAs($admin)->get(route('admin.users.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/users/index')
        ->has('users.data')
        ->has('filters')
        ->has('counts')
    );
});

test('admin can create a new user', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post(route('admin.users.store'), [
        'name' => 'Budi Santoso',
        'email' => 'budi@aikrutcv.com',
        'password' => 'password123',
        'role' => 'user',
    ]);

    $response->assertRedirect(route('admin.users.index'));
    $response->assertSessionHas('success');

    $created = User::where('email', 'budi@aikrutcv.com')->first();
    expect($created)->not->toBeNull()
        ->and($created->name)->toBe('Budi Santoso')
        ->and($created->role)->toBe('user')
        ->and(Hash::check('password123', $created->password))->toBeTrue();
});

test('admin can update user information and role', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create([
        'name' => 'Old Name',
        'email' => 'old@aikrutcv.com',
        'role' => 'user',
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.users.update', $user), [
        'name' => 'Updated Name',
        'email' => 'new@aikrutcv.com',
        'role' => 'admin',
    ]);

    $response->assertRedirect(route('admin.users.index'));
    $response->assertSessionHas('success');

    $user->refresh();
    expect($user->name)->toBe('Updated Name')
        ->and($user->email)->toBe('new@aikrutcv.com')
        ->and($user->role)->toBe('admin');
});

test('admin cannot demote their own role', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->patch(route('admin.users.update', $admin), [
        'name' => $admin->name,
        'email' => $admin->email,
        'role' => 'user',
    ]);

    $response->assertSessionHasErrors('role');
    $admin->refresh();
    expect($admin->role)->toBe('admin');
});

test('admin can reset another user password', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create(['password' => Hash::make('old-password')]);

    $response = $this->actingAs($admin)->patch(route('admin.users.reset-password', $user), [
        'password' => 'new-secret-password',
        'password_confirmation' => 'new-secret-password',
    ]);

    $response->assertRedirect(route('admin.users.index'));
    $response->assertSessionHas('success');

    $user->refresh();
    expect(Hash::check('new-secret-password', $user->password))->toBeTrue();
});

test('admin can delete a user', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create();

    $response = $this->actingAs($admin)->delete(route('admin.users.destroy', $user));

    $response->assertRedirect(route('admin.users.index'));
    $response->assertSessionHas('success');

    expect(User::find($user->id))->toBeNull();
});

test('admin cannot delete their own account', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->delete(route('admin.users.destroy', $admin));

    $response->assertSessionHasErrors('general');
    expect(User::find($admin->id))->not->toBeNull();
});
