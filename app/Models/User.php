<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\CustomVerifyEmail;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable , HasApiTokens,HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

public function sendEmailVerificationNotification()
{
    $this->notify(new CustomVerifyEmail);
}

    protected static function booted()
    {
        static::saved(function ($user) {
            if ($user->hasRole('Super Admin') && $user->role !== 'Super Admin') {
                $user->updateQuietly(['role' => 'Super Admin']);
            }
            if ($user->hasRole('Admin') && $user->role !== 'Admin') {
                $user->updateQuietly(['role' => 'Admin']);
            }
            if ($user->hasRole('Utilisateur') && $user->role !== 'Utilisateur') {
                $user->updateQuietly(['role' => 'Utilisateur']);
            }
        });
    }
}
