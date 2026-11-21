<?php

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
});

test('check-in updates attendance log and returns flash', function () {
    $admin = User::where('email', 'admin@hrsistem.local')->first();
    $employee = Employee::where('employee_number', 'ADM-0001')->first();

    $response = $this->actingAs($admin)->post(route('attendance.checkin'), [
        'employee_id' => $employee->id,
        'location' => 'Kantor Pusat',
    ]);

    // Should redirect
    $response->assertRedirect();

    // Follow redirect
    $followed = $this->actingAs($admin)->get(route('attendance.index'));
    $followed->assertOk();

    // Check if attendance record exists
    $attendance = Attendance::where('employee_id', $employee->id)
        ->whereDate('date', now()->toDateString())
        ->first();
    expect($attendance)->not->toBeNull();
    expect($attendance->check_in_at)->not->toBeNull();

    // Check if the page shows the attendance record
    $followed->assertSee('Kantor Pusat');
});
