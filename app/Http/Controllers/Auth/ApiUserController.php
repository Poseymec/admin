<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
u

class ApiUserController extends Controller
{
    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    public function index(Request $request)
    {
        // ✅ Corrigé : 'Super Admin' (avec espace), pas 'Super-Admin'
        if (! Auth::user()?->hasRole('Super Admin')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }


        $users = User::select('id', 'name', 'email', 'role', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['users' => $users]);
    }
}
