<?php

use App\Models\Employee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;

uses(RefreshDatabase::class);

function employeeIndexProps($response): array
{
    preg_match(
        '/<script data-page="[^"]+" type="application\/json">(.*?)<\/script>/s',
        $response->getContent(),
        $matches
    );

    return (array) (json_decode($matches[1] ?? '{}', true)['props'] ?? []);
}

beforeEach(function () {
    $this->seed();
});

it('seeds 2 admin employees and 20 karyawan employees with profile photos', function () {
    expect(Employee::whereHas('position', fn ($q) => $q->where('name', 'Admin'))->count())->toBe(2);
    expect(Employee::whereHas('position', fn ($q) => $q->where('name', 'Karyawan'))->count())->toBe(20);

    Employee::each(function ($employee) {
        expect($employee->profile_photo)->not->toBeNull();
        expect($employee->profile_photo_url)->toStartWith('http');
    });
});

it('exposes isAdmin true for admin users on the employees index', function () {
    $admin = User::where('email', 'admin@hrsistem.local')->first();

    $response = $this->actingAs($admin)->get(route('employees.index'));

    $response->assertOk();
    expect(employeeIndexProps($response)['isAdmin'])->toBeTrue();
});

it('exposes isAdmin false for karyawan users on the employees index', function () {
    $karyawan = Employee::whereHas('position', fn ($q) => $q->where('name', 'Karyawan'))->first()->user;

    $response = $this->actingAs($karyawan)->get(route('employees.index'));

    $response->assertOk();
    expect(employeeIndexProps($response)['isAdmin'])->toBeFalse();
});

it('admin can view the detail page of an employee', function () {
    $admin = User::where('email', 'admin@hrsistem.local')->first();
    $employee = Employee::where('employee_number', 'ADM-0001')->first();

    $response = $this->actingAs($admin)->get(route('employees.show', $employee));

    $response->assertOk();
});

it('includes the profile photo URL in the employees index props', function () {
    $admin = User::where('email', 'admin@hrsistem.local')->firstOrFail();
    $employee = Employee::where('employee_number', 'ADM-0001')->firstOrFail();

    $response = $this->actingAs($admin)->get(route('employees.index', ['search' => $employee->employee_number]));

    $response->assertOk();
    $photo = collect(employeeIndexProps($response)['employees']['data'])
        ->firstWhere('id', $employee->id)['profile_photo_url'] ?? null;

    expect($photo)->toBe(asset('uploads/employees/'.$employee->profile_photo));
});

it('shows the uploaded profile photo in the employees index after an update', function () {
    $admin = User::where('email', 'admin@hrsistem.local')->firstOrFail();
    $employee = Employee::where('employee_number', 'ADM-0001')->firstOrFail();
    $oldPhoto = $employee->profile_photo;
    $newFilename = null;

    try {
        $this->actingAs($admin)->put(route('employees.update', $employee), [
            'user_id' => $employee->user_id,
            'employee_number' => $employee->employee_number,
            'first_name' => $employee->first_name,
            'last_name' => $employee->last_name,
            'email' => $employee->email,
            'profile_photo' => UploadedFile::fake()->image('new-photo.jpg', 64, 64),
            'phone' => $employee->phone,
            'date_of_birth' => $employee->date_of_birth?->format('Y-m-d'),
            'gender' => $employee->gender,
            'address' => $employee->address,
            'emergency_contact_name' => $employee->emergency_contact_name,
            'emergency_contact_phone' => $employee->emergency_contact_phone,
            'hire_date' => $employee->hire_date?->format('Y-m-d'),
            'employment_status' => $employee->employment_status,
            'position_id' => $employee->position_id,
            'department_id' => $employee->department_id,
            'basic_salary' => $employee->basic_salary,
        ])->assertRedirect(route('employees.show', $employee));

        $employee->refresh();
        $newFilename = $employee->profile_photo;

        expect($newFilename)->not->toBe($oldPhoto);
        expect(file_exists(public_path('uploads/employees/'.$newFilename)))->toBeTrue();

        $response = $this->actingAs($admin)->get(route('employees.index', ['search' => $employee->employee_number]));
        $photo = collect(employeeIndexProps($response)['employees']['data'])
            ->firstWhere('id', $employee->id)['profile_photo_url'] ?? null;

        expect($photo)->toBe(asset('uploads/employees/'.$newFilename));
    } finally {
        if ($newFilename && file_exists(public_path('uploads/employees/'.$newFilename))) {
            unlink(public_path('uploads/employees/'.$newFilename));
        }
    }
});
