<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\LeaveType;
use App\Models\Shift;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password'), 'email_verified_at' => now()]
        );

        foreach ([
            ['name' => 'Annual Leave', 'days_allowed' => 12, 'is_paid' => true],
            ['name' => 'Sick Leave', 'days_allowed' => 10, 'is_paid' => true],
            ['name' => 'Unpaid Leave', 'days_allowed' => 5, 'is_paid' => false],
        ] as $lt) {
            LeaveType::firstOrCreate(['name' => $lt['name']], $lt);
        }

        foreach (['Human Resources', 'Engineering', 'Finance', 'Operations'] as $dept) {
            Department::firstOrCreate(['name' => $dept]);
        }

        Shift::firstOrCreate(['name' => 'Morning'], ['start_time' => '08:00:00', 'end_time' => '17:00:00', 'break_minutes' => 60]);
        Shift::firstOrCreate(['name' => 'Night'], ['start_time' => '20:00:00', 'end_time' => '05:00:00', 'break_minutes' => 60]);

        $this->call(EmployeeSeeder::class);
    }
}
