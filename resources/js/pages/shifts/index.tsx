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

type Props = {
    shifts: any[];
    assignments: any[];
    employees: any[];
};

export default function ShiftsIndex({ shifts, assignments, employees }: Props) {
    const shiftForm = useForm({
        name: '',
        start_time: '',
        end_time: '',
        break_minutes: 0,
    });

    const assignForm = useForm({
        employee_id: '',
        shift_id: '',
        date: '',
    });

    const submitShift = (e: React.FormEvent) => {
        e.preventDefault();
        shiftForm.post('/shifts', { onSuccess: () => shiftForm.reset() });
    };

    const submitAssign = (e: React.FormEvent) => {
        e.preventDefault();
        assignForm.post('/shifts/assign', {
            onSuccess: () => assignForm.reset(),
        });
    };

    const removeShift = (id: number) => {
        if (confirm('Delete shift?')) router.delete(`/shifts/${id}`);
    };

    return (
        <>
            <Head title="Shifts" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <header className="flex flex-col gap-1">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Shift & Jadwal
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola shift dan penugasan karyawan.
                    </p>
                </header>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tambah Shift</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitShift} className="grid gap-3">
                                <div className="grid gap-2">
                                    <Label>Nama</Label>
                                    <Input
                                        placeholder="Nama shift"
                                        value={shiftForm.data.name}
                                        onChange={(e) =>
                                            shiftForm.setData(
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Mulai</Label>
                                    <Input
                                        type="time"
                                        value={shiftForm.data.start_time}
                                        onChange={(e) =>
                                            shiftForm.setData(
                                                'start_time',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Selesai</Label>
                                    <Input
                                        type="time"
                                        value={shiftForm.data.end_time}
                                        onChange={(e) =>
                                            shiftForm.setData(
                                                'end_time',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Istirahat (mnt)</Label>
                                    <Input
                                        type="number"
                                        value={shiftForm.data.break_minutes}
                                        onChange={(e) =>
                                            shiftForm.setData(
                                                'break_minutes',
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                </div>
                                <Button
                                    disabled={shiftForm.processing}
                                    type="submit"
                                    className="w-full"
                                >
                                    Tambah Shift
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Penugasan Shift</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={submitAssign}
                                className="grid gap-3"
                            >
                                <div className="grid gap-2">
                                    <Label>Karyawan</Label>
                                    <Select
                                        value={assignForm.data.employee_id}
                                        onValueChange={(v) =>
                                            assignForm.setData('employee_id', v)
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
                                    <Label>Shift</Label>
                                    <Select
                                        value={assignForm.data.shift_id}
                                        onValueChange={(v) =>
                                            assignForm.setData('shift_id', v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih shift" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {shifts.map((s) => (
                                                <SelectItem
                                                    key={s.id}
                                                    value={String(s.id)}
                                                >
                                                    {s.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Tanggal</Label>
                                    <Input
                                        type="date"
                                        value={assignForm.data.date}
                                        onChange={(e) =>
                                            assignForm.setData(
                                                'date',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <Button
                                    disabled={assignForm.processing}
                                    type="submit"
                                    className="w-full"
                                >
                                    Tugaskan
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Shift</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="p-3 font-medium">
                                            Nama
                                        </th>
                                        <th className="p-3 font-medium">
                                            Mulai
                                        </th>
                                        <th className="p-3 font-medium">
                                            Selesai
                                        </th>
                                        <th className="p-3 font-medium">
                                            Istirahat (mnt)
                                        </th>
                                        <th className="p-3 font-medium">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shifts.map((s: any) => (
                                        <tr
                                            key={s.id}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-3 font-medium">
                                                {s.name}
                                            </td>
                                            <td className="p-3">
                                                {s.start_time}
                                            </td>
                                            <td className="p-3">
                                                {s.end_time}
                                            </td>
                                            <td className="p-3">
                                                {s.break_minutes}
                                            </td>
                                            <td className="p-3">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeShift(s.id)
                                                    }
                                                >
                                                    Hapus
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Penugasan Terbaru</CardTitle>
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
                                            Shift
                                        </th>
                                        <th className="p-3 font-medium">
                                            Tanggal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignments.map((a: any) => (
                                        <tr
                                            key={a.id}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-3 font-medium">
                                                {a.employee?.first_name}{' '}
                                                {a.employee?.last_name}
                                            </td>
                                            <td className="p-3">
                                                {a.shift?.name}
                                            </td>
                                            <td className="p-3">{a.date}</td>
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

ShiftsIndex.layout = {
    breadcrumbs: [{ title: 'Shift & Jadwal', href: '/shifts' }],
};
