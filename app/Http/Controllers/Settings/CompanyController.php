<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\CompanySetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    /**
     * Show the company and portal settings form.
     */
    public function edit(): Response
    {
        $setting = CompanySetting::current();

        return Inertia::render('settings/company', [
            'setting' => $setting,
        ]);
    }

    /**
     * Update the company and portal settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'tagline' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:500'],
            'work_hours' => ['required', 'string', 'max:255'],
            'announcement_title' => ['nullable', 'string', 'max:255'],
            'announcement_content' => ['nullable', 'string'],
            'announcement_active' => ['boolean'],
            'leave_policy' => ['nullable', 'string'],
            'attendance_policy' => ['nullable', 'string'],
        ]);

        $setting = CompanySetting::current();
        $setting->update($validated);

        return back()->with('status', 'Informasi perusahaan dan portal publik berhasil diperbarui.');
    }
}
