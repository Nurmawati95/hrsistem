<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class EmployeesTemplateExport implements FromArray, ShouldAutoSize, WithHeadings, WithStyles
{
    public function headings(): array
    {
        return [
            'employee_number',
            'first_name',
            'last_name',
            'email',
            'phone',
            'gender',
            'hire_date',
            'employment_status',
            'department',
            'position',
            'basic_salary',
        ];
    }

    public function array(): array
    {
        return [
            [
                'KRY-9999',
                'Contoh',
                'Pegawai',
                'contoh.pegawai@hrsistem.local',
                '081234567890',
                'Laki-laki',
                '2026-01-01',
                'contract',
                'Human Resources',
                'Karyawan',
                5000000,
            ],
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 11, 'color' => ['rgb' => 'FFFFFF']], 'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '1E3A8A']]],
            2 => ['fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => 'FEF3C7']], 'font' => ['italic' => true, 'color' => ['rgb' => '92400E']]],
        ];
    }
}
