import { Head, router, useForm } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    DollarSign,
    Eye,
    FileSpreadsheet,
    Plus,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = { periods: any[] };

export default function PayrollPeriods({ periods }: Props) {
    const form = useForm({
        name: '',
        start_date: '',
        end_date: '',
        pay_date: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/payroll/periods', { onSuccess: () => form.reset() });
    };

    const getStatusTicket = (status: string) => {
        const s = (status ?? '').toLowerCase();
        if (s === 'processed' || s === 'selesai') {
            return (
                <span className="inline-flex items-center rounded-sm bg-emerald-50 px-2.5 py-1 font-mono text-[11px] font-bold text-emerald-800 border border-emerald-200">
                    ✓ SELESAI DIPROSES
                </span>
            );
        }
        return (
            <span className="inline-flex items-center rounded-sm bg-sky-50 px-2.5 py-1 font-mono text-[11px] font-bold text-sky-800 border border-sky-200">
                ● DRAF PERIODE
            </span>
        );
    };

    return (
        <>
            <Head title="Periode Penggajian - HR Sistem" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 lg:p-8 bg-[#f8fafc] dark:bg-slate-950">
                {/* Header */}
                <header className="flex flex-col gap-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold tracking-widest text-[#16325c] uppercase dark:text-sky-400">
                                LOKET 06 · PENGGAJIAN
                            </span>
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                Payroll & Remunerasi
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0f274a] dark:text-white">
                            Periode Penggajian & Slip Gaji
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Pengelolaan siklus tutup buku penggajian bulanan, perhitungan tunjangan, dan penerbitan slip gaji.
                        </p>
                    </div>
                </header>

                {/* Form Buka Periode Baru */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 border-t-4 border-t-[#16325c]">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Plus className="size-4 text-[#16325c] dark:text-sky-400" />
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                Buka Periode Penggajian Baru
                            </h3>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400">
                            SIKLUS PAYROLL RESMI
                        </span>
                    </div>

                    <form onSubmit={submit} className="mt-4 grid gap-4 md:grid-cols-5">
                        <div className="grid gap-1.5 md:col-span-2">
                            <Label className="text-xs font-semibold">Nama / Identitas Periode</Label>
                            <Input
                                placeholder="Contoh: Gaji Periode November 2026"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                className="text-xs h-9"
                                required
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label className="text-xs font-semibold">Tanggal Mulai</Label>
                            <Input
                                type="date"
                                value={form.data.start_date}
                                onChange={(e) => form.setData('start_date', e.target.value)}
                                className="text-xs h-9 font-mono"
                                required
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label className="text-xs font-semibold">Tanggal Selesai</Label>
                            <Input
                                type="date"
                                value={form.data.end_date}
                                onChange={(e) => form.setData('end_date', e.target.value)}
                                className="text-xs h-9 font-mono"
                                required
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label className="text-xs font-semibold">Tgl Pencairan</Label>
                            <Input
                                type="date"
                                value={form.data.pay_date}
                                onChange={(e) => form.setData('pay_date', e.target.value)}
                                className="text-xs h-9 font-mono"
                                required
                            />
                        </div>
                        <div className="md:col-span-5 flex justify-end">
                            <Button
                                disabled={form.processing}
                                type="submit"
                                className="h-9 px-6 bg-[#12284c] hover:bg-[#1b3a6b] text-xs font-semibold uppercase tracking-wider text-white shadow-sm"
                            >
                                <Plus className="mr-1.5 size-3.5" />
                                Buka Periode Penggajian
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Table Periode Penggajian */}
                <div className="rounded-xl border border-slate-200/90 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-3.5 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#0f274a] dark:text-white uppercase tracking-wider">
                                ARSIP DAFTAR PERIODE PAYROLL
                            </span>
                            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-mono text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                {periods.length} periode
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400">
                                    <th className="p-3.5 pl-5">Nama Periode Penggajian</th>
                                    <th className="p-3.5">Rentang Siklus</th>
                                    <th className="p-3.5">Tanggal Transfer/Bayar</th>
                                    <th className="p-3.5">Status Pemrosesan</th>
                                    <th className="p-3.5 pr-5 text-right">Rincian Slip</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {periods.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-400 text-xs">
                                            Belum ada periode penggajian yang dibuka.
                                        </td>
                                    </tr>
                                ) : (
                                    periods.map((p: any) => (
                                        <tr
                                            key={p.id}
                                            className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                                        >
                                            <td className="p-3.5 pl-5 font-semibold text-slate-900 dark:text-slate-100">
                                                {p.name}
                                            </td>
                                            <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                                                {p.start_date} s/d {p.end_date}
                                            </td>
                                            <td className="p-3.5 font-mono font-semibold text-slate-800 dark:text-slate-200">
                                                {p.pay_date}
                                            </td>
                                            <td className="p-3.5">
                                                {getStatusTicket(p.status)}
                                            </td>
                                            <td className="p-3.5 pr-5 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 text-[11px] font-semibold text-[#16325c] hover:bg-slate-100 dark:text-sky-400"
                                                    onClick={() => router.visit(`/payroll/periods/${p.id}`)}
                                                >
                                                    <Eye className="mr-1 size-3" />
                                                    Buka Slip Gaji
                                                </Button>
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

PayrollPeriods.layout = {
    breadcrumbs: [{ title: 'Penggajian', href: '/payroll/periods' }],
};
