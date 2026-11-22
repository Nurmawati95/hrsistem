<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CashAdvance extends Model
{
    protected $fillable = [
        'employee_id', 'amount', 'reason', 'status',
        'supervisor_approved_by', 'supervisor_approved_at',
        'finance_approved_by', 'finance_approved_at',
        'disbursed_by', 'disbursed_at',
        'total_installments', 'installment_amount', 'remaining_balance',
        'rejection_reason',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'installment_amount' => 'decimal:2',
        'remaining_balance' => 'decimal:2',
        'supervisor_approved_at' => 'datetime',
        'finance_approved_at' => 'datetime',
        'disbursed_at' => 'datetime',
    ];

    /** @return BelongsTo<Employee, $this> */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /** @return BelongsTo<User, $this> */
    public function supervisorApprover(): BelongsTo
    {
        return $this->belongsTo(User::class, 'supervisor_approved_by');
    }

    /** @return BelongsTo<User, $this> */
    public function financeApprover(): BelongsTo
    {
        return $this->belongsTo(User::class, 'finance_approved_by');
    }

    /** @return BelongsTo<User, $this> */
    public function disbursedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'disbursed_by');
    }

    /** @return HasMany<CashAdvanceInstallment, $this> */
    public function installments(): HasMany
    {
        return $this->hasMany(CashAdvanceInstallment::class);
    }
}
