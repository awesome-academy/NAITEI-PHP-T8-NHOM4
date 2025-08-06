<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::where('name', 'Admin')->first();
        $userRole = Role::where('name', 'User')->first();

        User::unguard();

        User::firstOrCreate(
            ['email' => 'admin@sun-asterisk.com'],
            [
                'username' => 'admin',
                'fname' => 'Admin',
                'lname' => 'New',
                'email' => 'admin@sun-asterisk.com',
                'email_verified_at' => now(),
                'password' => Hash::make('admin123'),
                'role_id' => $adminRole->id,
            ]
        );

        User::firstOrCreate(
            ['email' => 'user@sun-asterisk.com'],
            [
                'username' => 'user',
                'fname' => 'User',
                'lname' => 'New',
                'email' => 'user@sun-asterisk.com',
                'email_verified_at' => now(),
                'password' => Hash::make('user123'),
                'role_id' => $userRole->id,
            ]
        );

        $this->command->info('Users seeded successfully.');
    }
}
