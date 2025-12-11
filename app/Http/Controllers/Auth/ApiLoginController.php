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
        ], [
            'email.required' => 'L’adresse e-mail est obligatoire.',
            'email.email' => 'Veuillez saisir une adresse e-mail valide.',
            'password.required' => 'Le mot de passe est obligatoire.',
        ]);

        if (! Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['Email ou mot de passe incorrect.'],
            ]);
        }

        /** @var User $user */
        $user = Auth::user();

        if (! $user) {
            Auth::logout();
            return response()->json(['message' => 'Utilisateur introuvable.'], 403);
        }

        if (! $user->hasVerifiedEmail()) {
            Auth::logout();
            return response()->json(['message' => 'Votre adresse e-mail n’est pas vérifiée.'], 403);
        }

        $request->session()->regenerate();

        // ✅ Force l'inclusion de 'role' même si caché
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'role' => $user->role, // 👈
            ]
        ]);
    }
}
