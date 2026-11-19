<?php

use App\Models\Employee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

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
