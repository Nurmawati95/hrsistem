<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeaveType extends Model
{
    protected $fillable = ['name', 'days_allowed', 'is_paid', 'description'];

    protected $casts = [
        'is_paid' => 'boolean',
    ];

    /** @return HasMany<LeaveRequest, $this> */
    /** @return HasMany<LeaveRequest, $this> */
    public function requests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    /** @return HasMany<LeaveBalance, $this> */
    /** @return HasMany<LeaveBalance, $this> */
    public function balances(): HasMany
    {
        return $this->hasMany(LeaveBalance::class);
    }
}
