<?php

use App\Models\CareerCategory;
use App\Models\CareerRole;
use App\Models\CareerSubCategory;
use App\Models\User;

test('guest cannot access admin onboarding steps management', function () {
    $response = $this->get(route('admin.onboarding-steps.index'));

    $response->assertRedirect(route('admin.login'));
});

test('regular non-admin user is forbidden from admin onboarding steps management', function () {
    $user = User::factory()->create(['role' => 'user']);

    $response = $this->actingAs($user)->get(route('admin.onboarding-steps.index'));

    $response->assertForbidden();
});

test('admin can access onboarding steps management and receives categories data', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.onboarding-steps.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/onboarding/index')
        ->has('categories')
        ->has('stats')
        ->has('availableIcons')
    );
});

test('admin can create, update, and delete career category', function () {
    $admin = User::factory()->admin()->create();

    // Create Category
    $storeResponse = $this->actingAs($admin)->post(route('admin.onboarding-steps.categories.store'), [
        'name' => 'Kategori Baru AI & Robotika',
        'slug' => 'ai-robotika',
        'description' => 'Bidang robotika pintar dan automasi.',
        'icon' => 'Cpu',
        'is_active' => true,
    ]);

    $storeResponse->assertRedirect();
    $category = CareerCategory::where('slug', 'ai-robotika')->first();
    expect($category)->not->toBeNull();
    expect($category->name)->toBe('Kategori Baru AI & Robotika');

    // Update Category
    $updateResponse = $this->actingAs($admin)->patch(route('admin.onboarding-steps.categories.update', $category), [
        'name' => 'Kategori AI & Robotika Cerdas',
        'is_active' => false,
    ]);

    $updateResponse->assertRedirect();
    $category->refresh();
    expect($category->name)->toBe('Kategori AI & Robotika Cerdas');
    expect($category->is_active)->toBeFalse();

    // Delete Category
    $deleteResponse = $this->actingAs($admin)->delete(route('admin.onboarding-steps.categories.destroy', $category));

    $deleteResponse->assertRedirect();
    expect(CareerCategory::where('id', $category->id)->exists())->toBeFalse();
});

test('admin can create, update, and delete sub-category', function () {
    $admin = User::factory()->admin()->create();
    $category = CareerCategory::firstOrCreate(
        ['slug' => 'test-engineering'],
        ['name' => 'Test Engineering', 'icon' => 'Code', 'is_active' => true]
    );

    // Create Sub Category
    $storeResponse = $this->actingAs($admin)->post(route('admin.onboarding-steps.sub-categories.store'), [
        'career_category_id' => $category->id,
        'name' => 'Distributed Systems',
        'slug' => 'distributed-systems',
        'description' => 'Sistem komputasi terdistribusi.',
        'is_active' => true,
    ]);

    $storeResponse->assertRedirect();
    $subCategory = CareerSubCategory::where('slug', 'distributed-systems')->first();
    expect($subCategory)->not->toBeNull();
    expect($subCategory->career_category_id)->toBe($category->id);

    // Update Sub Category
    $updateResponse = $this->actingAs($admin)->patch(route('admin.onboarding-steps.sub-categories.update', $subCategory), [
        'name' => 'High Scale Distributed Systems',
        'is_active' => true,
    ]);

    $updateResponse->assertRedirect();
    $subCategory->refresh();
    expect($subCategory->name)->toBe('High Scale Distributed Systems');

    // Delete Sub Category
    $deleteResponse = $this->actingAs($admin)->delete(route('admin.onboarding-steps.sub-categories.destroy', $subCategory));

    $deleteResponse->assertRedirect();
    expect(CareerSubCategory::where('id', $subCategory->id)->exists())->toBeFalse();
});

test('admin can create, update, and delete role/tech stack', function () {
    $admin = User::factory()->admin()->create();
    $category = CareerCategory::firstOrCreate(
        ['slug' => 'test-engineering'],
        ['name' => 'Test Engineering', 'icon' => 'Code', 'is_active' => true]
    );
    $subCategory = CareerSubCategory::firstOrCreate(
        ['slug' => 'test-sub-engineering', 'career_category_id' => $category->id],
        ['name' => 'Test Sub Engineering', 'is_active' => true]
    );

    // Create Role
    $storeResponse = $this->actingAs($admin)->post(route('admin.onboarding-steps.roles.store'), [
        'career_sub_category_id' => $subCategory->id,
        'name' => 'Rust Systems Developer',
        'slug' => 'rust-systems-developer',
        'popular_skills' => ['Rust', 'Cargo', 'Actix', 'Tokio'],
        'is_active' => true,
    ]);

    $storeResponse->assertRedirect();
    $role = CareerRole::where('slug', 'rust-systems-developer')->first();
    expect($role)->not->toBeNull();
    expect($role->popular_skills)->toContain('Rust');

    // Update Role
    $updateResponse = $this->actingAs($admin)->patch(route('admin.onboarding-steps.roles.update', $role), [
        'name' => 'Senior Rust Systems Developer',
        'popular_skills' => ['Rust', 'Tokio', 'Wasm'],
        'is_active' => false,
    ]);

    $updateResponse->assertRedirect();
    $role->refresh();
    expect($role->name)->toBe('Senior Rust Systems Developer');
    expect($role->is_active)->toBeFalse();
    expect($role->popular_skills)->toContain('Wasm');

    // Delete Role
    $deleteResponse = $this->actingAs($admin)->delete(route('admin.onboarding-steps.roles.destroy', $role));

    $deleteResponse->assertRedirect();
    expect(CareerRole::where('id', $role->id)->exists())->toBeFalse();
});

test('admin can seed or sync defaults', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('admin.onboarding-steps.seed-defaults'));

    $response->assertRedirect();
    expect(CareerCategory::count())->toBeGreaterThan(0);
    expect(CareerSubCategory::count())->toBeGreaterThan(0);
    expect(CareerRole::count())->toBeGreaterThan(0);
});
