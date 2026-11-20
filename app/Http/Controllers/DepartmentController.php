<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('view.any.department');

        $departments = Department::with('parent', 'children')->orderBy('name')->get();

        return Inertia::render('departments/index', [
            'departments' => $departments,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create.department');

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:departments,id',
            'description' => 'nullable|string',
        ]);

        Department::create($data);

        return back()->with('success', 'Department created.');
    }

    public function update(Request $request, Department $department): RedirectResponse
    {
        Gate::authorize('update.department');

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:departments,id',
            'description' => 'nullable|string',
        ]);

        $department->update($data);

        return back()->with('success', 'Department updated.');
    }

    public function destroy(Department $department): RedirectResponse
    {
        Gate::authorize('delete.department');

        $department->delete();

        return back()->with('success', 'Department deleted.');
    }
}
