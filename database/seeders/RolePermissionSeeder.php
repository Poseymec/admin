<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $superAdmin = Role::findByName('Super Admin');
        $admin = Role::findByName('Admin');
        $user = Role::findByName('Utilisateur');

        // SUPER ADMIN → toutes les permissions
        $superAdmin->givePermissionTo(Permission::all());

        // ADMIN → tout sauf "manage roles"
        $admin->givePermissionTo([
            'manage products',
            'manage categories',
            'manage orders',
        ]);

        // USER → aucune permission (normal)
    }
}
