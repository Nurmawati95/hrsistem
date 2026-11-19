import { Head, router, useForm } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    FileSpreadsheet,
    LogIn,
    LogOut,
    PlusCircle,
    UserCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

    const getStatusTicket = (status: string, lateMinutes: number) => {
        const s = (status ?? '').toLowerCase();
        if (lateMinutes > 0 || s.includes('late') || s.includes('terlambat')) {
            return (
                <span className="inline-flex items-center rounded-sm bg-amber-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-amber-800 border border-amber-200">
                    TERLAMBAT ({lateMinutes}m)
                </span>
            );
        }
        if (s.includes('present') || s.includes('hadir')) {
            return (
                <span className="inline-flex items-center rounded-sm bg-emerald-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                    TEPAT WAKTU
                </span>
            );
        }
        if (s.includes('absent') || s.includes('alfa')) {
            return (
                <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-red-800 border border-red-200">
                    ALFA
                </span>
            );
        }
        return (
            <span className="inline-flex items-center rounded-sm bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700 border border-slate-200">
                {status}
            </span>
        );
    };

    return (
        <>
            <Head title="Absensi & Presensi - HR Sistem" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 lg:p-8 bg-[#f8fafc] dark:bg-slate-950">
                {/* Header */}
                <header className="flex flex-col gap-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold tracking-widest text-[#16325c] uppercase dark:text-sky-400">
                                LOKET 04 · KEHADIRAN
                            </span>
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                Presensi Harian
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0f274a] dark:text-white">
                            Loket Presensi & Kehadiran Pegawai
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Pencatatan waktu masuk, keluar, status keterlambatan, dan jam lembur pegawai.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-500">Tanggal Operasional:</span>
                        <Input
                            type="date"
                            defaultValue={filters.date ?? new Date().toISOString().slice(0, 10)}
                            onChange={(e) => filterDate(e.target.value)}
                            className="w-40 text-xs h-9 bg-slate-50 font-mono font-semibold"
                        />
                    </div>
                </header>

                {/* Quick Check-in / Check-out Desk */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Check In Box */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 border-t-4 border-t-emerald-600">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="flex size-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                                    <LogIn className="size-4" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Loket Check-In Masuk
                                </h3>
                            </div>
                            <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                MASUK KERJA
                            </span>
                        </div>

                        <form onSubmit={doCheckIn} className="mt-4 grid gap-3">
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">Nama Pegawai</Label>
                                <Select
                                    value={checkInForm.data.employee_id}
                                    onValueChange={(v) => checkInForm.setData('employee_id', v)}
                                >
                                    <SelectTrigger className="text-xs h-9">
                                        <SelectValue placeholder="Pilih pegawai yang check-in" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((e) => (
                                            <SelectItem key={e.id} value={String(e.id)} className="text-xs">
                                                {e.employee_number} - {e.first_name} {e.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">Lokasi / Titik Presensi</Label>
                                <Input
                                    placeholder="Contoh: Kantor Pusat Lt. 12 / WFH"
                                    value={checkInForm.data.location}
                                    onChange={(e) => checkInForm.setData('location', e.target.value)}
                                    className="text-xs h-9"
                                />
                            </div>

                            <Button
                                disabled={checkInForm.processing || !checkInForm.data.employee_id}
                                type="submit"
                                className="mt-1 h-9 bg-emerald-700 hover:bg-emerald-800 text-xs font-semibold uppercase tracking-wider text-white"
                            >
                                Catat Check-In Masuk
                            </Button>
                        </form>
                    </div>

                    {/* Check Out Box */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 border-t-4 border-t-amber-600">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="flex size-7 items-center justify-center rounded-md bg-amber-50 text-amber-700">
                                    <LogOut className="size-4" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Loket Check-Out Pulang
                                </h3>
                            </div>
                            <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                                SELESAI KERJA
                            </span>
                        </div>

                        <form onSubmit={doCheckOut} className="mt-4 grid gap-3">
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">Nama Pegawai</Label>
                                <Select
                                    value={checkOutForm.data.employee_id}
                                    onValueChange={(v) => checkOutForm.setData('employee_id', v)}
                                >
                                    <SelectTrigger className="text-xs h-9">
                                        <SelectValue placeholder="Pilih pegawai yang check-out" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((e) => (
                                            <SelectItem key={e.id} value={String(e.id)} className="text-xs">
                                                {e.employee_number} - {e.first_name} {e.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">Lokasi / Catatan</Label>
                                <Input
                                    placeholder="Contoh: Kantor Pusat"
                                    value={checkOutForm.data.location}
                                    onChange={(e) => checkOutForm.setData('location', e.target.value)}
                                    className="text-xs h-9"
                                />
                            </div>

                            <Button
                                disabled={checkOutForm.processing || !checkOutForm.data.employee_id}
                                type="submit"
                                className="mt-1 h-9 bg-amber-600 hover:bg-amber-700 text-xs font-semibold uppercase tracking-wider text-white"
                            >
                                Catat Check-Out Pulang
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Riwayat Absensi Table */}
                <div className="rounded-xl border border-slate-200/90 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-3.5 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#0f274a] dark:text-white uppercase tracking-wider">
                                JURNAL LOG PRESENSI HARIAN
                            </span>
                            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-mono text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                {attendances.data.length} rekaman
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400">
                                    <th className="p-3.5 pl-5">NIP & Nama Pegawai</th>
                                    <th className="p-3.5">Tanggal</th>
                                    <th className="p-3.5">Check-In</th>
                                    <th className="p-3.5">Check-Out</th>
                                    <th className="p-3.5">Status Kehadiran</th>
                                    <th className="p-3.5">Terlambat</th>
                                    <th className="p-3.5 pr-5">Lembur</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {attendances.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                                            Belum ada catatan presensi untuk tanggal yang dipilih.
                                        </td>
                                    </tr>
                                ) : (
                                    attendances.data.map((a: any) => (
                                        <tr
                                            key={a.id}
                                            className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                                        >
                                            <td className="p-3.5 pl-5">
                                                <p className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {a.employee?.first_name} {a.employee?.last_name}
                                                </p>
                                                <p className="font-mono text-[10px] text-slate-400">
                                                    {a.employee?.employee_number}
                                                </p>
                                            </td>
                                            <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                                                {a.date}
                                            </td>
                                            <td className="p-3.5 font-mono font-semibold text-emerald-700">
                                                {a.check_in_at ? a.check_in_at.slice(11, 16) || a.check_in_at : '-'}
                                            </td>
                                            <td className="p-3.5 font-mono font-semibold text-amber-700">
                                                {a.check_out_at ? a.check_out_at.slice(11, 16) || a.check_out_at : '-'}
                                            </td>
                                            <td className="p-3.5">
                                                {getStatusTicket(a.status, a.late_minutes ?? 0)}
                                            </td>
                                            <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                                                {a.late_minutes > 0 ? `${a.late_minutes} mnt` : '-'}
                                            </td>
                                            <td className="p-3.5 pr-5 font-mono text-slate-600 dark:text-slate-400">
                                                {a.overtime_minutes > 0 ? `${a.overtime_minutes} mnt` : '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

AttendanceIndex.layout = {
    breadcrumbs: [{ title: 'Absensi & Presensi', href: '/attendance' }],
};
