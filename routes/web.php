<?php

use App\Http\Controllers\CvController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('cv/builder', [CvController::class, 'builder'])->name('cv.builder');
    Route::get('cv/{cv}/builder', [CvController::class, 'builder'])->name('cv.builder.edit');
    Route::post('cv/{cv}/contact', [CvController::class, 'updateContact'])->name('cv.contact.update');
});

require __DIR__.'/settings.php';
