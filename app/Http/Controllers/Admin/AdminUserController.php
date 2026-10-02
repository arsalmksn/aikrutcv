<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    /**
     * Display a paginated listing of users with search and role filters.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $roleFilter = trim((string) $request->input('role', 'all'));

        $query = User::query()->withCount('cvs');

        if ($search !== '') {
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if (in_array($roleFilter, ['admin', 'user'], true)) {
            $query->where('role', $roleFilter);
        }

        $users = $query->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'cvs_count' => $user->cvs_count,
                'created_at' => $user->created_at?->format('d M Y, H:i') ?? '-',
                'is_current_user' => $request->user()?->id === $user->id,
            ]);

        $counts = [
            'total' => User::count(),
            'admins' => User::where('role', 'admin')->count(),
            'users' => User::where('role', 'user')->count(),
        ];

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'role' => $roleFilter,
            ],
            'counts' => $counts,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'string', Password::defaults()],
            'role' => ['required', 'string', Rule::in(['admin', 'user'])],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'email_verified_at' => now(),
        ]);

        return redirect()->route('admin.users.index')->with('success', 'Akun pengguna berhasil ditambahkan.');
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($user->id)],
            'role' => ['required', 'string', Rule::in(['admin', 'user'])],
        ]);

        // Safety check: Cannot demote own role
        if ($request->user()?->id === $user->id && $validated['role'] !== 'admin') {
            return redirect()->back()->withErrors([
                'role' => 'Anda tidak dapat menurunkan role akun Anda sendiri.',
            ]);
        }

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
        ]);

        return redirect()->route('admin.users.index')->with('success', 'Data akun pengguna berhasil diperbarui.');
    }

    /**
     * Reset the password for the specified user.
     */
    public function resetPassword(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('admin.users.index')->with('success', 'Kata sandi untuk pengguna '.$user->name.' berhasil diperbarui.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        // Safety check: Cannot delete own account
        if ($request->user()?->id === $user->id) {
            return redirect()->back()->withErrors([
                'general' => 'Anda tidak dapat menghapus akun Anda sendiri.',
            ]);
        }

        $userName = $user->name;
        $user->delete();

        return redirect()->route('admin.users.index')->with('success', "Akun {$userName} berhasil dihapus.");
    }
}
