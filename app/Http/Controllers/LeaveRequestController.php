<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $requests = LeaveRequest::with(['employee', 'leaveType', 'approver'])
            ->orderByDesc('created_at')
            ->paginate(20);

        return Inertia::render('leave/requests', [
            'requests' => $requests,
            'leaveTypes' => LeaveType::orderBy('name')->get(),
            'employees' => Employee::orderBy('first_name')->get(['id', 'first_name', 'last_name']),
            'balances' => LeaveBalance::with('leaveType')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string',
            'attachment' => 'nullable|string',
        ]);

        $start = Carbon::parse($data['start_date']);
        $end = Carbon::parse($data['end_date']);
        $data['days'] = $start->diffInDays($end) + 1;
        $data['status'] = 'pending';

        LeaveRequest::create($data);

        return back()->with('success', 'Leave request submitted.');
    }

    public function approve(LeaveRequest $leaveRequest): RedirectResponse
    {
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

        return back()->with('success', 'Leave approved.');
    }

    public function reject(Request $request, LeaveRequest $leaveRequest): RedirectResponse
    {
        $data = $request->validate([
            'rejection_reason' => 'nullable|string',
        ]);

        $leaveRequest->update([
            'status' => 'rejected',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
            'rejection_reason' => $data['rejection_reason'] ?? null,
        ]);

        return back()->with('success', 'Leave rejected.');
    }
}
