<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cv;
use App\Models\Template;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Display the admin dashboard with overview statistics and recent activities.
     */
    public function index(Request $request): Response
    {
        $totalUsers = User::count();
        $totalAdmins = User::where('role', 'admin')->count();
        $totalRegularUsers = User::where('role', 'user')->count();
        $totalCvs = Cv::count();
        $totalTemplates = Template::count();
        $totalActiveTemplates = Template::where('is_active', true)->count();

        $recentUsers = User::query()
            ->latest()
            ->take(5)
            ->get()
            ->map(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at?->format('d M Y, H:i') ?? '-',
            ]);

        $recentCvs = Cv::query()
            ->with('user:id,name,email')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn (Cv $cv): array => [
                'id' => $cv->id,
                'title' => $cv->title,
                'user_name' => $cv->user?->name ?? 'Anonim',
                'user_email' => $cv->user?->email ?? '-',
                'created_at' => $cv->created_at?->format('d M Y, H:i') ?? '-',
            ]);

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_users' => $totalUsers,
                'total_admins' => $totalAdmins,
                'total_regular_users' => $totalRegularUsers,
                'total_cvs' => $totalCvs,
                'total_templates' => $totalTemplates,
                'total_active_templates' => $totalActiveTemplates,
            ],
            'recentUsers' => $recentUsers,
            'recentCvs' => $recentCvs,
        ]);
    }
}
