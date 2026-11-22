<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CashAdvanceInstallment extends Model
{
    protected $fillable = [
        'cash_advance_id', 'installment_number', 'amount', 'status',
        'paid_at', 'payment_method', 'transaction_ref',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    /** @return BelongsTo<CashAdvance, $this> */
    public function cashAdvance(): BelongsTo
    {
        return $this->belongsTo(CashAdvance::class);
    }
}
