<?php

// routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\ApiLoginController;
use App\Http\Controllers\Auth\ApiRegisterController;
use App\Http\Controllers\Auth\ApiLogoutController;
use App\Http\Controllers\Auth\ApiUserController;
use App\Http\Controllers\Auth\ApiForgotPasswordController;
use App\Http\Controllers\Auth\ApiResetPasswordController;
use App\Http\Controllers\Auth\ApiEmailVerificationNotificationController;
use App\Http\Controllers\Auth\ApiVerifyEmailController;

Route::prefix('auth')->group(function () {
    // Routes publiques
    Route::post('/login', [ApiLoginController::class, 'login']);
    Route::post('/register', [ApiRegisterController::class, 'register']);
    Route::post('/forgot-password', [ApiForgotPasswordController::class, 'sendResetLink']);
    Route::post('/reset-password', [ApiResetPasswordController::class, 'reset']);
    Route::post('/email/verification-notification', [ApiEmailVerificationNotificationController::class, 'sendVerificationEmail']);
    Route::post('/email/verify', [ApiVerifyEmailController::class, 'verify']);
});

// Routes protégées (Sanctum)
Route::middleware('auth:sanctum')->prefix('auth')->group(function () {
    Route::post('/logout', [ApiLogoutController::class, 'logout']);
    Route::get('/user', [ApiUserController::class, 'user']);
});