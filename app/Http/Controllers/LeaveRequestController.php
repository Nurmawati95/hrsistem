<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class LeaveRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Admin melihat semua karyawan; karyawan hanya data sendiri.
        $query = LeaveRequest::with(['employee', 'leaveType', 'approver']);

        $employee = Employee::where('user_id', $user->id)->first();

        if ($user->isKaryawan()) {
            if ($employee) {
                $query->where('employee_id', $employee->id);
            }
        }

        $requests = $query->orderByDesc('created_at')->paginate(20);

        $employees = $user->isAdmin()
            ? Employee::orderBy('first_name')->get(['id', 'first_name', 'last_name'])
            : collect($employee ? [$employee] : []);

        return Inertia::render('leave/requests', [
            'requests' => $requests,
            'leaveTypes' => LeaveType::orderBy('name')->get(),
            'employees' => $employees,
            'balances' => LeaveBalance::with('leaveType')->get(),
            'isAdmin' => $user->isAdmin(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create.leave.request');

        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (! $employee) {
            return back()->withErrors(['employee' => 'Data karyawan tidak ditemukan.']);
        }

        $data = $request->validate([
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string',
            'attachment' => 'nullable|string',
        ]);

        $start = Carbon::parse($data['start_date']);
        $end = Carbon::parse($data['end_date']);
        $data['employee_id'] = $employee->id;
        $data['days'] = $start->diffInDays($end) + 1;
        $data['status'] = 'pending';

        LeaveRequest::create($data);

        return back()->with('success', 'Pengajuan cuti/izin berhasil dikirim.');
    }

    public function approve(LeaveRequest $leaveRequest): RedirectResponse
    {
        Gate::authorize('approve.leave.request');

        $leaveRequest->update([
            'status' => 'approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        // update balance
        $year = $leaveRequest->start_date->year;
        $balance = LeaveBalance::firstOrCreate(
            ['employee_id' => $leaveRequest->employee_id, 'leave_type_id' => $leaveRequest->leave_type_id, 'year' => $year],
            ['total_days' => $leaveRequest->leaveType->days_allowed, 'used_days' => 0]
        );
        $balance->increment('used_days', $leaveRequest->days);

        return back()->with('success', 'Cuti/izin disetujui.');
    }

    public function reject(Request $request, LeaveRequest $leaveRequest): RedirectResponse
    {
        Gate::authorize('reject.leave.request');

        $data = $request->validate([
            'rejection_reason' => 'nullable|string',
        ]);

        $leaveRequest->update([
            'status' => 'rejected',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
            'rejection_reason' => $data['rejection_reason'] ?? null,
        ]);

        return back()->with('success', 'Cuti/izin ditolak.');
    }
}
