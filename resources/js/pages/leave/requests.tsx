import { Head, Link, router, useForm } from '@inertiajs/react';
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
};

export default function LeaveRequests({
    requests,
    leaveTypes,
    employees,
    balances,
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
        const reason = prompt('Rejection reason (optional):') ?? '';
        router.post(`/leave/requests/${id}/reject`, {
            rejection_reason: reason,
        });
    };

    return (
        <>
            <Head title="Leave Requests" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Pengajuan Cuti & Izin
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Ajukan cuti dan kelola persetujuan.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/leave/types">Kelola Jenis Cuti</Link>
                    </Button>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle>Ajukan Cuti</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="grid gap-3 md:grid-cols-3"
                        >
                            <div className="grid gap-2">
                                <Label>Karyawan</Label>
                                <Select
                                    value={form.data.employee_id}
                                    onValueChange={(v) =>
                                        form.setData('employee_id', v)
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
                                <Label>Jenis Cuti</Label>
                                <Select
                                    value={form.data.leave_type_id}
                                    onValueChange={(v) =>
                                        form.setData('leave_type_id', v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih jenis" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {leaveTypes.map((lt) => (
                                            <SelectItem
                                                key={lt.id}
                                                value={String(lt.id)}
                                            >
                                                {lt.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Mulai</Label>
                                <Input
                                    type="date"
                                    value={form.data.start_date}
                                    onChange={(e) =>
                                        form.setData(
                                            'start_date',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Selesai</Label>
                                <Input
                                    type="date"
                                    value={form.data.end_date}
                                    onChange={(e) =>
                                        form.setData('end_date', e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid gap-2 md:col-span-2">
                                <Label>Alasan</Label>
                                <Input
                                    placeholder="Alasan"
                                    value={form.data.reason}
                                    onChange={(e) =>
                                        form.setData('reason', e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Lampiran (path)</Label>
                                <Input
                                    placeholder="Attachment path"
                                    value={form.data.attachment}
                                    onChange={(e) =>
                                        form.setData(
                                            'attachment',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    disabled={form.processing}
                                    type="submit"
                                    className="w-full"
                                >
                                    Kirim
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pengajuan</CardTitle>
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
                                            Jenis
                                        </th>
                                        <th className="p-3 font-medium">
                                            Mulai
                                        </th>
                                        <th className="p-3 font-medium">
                                            Selesai
                                        </th>
                                        <th className="p-3 font-medium">
                                            Hari
                                        </th>
                                        <th className="p-3 font-medium">
                                            Status
                                        </th>
                                        <th className="p-3 font-medium">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.data.map((r: any) => (
                                        <tr
                                            key={r.id}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-3 font-medium">
                                                {r.employee?.first_name}{' '}
                                                {r.employee?.last_name}
                                            </td>
                                            <td className="p-3">
                                                {r.leave_type?.name}
                                            </td>
                                            <td className="p-3">
                                                {r.start_date}
                                            </td>
                                            <td className="p-3">
                                                {r.end_date}
                                            </td>
                                            <td className="p-3">{r.days}</td>
                                            <td className="p-3">
                                                <Badge
                                                    variant={
                                                        r.status === 'approved'
                                                            ? 'default'
                                                            : r.status ===
                                                                'rejected'
                                                              ? 'destructive'
                                                              : 'secondary'
                                                    }
                                                >
                                                    {r.status}
                                                </Badge>
                                            </td>
                                            <td className="p-3">
                                                {r.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                approve(r.id)
                                                            }
                                                        >
                                                            Setujui
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                reject(r.id)
                                                            }
                                                        >
                                                            Tolak
                                                        </Button>
                                                    </div>
                                                )}
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
                        <CardTitle>Sisa Kuota Cuti</CardTitle>
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
                                            Jenis
                                        </th>
                                        <th className="p-3 font-medium">
                                            Tahun
                                        </th>
                                        <th className="p-3 font-medium">
                                            Total
                                        </th>
                                        <th className="p-3 font-medium">
                                            Terpakai
                                        </th>
                                        <th className="p-3 font-medium">
                                            Sisa
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {balances.map((b: any) => (
                                        <tr
                                            key={b.id}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-3 font-medium">
                                                {b.employee?.first_name}{' '}
                                                {b.employee?.last_name}
                                            </td>
                                            <td className="p-3">
                                                {b.leave_type?.name}
                                            </td>
                                            <td className="p-3">{b.year}</td>
                                            <td className="p-3">
                                                {b.total_days}
                                            </td>
                                            <td className="p-3">
                                                {b.used_days}
                                            </td>
                                            <td className="p-3 font-medium">
                                                {b.total_days - b.used_days}
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

LeaveRequests.layout = {
    breadcrumbs: [{ title: 'Pengajuan Cuti', href: '/leave/requests' }],
};
