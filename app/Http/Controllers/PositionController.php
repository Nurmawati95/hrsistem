<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Position;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PositionController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('view.any.position');

        $positions = Position::with('department')->orderBy('name')->get();

        return Inertia::render('positions/index', [
            'positions' => $positions,
            'departments' => Department::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create.position');

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'description' => 'nullable|string',
        ]);

        Position::create($data);

        return back()->with('success', 'Position created.');
    }

    public function update(Request $request, Position $position): RedirectResponse
    {
        Gate::authorize('update.position');

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'description' => 'nullable|string',
        ]);

        $position->update($data);

        return back()->with('success', 'Position updated.');
    }

    public function destroy(Position $position): RedirectResponse
    {
        Gate::authorize('delete.position');

        $position->delete();

        return back()->with('success', 'Position destroyed.');
    }
}
