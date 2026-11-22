<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\CashAdvanceController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\LeaveTypeController;
use App\Http\Controllers\PayrollPeriodController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\Settings\QrisController;
use App\Http\Controllers\ShiftController;
use App\Http\Middleware\EnsureValidRole;
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

Route::middleware('guest')->group(function () {
    Route::get('auth/google/redirect', [GoogleAuthController::class, 'redirect'])->name('auth.google.redirect');
    Route::get('auth/google/callback', [GoogleAuthController::class, 'callback'])->name('auth.google.callback');
});

Route::middleware(['auth', EnsureValidRole::class])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();

        if ($user && $user->isKaryawan()) {
            return redirect()->route('employees.index');
        }

        return Inertia::render('dashboard', [
            'stats' => [
                'employees' => Employee::count(),
                'departments' => Department::count(),
                'pending_leaves' => LeaveRequest::where('status', 'pending')->count(),
                'today_attendance' => Attendance::whereDate('date', now()->toDateString())->count(),
            ],
        ]);
    })->name('dashboard');

    Route::get('employees/template', [EmployeeController::class, 'downloadTemplate'])->name('employees.template');
    Route::get('employees/export', [EmployeeController::class, 'export'])->name('employees.export');
    Route::get('employees/export/pdf', [EmployeeController::class, 'exportPdf'])->name('employees.exportPdf');
    Route::post('employees/import', [EmployeeController::class, 'import'])->name('employees.import');
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

    Route::get('cash-advances', [CashAdvanceController::class, 'index'])->name('cash-advances.index');
    Route::post('cash-advances', [CashAdvanceController::class, 'store'])->name('cash-advances.store');
    Route::post('cash-advances/{cashAdvance}/supervisor-approve', [CashAdvanceController::class, 'supervisorApprove'])->name('cash-advances.supervisor-approve');
    Route::post('cash-advances/{cashAdvance}/finance-approve', [CashAdvanceController::class, 'financeApprove'])->name('cash-advances.finance-approve');
    Route::post('cash-advances/{cashAdvance}/disburse', [CashAdvanceController::class, 'disburse'])->name('cash-advances.disburse');
    Route::post('cash-advances/{cashAdvance}/reject', [CashAdvanceController::class, 'reject'])->name('cash-advances.reject');
    Route::post('cash-advances/installments/{installment}/pay', [CashAdvanceController::class, 'payInstallment'])->name('cash-advances.pay-installment');
    Route::get('cash-advances/installments/{installment}/qris', [QrisController::class, 'generateDynamicQris'])->name('cash-advances.qris');
});

require __DIR__.'/settings.php';
