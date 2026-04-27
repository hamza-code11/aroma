<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect the user to Google's OAuth page.
     */
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->with(['prompt' => 'select_account'])->redirect();
    }

    /**
     * Handle the callback from Google.
     *
     * Logic:
     * 1. If a user with this google_id exists → log them in.
     * 2. If no google_id match but email exists → update user with google_id → log them in.
     * 3. If neither exists → create a new user → log them in.
     *
     * After login, generates a Sanctum token and redirects to frontend.
     */
    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect($frontendUrl . '/login?error=google_auth_failed');
        }

        // 1. Check if user exists by google_id
        $user = User::where('google_id', $googleUser->getId())->first();

        if (!$user) {
            // 2. Check if email exists (user registered via normal form)
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                // Link the Google account to the existing user
                $user->update([
                    'google_id' => $googleUser->getId(),
                    'avatar'    => $googleUser->getAvatar(),
                ]);
            } else {
                // 3. Create a brand new user
                $user = User::create([
                    'name'      => $googleUser->getName(),
                    'email'     => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar'    => $googleUser->getAvatar(),
                    'password'  => bcrypt(Str::random(24)), // Random password for Google-only users
                    'role'      => 'user',
                ]);
            }
        } else {
            // Update avatar in case it changed
            $user->update([
                'avatar' => $googleUser->getAvatar(),
            ]);
        }

        // Generate Sanctum token
        $token = $user->createToken('google_auth_token')->plainTextToken;

        // Redirect to frontend with token
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

        return redirect($frontendUrl . '/auth/google/callback?token=' . $token . '&user=' . urlencode(json_encode([
            'id'     => $user->id,
            'name'   => $user->name,
            'email'  => $user->email,
            'avatar' => $user->avatar,
            'role'   => $user->role,
        ])));
    }
}
