<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        $attendances = Attendance::with('employee')
            ->when($request->date, fn ($q, $d) => $q->whereDate('date', $d))
            ->orderByDesc('date')
            ->orderByDesc('check_in_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('attendance/index', [
            'attendances' => $attendances,
            'employees' => Employee::orderBy('first_name')->get(['id', 'first_name', 'last_name']),
            'filters' => $request->only('date'),
        ]);
    }

    public function checkIn(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'location' => 'nullable|string',
            'photo' => 'nullable|string',
        ]);

        $today = now()->toDateString();
        $attendance = Attendance::firstOrCreate(
            ['employee_id' => $data['employee_id'], 'date' => $today],
            ['status' => 'present']
        );

        if (! $attendance->check_in_at) {
            $attendance->check_in_at = now();
            $attendance->check_in_location = $data['location'] ?? null;
            $attendance->check_in_photo = $data['photo'] ?? null;

            // late calculation: if after 09:00
            $threshold = now()->setTime(9, 0, 0);
            if (now()->gt($threshold)) {
                $attendance->status = 'late';
                $attendance->late_minutes = now()->diffInMinutes($threshold);
            }

            $attendance->save();
        }

        return back()->with('success', 'Checked in.');
    }

    public function checkOut(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'location' => 'nullable|string',
        ]);

        $today = now()->toDateString();
        $attendance = Attendance::where('employee_id', $data['employee_id'])->whereDate('date', $today)->first();

        if ($attendance && ! $attendance->check_out_at) {
            $attendance->check_out_at = now();
            $attendance->check_out_location = $data['location'] ?? null;

            // overtime: after 17:00
            $threshold = now()->setTime(17, 0, 0);
            if (now()->gt($threshold)) {
                $attendance->overtime_minutes = now()->diffInMinutes($threshold);
            }

            $attendance->save();
        }

        return back()->with('success', 'Checked out.');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'check_in_at' => 'nullable|date',
            'check_out_at' => 'nullable|date',
            'status' => 'required|string',
            'late_minutes' => 'nullable|integer',
            'overtime_minutes' => 'nullable|integer',
            'notes' => 'nullable|string',
        ]);

        Attendance::updateOrCreate(
            ['employee_id' => $data['employee_id'], 'date' => $data['date']],
            $data
        );

        return back()->with('success', 'Attendance saved.');
    }
}
