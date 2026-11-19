<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    protected $fillable = ['name', 'parent_id', 'description'];

    /** @return BelongsTo<Department, $this> */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'parent_id');
    }

    /** @return HasMany<Department, $this> */
    public function children(): HasMany
    {
        return $this->hasMany(Department::class, 'parent_id');
    }

    /** @return HasMany<Position, $this> */
    /** @return HasMany<Position, $this> */
    public function positions(): HasMany
    {
        return $this->hasMany(Position::class);
    }

    /** @return HasMany<Employee, $this> */
    /** @return HasMany<Employee, $this> */
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }
}
