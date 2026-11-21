<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('check.attendance');

        $user = $request->user();

        $query = Attendance::with('employee');

        // Karyawan hanya melihat absensi sendiri.
        $employee = null;
        if ($user->isKaryawan()) {
            $employee = Employee::where('user_id', $user->id)->first();
            if ($employee) {
                $query->where('employee_id', $employee->id);
            }
        }

        $query->when($request->date, fn ($q, $d) => $q->whereDate('date', $d))
            ->orderByDesc('date')
            ->orderByDesc('check_in_at');

        $attendances = $query->paginate(20)->withQueryString();

        $employees = $user->isAdmin()
            ? Employee::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'employee_number'])
            : ($employee ? Employee::where('id', $employee->id)->get(['id', 'first_name', 'last_name', 'employee_number']) : collect());

        return Inertia::render('attendance/index', [
            'attendances' => $attendances,
            'employees' => $employees,
            'filters' => $request->only('date'),
        ]);
    }

    public function checkIn(Request $request): RedirectResponse
    {
        Gate::authorize('check.attendance');

        $user = $request->user();

        $data = $request->validate([
            'employee_id' => 'nullable|exists:employees,id',
            'location' => 'nullable|string',
            'photo' => 'nullable|string',
        ]);

        // Admin dapat memilih pegawai; karyawan hanya dirinya sendiri.
        if ($user->isAdmin() && ! empty($data['employee_id'])) {
            $employee = Employee::find($data['employee_id']);
        } else {
            $employee = Employee::where('user_id', $user->id)->first();
        }

        if (! $employee) {
            return back()->withErrors(['employee' => 'Data karyawan tidak ditemukan.']);
        }

        $today = now()->toDateString();
        $attendance = Attendance::firstOrCreate(
            ['employee_id' => $employee->id, 'date' => $today],
            ['status' => 'present']
        );

        if (! $attendance->check_in_at) {
            $attendance->check_in_at = now();
            $attendance->check_in_location = $data['location'] ?? null;

            if (! empty($data['photo'])) {
                $filename = $this->storeAttendancePhoto($data['photo'], 'checkin');
                if ($filename) {
                    $attendance->check_in_photo = $filename;
                }
            }

            $threshold = now()->setTime(9, 0, 0);
            if (now()->gt($threshold)) {
                $attendance->status = 'late';
                $attendance->late_minutes = (int) now()->diffInMinutes($threshold);
            }

            $attendance->save();
        }

        return back()->with('success', 'Checked in.');
    }

    public function checkOut(Request $request): RedirectResponse
    {
        Gate::authorize('check.attendance');

        $user = $request->user();

        $data = $request->validate([
            'employee_id' => 'nullable|exists:employees,id',
            'location' => 'nullable|string',
            'photo' => 'nullable|string',
        ]);

        if ($user->isAdmin() && ! empty($data['employee_id'])) {
            $employee = Employee::find($data['employee_id']);
        } else {
            $employee = Employee::where('user_id', $user->id)->first();
        }

        if (! $employee) {
            return back()->withErrors(['employee' => 'Data karyawan tidak ditemukan.']);
        }

        $today = now()->toDateString();
        $attendance = Attendance::where('employee_id', $employee->id)->whereDate('date', $today)->first();

        if ($attendance && ! $attendance->check_out_at) {
            $attendance->check_out_at = now();
            $attendance->check_out_location = $data['location'] ?? null;

            if (! empty($data['photo'])) {
                $filename = $this->storeAttendancePhoto($data['photo'], 'checkout');
                if ($filename) {
                    $attendance->check_out_photo = $filename;
                }
            }

            $threshold = now()->setTime(17, 0, 0);
            if (now()->gt($threshold)) {
                $attendance->overtime_minutes = (int) now()->diffInMinutes($threshold);
            }

            $attendance->save();
        }

        return back()->with('success', 'Checked out.');
    }

    /**
     * Store a base64-encoded selfie photo and return its file name.
     */
    protected function storeAttendancePhoto(string $base64, string $prefix): ?string
    {
        if (! preg_match('/^data:image\/(\w+);base64,/', $base64, $matches)) {
            return null;
        }

        $extension = strtolower($matches[1]);
        if (! in_array($extension, ['jpg', 'jpeg', 'png', 'webp'], true)) {
            $extension = 'jpg';
        }

        $imageData = base64_decode(substr($base64, strpos($base64, ',') + 1), true);
        if ($imageData === false) {
            return null;
        }

        $directory = public_path('uploads/attendance');
        if (! is_dir($directory)) {
            @mkdir($directory, 0755, true);
        }

        $filename = $prefix.'_'.uniqid('att_', true).'.'.$extension;
        file_put_contents($directory.'/'.$filename, $imageData);

        return $filename;
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('view.any.attendance');

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
