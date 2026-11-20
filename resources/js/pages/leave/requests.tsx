import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Calendar,
    CalendarCheck,
    Check,
    Clock,
    FileText,
    PieChart,
    Plus,
    Send,
    UserCheck,
    X,
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
    requests: { data: any[] };
    leaveTypes: any[];
    employees: any[];
    balances: any[];
    isAdmin: boolean;
};

export default function LeaveRequests({
    requests,
    leaveTypes,
    employees,
    balances,
    isAdmin,
}: Props) {
    const form = useForm({
        employee_id: '',
        leave_type_id: '',
        start_date: '',
        end_date: '',
        reason: '',
        attachment: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/leave/requests', { onSuccess: () => form.reset() });
    };

    const approve = (id: number) =>
        router.post(`/leave/requests/${id}/approve`);

    const reject = (id: number) => {
        const reason = prompt('Alasan penolakan (opsional):') ?? '';
        router.post(`/leave/requests/${id}/reject`, {
            rejection_reason: reason,
        });
    };

    const getStatusTicket = (status: string) => {
        const s = (status ?? '').toLowerCase();
        if (s === 'approved' || s === 'disetujui') {
            return (
                <span className="inline-flex items-center rounded-sm border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-[11px] font-bold text-emerald-800">
                    ✓ DISETUJUI
                </span>
            );
        }
        if (s === 'rejected' || s === 'ditolak') {
            return (
                <span className="inline-flex items-center rounded-sm border border-red-200 bg-red-50 px-2.5 py-1 font-mono text-[11px] font-bold text-red-800">
                    ✕ DITOLAK
                </span>
            );
        }
        return (
            <span className="inline-flex animate-pulse items-center rounded-sm border border-amber-200 bg-amber-50 px-2.5 py-1 font-mono text-[11px] font-bold text-amber-800">
                ⏳ MENUNGGU VERIFIKASI
            </span>
        );
    };

    return (
        <>
            <Head title="Pengajuan Cuti & Izin - HR Sistem" />

            <div className="flex h-full flex-1 flex-col gap-6 bg-[#f8fafc] p-6 lg:p-8 dark:bg-slate-950">
                {/* Header */}
                <header className="flex flex-col gap-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold tracking-widest text-[#16325c] uppercase dark:text-sky-400">
                                LOKET 05 · CUTI & IZIN
                            </span>
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                Self-Service & Approval
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0f274a] dark:text-white">
                            Loket Pelayanan Cuti & Dispensasi
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Pengajuan izin ketidakhadiran, cuti tahunan, sakit,
                            serta verifikasi persetujuan atasan.
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        asChild
                        className="h-9 text-xs font-semibold"
                    >
                        <Link href="/leave/types">
                            <FileText className="mr-1.5 size-3.5" />
                            Kelola Jenis Cuti & Kuota
                        </Link>
                    </Button>
                </header>

                {/* Form Pengajuan Cuti Baru */}
                <div className="rounded-xl border border-t-4 border-slate-200 border-t-[#16325c] bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Plus className="size-4 text-[#16325c] dark:text-sky-400" />
                            <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase dark:text-white">
                                Formulir Pengajuan Cuti / Izin Baru
                            </h3>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400">
                            PENGURANGAN KUOTA OTOMATIS
                        </span>
                    </div>

                    <form
                        onSubmit={submit}
                        className="mt-4 grid gap-4 md:grid-cols-3"
                    >
                        <div className="grid gap-1.5">
                            <Label className="text-xs font-semibold">
                                Pegawai Pemohon
                            </Label>
                            <Select
                                value={form.data.employee_id}
                                onValueChange={(v) =>
                                    form.setData('employee_id', v)
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
                                            {e.employee_number} - {e.first_name}{' '}
                                            {e.last_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-1.5">
                            <Label className="text-xs font-semibold">
                                Jenis Cuti / Izin
                            </Label>
                            <Select
                                value={form.data.leave_type_id}
                                onValueChange={(v) =>
                                    form.setData('leave_type_id', v)
                                }
                            >
                                <SelectTrigger className="h-9 text-xs">
                                    <SelectValue placeholder="Pilih jenis cuti" />
                                </SelectTrigger>
                                <SelectContent>
                                    {leaveTypes.map((lt) => (
                                        <SelectItem
                                            key={lt.id}
                                            value={String(lt.id)}
                                            className="text-xs"
                                        >
                                            {lt.name} ({lt.days_allowed} hari)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">
                                    Tgl Mulai
                                </Label>
                                <Input
                                    type="date"
                                    value={form.data.start_date}
                                    onChange={(e) =>
                                        form.setData(
                                            'start_date',
                                            e.target.value,
                                        )
                                    }
                                    className="h-9 font-mono text-xs"
                                    required
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">
                                    Tgl Selesai
                                </Label>
                                <Input
                                    type="date"
                                    value={form.data.end_date}
                                    onChange={(e) =>
                                        form.setData('end_date', e.target.value)
                                    }
                                    className="h-9 font-mono text-xs"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-1.5 md:col-span-2">
                            <Label className="text-xs font-semibold">
                                Alasan & Keterangan Pengajuan
                            </Label>
                            <Input
                                placeholder="Contoh: Keperluan keluarga / sakit dengan surat dokter"
                                value={form.data.reason}
                                onChange={(e) =>
                                    form.setData('reason', e.target.value)
                                }
                                className="h-9 text-xs"
                                required
                            />
                        </div>

                        <div className="flex items-end">
                            <Button
                                disabled={form.processing}
                                type="submit"
                                className="h-9 w-full bg-[#12284c] text-xs font-semibold tracking-wider text-white uppercase shadow-sm hover:bg-[#1b3a6b]"
                            >
                                <Send className="mr-1.5 size-3.5" />
                                Kirim Pengajuan
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Antrean Pengajuan Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/70 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold tracking-wider text-[#0f274a] uppercase dark:text-white">
                                ANTREAN PENGAJUAN CUTI & IZIN
                            </span>
                            <span className="rounded-full bg-slate-200 px-2 py-0.5 font-mono text-[10px] text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                {requests.data.length} pengajuan
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400">
                                    <th className="p-3.5 pl-5">
                                        NIP & Nama Pegawai
                                    </th>
                                    <th className="p-3.5">Jenis Cuti</th>
                                    <th className="p-3.5">Rentang Tanggal</th>
                                    <th className="p-3.5">Total Hari</th>
                                    <th className="p-3.5">Alasan</th>
                                    <th className="p-3.5">Status Pengajuan</th>
                                    <th className="p-3.5 pr-5 text-right">
                                        Tindakan Verifikasi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {requests.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="p-8 text-center text-xs text-slate-400"
                                        >
                                            Tidak ada antrean pengajuan cuti
                                            saat ini.
                                        </td>
                                    </tr>
                                ) : (
                                    requests.data.map((r: any) => (
                                        <tr
                                            key={r.id}
                                            className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                                        >
                                            <td className="p-3.5 pl-5">
                                                <p className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {r.employee?.first_name}{' '}
                                                    {r.employee?.last_name}
                                                </p>
                                                <p className="font-mono text-[10px] text-slate-400">
                                                    {
                                                        r.employee
                                                            ?.employee_number
                                                    }
                                                </p>
                                            </td>
                                            <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">
                                                {r.leave_type?.name}
                                            </td>
                                            <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                                                {r.start_date} s/d {r.end_date}
                                            </td>
                                            <td className="p-3.5 font-mono font-bold text-[#0f274a] dark:text-sky-400">
                                                {r.total_days} hari
                                            </td>
                                            <td className="max-w-xs truncate p-3.5 text-slate-600 dark:text-slate-400">
                                                {r.reason}
                                            </td>
                                            <td className="p-3.5">
                                                {getStatusTicket(r.status)}
                                            </td>
                                            <td className="p-3.5 pr-5 text-right">
                                                {isAdmin &&
                                                r.status === 'pending' ? (
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Button
                                                            size="sm"
                                                            className="h-7 bg-emerald-700 px-2.5 text-[11px] font-semibold text-white hover:bg-emerald-800"
                                                            onClick={() =>
                                                                approve(r.id)
                                                            }
                                                        >
                                                            <Check className="mr-1 size-3" />
                                                            Setujui
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="h-7 px-2.5 text-[11px] font-semibold"
                                                            onClick={() =>
                                                                reject(r.id)
                                                            }
                                                        >
                                                            <X className="mr-1 size-3" />
                                                            Tolak
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="font-mono text-[10px] text-slate-400 uppercase">
                                                        Selesai Diproses
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sisa Kuota Cuti Section */}
                <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-200/80 bg-slate-50/70 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                        <span className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider text-[#0f274a] uppercase dark:text-white">
                            <PieChart className="size-4 text-[#16325c] dark:text-sky-400" />
                            REKAPITULASI SISA KUOTA CUTI PEGAWAI
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/80">
                                    <th className="p-3.5 pl-5">Pegawai</th>
                                    <th className="p-3.5">Jenis Cuti</th>
                                    <th className="p-3.5">Tahun Periode</th>
                                    <th className="p-3.5">Total Hak</th>
                                    <th className="p-3.5">Terpakai</th>
                                    <th className="p-3.5 pr-5">Sisa Kuota</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono dark:divide-slate-800">
                                {balances.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="p-6 text-center font-sans text-xs text-slate-400"
                                        >
                                            Belum ada data saldo cuti tercatat.
                                        </td>
                                    </tr>
                                ) : (
                                    balances.map((b: any) => (
                                        <tr
                                            key={b.id}
                                            className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                                        >
                                            <td className="p-3.5 pl-5 font-sans font-semibold text-slate-900 dark:text-slate-100">
                                                {b.employee?.first_name}{' '}
                                                {b.employee?.last_name}
                                            </td>
                                            <td className="p-3.5 font-sans text-slate-600 dark:text-slate-300">
                                                {b.leave_type?.name}
                                            </td>
                                            <td className="p-3.5 text-slate-500">
                                                {b.year}
                                            </td>
                                            <td className="p-3.5 text-slate-600">
                                                {b.total_days} hari
                                            </td>
                                            <td className="p-3.5 text-amber-700">
                                                {b.used_days} hari
                                            </td>
                                            <td className="p-3.5 pr-5 font-bold text-emerald-700">
                                                {b.total_days - b.used_days}{' '}
                                                hari
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

LeaveRequests.layout = {
    breadcrumbs: [{ title: 'Cuti & Izin', href: '/leave/requests' }],
};
