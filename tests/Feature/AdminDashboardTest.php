<?php

use App\Models\Template;
use App\Models\User;

test('guests are redirected from admin dashboard to admin login', function () {
    $response = $this->get(route('admin.dashboard'));
    $response->assertRedirect(route('admin.login'));
});

test('guests can view admin login page', function () {
    $response = $this->get(route('admin.login'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('auth/login')
        ->where('isAdminLogin', true)
    );
});

test('regular users cannot access admin dashboard', function () {
    $user = User::factory()->create(['role' => 'user']);

    $response = $this->actingAs($user)->get(route('admin.dashboard'));
    $response->assertForbidden();
});

test('admin can view admin dashboard with statistics', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    User::factory()->count(3)->create(['role' => 'user']);
    Template::factory()->count(2)->create(['is_active' => true]);

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/dashboard')
        ->has('stats')
        ->has('recentUsers')
        ->has('recentCvs')
    );
});
