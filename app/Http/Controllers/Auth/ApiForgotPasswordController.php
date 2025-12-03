<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use App\Notifications\CustomResetPassword;
use Illuminate\Validation\ValidationException;

class ApiForgotPasswordController extends Controller
{
    public function sendResetLink(Request $request)
    {
        // Validation du format email
        $request->validate([
            'email' => 'required|email',
        ], [
            'email.required' => 'L’adresse e-mail est obligatoire.',
            'email.email' => 'Veuillez saisir une adresse e-mail valide.',
        ]);

        $status = Password::sendResetLink(
            $request->only('email'),
            function ($user, $token) {
                $user->notify(new CustomResetPassword($token));
            }
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Un lien de réinitialisation a été envoyé à votre adresse e-mail.'
            ]);
        }

        // 🚨 Cas : email inconnu → on retourne une erreur explicite
        if ($status === Password::INVALID_USER) {
            throw ValidationException::withMessages([
                'email' => ['Aucun compte n’est associé à cette adresse e-mail.']
            ]);
        }

        // Autres erreurs (ex: trop de tentatives)
        throw ValidationException::withMessages([
            'email' => ['Impossible d’envoyer le lien de réinitialisation. Veuillez réessayer plus tard.']
        ]);
    }
}