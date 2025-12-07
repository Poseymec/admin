<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Auth;


class ApiUserRoleController extends Controller
{

    // ApiUserRoleController
    // ApiUserRoleController
    public function updateRole(Request $request, int $user)
    {
        try {
            if (!auth()->user()->hasRole('Super Admin')) {
                return response()->json(['message' => 'Non autorisé'], 403);
            }
            if ($user === auth()->id()) {
                return response()->json(['message' => 'Vous ne pouvez pas modifier votre propre rôle.'], 400);
            }

            $request->validate(['role' => 'required|string|in:User,Admin,Super Admin']);

            $target = User::findOrFail($user);
            $target->syncRoles([$request->role]);

            return response()->json(['message' => 'Rôle mis à jour avec succès.']);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Erreur lors de la mise à jour.', 'error' => $e->getMessage()], 500);
        }
    }
}
