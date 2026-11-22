import { Head, router, useForm } from '@inertiajs/react';
import {
    Calendar,
    CalendarDays,
    Clock,
    Plus,
    Trash2,
    UserCheck,
    Users,
} from 'lucide-react';
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
        if (confirm('Hapus jadwal shift ini?')) router.delete(`/shifts/${id}`);
    };

    return (
        <>
            <Head title="Shift & Jadwal Kerja - HR Sistem" />

            <div className="flex h-full flex-1 flex-col gap-6 bg-[#f8fafc] p-4 sm:p-6 lg:p-8 dark:bg-slate-950">
                {/* Header */}
                <header className="flex flex-col gap-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold tracking-widest text-[#16325c] uppercase dark:text-sky-400">
                                LOKET 03 · PENJADWALAN
                            </span>
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                Jam Kerja Pegawai
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0f274a] dark:text-white">
                            Master Shift & Penugasan Jadwal
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Pengaturan template shift kerja, jam istirahat,
                            serta alokasi jadwal harian pegawai.
                        </p>
                    </div>
                </header>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Tambah Shift Template */}
                    <div className="rounded-xl border border-t-4 border-slate-200 border-t-[#16325c] bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Clock className="size-4 text-[#16325c] dark:text-sky-400" />
                                <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase dark:text-white">
                                    Tambah Template Shift
                                </h3>
                            </div>
                        </div>

                        <form
                            onSubmit={submitShift}
                            className="mt-4 grid gap-3"
                        >
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">
                                    Nama Shift
                                </Label>
                                <Input
                                    placeholder="Contoh: Shift Pagi (08:00 - 17:00)"
                                    value={shiftForm.data.name}
                                    onChange={(e) =>
                                        shiftForm.setData(
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                    className="h-9 text-xs"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="grid gap-1.5">
                                    <Label className="text-xs font-semibold">
                                        Jam Mulai
                                    </Label>
                                    <Input
                                        type="time"
                                        value={shiftForm.data.start_time}
                                        onChange={(e) =>
                                            shiftForm.setData(
                                                'start_time',
                                                e.target.value,
                                            )
                                        }
                                        className="h-9 font-mono text-xs"
                                        required
                                    />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label className="text-xs font-semibold">
                                        Jam Selesai
                                    </Label>
                                    <Input
                                        type="time"
                                        value={shiftForm.data.end_time}
                                        onChange={(e) =>
                                            shiftForm.setData(
                                                'end_time',
                                                e.target.value,
                                            )
                                        }
                                        className="h-9 font-mono text-xs"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">
                                    Durasi Istirahat (Menit)
                                </Label>
                                <Input
                                    type="number"
                                    placeholder="60"
                                    value={shiftForm.data.break_minutes}
                                    onChange={(e) =>
                                        shiftForm.setData(
                                            'break_minutes',
                                            Number(e.target.value),
                                        )
                                    }
                                    className="h-9 font-mono text-xs"
                                />
                            </div>

                            <Button
                                disabled={shiftForm.processing}
                                type="submit"
                                className="mt-1 h-9 bg-[#12284c] text-xs font-semibold tracking-wider text-white uppercase shadow-sm hover:bg-[#1b3a6b]"
                            >
                                <Plus className="mr-1.5 size-3.5" />
                                Simpan Template Shift
                            </Button>
                        </form>
                    </div>

                    {/* Penugasan Shift ke Pegawai */}
                    <div className="rounded-xl border border-t-4 border-slate-200 border-t-sky-600 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <UserCheck className="size-4 text-sky-600" />
                                <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase dark:text-white">
                                    Tugaskan Shift ke Pegawai
                                </h3>
                            </div>
                        </div>

                        <form
                            onSubmit={submitAssign}
                            className="mt-4 grid gap-3"
                        >
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">
                                    Pilih Pegawai
                                </Label>
                                <Select
                                    value={assignForm.data.employee_id}
                                    onValueChange={(v) =>
                                        assignForm.setData('employee_id', v)
                                    }
                                >
                                    <SelectTrigger className="h-9 text-xs">
                                        <SelectValue placeholder="Pilih nama pegawai" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((e) => (
                                            <SelectItem
                                                key={e.id}
                                                value={String(e.id)}
                                                className="text-xs"
                                            >
                                                {e.employee_number} -{' '}
                                                {e.first_name} {e.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">
                                    Pilih Shift
                                </Label>
                                <Select
                                    value={assignForm.data.shift_id}
                                    onValueChange={(v) =>
                                        assignForm.setData('shift_id', v)
                                    }
                                >
                                    <SelectTrigger className="h-9 text-xs">
                                        <SelectValue placeholder="Pilih jadwal shift" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {shifts.map((s) => (
                                            <SelectItem
                                                key={s.id}
                                                value={String(s.id)}
                                                className="text-xs"
                                            >
                                                {s.name} ({s.start_time} -{' '}
                                                {s.end_time})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">
                                    Tanggal Penugasan
                                </Label>
                                <Input
                                    type="date"
                                    value={assignForm.data.date}
                                    onChange={(e) =>
                                        assignForm.setData(
                                            'date',
                                            e.target.value,
                                        )
                                    }
                                    className="h-9 font-mono text-xs"
                                    required
                                />
                            </div>

                            <Button
                                disabled={assignForm.processing}
                                type="submit"
                                className="mt-1 h-9 bg-sky-700 text-xs font-semibold tracking-wider text-white uppercase shadow-sm hover:bg-sky-800"
                            >
                                <UserCheck className="mr-1.5 size-3.5" />
                                Alokasikan Jadwal
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Daftar Shift & Penugasan Terkini */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Daftar Shift */}
                    <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="border-b border-slate-200/80 bg-slate-50/70 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                            <span className="font-mono text-xs font-bold tracking-wider text-[#0f274a] uppercase dark:text-white">
                                DAFTAR TEMPLATE SHIFT
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/80">
                                        <th className="p-3.5 pl-5">
                                            Nama Shift
                                        </th>
                                        <th className="p-3.5">Jam Masuk</th>
                                        <th className="p-3.5">Jam Keluar</th>
                                        <th className="p-3.5">Istirahat</th>
                                        <th className="p-3.5 pr-5 text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-mono dark:divide-slate-800">
                                    {shifts.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="p-6 text-center font-sans text-slate-400"
                                            >
                                                Belum ada template shift
                                                terdaftar.
                                            </td>
                                        </tr>
                                    ) : (
                                        shifts.map((s: any) => (
                                            <tr
                                                key={s.id}
                                                className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                                            >
                                                <td className="p-3.5 pl-5 font-sans font-semibold text-slate-900 dark:text-slate-100">
                                                    {s.name}
                                                </td>
                                                <td className="p-3.5 font-semibold text-emerald-700">
                                                    {s.start_time}
                                                </td>
                                                <td className="p-3.5 font-semibold text-amber-700">
                                                    {s.end_time}
                                                </td>
                                                <td className="p-3.5 text-slate-500">
                                                    {s.break_minutes} mnt
                                                </td>
                                                <td className="p-3.5 pr-5 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
                                                        onClick={() =>
                                                            removeShift(s.id)
                                                        }
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Penugasan Terkini */}
                    <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="border-b border-slate-200/80 bg-slate-50/70 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                            <span className="font-mono text-xs font-bold tracking-wider text-[#0f274a] uppercase dark:text-white">
                                JADWAL ALOKASI PEGAWAI TERKINI
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/80">
                                        <th className="p-3.5 pl-5">Pegawai</th>
                                        <th className="p-3.5">Tanggal</th>
                                        <th className="p-3.5 pr-5">
                                            Shift Kerja
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {assignments.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="p-6 text-center text-slate-400"
                                            >
                                                Belum ada penugasan shift
                                                tercatat.
                                            </td>
                                        </tr>
                                    ) : (
                                        assignments.map((a: any) => (
                                            <tr
                                                key={a.id}
                                                className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                                            >
                                                <td className="p-3.5 pl-5 font-semibold text-slate-900 dark:text-slate-100">
                                                    {a.employee?.first_name}{' '}
                                                    {a.employee?.last_name}
                                                </td>
                                                <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                                                    {a.date}
                                                </td>
                                                <td className="p-3.5 pr-5 font-medium text-[#16325c] dark:text-sky-400">
                                                    {a.shift?.name} (
                                                    {a.shift?.start_time} -{' '}
                                                    {a.shift?.end_time})
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ShiftsIndex.layout = {
    breadcrumbs: [{ title: 'Shift & Jadwal', href: '/shifts' }],
};
