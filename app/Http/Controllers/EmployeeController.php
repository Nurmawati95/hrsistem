<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(Request $request): Response
    {
        $employees = Employee::with(['department', 'position', 'user'])
            ->when($request->search, fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('first_name', 'like', "%{$s}%")
                    ->orWhere('last_name', 'like', "%{$s}%")
                    ->orWhere('employee_number', 'like', "%{$s}%")
                    ->orWhere('email', 'like', "%{$s}%");
            }))
            ->orderBy('first_name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('employees/index', [
            'employees' => $employees,
            'filters' => $request->only('search'),
            'stats' => [
                'total' => Employee::count(),
                'permanent' => Employee::where('employment_status', 'permanent')->count(),
                'contract' => Employee::where('employment_status', 'contract')->count(),
                'intern' => Employee::where('employment_status', 'intern')->count(),
                'departments' => Department::count(),
            ],
            'recent' => Employee::orderByDesc('hire_date')->limit(5)->get(['id', 'first_name', 'last_name', 'hire_date', 'employment_status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('employees/create', [
            'departments' => Department::orderBy('name')->get(),
            'positions' => Position::orderBy('name')->get(),
            'users' => User::orderBy('name')->get(['id', 'name', 'email']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'employee_number' => 'required|string|unique:employees,employee_number',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email',
            'phone' => 'nullable|string|max:50',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string',
            'address' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string',
            'emergency_contact_phone' => 'nullable|string',
            'hire_date' => 'required|date',
            'employment_status' => 'required|string',
            'position_id' => 'nullable|exists:positions,id',
            'department_id' => 'nullable|exists:departments,id',
            'basic_salary' => 'nullable|numeric',
        ]);

        $employee = Employee::create($data);

        // record initial job history
        $employee->jobHistories()->create([
            'position_id' => $data['position_id'] ?? null,
            'department_id' => $data['department_id'] ?? null,
            'start_date' => $data['hire_date'],
            'notes' => 'Initial assignment',
        ]);

        return redirect()->route('employees.index')->with('success', 'Employee created.');
    }

    public function show(Employee $employee): Response
    {
        $employee->load(['department', 'position', 'user', 'educations', 'documents', 'jobHistories.position', 'jobHistories.department', 'attendances', 'leaveRequests.leaveType', 'payrolls.period']);

        return Inertia::render('employees/show', [
            'employee' => $employee,
        ]);
    }

    public function edit(Employee $employee): Response
    {
        return Inertia::render('employees/edit', [
            'employee' => $employee,
            'departments' => Department::orderBy('name')->get(),
            'positions' => Position::orderBy('name')->get(),
            'users' => User::orderBy('name')->get(['id', 'name', 'email']),
        ]);
    }

    public function update(Request $request, Employee $employee): RedirectResponse
    {
        $data = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'employee_number' => 'required|string|unique:employees,employee_number,'.$employee->id,
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email,'.$employee->id,
            'phone' => 'nullable|string|max:50',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string',
            'address' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string',
            'emergency_contact_phone' => 'nullable|string',
            'hire_date' => 'required|date',
            'employment_status' => 'required|string',
            'position_id' => 'nullable|exists:positions,id',
            'department_id' => 'nullable|exists:departments,id',
            'basic_salary' => 'nullable|numeric',
        ]);

        $employee->update($data);

        return redirect()->route('employees.show', $employee)->with('success', 'Employee updated.');
    }

    public function destroy(Employee $employee): RedirectResponse
    {
        $employee->delete();

        return redirect()->route('employees.index')->with('success', 'Employee deleted.');
    }
}
