<?php

namespace App\Http\Controllers;

use App\Exports\EmployeesExport;
use App\Imports\EmployeesImport;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class EmployeeController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        Gate::authorize($user->isAdmin() ? 'view.any.employee' : 'view.own.employee');

        $query = Employee::with(['department', 'position', 'user']);

        // Karyawan hanya bisa melihat data dirinya sendiri.
        if ($user->isKaryawan()) {
            $query->where('user_id', $user->id);
        }

        $query->when($request->search, fn ($q, $s) => $q->where(function ($q) use ($s) {
            $q->where('first_name', 'like', "%{$s}%")
                ->orWhere('last_name', 'like', "%{$s}%")
                ->orWhere('employee_number', 'like', "%{$s}%")
                ->orWhere('email', 'like', "%{$s}%");
        }))->orderBy('first_name');

        $employees = $query->paginate(15)->withQueryString();

        return Inertia::render('employees/index', [
            'employees' => $employees,
            'filters' => $request->only('search'),
            'isAdmin' => $user->isAdmin(),
            'userPosition' => $this->authUserPosition($user),
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

    /**
     * Get the authenticated employee's position name.
     */
    protected function authUserPosition(?User $user = null): ?string
    {
        $user = $user ?? auth()->user();

        $employee = Employee::with('position')->where('user_id', $user?->id)->first();

        return $employee?->position?->name;
    }

    public function create(): Response
    {
        Gate::authorize('create.employee');

        return Inertia::render('employees/create', [
            'departments' => Department::orderBy('name')->get(),
            'positions' => Position::orderBy('name')->get(),
            'users' => User::orderBy('name')->get(['id', 'name', 'email']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create.employee');

        $data = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'employee_number' => 'required|string|unique:employees,employee_number',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email',
            'profile_photo' => 'nullable|image|max:2048',
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

        if ($request->hasFile('profile_photo')) {
            $data['profile_photo'] = $this->storeProfilePhoto($request->file('profile_photo'));
        }

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
        $user = auth()->user();

        Gate::authorize($user->isAdmin() ? 'view.any.employee' : 'view.own.employee');

        if ($user->isKaryawan() && $employee->user_id !== $user->id) {
            abort(403);
        }

        $employee->load(['department', 'position', 'user', 'educations', 'documents', 'jobHistories.position', 'jobHistories.department', 'attendances', 'leaveRequests.leaveType', 'payrolls.period']);

        return Inertia::render('employees/show', [
            'employee' => $employee->append('profile_photo_url'),
        ]);
    }

    public function edit(Employee $employee): Response
    {
        Gate::authorize('update.employee', $employee);

        return Inertia::render('employees/edit', [
            'employee' => $employee->append('profile_photo_url'),
            'departments' => Department::orderBy('name')->get(),
            'positions' => Position::orderBy('name')->get(),
            'users' => User::orderBy('name')->get(['id', 'name', 'email']),
        ]);
    }

    public function update(Request $request, Employee $employee): RedirectResponse
    {
        Gate::authorize('update.employee', $employee);

        $data = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'employee_number' => 'required|string|unique:employees,employee_number,'.$employee->id,
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email,'.$employee->id,
            'profile_photo' => 'nullable|image|max:2048',
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

        if ($request->hasFile('profile_photo')) {
            $newPhoto = $this->storeProfilePhoto($request->file('profile_photo'));

            // Hapus foto lama jika ada
            if ($employee->profile_photo && File::exists(public_path('uploads/employees/'.$employee->profile_photo))) {
                File::delete(public_path('uploads/employees/'.$employee->profile_photo));
            }

            $data['profile_photo'] = $newPhoto;
        }

        $employee->fill($data);
        $employee->save();

        return redirect()->route('employees.show', $employee)->with('success', 'Employee updated.');
    }

    public function destroy(Employee $employee): RedirectResponse
    {
        Gate::authorize('delete.employee');

        $employee->delete();

        return redirect()->route('employees.index')->with('success', 'Employee deleted.');
    }

    /**
     * Export employees to Excel.
     */
    public function export(): BinaryFileResponse
    {
        Gate::authorize('view.any.employee');

        return Excel::download(new EmployeesExport, 'data-karyawan.xlsx');
    }

    /**
     * Export employees to PDF.
     */
    public function exportPdf(): \Illuminate\Http\Response
    {
        Gate::authorize('view.any.employee');

        $employees = Employee::with(['department', 'position'])->orderBy('first_name')->get();

        $pdf = Pdf::loadView('exports.employees', ['employees' => $employees]);

        return $pdf->download('data-karyawan.pdf');
    }

    /**
     * Import employees from Excel.
     */
    public function import(Request $request): RedirectResponse
    {
        Gate::authorize('create.employee');

        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240',
        ]);

        $import = new EmployeesImport;
        Excel::import($import, $request->file('file'));

        $errors = $import->getErrors();

        if (! empty($errors)) {
            return back()->with('warning', 'Import selesai dengan catatan: '.implode(' | ', $errors));
        }

        return back()->with('success', 'Data karyawan berhasil diimport.');
    }

    /**
     * Store an uploaded profile photo and return its file name.
     */
    protected function storeProfilePhoto(UploadedFile $file): string
    {
        $directory = public_path('uploads/employees');

        File::ensureDirectoryExists($directory, 0755, true);

        $fileName = uniqid('emp_', true).'.'.$file->getClientOriginalExtension();

        $file->move($directory, $fileName);

        return $fileName;
    }
}
