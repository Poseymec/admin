<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use App\Models\User;

class ApiVerifyEmailController extends Controller
{
    public function verify(Request $request)
    {
        $request->validate([
            'uid' => 'required|integer|exists:users,id',
            'hash' => 'required|string',
        ], [
            'uid.required' => 'L’identifiant utilisateur est requis.',
            'uid.exists' => 'Utilisateur introuvable.',
            'hash.required' => 'Le lien de vérification est invalide.',
        ]);

        $user = User::findOrFail($request->uid);

        if (! hash_equals((string) $request->hash, sha1($user->getEmailForVerification()))) {
            return response()->json([
                'message' => 'Le lien de vérification est invalide ou a expiré.'
            ], 400);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Votre e-mail a déjà été vérifié.'
            ], 200);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return response()->json([
            'message' => 'Votre e-mail a été vérifié avec succès.'
        ]);
    }
}