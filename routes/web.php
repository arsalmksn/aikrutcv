<?php

use App\Http\Controllers\CvController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('cv/builder', [CvController::class, 'builder'])->name('cv.builder');
    Route::get('cv/{cv}/builder', [CvController::class, 'builder'])->name('cv.builder.edit');
    Route::post('cv/{cv}/contact', [CvController::class, 'updateContact'])->name('cv.contact.update');
    Route::post('cv/{cv}/experiences', [CvController::class, 'updateExperiences'])->name('cv.experiences.update');
});

require __DIR__.'/settings.php';
