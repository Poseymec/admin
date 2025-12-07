<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        // Si l'utilisateur possède le rôle « nouveau » => on le force sur la page d'attente
        if ($user->hasRole('User')) {
            return response()->json(['message' => 'Votre compte est en attente de validation'], 403);
        }

        // S'il n'a aucun des rôles demandés => 403
        if (! empty($roles) && ! $user->hasAnyRole($roles)) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        return $next($request);
    }
}
