<?php

namespace App\Providers;

use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // EmployeePolicy, LeaveRequestPolicy etc. can be added here when needed.
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Administrators have unrestricted access to everything.
        Gate::define('access.admin', fn (User $user) => $user->isAdmin());

        // Karyawan can only access their own employee record.
        Gate::define('view.own.employee', fn (User $user) => $user->isKaryawan() || $user->isAdmin());
        Gate::define('view.any.employee', fn (User $user) => $user->isAdmin());
        Gate::define('create.employee', fn (User $user) => $user->isAdmin());
        Gate::define('update.employee', function (User $user, Employee $employee) {
            return $user->isAdmin() || $user->id === ($employee->user_id ?? null);
        });
        Gate::define('delete.employee', fn (User $user) => $user->isAdmin());

        // Master data (departments, positions, shifts, payroll) is admin-only.
        Gate::define('view.any.department', fn (User $user) => $user->isAdmin());
        Gate::define('create.department', fn (User $user) => $user->isAdmin());
        Gate::define('update.department', fn (User $user) => $user->isAdmin());
        Gate::define('delete.department', fn (User $user) => $user->isAdmin());

        Gate::define('view.any.position', fn (User $user) => $user->isAdmin());
        Gate::define('create.position', fn (User $user) => $user->isAdmin());
        Gate::define('update.position', fn (User $user) => $user->isAdmin());
        Gate::define('delete.position', fn (User $user) => $user->isAdmin());

        Gate::define('view.any.shift', fn (User $user) => $user->isAdmin());
        Gate::define('create.shift', fn (User $user) => $user->isAdmin());
        Gate::define('update.shift', fn (User $user) => $user->isAdmin());
        Gate::define('delete.shift', fn (User $user) => $user->isAdmin());
        Gate::define('assign.shift', fn (User $user) => $user->isAdmin());

        Gate::define('view.any.payroll', fn (User $user) => $user->isAdmin());
        Gate::define('process.payroll', fn (User $user) => $user->isAdmin());

        // Attendance: karyawan can check in/out and view their own records.
        Gate::define('view.any.attendance', fn (User $user) => $user->isAdmin());
        Gate::define('check.attendance', fn (User $user) => $user->isAdmin() || $user->isKaryawan());

        // Leave requests: karyawan can create/view their own; admin can approve/reject all.
        Gate::define('view.any.leave.request', fn (User $user) => $user->isAdmin());
        Gate::define('view.own.leave.request', fn (User $user) => $user->isKaryawan() || $user->isAdmin());
        Gate::define('create.leave.request', fn (User $user) => $user->isKaryawan() || $user->isAdmin());
        Gate::define('update.own.leave.request', function (User $user, LeaveRequest $leaveRequest) {
            return $user->isAdmin() || $leaveRequest->employee->user_id === $user->id;
        });
        Gate::define('approve.leave.request', fn (User $user) => $user->isAdmin());
        Gate::define('reject.leave.request', fn (User $user) => $user->isAdmin());

        // Company settings is admin-only; profile is available to everyone.
        Gate::define('view.company.settings', fn (User $user) => $user->isAdmin());
        Gate::define('update.company.settings', fn (User $user) => $user->isAdmin());
        Gate::define('view.own.profile', fn (User $user) => true);
        Gate::define('update.own.profile', fn (User $user) => true);

        // Cash advances (Kasbon): karyawan can create/view own; admin manages approvals.
        Gate::define('view.any.cash.advance', fn (User $user) => $user->isAdmin());
        Gate::define('create.cash.advance', fn (User $user) => $user->isKaryawan() || $user->isAdmin());
        Gate::define('pay.cash.advance.installment', fn (User $user) => $user->isKaryawan() || $user->isAdmin());
    }
}
