<?php

use App\Http\Controllers\Admin\AdminAiSettingController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminCareerPathController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\AiEnhanceController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\CvController;
use App\Http\Controllers\CvFinalizationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\ProfileCvImportController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::get('cv/templates', [CvController::class, 'templates'])->name('cv.templates');
Route::get('cv/options', [CvController::class, 'options'])->name('cv.options');
Route::get('cv/builder', [CvController::class, 'builder'])->name('cv.builder');

// Google OAuth Authentication
Route::get('auth/google/redirect', [GoogleAuthController::class, 'redirect'])->name('auth.google.redirect');
Route::get('auth/google/callback', [GoogleAuthController::class, 'callback'])->name('auth.google.callback');

Route::get('admin/login', [AdminAuthController::class, 'create'])->name('admin.login');
Route::post('admin/login', [AdminAuthController::class, 'store'])->name('admin.login.store');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard Route (accessible to all authenticated users, hosts onboarding modal for new users)
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Onboarding Routes
    Route::get('onboarding', [OnboardingController::class, 'index'])->name('onboarding');
    Route::post('onboarding/blueprint', [OnboardingController::class, 'generateBlueprint'])->name('onboarding.blueprint');
    Route::post('onboarding/complete', [OnboardingController::class, 'complete'])->name('onboarding.complete');

    // Profile CV Import Routes (Accessible during onboarding & on profile)
    Route::post('api/v1/profile/import-cv/parse', [ProfileCvImportController::class, 'parse'])->name('profile.import-cv.parse');
    Route::post('api/v1/profile/import-cv/apply', [ProfileCvImportController::class, 'apply'])->name('profile.import-cv.apply');

    // Protected User Routes (Requires completed onboarding)
    Route::middleware(['onboarded'])->group(function () {
        Route::get('profile', [UserProfileController::class, 'index'])->name('profile.index');

        Route::get('cv', [CvController::class, 'index'])->name('cv.index');
        Route::post('cv/create-from-profile', [CvController::class, 'createFromProfile'])->name('cv.create-from-profile');
        Route::get('cv/{cv}/builder', [CvController::class, 'builder'])->name('cv.builder.edit');
        Route::patch('cv/{cv}/title', [CvController::class, 'updateTitle'])->name('cv.title.update');
        Route::post('cv/{cv}/duplicate', [CvController::class, 'duplicate'])->name('cv.duplicate');
        Route::delete('cv/{cv}', [CvController::class, 'destroy'])->name('cv.destroy');
        Route::post('cv/{cv}/contact', [CvController::class, 'updateContact'])->name('cv.contact.update');
        Route::post('cv/{cv}/experiences', [CvController::class, 'updateExperiences'])->name('cv.experiences.update');
        Route::post('cv/{cv}/educations', [CvController::class, 'updateEducations'])->name('cv.educations.update');
        Route::post('cv/{cv}/skills', [CvController::class, 'updateSkills'])->name('cv.skills.update');
        Route::post('cv/{cv}/summary', [CvController::class, 'updateSummary'])->name('cv.summary.update');
        Route::post('cv/{cv}/finalize', [CvFinalizationController::class, 'finalize'])->name('cv.finalize');
        Route::get('cv/{cv}/download-pdf', [CvFinalizationController::class, 'downloadPdf'])->name('cv.download-pdf');

        // AI Enhance Routes
        Route::get('ai/status', [AiEnhanceController::class, 'status'])->name('ai.status');
        Route::post('ai/enhance-summary', [AiEnhanceController::class, 'enhanceSummary'])->name('ai.enhance-summary');
        Route::post('ai/enhance-experience', [AiEnhanceController::class, 'enhanceExperience'])->name('ai.enhance-experience');
        Route::post('ai/enhance-education', [AiEnhanceController::class, 'enhanceEducation'])->name('ai.enhance-education');

        Route::post('api/v1/profile/recommend-jobs', [UserProfileController::class, 'recommendJobs'])->name('profile.recommend-jobs');
        Route::post('api/v1/profile/ai-score', [UserProfileController::class, 'scoreProfileWithAi'])->name('profile.ai-score');
    });
});

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    // Admin Dashboard & User Management
    Route::redirect('admin', '/admin/dashboard');
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::redirect('/', '/admin/dashboard');
        Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
        Route::post('users', [AdminUserController::class, 'store'])->name('users.store');
        Route::patch('users/{user}', [AdminUserController::class, 'update'])->name('users.update');
        Route::patch('users/{user}/password', [AdminUserController::class, 'resetPassword'])->name('users.reset-password');
        Route::delete('users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
        Route::redirect('templates', '/templates');

        // AI Settings & Fallback Models Management
        Route::get('ai-settings', [AdminAiSettingController::class, 'index'])->name('ai-settings.index');
        Route::post('ai-settings/providers', [AdminAiSettingController::class, 'storeProvider'])->name('ai-settings.providers.store');
        Route::patch('ai-settings/providers/{provider}', [AdminAiSettingController::class, 'updateProvider'])->name('ai-settings.providers.update');
        Route::delete('ai-settings/providers/{provider}', [AdminAiSettingController::class, 'destroyProvider'])->name('ai-settings.providers.destroy');
        Route::post('ai-settings/providers/{provider}/models', [AdminAiSettingController::class, 'storeModel'])->name('ai-settings.models.store');
        Route::patch('ai-settings/models/{model}', [AdminAiSettingController::class, 'updateModel'])->name('ai-settings.models.update');
        Route::delete('ai-settings/models/{model}', [AdminAiSettingController::class, 'destroyModel'])->name('ai-settings.models.destroy');
        Route::post('ai-settings/priorities', [AdminAiSettingController::class, 'reorderPriorities'])->name('ai-settings.priorities.update');
        Route::post('ai-settings/models/{model}/test', [AdminAiSettingController::class, 'testModel'])->name('ai-settings.models.test');

        // Onboarding Master Data Management
        Route::get('onboarding-steps', [AdminCareerPathController::class, 'index'])->name('onboarding-steps.index');
        Route::post('onboarding-steps/categories', [AdminCareerPathController::class, 'storeCategory'])->name('onboarding-steps.categories.store');
        Route::patch('onboarding-steps/categories/{category}', [AdminCareerPathController::class, 'updateCategory'])->name('onboarding-steps.categories.update');
        Route::delete('onboarding-steps/categories/{category}', [AdminCareerPathController::class, 'destroyCategory'])->name('onboarding-steps.categories.destroy');
        Route::post('onboarding-steps/sub-categories', [AdminCareerPathController::class, 'storeSubCategory'])->name('onboarding-steps.sub-categories.store');
        Route::patch('onboarding-steps/sub-categories/{subCategory}', [AdminCareerPathController::class, 'updateSubCategory'])->name('onboarding-steps.sub-categories.update');
        Route::delete('onboarding-steps/sub-categories/{subCategory}', [AdminCareerPathController::class, 'destroySubCategory'])->name('onboarding-steps.sub-categories.destroy');
        Route::post('onboarding-steps/roles', [AdminCareerPathController::class, 'storeRole'])->name('onboarding-steps.roles.store');
        Route::match(['patch', 'post'], 'onboarding-steps/roles/{role}', [AdminCareerPathController::class, 'updateRole'])->name('onboarding-steps.roles.update');
        Route::delete('onboarding-steps/roles/{role}', [AdminCareerPathController::class, 'destroyRole'])->name('onboarding-steps.roles.destroy');
        Route::post('onboarding-steps/sub-categories/{subCategory}/skills', [AdminCareerPathController::class, 'storeSubCategorySkill'])->name('onboarding-steps.sub-categories.skills.store');
        Route::delete('onboarding-steps/sub-categories/{subCategory}/skills', [AdminCareerPathController::class, 'destroySubCategorySkill'])->name('onboarding-steps.sub-categories.skills.destroy');
        Route::post('onboarding-steps/roles/{role}/skills', [AdminCareerPathController::class, 'storeSkill'])->name('onboarding-steps.roles.skills.store');
        Route::delete('onboarding-steps/roles/{role}/skills', [AdminCareerPathController::class, 'destroySkill'])->name('onboarding-steps.roles.skills.destroy');
        Route::post('onboarding-steps/wizard-save', [AdminCareerPathController::class, 'saveWizard'])->name('onboarding-steps.wizard-save');
        Route::post('onboarding-steps/seed-defaults', [AdminCareerPathController::class, 'seedDefaults'])->name('onboarding-steps.seed-defaults');
    });

    // Template Management (Admin Only)
    Route::get('templates', [TemplateController::class, 'index'])->name('templates.index');
    Route::post('templates', [TemplateController::class, 'store'])->name('templates.store');
    Route::post('templates/{template}', [TemplateController::class, 'update'])->name('templates.update');
    Route::delete('templates/{template}', [TemplateController::class, 'destroy'])->name('templates.destroy');
});

require __DIR__.'/settings.php';
