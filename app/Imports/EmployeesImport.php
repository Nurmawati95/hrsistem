<?php

namespace App\Imports;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Validators\Failure;
use Throwable;

class EmployeesImport implements SkipsOnError, SkipsOnFailure, ToModel, WithHeadingRow, WithValidation
{
    /** @var list<string> */
    protected array $errors = [];

    public function model(array $row): ?Employee
    {
        $department = null;
        if (! empty($row['department'] ?? null)) {
            $department = Department::where('name', $row['department'])->first();
        }

        $position = null;
        if (! empty($row['position'] ?? null)) {
            $position = Position::where('name', $row['position'])->first();
        }

        return new Employee([
            'employee_number' => $row['employee_number'] ?? null,
            'first_name' => $row['first_name'] ?? '',
            'last_name' => $row['last_name'] ?? '',
            'email' => $row['email'] ?? null,
            'phone' => $row['phone'] ?? null,
            'gender' => $row['gender'] ?? null,
            'hire_date' => $row['hire_date'] ?? now()->toDateString(),
            'employment_status' => $row['employment_status'] ?? 'contract',
            'department_id' => $department?->id,
            'position_id' => $position?->id,
            'basic_salary' => $row['basic_salary'] ?? 0,
        ]);
    }

    public function rules(): array
    {
        return [
            'employee_number' => 'required|string|unique:employees,employee_number',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:employees,email',
            'hire_date' => 'required|date',
            'employment_status' => 'required|string',
        ];
    }

    public function onError(Throwable $e): void
    {
        $this->errors[] = $e->getMessage();
    }

    public function onFailure(Failure ...$failures): void
    {
        foreach ($failures as $failure) {
            $this->errors[] = 'Baris '.$failure->row().': '.implode(', ', $failure->errors());
        }
    }

    /** @return list<string> */
    public function getErrors(): array
    {
        return $this->errors;
    }
}
