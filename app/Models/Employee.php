<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    protected $fillable = [
        'user_id', 'employee_number', 'first_name', 'last_name', 'email', 'profile_photo', 'phone',
        'date_of_birth', 'gender', 'address', 'emergency_contact_name', 'emergency_contact_phone',
        'hire_date', 'employment_status', 'position_id', 'department_id', 'basic_salary',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'hire_date' => 'date',
        'basic_salary' => 'decimal:2',
    ];

    /** @var list<string> */
    protected $appends = ['profile_photo_url'];

    /** @return BelongsTo<User, $this> */
    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
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

    /** @return HasMany<EmployeeEducation, $this> */
    /** @return HasMany<EmployeeEducation, $this> */
    public function educations(): HasMany
    {
        return $this->hasMany(EmployeeEducation::class);
    }

    /** @return HasMany<EmployeeDocument, $this> */
    /** @return HasMany<EmployeeDocument, $this> */
    public function documents(): HasMany
    {
        return $this->hasMany(EmployeeDocument::class);
    }

    /** @return HasMany<EmployeeJobHistory, $this> */
    /** @return HasMany<EmployeeJobHistory, $this> */
    public function jobHistories(): HasMany
    {
        return $this->hasMany(EmployeeJobHistory::class);
    }

    /** @return HasMany<Attendance, $this> */
    /** @return HasMany<Attendance, $this> */
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    /** @return HasMany<ShiftAssignment, $this> */
    /** @return HasMany<ShiftAssignment, $this> */
    public function shiftAssignments(): HasMany
    {
        return $this->hasMany(ShiftAssignment::class);
    }

    /** @return HasMany<LeaveRequest, $this> */
    /** @return HasMany<LeaveRequest, $this> */
    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    /** @return HasMany<LeaveBalance, $this> */
    /** @return HasMany<LeaveBalance, $this> */
    public function leaveBalances(): HasMany
    {
        return $this->hasMany(LeaveBalance::class);
    }

    /** @return HasMany<Payroll, $this> */
    /** @return HasMany<Payroll, $this> */
    public function payrolls(): HasMany
    {
        return $this->hasMany(Payroll::class);
    }

    public function getFullNameAttribute(): string
    {
        return $this->first_name.' '.$this->last_name;
    }

    public function getProfilePhotoUrlAttribute(): ?string
    {
        if (! $this->profile_photo) {
            return null;
        }

        return asset('uploads/employees/'.$this->profile_photo);
    }
}
