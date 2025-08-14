<?php

namespace App\Http\Controllers\Auth;

use App\Config\Role;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('email', $googleUser->getEmail())->orWhere('google_id', $googleUser->getId())->first();

            if (!$user) {
                // Split the name from Google
                $fullName = explode(' ', $googleUser->getName(), 2);
                $fname = $fullName[0] ?? '';
                $lname = $fullName[1] ?? '';

                // Generate unique username from email if needed
                $baseUsername = explode('@', $googleUser->getEmail())[0];
                $username = $this->generateUniqueUsername($baseUsername);

                $user = User::create([
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'email_verified_at' => now(),
                    'password' => bcrypt(Str::random(32)), // Not used, but required
                    'fname' => $fname,
                    'lname' => $lname,
                    'username' => $username,
                    'role_id' => ROLE::USER,
                ]);
            } elseif (!$user->google_id) {
                // Link account if user registered earlier
                $user->update(['google_id' => $googleUser->getId()]);
            }

            Auth::login($user, true);

            return redirect()->intended('/');

        } catch (\Exception $e) {
            return redirect()->route('login')->withErrors([
                'oauth' => 'Google login failed. Please try again later.',
            ]);
        }
    }

    private function generateUniqueUsername($base)
    {
        $username = $base;
        $i = 1;
        while (User::where('username', $username)->exists()) {
            $username = $base . $i++;
        }
        return $username;
    }
}
