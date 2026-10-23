<?php

use App\Models\User;
use Laravel\Socialite\Contracts\Provider;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

test('redirects to google oauth url for unauthenticated user', function () {
    $response = $this->get(route('auth.google.redirect'));

    $response->assertRedirect();
    expect($response->headers->get('Location'))->toContain('accounts.google.com');
});

test('redirects authenticated user away from google redirect endpoint', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('auth.google.redirect'));

    $response->assertRedirect(route('dashboard'));
});

test('handles google oauth cancellation or error gracefully', function () {
    $provider = Mockery::mock(Provider::class);
    $provider->shouldReceive('user')->andThrow(new Exception('OAuth access denied'));

    Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect(route('login'));
    $response->assertSessionHas('status');
    $this->assertGuest();
});

test('registers new user and creates profile from google callback', function () {
    $googleUser = Mockery::mock(SocialiteUser::class);
    $googleUser->shouldReceive('getId')->andReturn('google-uid-999');
    $googleUser->shouldReceive('getName')->andReturn('Budi Santoso');
    $googleUser->shouldReceive('getEmail')->andReturn('budi.santoso@example.com');
    $googleUser->shouldReceive('getAvatar')->andReturn('https://lh3.googleusercontent.com/a/budi.jpg');

    $provider = Mockery::mock(Provider::class);
    $provider->shouldReceive('user')->andReturn($googleUser);

    Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect(route('dashboard'));

    $this->assertAuthenticated();

    $user = User::where('email', 'budi.santoso@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->google_id)->toBe('google-uid-999');
    expect($user->name)->toBe('Budi Santoso');
    expect($user->avatar)->toBe('https://lh3.googleusercontent.com/a/budi.jpg');
    expect($user->email_verified_at)->not->toBeNull();
    expect($user->hasPassword())->toBeFalse();

    // Verify initial profile was created
    expect($user->profile)->not->toBeNull();
    expect($user->profile->full_name)->toBe('Budi Santoso');
    expect($user->profile->email)->toBe('budi.santoso@example.com');
});

test('links google account to existing user with matching email', function () {
    $existingUser = User::factory()->create([
        'email' => 'existing@example.com',
        'name' => 'Existing User',
        'google_id' => null,
    ]);

    $googleUser = Mockery::mock(SocialiteUser::class);
    $googleUser->shouldReceive('getId')->andReturn('google-uid-existing');
    $googleUser->shouldReceive('getName')->andReturn('Existing User Google');
    $googleUser->shouldReceive('getEmail')->andReturn('existing@example.com');
    $googleUser->shouldReceive('getAvatar')->andReturn('https://lh3.googleusercontent.com/a/existing.jpg');

    $provider = Mockery::mock(Provider::class);
    $provider->shouldReceive('user')->andReturn($googleUser);

    Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect(route('dashboard'));
    $this->assertAuthenticatedAs($existingUser);

    $existingUser->refresh();
    expect($existingUser->google_id)->toBe('google-uid-existing');
    expect($existingUser->avatar)->toBe('https://lh3.googleusercontent.com/a/existing.jpg');
});

test('blocks admin user from logging in via google and redirects to admin login', function () {
    $admin = User::factory()->admin()->create([
        'email' => 'admin@example.com',
    ]);

    $googleUser = Mockery::mock(SocialiteUser::class);
    $googleUser->shouldReceive('getId')->andReturn('google-uid-admin');
    $googleUser->shouldReceive('getName')->andReturn('Admin User');
    $googleUser->shouldReceive('getEmail')->andReturn('admin@example.com');
    $googleUser->shouldReceive('getAvatar')->andReturn(null);

    $provider = Mockery::mock(Provider::class);
    $provider->shouldReceive('user')->andReturn($googleUser);

    Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect(route('admin.login', ['email' => 'admin@example.com']));
    $response->assertSessionHas('status');
    $this->assertGuest();
});

test('google user without password can set a password without current_password', function () {
    $googleUser = User::factory()->google()->create();

    $response = $this->actingAs($googleUser)->put(route('user-password.update'), [
        'password' => 'NewSecurePassword123!',
        'password_confirmation' => 'NewSecurePassword123!',
    ]);

    $response->assertRedirect();
    $googleUser->refresh();
    expect($googleUser->hasPassword())->toBeTrue();
});
