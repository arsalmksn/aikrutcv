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

test('admin can add and remove individual skill from role', function () {
    $admin = User::factory()->admin()->create();
    $category = CareerCategory::firstOrCreate(
        ['slug' => 'test-engineering'],
        ['name' => 'Test Engineering', 'icon' => 'Code', 'is_active' => true]
    );
    $subCategory = CareerSubCategory::firstOrCreate(
        ['slug' => 'test-sub-engineering', 'career_category_id' => $category->id],
        ['name' => 'Test Sub Engineering', 'is_active' => true]
    );
    $role = CareerRole::firstOrCreate(
        ['slug' => 'web-dev-test', 'career_sub_category_id' => $subCategory->id],
        ['name' => 'Web Dev Test', 'popular_skills' => ['HTML', 'CSS'], 'is_active' => true]
    );

    // Add Skill
    $addResponse = $this->actingAs($admin)->post(route('admin.onboarding-steps.roles.skills.store', $role), [
        'skill' => 'JavaScript',
    ]);

    $addResponse->assertRedirect();
    $role->refresh();
    expect($role->popular_skills)->toContain('JavaScript');

    // Remove Skill
    $removeResponse = $this->actingAs($admin)->delete(route('admin.onboarding-steps.roles.skills.destroy', $role), [
        'skill' => 'HTML',
    ]);

    $removeResponse->assertRedirect();
    $role->refresh();
    expect($role->popular_skills)->not->toContain('HTML');
    expect($role->popular_skills)->toContain('JavaScript');
});

test('admin can save onboarding wizard selection', function () {
    $admin = User::factory()->admin()->create();
    $category = CareerCategory::firstOrCreate(
        ['slug' => 'test-engineering'],
        ['name' => 'Test Engineering', 'icon' => 'Code', 'is_active' => true]
    );
    $subCategory = CareerSubCategory::firstOrCreate(
        ['slug' => 'test-sub-engineering', 'career_category_id' => $category->id],
        ['name' => 'Test Sub Engineering', 'is_active' => true]
    );
    $role = CareerRole::firstOrCreate(
        ['slug' => 'web-dev-test-wizard', 'career_sub_category_id' => $subCategory->id],
        ['name' => 'Web Dev Test Wizard', 'popular_skills' => ['React'], 'is_active' => true]
    );

    $wizardResponse = $this->actingAs($admin)->post(route('admin.onboarding-steps.wizard-save'), [
        'career_category_id' => $category->id,
        'career_sub_category_ids' => [$subCategory->id],
        'career_sub_category_id' => $subCategory->id,
        'career_role_id' => $role->id,
        'skills' => ['React', 'Next.js', 'Tailwind CSS'],
    ]);

    $wizardResponse->assertRedirect(route('admin.onboarding-steps.index'));
    $role->refresh();
    expect($role->popular_skills)->toContain('Next.js');
    expect($role->popular_skills)->toContain('Tailwind CSS');
    $subCategory->refresh();
    expect($subCategory->popular_skills)->toContain('Next.js');
    expect($subCategory->popular_skills)->toContain('Tailwind CSS');
});

test('admin can add and remove skills directly on sub category', function () {
    $admin = User::factory()->admin()->create();
    $category = CareerCategory::firstOrCreate(
        ['slug' => 'test-engineering-direct'],
        ['name' => 'Test Engineering Direct', 'icon' => 'Code', 'is_active' => true]
    );
    $subCategory = CareerSubCategory::firstOrCreate(
        ['slug' => 'test-sub-engineering-direct', 'career_category_id' => $category->id],
        ['name' => 'Test Sub Engineering Direct', 'popular_skills' => ['Vue.js'], 'is_active' => true]
    );

    $addResponse = $this->actingAs($admin)->post(route('admin.onboarding-steps.sub-categories.skills.store', $subCategory), [
        'skill' => 'Nuxt.js',
    ]);

    $addResponse->assertRedirect();
    $subCategory->refresh();
    expect($subCategory->popular_skills)->toContain('Nuxt.js');

    $removeResponse = $this->actingAs($admin)->delete(route('admin.onboarding-steps.sub-categories.skills.destroy', $subCategory), [
        'skill' => 'Vue.js',
    ]);

    $removeResponse->assertRedirect();
    $subCategory->refresh();
    expect($subCategory->popular_skills)->not->toContain('Vue.js');
    expect($subCategory->popular_skills)->toContain('Nuxt.js');
});
