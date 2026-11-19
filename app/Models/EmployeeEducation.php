<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeEducation extends Model
{
    protected $fillable = ['employee_id', 'institution', 'degree', 'field_of_study', 'start_date', 'end_date', 'description'];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /** @return BelongsTo<Employee, $this> */
    /** @return BelongsTo<Employee, $this> */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
