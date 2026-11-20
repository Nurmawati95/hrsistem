<?php

namespace App\Exports;

use App\Models\Employee;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class EmployeesExport implements FromCollection, ShouldAutoSize, WithHeadings, WithMapping, WithStyles
{
    /** @return Collection<int, Employee> */
    public function collection(): Collection
    {
        return Employee::with(['department', 'position'])->orderBy('first_name')->get();
    }

    public function headings(): array
    {
        return [
            'NIP',
            'Nama Depan',
            'Nama Belakang',
            'Email',
            'Telepon',
            'Jenis Kelamin',
            'Tanggal Masuk',
            'Status Kerja',
            'Departemen',
            'Jabatan',
            'Gaji Pokok',
        ];
    }

    public function map($employee): array
    {
        return [
            $employee->employee_number,
            $employee->first_name,
            $employee->last_name,
            $employee->email,
            $employee->phone,
            $employee->gender,
            $employee->hire_date?->format('Y-m-d'),
            $employee->employment_status,
            $employee->department?->name,
            $employee->position?->name,
            $employee->basic_salary,
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 12]],
        ];
    }
}
