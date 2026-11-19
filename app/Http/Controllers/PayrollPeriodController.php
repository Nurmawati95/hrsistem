<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Payroll;
use App\Models\PayrollPeriod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PayrollPeriodController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('payroll/periods', [
            'periods' => PayrollPeriod::orderByDesc('start_date')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'pay_date' => 'required|date',
        ]);

        $data['status'] = 'draft';

        PayrollPeriod::create($data);

        return back()->with('success', 'Payroll period created.');
    }

    public function show(PayrollPeriod $payrollPeriod): Response
    {
        $payrollPeriod->load('payrolls.employee');

        return Inertia::render('payroll/show', [
            'period' => $payrollPeriod,
        ]);
    }

    public function process(PayrollPeriod $payrollPeriod): RedirectResponse
    {
        foreach (Employee::all() as $employee) {
            $attendances = Attendance::where('employee_id', $employee->id)
                ->whereBetween('date', [$payrollPeriod->start_date, $payrollPeriod->end_date])
                ->get();

            $lateMinutes = $attendances->sum('late_minutes');
            $overtimeMinutes = $attendances->sum('overtime_minutes');

            $basic = (float) $employee->basic_salary;
            $allowances = 0;
            $overtimePay = round(($basic / 173) * ($overtimeMinutes / 60), 2); // simple hourly rate
            $bonus = 0;

            $dedBpjsHealth = round($basic * 0.01, 2); // 1%
            $dedBpjsEmployment = round($basic * 0.02, 2); // 2%
            $dedTax = round($basic * 0.05, 2); // 5% simplified
            $dedLate = round(($basic / 173 / 60) * $lateMinutes, 2);
            $dedLoan = 0;

            $earnings = $basic + $allowances + $overtimePay + $bonus;
            $deductions = $dedBpjsHealth + $dedBpjsEmployment + $dedTax + $dedLate + $dedLoan;
            $net = $earnings - $deductions;

            Payroll::updateOrCreate(
                ['employee_id' => $employee->id, 'payroll_period_id' => $payrollPeriod->id],
                [
                    'basic_salary' => $basic,
                    'allowances' => $allowances,
                    'overtime_pay' => $overtimePay,
                    'bonus' => $bonus,
                    'deduction_bpjs_health' => $dedBpjsHealth,
                    'deduction_bpjs_employment' => $dedBpjsEmployment,
                    'deduction_tax' => $dedTax,
                    'deduction_late' => $dedLate,
                    'deduction_loan' => $dedLoan,
                    'total_earnings' => $earnings,
                    'total_deductions' => $deductions,
                    'net_salary' => $net,
                    'status' => 'processed',
                ]
            );
        }

        $payrollPeriod->update(['status' => 'processed']);

        return back()->with('success', 'Payroll processed.');
    }
}
