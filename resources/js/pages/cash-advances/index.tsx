import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    Banknote,
    Check,
    CreditCard,
    DollarSign,
    QrCode,
    Send,
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
    cashAdvances: { data: any[] };
    employees: any[];
    isAdmin: boolean;
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
    pending: {
        label: 'Menunggu Atasan',
        color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    supervisor_approved: {
        label: 'Disetujui Atasan',
        color: 'bg-sky-50 text-sky-800 border-sky-200',
    },
    finance_approved: {
        label: 'Disetujui Finance',
        color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
    disbursed: {
        label: 'Dicairkan',
        color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    repaying: {
        label: 'Cicilan Berjalan',
        color: 'bg-purple-50 text-purple-800 border-purple-200',
    },
    paid: {
        label: 'Lunas',
        color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    },
    rejected: {
        label: 'Ditolak',
        color: 'bg-red-50 text-red-800 border-red-200',
    },
};

export default function CashAdvancesIndex({
    cashAdvances,
    employees,
    isAdmin,
}: Props) {
    const [payingId, setPayingId] = useState<number | null>(null);

    const form = useForm({
        amount: '',
        reason: '',
        total_installments: '3',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/cash-advances', { onSuccess: () => form.reset() });
    };

    const supervisorApprove = (id: number) =>
        router.post(`/cash-advances/${id}/supervisor-approve`);
    const financeApprove = (id: number) =>
        router.post(`/cash-advances/${id}/finance-approve`);
    const disburse = (id: number) =>
        router.post(`/cash-advances/${id}/disburse`);
    const reject = (id: number) => {
        const reason = prompt('Alasan penolakan (opsional):') ?? '';
        router.post(`/cash-advances/${id}/reject`, {
            rejection_reason: reason,
        });
    };
    const payInstallment = (id: number) =>
        router.post(`/cash-advances/installments/${id}/pay`);

    return (
        <>
            <Head title="Kasbon - HR Sistem" />
            <div className="flex h-full flex-1 flex-col gap-6 bg-[#f8fafc] p-6 lg:p-8 dark:bg-slate-950">
                <header className="flex flex-col gap-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold tracking-widest text-[#16325c] uppercase dark:text-sky-400">
                                LOKET KASBON
                            </span>
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                Cash Advance
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0f274a] dark:text-white">
                            Kasbon & Cicilan Pegawai
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Pengajuan kasbon, persetujuan berjenjang, dan
                            pembayaran cicilan via QRIS.
                        </p>
                    </div>
                </header>

                {/* Form Pengajuan Kasbon (karyawan) */}
                {!isAdmin && (
                    <div className="rounded-xl border border-t-4 border-slate-200 border-t-[#16325c] bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                            <Banknote className="size-4 text-[#16325c] dark:text-sky-400" />
                            <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase dark:text-white">
                                Formulir Pengajuan Kasbon Baru
                            </h3>
                        </div>
                        <form
                            onSubmit={submit}
                            className="mt-4 grid gap-4 md:grid-cols-3"
                        >
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">
                                    Jumlah Kasbon (Rp)
                                </Label>
                                <Input
                                    type="number"
                                    min={100000}
                                    value={form.data.amount}
                                    onChange={(e) =>
                                        form.setData('amount', e.target.value)
                                    }
                                    className="h-9 text-xs"
                                    required
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">
                                    Jumlah Cicilan
                                </Label>
                                <Select
                                    value={form.data.total_installments}
                                    onValueChange={(v) =>
                                        form.setData('total_installments', v)
                                    }
                                >
                                    <SelectTrigger className="h-9 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[1, 2, 3, 4, 6, 8, 12].map((n) => (
                                            <SelectItem
                                                key={n}
                                                value={String(n)}
                                                className="text-xs"
                                            >
                                                {n}x cicilan
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-1.5 md:col-span-1">
                                <Label className="text-xs font-semibold">
                                    Alasan Pengajuan
                                </Label>
                                <Input
                                    placeholder="Contoh: Biaya pengobatan / pendidikan"
                                    value={form.data.reason}
                                    onChange={(e) =>
                                        form.setData('reason', e.target.value)
                                    }
                                    className="h-9 text-xs"
                                    required
                                />
                            </div>
                            <div className="flex items-end md:col-span-3">
                                <Button
                                    disabled={form.processing}
                                    type="submit"
                                    className="h-9 bg-[#12284c] text-xs font-semibold tracking-wider text-white uppercase shadow-sm hover:bg-[#1b3a6b]"
                                >
                                    <Send className="mr-1.5 size-3.5" />
                                    Ajukan Kasbon
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Daftar Kasbon */}
                <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/70 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                        <span className="font-mono text-xs font-bold tracking-wider text-[#0f274a] uppercase dark:text-white">
                            ANTREAN KASBON
                        </span>
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 font-mono text-[10px] text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                            {cashAdvances.data.length} pengajuan
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400">
                                    <th className="p-3.5 pl-5">Pegawai</th>
                                    <th className="p-3.5">Jumlah</th>
                                    <th className="p-3.5">Alasan</th>
                                    <th className="p-3.5">Cicilan</th>
                                    <th className="p-3.5">Sisa</th>
                                    <th className="p-3.5">Status</th>
                                    <th className="p-3.5 pr-5 text-right">
                                        Tindakan
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {cashAdvances.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="p-8 text-center text-xs text-slate-400"
                                        >
                                            Belum ada pengajuan kasbon.
                                        </td>
                                    </tr>
                                ) : (
                                    cashAdvances.data.map((ca: any) => {
                                        const statusInfo =
                                            STATUS_LABEL[ca.status] ??
                                            STATUS_LABEL.pending;
                                        return (
                                            <tr
                                                key={ca.id}
                                                className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                                            >
                                                <td className="p-3.5 pl-5">
                                                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {
                                                            ca.employee
                                                                ?.first_name
                                                        }{' '}
                                                        {ca.employee?.last_name}
                                                    </p>
                                                    <p className="font-mono text-[10px] text-slate-400">
                                                        {
                                                            ca.employee
                                                                ?.employee_number
                                                        }
                                                    </p>
                                                </td>
                                                <td className="p-3.5 font-mono font-bold text-[#0f274a] dark:text-sky-400">
                                                    Rp{' '}
                                                    {Number(
                                                        ca.amount,
                                                    ).toLocaleString('id-ID')}
                                                </td>
                                                <td className="max-w-xs truncate p-3.5 text-slate-600 dark:text-slate-400">
                                                    {ca.reason}
                                                </td>
                                                <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                                                    {ca.total_installments}x @
                                                    Rp{' '}
                                                    {Number(
                                                        ca.installment_amount,
                                                    ).toLocaleString('id-ID')}
                                                </td>
                                                <td className="p-3.5 font-mono font-bold text-amber-700">
                                                    Rp{' '}
                                                    {Number(
                                                        ca.remaining_balance,
                                                    ).toLocaleString('id-ID')}
                                                </td>
                                                <td className="p-3.5">
                                                    <span
                                                        className={`inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[10px] font-bold ${statusInfo.color}`}
                                                    >
                                                        {statusInfo.label}
                                                    </span>
                                                </td>
                                                <td className="p-3.5 pr-5 text-right">
                                                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                                                        {isAdmin &&
                                                            ca.status ===
                                                                'pending' && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        className="h-7 bg-sky-700 px-2.5 text-[11px] font-semibold text-white hover:bg-sky-800"
                                                                        onClick={() =>
                                                                            supervisorApprove(
                                                                                ca.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Check className="mr-1 size-3" />
                                                                        Atasan
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        className="h-7 px-2.5 text-[11px] font-semibold"
                                                                        onClick={() =>
                                                                            reject(
                                                                                ca.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <X className="mr-1 size-3" />
                                                                        Tolak
                                                                    </Button>
                                                                </>
                                                            )}
                                                        {isAdmin &&
                                                            ca.status ===
                                                                'supervisor_approved' && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        className="h-7 bg-indigo-700 px-2.5 text-[11px] font-semibold text-white hover:bg-indigo-800"
                                                                        onClick={() =>
                                                                            financeApprove(
                                                                                ca.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Check className="mr-1 size-3" />
                                                                        Finance
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        className="h-7 px-2.5 text-[11px] font-semibold"
                                                                        onClick={() =>
                                                                            reject(
                                                                                ca.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <X className="mr-1 size-3" />
                                                                        Tolak
                                                                    </Button>
                                                                </>
                                                            )}
                                                        {isAdmin &&
                                                            ca.status ===
                                                                'finance_approved' && (
                                                                <Button
                                                                    size="sm"
                                                                    className="h-7 bg-emerald-700 px-2.5 text-[11px] font-semibold text-white hover:bg-emerald-800"
                                                                    onClick={() =>
                                                                        disburse(
                                                                            ca.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <Banknote className="mr-1 size-3" />
                                                                    Cairkan
                                                                </Button>
                                                            )}
                                                        {!isAdmin &&
                                                            (ca.status ===
                                                                'disbursed' ||
                                                                ca.status ===
                                                                    'repaying') && (
                                                                <Button
                                                                    size="sm"
                                                                    className="h-7 bg-purple-700 px-2.5 text-[11px] font-semibold text-white hover:bg-purple-800"
                                                                    onClick={() =>
                                                                        setPayingId(
                                                                            ca.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <QrCode className="mr-1 size-3" />
                                                                    Bayar
                                                                    Cicilan
                                                                </Button>
                                                            )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal Bayar Cicilan via QRIS */}
                {payingId !== null && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                        <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl dark:bg-slate-900">
                            <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                                Pembayaran Cicilan via QRIS
                            </h3>
                            {(() => {
                                const ca = cashAdvances.data.find(
                                    (c: any) => c.id === payingId,
                                );
                                const nextInstallment = ca?.installments?.find(
                                    (i: any) => i.status === 'pending',
                                );
                                if (!nextInstallment) {
                                    return (
                                        <p className="text-xs text-slate-500">
                                            Semua cicilan sudah lunas.
                                        </p>
                                    );
                                }
                                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=KASBON-${ca.id}-INSTALLMENT-${nextInstallment.installment_number}-AMOUNT-${nextInstallment.amount}`;
                                return (
                                    <div className="space-y-4 text-center">
                                        <p className="text-xs text-slate-600">
                                            Scan QR berikut dengan aplikasi
                                            e-wallet / mobile banking Anda.
                                        </p>
                                        <div className="flex justify-center">
                                            <img
                                                src={qrUrl}
                                                alt="QRIS"
                                                className="size-48 rounded-lg border"
                                            />
                                        </div>
                                        <div className="rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-800">
                                            <p className="font-semibold text-slate-800 dark:text-white">
                                                Cicilan ke-
                                                {
                                                    nextInstallment.installment_number
                                                }
                                            </p>
                                            <p className="font-mono text-lg font-bold text-[#0f274a] dark:text-sky-400">
                                                Rp{' '}
                                                {Number(
                                                    nextInstallment.amount,
                                                ).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                className="flex-1 bg-purple-700 text-xs font-semibold text-white hover:bg-purple-800"
                                                onClick={() =>
                                                    payInstallment(
                                                        nextInstallment.id,
                                                    )
                                                }
                                            >
                                                <CreditCard className="mr-1.5 size-4" />
                                                Konfirmasi Pembayaran
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="text-xs"
                                                onClick={() =>
                                                    setPayingId(null)
                                                }
                                            >
                                                Tutup
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

CashAdvancesIndex.layout = {
    breadcrumbs: [{ title: 'Kasbon', href: '/cash-advances' }],
};
