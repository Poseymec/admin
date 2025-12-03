<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class ApiLoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Attempt authentication with web guard (session-based)
        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        /** @var User $user */
        $user = Auth::user();

        if (!$user || !$user->hasVerifiedEmail()) {
            Auth::logout();
            return response()->json([
                'message' => 'Your email address is not verified.'
            ], 403);
        }

        // Regenerate the session for security
        $request->session()->regenerate();

        return response()->json([
            'user' => $user,
        ]);
    }
}
