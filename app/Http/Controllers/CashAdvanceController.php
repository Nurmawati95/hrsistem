<?php

namespace App\Http\Controllers;

use App\Models\CashAdvance;
use App\Models\CashAdvanceInstallment;
use App\Models\CompanySetting;
use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CashAdvanceController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = CashAdvance::with(['employee', 'installments']);

        if ($user->isKaryawan()) {
            $employee = Employee::where('user_id', $user->id)->first();
            if ($employee) {
                $query->where('employee_id', $employee->id);
            } else {
                $query->whereRaw('1 = 0');
            }
        }

        $cashAdvances = $query->orderByDesc('created_at')->paginate(20);

        $setting = CompanySetting::current();

        return Inertia::render('cash-advances/index', [
            'cashAdvances' => $cashAdvances,
            'employees' => $user->isAdmin()
                ? Employee::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'employee_number'])
                : collect(),
            'isAdmin' => $user->isAdmin(),
            'qrisImage' => $setting->qris_image
                ? '/uploads/qris/'.$setting->qris_image
                : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (! $employee) {
            return back()->withErrors(['employee' => 'Data karyawan tidak ditemukan.']);
        }

        $data = $request->validate([
            'amount' => 'required|numeric|min:100000',
            'reason' => 'required|string|max:500',
            'total_installments' => 'required|integer|min:1|max:12',
        ]);

        $installmentAmount = round($data['amount'] / $data['total_installments'], 2);

        CashAdvance::create([
            'employee_id' => $employee->id,
            'amount' => $data['amount'],
            'reason' => $data['reason'],
            'status' => 'pending',
            'total_installments' => $data['total_installments'],
            'installment_amount' => $installmentAmount,
            'remaining_balance' => $data['amount'],
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pengajuan kasbon berhasil dikirim.']);

        return to_route('cash-advances.index');
    }

    public function supervisorApprove(CashAdvance $cashAdvance): RedirectResponse
    {
        Gate::authorize('access.admin');

        $cashAdvance->update([
            'status' => 'supervisor_approved',
            'supervisor_approved_by' => auth()->id(),
            'supervisor_approved_at' => now(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kasbon disetujui oleh atasan.']);

        return to_route('cash-advances.index');
    }

    public function financeApprove(CashAdvance $cashAdvance): RedirectResponse
    {
        Gate::authorize('access.admin');

        $cashAdvance->update([
            'status' => 'finance_approved',
            'finance_approved_by' => auth()->id(),
            'finance_approved_at' => now(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kasbon disetujui oleh finance.']);

        return to_route('cash-advances.index');
    }

    public function disburse(CashAdvance $cashAdvance): RedirectResponse
    {
        Gate::authorize('access.admin');

        // Create installments
        $installmentAmount = $cashAdvance->installment_amount;
        for ($i = 1; $i <= $cashAdvance->total_installments; $i++) {
            $amount = ($i === $cashAdvance->total_installments)
                ? $cashAdvance->amount - ($installmentAmount * ($cashAdvance->total_installments - 1))
                : $installmentAmount;

            CashAdvanceInstallment::create([
                'cash_advance_id' => $cashAdvance->id,
                'installment_number' => $i,
                'amount' => $amount,
                'status' => 'pending',
            ]);
        }

        $cashAdvance->update([
            'status' => 'disbursed',
            'disbursed_by' => auth()->id(),
            'disbursed_at' => now(),
            'remaining_balance' => $cashAdvance->amount,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kasbon dicairkan. Cicilan dibuat.']);

        return to_route('cash-advances.index');
    }

    public function payInstallment(CashAdvanceInstallment $installment): RedirectResponse
    {
        /** @var CashAdvance $cashAdvance */
        $cashAdvance = $installment->cashAdvance;
        $user = auth()->user();
        $employee = Employee::where('user_id', $user->id)->first();

        if (! $employee || $cashAdvance->employee_id !== $employee->id) {
            abort(403);
        }

        if ($installment->status === 'paid') {
            return back()->withErrors(['installment' => 'Cicilan sudah dibayar.']);
        }

        $installment->update([
            'status' => 'paid',
            'paid_at' => now(),
            'payment_method' => 'qris',
            'transaction_ref' => 'QRIS-'.uniqid(),
        ]);

        $cashAdvance->decrement('remaining_balance', (float) $installment->amount);

        if ($cashAdvance->remaining_balance <= 0) {
            $cashAdvance->update(['status' => 'paid']);
        } else {
            $cashAdvance->update(['status' => 'repaying']);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pembayaran cicilan via QRIS berhasil.']);

        return to_route('cash-advances.index');
    }

    public function reject(Request $request, CashAdvance $cashAdvance): RedirectResponse
    {
        Gate::authorize('access.admin');

        $data = $request->validate([
            'rejection_reason' => 'nullable|string',
        ]);

        $cashAdvance->update([
            'status' => 'rejected',
            'rejection_reason' => $data['rejection_reason'] ?? null,
        ]);

        Inertia::flash('toast', ['type' => 'warning', 'message' => 'Kasbon ditolak.']);

        return to_route('cash-advances.index');
    }
}
