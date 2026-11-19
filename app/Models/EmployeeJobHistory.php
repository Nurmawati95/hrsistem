<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeJobHistory extends Model
{
    protected $fillable = ['employee_id', 'position_id', 'department_id', 'start_date', 'end_date', 'notes'];

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

    /** @return BelongsTo<Position, $this> */
    /** @return BelongsTo<Position, $this> */
    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    /** @return BelongsTo<Department, $this> */
    /** @return BelongsTo<Department, $this> */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
