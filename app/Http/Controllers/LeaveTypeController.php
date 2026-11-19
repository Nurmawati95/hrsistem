<?php

namespace App\Http\Controllers;

use App\Models\LeaveType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveTypeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('leave/types', [
            'leaveTypes' => LeaveType::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'days_allowed' => 'required|integer|min:0',
            'is_paid' => 'boolean',
            'description' => 'nullable|string',
        ]);

        LeaveType::create($data);

        return back()->with('success', 'Leave type created.');
    }

    public function update(Request $request, LeaveType $leaveType): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'days_allowed' => 'required|integer|min:0',
            'is_paid' => 'boolean',
            'description' => 'nullable|string',
        ]);

        $leaveType->update($data);

        return back()->with('success', 'Leave type updated.');
    }

    public function destroy(LeaveType $leaveType): RedirectResponse
    {
        $leaveType->delete();

        return back()->with('success', 'Leave type deleted.');
    }
}
