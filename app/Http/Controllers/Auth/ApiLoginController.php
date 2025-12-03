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

    // 🔴 Ajoutez cette vérification pour éviter tout crash
    if (! $user) {
        Auth::logout();
        return response()->json(['message' => 'Utilisateur introuvable.'], 403);
    }

    if (! $user->hasVerifiedEmail()) {
        Auth::logout();
        return response()->json(['message' => 'Votre adresse e-mail n’est pas vérifiée.'], 403);
    }

    $request->session()->regenerate();

    return response()->json(['user' => $user]);
}
}