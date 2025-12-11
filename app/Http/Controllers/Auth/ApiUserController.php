<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class ApiUserController extends Controller
{
    /**
     * Récupère les informations de l'utilisateur authentifié.
     */
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
            'role'  => $user->getRoleNames()->first() ?? 'User',
        ]);
    }

    /**
     * Liste tous les utilisateurs (réservé au Super Admin).
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        // Vérifie que l'utilisateur est authentifié et est Super Admin
        if (! $user || ! $user->hasRole('Super Admin')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $users = User::select('id', 'name', 'email', 'created_at')
            ->with('roles') // Chargement des rôles pour getRoleNames()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($u) => [
                'id'         => $u->id,
                'name'       => $u->name,
                'email'      => $u->email,
                'role'       => $u->getRoleNames()->first() ?? 'User', // ✅ CORRIGÉ
                'created_at' => $u->created_at?->toDateTimeString(),
            ]);

        return response()->json(['users' => $users]);
    }

    /**
     * Supprime un utilisateur (réservé au Super Admin).
     */
    public function destroy(int $id)
    {
        $currentUser = Auth::user();

        // Vérifications de sécurité
        if (! $currentUser || ! $currentUser->hasRole('Super Admin')) {
            return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        if ($id === $currentUser->id) {
            return response()->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte.'], 400);
        }

        try {
            $user = User::findOrFail($id);
            $user->delete();

            return response()->json(['message' => 'Utilisateur supprimé avec succès.']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression.',
            ], 500);
        }
    }
}
