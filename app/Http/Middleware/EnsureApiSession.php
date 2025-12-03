<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureApiSession
{
    public function handle(Request $request, Closure $next): Response
    {
        // Force le démarrage de la session pour les routes API
        $request->setLaravelSession(
            app('session.store')
        );

        return $next($request);
    }
}
