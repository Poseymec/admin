<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\ApiLoginController;
use App\Http\Controllers\Auth\ApiRegisterController;
use App\Http\Controllers\Auth\ApiLogoutController;
use App\Http\Controllers\Auth\ApiUserController;
use App\Http\Controllers\Auth\ApiForgotPasswordController;
use App\Http\Controllers\Auth\ApiResetPasswordController;
use App\Http\Controllers\Auth\ApiEmailVerificationNotificationController;
use App\Http\Controllers\Auth\ApiVerifyEmailController;
use App\Http\Controllers\Auth\ApiChangePasswordController;
use App\Http\Controllers\Auth\ApiUserRoleController;

// Routes publiques
Route::prefix('auth')->group(function () {
    Route::post('/login', [ApiLoginController::class, 'login']);
    Route::post('/register', [ApiRegisterController::class, 'register']);
    Route::post('/forgot-password', [ApiForgotPasswordController::class, 'sendResetLink']);
    Route::post('/reset-password', [ApiResetPasswordController::class, 'reset']);
    Route::post('/email/verification-notification', [ApiEmailVerificationNotificationController::class, 'sendVerificationEmail']);
    Route::post('/email/verify', [ApiVerifyEmailController::class, 'verify']);
});

// Routes protégées (authentification par session/cookie)
Route::middleware('auth:sanctum')->prefix('auth')->group(function () {
    Route::post('/logout', [ApiLogoutController::class, 'logout']);
    Route::get('/user', [ApiUserController::class, 'user']);

    /** route autoriser pour les admin et super admin */
    Route::middleware('role:Admin|Super Admin')->group(function (){
        Route::put('/password', [ApiChangePasswordController::class, '__invoke']);
    });

    /**route uniquement pour les super admin  */
    Route::middleware( 'role:Super Admin')->group(function () {

        Route::get('/users', [ApiUserController::class, 'index']);
        Route::patch('/users/{user}/role', [ApiUserRoleController::class, 'updateRole']);
        Route::delete('/users/{user}', [ApiUserController::class, 'destroy']);

    });
});
