<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Request;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\Contracts\RegisterResponse;
use Laravel\Fortify\Contracts\LoginResponse;
use Laravel\Fortify\Contracts\FailedLoginResponse;

class FortifyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->configureActions();
        $this->configureJsonResponses();
        $this->configureRateLimiting();

        // Désactive totalement les vues Fortify
        Fortify::ignoreRoutes(); 
    }

    private function configureActions(): void
    {
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
    }

    private function configureJsonResponses(): void
    {
        // LOGIN SUCCESS
        $this->app->singleton(LoginResponse::class, function () {
            return new class implements LoginResponse {
                public function toResponse($request)
                {
                    return response()->json([
                        'message' => 'Login successful',
                        'user'    => $request->user(),
                        'token'   => $request->user()->createToken('auth_token')->plainTextToken,
                    ]);
                }
            };
        });

        // LOGIN FAILED
        $this->app->singleton(FailedLoginResponse::class, function () {
            return new class implements FailedLoginResponse {
                public function toResponse($request)
                {
                    return response()->json([
                        'message' => 'Invalid credentials'
                    ], 422);
                }
            };
        });

        // REGISTER SUCCESS
        $this->app->singleton(RegisterResponse::class, function () {
            return new class implements RegisterResponse {
                public function toResponse($request)
                {
                    return response()->json([
                        'message' => 'User created successfully',
                        'user'    => $request->user(),
                    ], 201);
                }
            };
        });
    }

    private function configureRateLimiting(): void
    {
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });
    }
}
