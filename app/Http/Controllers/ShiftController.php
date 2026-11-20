<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Shift;
use App\Models\ShiftAssignment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ShiftController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        $shifts = Shift::orderBy('name')->get();

        // Karyawan hanya melihat jadwal shift yang ditetapkan untuknya.
        $assignments = ShiftAssignment::with(['employee', 'shift'])->orderByDesc('date')->limit(50)->get();
        if ($user->isKaryawan()) {
            $employee = Employee::where('user_id', $user->id)->first();
            $assignments = $employee
                ? ShiftAssignment::with(['employee', 'shift'])->where('employee_id', $employee->id)->orderByDesc('date')->limit(50)->get()
                : collect();
        }

        return Inertia::render('shifts/index', [
            'shifts' => $shifts,
            'assignments' => $assignments,
            'employees' => $user->isAdmin()
                ? Employee::orderBy('first_name')->get(['id', 'first_name', 'last_name'])
                : collect(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create.shift');

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required',
            'end_time' => 'required',
            'break_minutes' => 'nullable|integer',
        ]);

        Shift::create($data);

        return back()->with('success', 'Shift created.');
    }

    public function update(Request $request, Shift $shift): RedirectResponse
    {
        Gate::authorize('update.shift');

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required',
            'end_time' => 'required',
            'break_minutes' => 'nullable|integer',
        ]);

        $shift->update($data);

        return back()->with('success', 'Shift updated.');
    }

    public function destroy(Shift $shift): RedirectResponse
    {
        Gate::authorize('delete.shift');

        $shift->delete();

        return back()->with('success', 'Shift destroyed.');
    }

    public function assign(Request $request): RedirectResponse
    {
        Gate::authorize('assign.shift');

        $data = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'shift_id' => 'required|exists:shifts,id',
            'date' => 'required|date',
        ]);

        ShiftAssignment::updateOrCreate(
            ['employee_id' => $data['employee_id'], 'date' => $data['date']],
            ['shift_id' => $data['shift_id']]
        );

        return back()->with('success', 'Shift assigned.');
    }
}
