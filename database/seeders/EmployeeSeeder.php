<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class EmployeeSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $departments = [];
        foreach (['Human Resources', 'Engineering', 'Finance', 'Operations'] as $name) {
            $departments[$name] = Department::firstOrCreate(['name' => $name])->id;
        }

        $positions = [];
        foreach ([
            ['name' => 'Admin', 'department' => 'Human Resources'],
            ['name' => 'Karyawan', 'department' => 'Human Resources'],
            ['name' => 'Manager', 'department' => 'Engineering'],
            ['name' => 'Supervisor', 'department' => 'Finance'],
            ['name' => 'Staff', 'department' => 'Operations'],
        ] as $data) {
            $positions[$data['name']] = Position::firstOrCreate([
                'name' => $data['name'],
                'department_id' => $departments[$data['department']],
            ], ['description' => 'Position '.$data['name']])->id;
        }

        // 2 admin karyawan
        $admins = [
            ['first_name' => 'Admin', 'last_name' => 'Sistem', 'email' => 'admin@hrsistem.local', 'number' => 'ADM-0001'],
            ['first_name' => 'Admin', 'last_name' => 'Operasional', 'email' => 'admin.ops@hrsistem.local', 'number' => 'ADM-0002'],
        ];

        foreach ($admins as $index => $admin) {
            $firstName = $admin['first_name'];
            $lastName = $admin['last_name'];
            $name = $firstName.' '.$lastName;

            $user = User::firstOrCreate(
                ['email' => $admin['email']],
                [
                    'name' => $name,
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );

            $photo = $this->generateProfilePhoto($admin['number']);

            Employee::updateOrCreate(
                ['employee_number' => $admin['number']],
                [
                    'user_id' => $user->id,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => $admin['email'],
                    'profile_photo' => $photo,
                    'phone' => sprintf('08123456%04d', $index + 1),
                    'gender' => $index % 2 === 0 ? 'Laki-laki' : 'Perempuan',
                    'address' => fake()->address(),
                    'hire_date' => now()->subYears(3)->format('Y-m-d'),
                    'employment_status' => 'permanent',
                    'position_id' => $positions['Admin'],
                    'department_id' => $departments['Human Resources'],
                    'basic_salary' => 15000000,
                ]
            );
        }

        // 20 karyawan
        $genders = ['Laki-laki', 'Perempuan'];
        $statuses = ['permanent', 'contract', 'intern'];

        for ($i = 1; $i <= 20; $i++) {
            $firstName = fake()->firstName();
            $lastName = fake()->lastName();
            $name = $firstName.' '.$lastName;
            $email = strtolower($firstName.'.'.$lastName.$i.'@hrsistem.local');
            $number = sprintf('KRY-%04d', $i);

            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );

            $photo = $this->generateProfilePhoto($number);

            Employee::updateOrCreate(
                ['employee_number' => $number],
                [
                    'user_id' => $user->id,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => $email,
                    'profile_photo' => $photo,
                    'phone' => '081'.rand(100000000, 999999999),
                    'gender' => $genders[array_rand($genders)],
                    'address' => fake()->address(),
                    'hire_date' => now()->subMonths(rand(1, 36))->format('Y-m-d'),
                    'employment_status' => $statuses[array_rand($statuses)],
                    'position_id' => $positions['Karyawan'],
                    'department_id' => $departments[array_rand($departments)],
                    'basic_salary' => rand(4000000, 9000000),
                ]
            );
        }
    }

    /**
     * Generate a profile photo SVG avatar and return its file name.
     */
    protected function generateProfilePhoto(string $fileName): string
    {
        $directory = public_path('uploads/employees');

        if (! is_dir($directory)) {
            @mkdir($directory, 0755, true);
        }

        $colors = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
            '#ec4899', '#06b6d4', '#6366f1', '#14b8a6', '#f97316',
        ];
        $color = $colors[array_rand($colors)];
        $initials = strtoupper(Str::substr(Str::replace(' ', '', $fileName), 0, 2));

        $svg = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="{$color}" />
    <text x="50%" y="50%" font-family="Arial, Helvetica, sans-serif" font-size="70" fill="#ffffff" text-anchor="middle" dy=".35em">{$initials}</text>
</svg>
SVG;

        $path = $directory.'/'.$fileName.'.svg';
        file_put_contents($path, $svg);

        return $fileName.'.svg';
    }
}
