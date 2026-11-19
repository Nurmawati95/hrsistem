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
        assignForm.post('/shifts/assign', { onSuccess: () => assignForm.reset() });
    };

    const removeShift = (id: number) => {
        if (confirm('Delete shift?')) router.delete(`/shifts/${id}`);
    };

    return (
        <>
            <Head title="Shifts" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Shifts & Scheduling</h1>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add Shift</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitShift} className="grid gap-2">
                                <Input placeholder="Name" value={shiftForm.data.name} onChange={(e) => shiftForm.setData('name', e.target.value)} />
                                <Input type="time" value={shiftForm.data.start_time} onChange={(e) => shiftForm.setData('start_time', e.target.value)} />
                                <Input type="time" value={shiftForm.data.end_time} onChange={(e) => shiftForm.setData('end_time', e.target.value)} />
                                <Input type="number" placeholder="Break minutes" value={shiftForm.data.break_minutes} onChange={(e) => shiftForm.setData('break_minutes', Number(e.target.value))} />
                                <Button disabled={shiftForm.processing} type="submit">Add Shift</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Assign Shift</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitAssign} className="grid gap-2">
                                <Select value={assignForm.data.employee_id} onValueChange={(v) => assignForm.setData('employee_id', v)}>
                                    <SelectTrigger><SelectValue placeholder="Employee" /></SelectTrigger>
                                    <SelectContent>
                                        {employees.map((e) => (
                                            <SelectItem key={e.id} value={String(e.id)}>
                                                {e.first_name} {e.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={assignForm.data.shift_id} onValueChange={(v) => assignForm.setData('shift_id', v)}>
                                    <SelectTrigger><SelectValue placeholder="Shift" /></SelectTrigger>
                                    <SelectContent>
                                        {shifts.map((s) => (
                                            <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input type="date" value={assignForm.data.date} onChange={(e) => assignForm.setData('date', e.target.value)} />
                                <Button disabled={assignForm.processing} type="submit">Assign</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Shifts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="p-2">Name</th>
                                    <th className="p-2">Start</th>
                                    <th className="p-2">End</th>
                                    <th className="p-2">Break (min)</th>
                                    <th className="p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shifts.map((s: any) => (
                                    <tr key={s.id} className="border-b">
                                        <td className="p-2">{s.name}</td>
                                        <td className="p-2">{s.start_time}</td>
                                        <td className="p-2">{s.end_time}</td>
                                        <td className="p-2">{s.break_minutes}</td>
                                        <td className="p-2">
                                            <Button variant="destructive" size="sm" onClick={() => removeShift(s.id)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="p-2">Employee</th>
                                    <th className="p-2">Shift</th>
                                    <th className="p-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignments.map((a: any) => (
                                    <tr key={a.id} className="border-b">
                                        <td className="p-2">{a.employee?.first_name} {a.employee?.last_name}</td>
                                        <td className="p-2">{a.shift?.name}</td>
                                        <td className="p-2">{a.date}</td>
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

ShiftsIndex.layout = {
    breadcrumbs: [{ title: 'Shifts', href: '/shifts' }],
};