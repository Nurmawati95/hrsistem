<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Data Karyawan</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 10px; color: #1f2937; }
        h1 { font-size: 16px; margin-bottom: 8px; color: #1e3a8a; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border: 1px solid #cbd5e1; padding: 4px 6px; }
        th { background: #1e3a8a; color: #ffffff; font-weight: bold; }
        tr:nth-child(even) { background: #f1f5f9; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
    </style>
</head>
<body>
    <h1>Data Karyawan — HR Sistem</h1>
    <p>Dicetak: {{ now()->format('d/m/Y H:i') }} &nbsp;|&nbsp; Total: {{ $employees->count() }} pegawai</p>

    <table>
        <thead>
            <tr>
                <th class="text-center">No</th>
                <th>NIP</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Departemen</th>
                <th>Jabatan</th>
                <th>Status</th>
                <th class="text-right">Gaji Pokok</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($employees as $index => $employee)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $employee->employee_number }}</td>
                    <td>{{ $employee->first_name }} {{ $employee->last_name }}</td>
                    <td>{{ $employee->email }}</td>
                    <td>{{ $employee->department?->name ?? '-' }}</td>
                    <td>{{ $employee->position?->name ?? '-' }}</td>
                    <td>{{ $employee->employment_status }}</td>
                    <td class="text-right">{{ number_format((float) $employee->basic_salary, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
