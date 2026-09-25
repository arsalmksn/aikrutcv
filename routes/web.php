<?php

use App\Http\Controllers\CvController;
use App\Http\Controllers\CvFinalizationController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::get('cv/templates', [CvController::class, 'templates'])->name('cv.templates');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('cv/builder', [CvController::class, 'builder'])->name('cv.builder');
    Route::get('cv/{cv}/builder', [CvController::class, 'builder'])->name('cv.builder.edit');
    Route::post('cv/{cv}/contact', [CvController::class, 'updateContact'])->name('cv.contact.update');
    Route::post('cv/{cv}/experiences', [CvController::class, 'updateExperiences'])->name('cv.experiences.update');
    Route::post('cv/{cv}/educations', [CvController::class, 'updateEducations'])->name('cv.educations.update');
    Route::post('cv/{cv}/skills', [CvController::class, 'updateSkills'])->name('cv.skills.update');
    Route::post('cv/{cv}/summary', [CvController::class, 'updateSummary'])->name('cv.summary.update');
    Route::post('cv/{cv}/finalize', [CvFinalizationController::class, 'finalize'])->name('cv.finalize');
    Route::get('cv/{cv}/download-pdf', [CvFinalizationController::class, 'downloadPdf'])->name('cv.download-pdf');
});

require __DIR__.'/settings.php';
