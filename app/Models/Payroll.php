<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payroll extends Model
{
    protected $fillable = [
        'employee_id', 'payroll_period_id', 'basic_salary', 'allowances', 'overtime_pay', 'bonus',
        'deduction_bpjs_health', 'deduction_bpjs_employment', 'deduction_tax', 'deduction_late',
        'deduction_loan', 'total_earnings', 'total_deductions', 'net_salary', 'status',
    ];

    protected $casts = [
        'basic_salary' => 'decimal:2',
        'allowances' => 'decimal:2',
        'overtime_pay' => 'decimal:2',
        'bonus' => 'decimal:2',
        'deduction_bpjs_health' => 'decimal:2',
        'deduction_bpjs_employment' => 'decimal:2',
        'deduction_tax' => 'decimal:2',
        'deduction_late' => 'decimal:2',
        'deduction_loan' => 'decimal:2',
        'total_earnings' => 'decimal:2',
        'total_deductions' => 'decimal:2',
        'net_salary' => 'decimal:2',
    ];

    /** @return BelongsTo<Employee, $this> */
    /** @return BelongsTo<Employee, $this> */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /** @return BelongsTo<PayrollPeriod, $this> */
    public function period(): BelongsTo
    {
        return $this->belongsTo(PayrollPeriod::class, 'payroll_period_id');
    }
}
