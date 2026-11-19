import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

type Props = {
    attendances: { data: any[]; links: any[] };
    employees: any[];
    filters: { date?: string };
};

export default function AttendanceIndex({
    attendances,
    employees,
    filters,
}: Props) {
    const checkInForm = useForm({ employee_id: '', location: '' });
    const checkOutForm = useForm({ employee_id: '', location: '' });
    const manualForm = useForm({
        employee_id: '',
        date: new Date().toISOString().slice(0, 10),
        check_in_at: '',
        check_out_at: '',
        status: 'present',
        late_minutes: 0,
        overtime_minutes: 0,
        notes: '',
    });

    const doCheckIn = (e: React.FormEvent) => {
        e.preventDefault();
        checkInForm.post('/attendance/check-in', {
            onSuccess: () => checkInForm.reset(),
        });
    };
    const doCheckOut = (e: React.FormEvent) => {
        e.preventDefault();
        checkOutForm.post('/attendance/check-out', {
            onSuccess: () => checkOutForm.reset(),
        });
    };
    const doManual = (e: React.FormEvent) => {
        e.preventDefault();
        manualForm.post('/attendance', { onSuccess: () => manualForm.reset() });
    };

    const filterDate = (date: string) => {
        router.get('/attendance', { date }, { preserveState: true });
    };

    return (
        <>
            <Head title="Attendance" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <header className="flex flex-col gap-1">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Absensi
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola check-in, check-out, dan entri manual.
                    </p>
                </header>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Absen Masuk</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={doCheckIn} className="grid gap-3">
                                <div className="grid gap-2">
                                    <Label>Karyawan</Label>
                                    <Select
                                        value={checkInForm.data.employee_id}
                                        onValueChange={(v) =>
                                            checkInForm.setData(
                                                'employee_id',
                                                v,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih karyawan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employees.map((e) => (
                                                <SelectItem
                                                    key={e.id}
                                                    value={String(e.id)}
                                                >
                                                    {e.first_name} {e.last_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Lokasi</Label>
                                    <Input
                                        placeholder="Lokasi"
                                        value={checkInForm.data.location}
                                        onChange={(e) =>
                                            checkInForm.setData(
                                                'location',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <Button
                                    disabled={checkInForm.processing}
                                    type="submit"
                                    className="w-full"
                                >
                                    Absen Masuk
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Absen Keluar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={doCheckOut} className="grid gap-3">
                                <div className="grid gap-2">
                                    <Label>Karyawan</Label>
                                    <Select
                                        value={checkOutForm.data.employee_id}
                                        onValueChange={(v) =>
                                            checkOutForm.setData(
                                                'employee_id',
                                                v,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih karyawan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employees.map((e) => (
                                                <SelectItem
                                                    key={e.id}
                                                    value={String(e.id)}
                                                >
                                                    {e.first_name} {e.last_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Lokasi</Label>
                                    <Input
                                        placeholder="Lokasi"
                                        value={checkOutForm.data.location}
                                        onChange={(e) =>
                                            checkOutForm.setData(
                                                'location',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <Button
                                    disabled={checkOutForm.processing}
                                    type="submit"
                                    variant="outline"
                                    className="w-full"
                                >
                                    Absen Keluar
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Entri Manual</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={doManual}
                            className="grid gap-3 md:grid-cols-4"
                        >
                            <div className="grid gap-2">
                                <Label>Karyawan</Label>
                                <Select
                                    value={manualForm.data.employee_id}
                                    onValueChange={(v) =>
                                        manualForm.setData('employee_id', v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((e) => (
                                            <SelectItem
                                                key={e.id}
                                                value={String(e.id)}
                                            >
                                                {e.first_name} {e.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Tanggal</Label>
                                <Input
                                    type="date"
                                    value={manualForm.data.date}
                                    onChange={(e) =>
                                        manualForm.setData(
                                            'date',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Masuk</Label>
                                <Input
                                    type="datetime-local"
                                    value={manualForm.data.check_in_at}
                                    onChange={(e) =>
                                        manualForm.setData(
                                            'check_in_at',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Keluar</Label>
                                <Input
                                    type="datetime-local"
                                    value={manualForm.data.check_out_at}
                                    onChange={(e) =>
                                        manualForm.setData(
                                            'check_out_at',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Input
                                    placeholder="Status"
                                    value={manualForm.data.status}
                                    onChange={(e) =>
                                        manualForm.setData(
                                            'status',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Terlambat (mnt)</Label>
                                <Input
                                    type="number"
                                    value={manualForm.data.late_minutes}
                                    onChange={(e) =>
                                        manualForm.setData(
                                            'late_minutes',
                                            Number(e.target.value),
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Lembur (mnt)</Label>
                                <Input
                                    type="number"
                                    value={manualForm.data.overtime_minutes}
                                    onChange={(e) =>
                                        manualForm.setData(
                                            'overtime_minutes',
                                            Number(e.target.value),
                                        )
                                    }
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    disabled={manualForm.processing}
                                    type="submit"
                                    className="w-full"
                                >
                                    Simpan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Riwayat Absensi</CardTitle>
                        <Input
                            type="date"
                            defaultValue={filters.date}
                            onChange={(e) => filterDate(e.target.value)}
                            className="w-48"
                        />
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="p-3 font-medium">
                                            Karyawan
                                        </th>
                                        <th className="p-3 font-medium">
                                            Tanggal
                                        </th>
                                        <th className="p-3 font-medium">
                                            Masuk
                                        </th>
                                        <th className="p-3 font-medium">
                                            Keluar
                                        </th>
                                        <th className="p-3 font-medium">
                                            Status
                                        </th>
                                        <th className="p-3 font-medium">
                                            Terlambat (mnt)
                                        </th>
                                        <th className="p-3 font-medium">
                                            Lembur (mnt)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendances.data.map((a: any) => (
                                        <tr
                                            key={a.id}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-3 font-medium">
                                                {a.employee?.first_name}{' '}
                                                {a.employee?.last_name}
                                            </td>
                                            <td className="p-3">{a.date}</td>
                                            <td className="p-3">
                                                {a.check_in_at ?? '-'}
                                            </td>
                                            <td className="p-3">
                                                {a.check_out_at ?? '-'}
                                            </td>
                                            <td className="p-3">
                                                <Badge variant="secondary">
                                                    {a.status}
                                                </Badge>
                                            </td>
                                            <td className="p-3">
                                                {a.late_minutes}
                                            </td>
                                            <td className="p-3">
                                                {a.overtime_minutes}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AttendanceIndex.layout = {
    breadcrumbs: [{ title: 'Absensi', href: '/attendance' }],
};
