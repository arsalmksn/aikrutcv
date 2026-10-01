<?php

use App\Http\Controllers\UserProfileController;
use App\Models\Cv;
use App\Models\Template;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Rute API dengan pemisahan akses:
| 1. Guest / Public: Dapat diakses siapapun tanpa autentikasi.
| 2. Authenticated: Hanya dapat diakses oleh user yang sudah login (middleware: 'auth').
| 3. Admin Only: Hanya dapat diakses oleh user dengan role admin (middleware: 'auth', 'role:admin').
|
*/

// =========================================================================
// 1. PUBLIC / GUEST ROUTES (Dapat diakses tanpa login)
// =========================================================================
Route::prefix('v1')->group(function (): void {
    Route::get('/health', function (): JsonResponse {
        return response()->json([
            'status' => 'ok',
            'message' => 'API is running normally.',
        ]);
    })->name('api.health');

    Route::get('/templates', function (): JsonResponse {
        $templates = Template::where('is_active', true)->get();

        return response()->json([
            'status' => 'success',
            'data' => $templates,
        ]);
    })->name('api.templates.public');
});

// =========================================================================
// 2. AUTHENTICATED USER ROUTES (Harus login: Guest vs Akun Terdaftar)
// =========================================================================
Route::prefix('v1')->middleware(['web', 'auth'])->group(function (): void {
    Route::get('/user', function (Request $request): JsonResponse {
        return response()->json([
            'status' => 'success',
            'data' => $request->user(),
        ]);
    })->name('api.user.profile');

    Route::get('/my-cvs', function (Request $request): JsonResponse {
        $cvs = $request->user()->cvs()->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $cvs,
        ]);
    })->name('api.user.cvs');

    Route::get('/profile', [UserProfileController::class, 'show'])->name('api.profile.show');
    Route::patch('/profile', [UserProfileController::class, 'update'])->name('api.profile.update');
    Route::post('/profile/upload', [UserProfileController::class, 'upload'])->name('api.profile.upload');
    Route::delete('/profile/items/{type}/{id}', [UserProfileController::class, 'destroyItem'])->name('api.profile.item.destroy');
});

// =========================================================================
// 3. ADMIN ONLY ROUTES (Harus login dan role 'admin': User vs Admin)
// =========================================================================
Route::prefix('v1/admin')->middleware(['web', 'auth', 'role:admin'])->group(function (): void {
    Route::get('/stats', function (): JsonResponse {
        return response()->json([
            'status' => 'success',
            'data' => [
                'total_users' => User::count(),
                'total_cvs' => Cv::count(),
                'total_templates' => Template::count(),
            ],
        ]);
    })->name('api.admin.stats');

    Route::get('/users', function (): JsonResponse {
        $users = User::select('id', 'name', 'email', 'role', 'created_at')->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $users,
        ]);
    })->name('api.admin.users');
});
