<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ApiUserController extends Controller
{
    public function user(Request $request)
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return response()->json([
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'role'  => $user->getRoleNames()->first() ?? 'Utilisateur', // rôle Spatie
        ]);
    }

    public function index(Request $request)
    {
        $authUser = Auth::user();
        $isSuper = false;
        if ($authUser && is_callable([$authUser, 'hasRole'])) {
            $isSuper = (bool) call_user_func([$authUser, 'hasRole'], 'Super Admin');
        }

        if (! $isSuper) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        // on retire 'role' de la sélection SQL
        $users = User::select('id', 'name', 'email', 'created_at')
            ->with('roles') // si tu veux afficher le rôle plus loin
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($u) => [
                'id'    => $u->id,
                'name'  => $u->name,
                'email' => $u->email,
                'role'  => $u->getRoleNames()->first(),
                'created_at' => optional($u->created_at)->toDateTimeString(),
            ]);

        return response()->json(['users' => $users]);
    }
    /**
     * Supprimer un utilisateur.
     */
    // ApiUserController
    // ApiUserController
    public function destroy(int $user)
    {
        try {
            if (!Auth::user()->hasRole('Super Admin')) {
                return response()->json(['message' => 'Action non autorisée.'], 403);
            }
            if ($user === Auth::id()) {
                return response()->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte.'], 400);
            }

            User::findOrFail($user)->delete();

            return response()->json(['message' => 'Utilisateur supprimé avec succès.']);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Erreur lors de la suppression.', 'error' => $e->getMessage()], 500);
        }
    }
}
