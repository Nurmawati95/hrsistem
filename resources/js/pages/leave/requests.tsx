import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Pengajuan Cuti & Izin
                    </h1>
                    <Link
                        href="/leave/types"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Kelola Jenis Cuti
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Ajukan Cuti</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="grid gap-2 md:grid-cols-3"
                        >
                            <Select
                                value={form.data.employee_id}
                                onValueChange={(v) =>
                                    form.setData('employee_id', v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Employee" />
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
                            <Select
                                value={form.data.leave_type_id}
                                onValueChange={(v) =>
                                    form.setData('leave_type_id', v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Leave Type" />
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
                            <Input
                                type="date"
                                value={form.data.start_date}
                                onChange={(e) =>
                                    form.setData('start_date', e.target.value)
                                }
                            />
                            <Input
                                type="date"
                                value={form.data.end_date}
                                onChange={(e) =>
                                    form.setData('end_date', e.target.value)
                                }
                            />
                            <Input
                                placeholder="Reason"
                                value={form.data.reason}
                                onChange={(e) =>
                                    form.setData('reason', e.target.value)
                                }
                            />
                            <Input
                                placeholder="Attachment path"
                                value={form.data.attachment}
                                onChange={(e) =>
                                    form.setData('attachment', e.target.value)
                                }
                            />
                            <Button disabled={form.processing} type="submit">
                                Kirim
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pengajuan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="p-2">Karyawan</th>
                                    <th className="p-2">Jenis</th>
                                    <th className="p-2">Mulai</th>
                                    <th className="p-2">Selesai</th>
                                    <th className="p-2">Hari</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.data.map((r: any) => (
                                    <tr key={r.id} className="border-b">
                                        <td className="p-2">
                                            {r.employee?.first_name}{' '}
                                            {r.employee?.last_name}
                                        </td>
                                        <td className="p-2">
                                            {r.leave_type?.name}
                                        </td>
                                        <td className="p-2">{r.start_date}</td>
                                        <td className="p-2">{r.end_date}</td>
                                        <td className="p-2">{r.days}</td>
                                        <td className="p-2">{r.status}</td>
                                        <td className="p-2">
                                            {r.status === 'pending' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        className="mr-1"
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
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Sisa Kuota Cuti</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="p-2">Karyawan</th>
                                    <th className="p-2">Jenis</th>
                                    <th className="p-2">Tahun</th>
                                    <th className="p-2">Total</th>
                                    <th className="p-2">Terpakai</th>
                                    <th className="p-2">Sisa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {balances.map((b: any) => (
                                    <tr key={b.id} className="border-b">
                                        <td className="p-2">
                                            {b.employee?.first_name}{' '}
                                            {b.employee?.last_name}
                                        </td>
                                        <td className="p-2">
                                            {b.leave_type?.name}
                                        </td>
                                        <td className="p-2">{b.year}</td>
                                        <td className="p-2">{b.total_days}</td>
                                        <td className="p-2">{b.used_days}</td>
                                        <td className="p-2">
                                            {b.total_days - b.used_days}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

LeaveRequests.layout = {
    breadcrumbs: [{ title: 'Pengajuan Cuti', href: '/leave/requests' }],
};
