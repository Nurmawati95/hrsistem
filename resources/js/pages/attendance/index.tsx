import { Head, router, useForm } from '@inertiajs/react';
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
    attendances: { data: any[]; links: any[] };
    employees: any[];
    filters: { date?: string };
};

export default function AttendanceIndex({ attendances, employees, filters }: Props) {
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
        checkInForm.post('/attendance/check-in', { onSuccess: () => checkInForm.reset() });
    };
    const doCheckOut = (e: React.FormEvent) => {
        e.preventDefault();
        checkOutForm.post('/attendance/check-out', { onSuccess: () => checkOutForm.reset() });
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
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Attendance</h1>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Check In</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={doCheckIn} className="grid gap-2">
                                <Select value={checkInForm.data.employee_id} onValueChange={(v) => checkInForm.setData('employee_id', v)}>
                                    <SelectTrigger><SelectValue placeholder="Employee" /></SelectTrigger>
                                    <SelectContent>
                                        {employees.map((e) => (
                                            <SelectItem key={e.id} value={String(e.id)}>{e.first_name} {e.last_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input placeholder="Location" value={checkInForm.data.location} onChange={(e) => checkInForm.setData('location', e.target.value)} />
                                <Button disabled={checkInForm.processing} type="submit">Check In</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Check Out</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={doCheckOut} className="grid gap-2">
                                <Select value={checkOutForm.data.employee_id} onValueChange={(v) => checkOutForm.setData('employee_id', v)}>
                                    <SelectTrigger><SelectValue placeholder="Employee" /></SelectTrigger>
                                    <SelectContent>
                                        {employees.map((e) => (
                                            <SelectItem key={e.id} value={String(e.id)}>{e.first_name} {e.last_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input placeholder="Location" value={checkOutForm.data.location} onChange={(e) => checkOutForm.setData('location', e.target.value)} />
                                <Button disabled={checkOutForm.processing} type="submit">Check Out</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Manual Entry</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={doManual} className="grid gap-2 md:grid-cols-4">
                            <Select value={manualForm.data.employee_id} onValueChange={(v) => manualForm.setData('employee_id', v)}>
                                <SelectTrigger><SelectValue placeholder="Employee" /></SelectTrigger>
                                <SelectContent>
                                    {employees.map((e) => (
                                        <SelectItem key={e.id} value={String(e.id)}>{e.first_name} {e.last_name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input type="date" value={manualForm.data.date} onChange={(e) => manualForm.setData('date', e.target.value)} />
                            <Input type="datetime-local" value={manualForm.data.check_in_at} onChange={(e) => manualForm.setData('check_in_at', e.target.value)} />
                            <Input type="datetime-local" value={manualForm.data.check_out_at} onChange={(e) => manualForm.setData('check_out_at', e.target.value)} />
                            <Input placeholder="Status" value={manualForm.data.status} onChange={(e) => manualForm.setData('status', e.target.value)} />
                            <Input type="number" placeholder="Late min" value={manualForm.data.late_minutes} onChange={(e) => manualForm.setData('late_minutes', Number(e.target.value))} />
                            <Input type="number" placeholder="OT min" value={manualForm.data.overtime_minutes} onChange={(e) => manualForm.setData('overtime_minutes', Number(e.target.value))} />
                            <Button disabled={manualForm.processing} type="submit">Save</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Attendance Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-2">
                            <Input type="date" defaultValue={filters.date} onChange={(e) => filterDate(e.target.value)} className="w-48" />
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="p-2">Employee</th>
                                    <th className="p-2">Date</th>
                                    <th className="p-2">Check In</th>
                                    <th className="p-2">Check Out</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Late (min)</th>
                                    <th className="p-2">OT (min)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendances.data.map((a: any) => (
                                    <tr key={a.id} className="border-b">
                                        <td className="p-2">{a.employee?.first_name} {a.employee?.last_name}</td>
                                        <td className="p-2">{a.date}</td>
                                        <td className="p-2">{a.check_in_at ?? '-'}</td>
                                        <td className="p-2">{a.check_out_at ?? '-'}</td>
                                        <td className="p-2">{a.status}</td>
                                        <td className="p-2">{a.late_minutes}</td>
                                        <td className="p-2">{a.overtime_minutes}</td>
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

AttendanceIndex.layout = {
    breadcrumbs: [{ title: 'Attendance', href: '/attendance' }],
};