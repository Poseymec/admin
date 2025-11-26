<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use App\Notifications\CustomResetPassword;

class ApiForgotPasswordController extends Controller{
public function sendResetLink(Request $request)
{
    $request->validate(['email' => 'required|email']);

    $status = Password::sendResetLink(
        $request->only('email'),
        function ($user, $token) {
            $user->notify(new CustomResetPassword($token));
        }
    );

    if ($status === Password::RESET_LINK_SENT) {
        return response()->json(['message' => __($status)]);
    }

    return response()->json(['email' => [__($status)]], 422);
}
}