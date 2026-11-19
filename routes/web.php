<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\LeaveTypeController;
use App\Http\Controllers\PayrollPeriodController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\ShiftController;
use App\Models\Attendance;
use App\Models\CompanySetting;
use App\Models\Department;
use App\Models\Employee;
use App\Models\LeaveRequest;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'company' => CompanySetting::current(),
        'stats' => [
            'employees' => Employee::count(),
            'departments' => Department::count(),
            'today_attendance' => Attendance::whereDate('date', now()->toDateString())->count(),
        ],
    ]);
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'stats' => [
                'employees' => Employee::count(),
                'departments' => Department::count(),
                'pending_leaves' => LeaveRequest::where('status', 'pending')->count(),
                'today_attendance' => Attendance::whereDate('date', now()->toDateString())->count(),
            ],
        ]);
    })->name('dashboard');

    Route::resource('employees', EmployeeController::class);
    Route::resource('departments', DepartmentController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('positions', PositionController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::get('organization', fn () => Inertia::render('organization/index', [
        'departments' => Department::with(['children', 'employees.position', 'parent'])->orderBy('name')->get(),
    ]))->name('organization.index');

    Route::get('shifts', [ShiftController::class, 'index'])->name('shifts.index');
    Route::post('shifts', [ShiftController::class, 'store'])->name('shifts.store');
    Route::put('shifts/{shift}', [ShiftController::class, 'update'])->name('shifts.update');
    Route::delete('shifts/{shift}', [ShiftController::class, 'destroy'])->name('shifts.destroy');
    Route::post('shifts/assign', [ShiftController::class, 'assign'])->name('shifts.assign');

    Route::get('attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('attendance/check-in', [AttendanceController::class, 'checkIn'])->name('attendance.checkin');
    Route::post('attendance/check-out', [AttendanceController::class, 'checkOut'])->name('attendance.checkout');
    Route::post('attendance', [AttendanceController::class, 'store'])->name('attendance.store');

    Route::get('leave/types', [LeaveTypeController::class, 'index'])->name('leave.types');
    Route::post('leave/types', [LeaveTypeController::class, 'store'])->name('leave.types.store');
    Route::put('leave/types/{leaveType}', [LeaveTypeController::class, 'update'])->name('leave.types.update');
    Route::delete('leave/types/{leaveType}', [LeaveTypeController::class, 'destroy'])->name('leave.types.destroy');

    Route::get('leave/requests', [LeaveRequestController::class, 'index'])->name('leave.requests');
    Route::post('leave/requests', [LeaveRequestController::class, 'store'])->name('leave.requests.store');
    Route::post('leave/requests/{leaveRequest}/approve', [LeaveRequestController::class, 'approve'])->name('leave.requests.approve');
    Route::post('leave/requests/{leaveRequest}/reject', [LeaveRequestController::class, 'reject'])->name('leave.requests.reject');

    Route::get('payroll/periods', [PayrollPeriodController::class, 'index'])->name('payroll.periods');
    Route::post('payroll/periods', [PayrollPeriodController::class, 'store'])->name('payroll.periods.store');
    Route::get('payroll/periods/{payrollPeriod}', [PayrollPeriodController::class, 'show'])->name('payroll.periods.show');
    Route::post('payroll/periods/{payrollPeriod}/process', [PayrollPeriodController::class, 'process'])->name('payroll.periods.process');
});

require __DIR__.'/settings.php';
