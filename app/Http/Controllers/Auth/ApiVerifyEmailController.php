<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;

class ApiVerifyEmailController extends Controller
{
   public function verify(Request $request)
{
    $request->validate([
        'uid' => 'required|integer|exists:users,id',
        'hash' => 'required|string',
    ]);

    $user = \App\Models\User::findOrFail($request->uid);

    if (! hash_equals((string) $request->hash, sha1($user->getEmailForVerification()))) {
        return response()->json(['message' => 'Invalid verification link.'], 400);
    }

    if ($user->hasVerifiedEmail()) {
        return response()->json(['message' => 'Email already verified.'], 200);
    }

    if ($user->markEmailAsVerified()) {
        event(new Verified($user));
    }

    return response()->json(['message' => 'Email verified successfully.']);
}
}
