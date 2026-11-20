<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'role' => $request->user()?->role,
            'can' => [
                'accessAdmin' => $request->user()?->isAdmin() ?? false,
                'viewAnyEmployee' => Gate::allows('view.any.employee'),
                'createEmployee' => Gate::allows('create.employee'),
                'viewAnyDepartment' => Gate::allows('view.any.department'),
                'createDepartment' => Gate::allows('create.department'),
                'viewAnyPosition' => Gate::allows('view.any.position'),
                'createPosition' => Gate::allows('create.position'),
                'viewAnyShift' => Gate::allows('view.any.shift'),
                'assignShift' => Gate::allows('assign.shift'),
                'viewAnyAttendance' => Gate::allows('view.any.attendance'),
                'viewAnyLeaveRequest' => Gate::allows('view.any.leave.request'),
                'createLeaveRequest' => Gate::allows('create.leave.request'),
                'approveLeaveRequest' => Gate::allows('approve.leave.request'),
                'rejectLeaveRequest' => Gate::allows('reject.leave.request'),
                'viewAnyPayroll' => Gate::allows('view.any.payroll'),
                'processPayroll' => Gate::allows('process.payroll'),
                'updateCompanySettings' => Gate::allows('update.company.settings'),
            ],
        ];
    }
}
