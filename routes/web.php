<?php

use App\Http\Controllers\CvController;
use App\Http\Controllers\CvFinalizationController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::get('cv/templates', [CvController::class, 'templates'])->name('cv.templates');
Route::get('cv/options', [CvController::class, 'options'])->name('cv.options');
Route::get('cv/builder', [CvController::class, 'builder'])->name('cv.builder');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
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

    Route::get('templates', [TemplateController::class, 'index'])->name('templates.index');
    Route::post('templates', [TemplateController::class, 'store'])->name('templates.store');
    Route::post('templates/{template}', [TemplateController::class, 'update'])->name('templates.update');
    Route::delete('templates/{template}', [TemplateController::class, 'destroy'])->name('templates.destroy');
});

require __DIR__.'/settings.php';
