<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    protected $fillable = ['employee_id', 'date', 'check_in_at', 'check_out_at', 'check_in_location', 'check_out_location', 'check_in_photo', 'status', 'late_minutes', 'overtime_minutes', 'notes'];

    protected $casts = [
        'date' => 'date',
        'check_in_at' => 'datetime',
        'check_out_at' => 'datetime',
    ];

    /** @return BelongsTo<Employee, $this> */
    /** @return BelongsTo<Employee, $this> */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
