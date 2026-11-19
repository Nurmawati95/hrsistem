<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shift extends Model
{
    protected $fillable = ['name', 'start_time', 'end_time', 'break_minutes'];

    /** @return HasMany<ShiftAssignment, $this> */
    /** @return HasMany<ShiftAssignment, $this> */
    public function assignments(): HasMany
    {
        return $this->hasMany(ShiftAssignment::class);
    }
}
