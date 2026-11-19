import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
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
    employee: any;
    departments: any[];
    positions: any[];
    users: any[];
};

export default function EmployeesEdit({ employee, departments, positions, users }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        user_id: employee.user_id ? String(employee.user_id) : '',
        employee_number: employee.employee_number ?? '',
        first_name: employee.first_name ?? '',
        last_name: employee.last_name ?? '',
        email: employee.email ?? '',
        phone: employee.phone ?? '',
        date_of_birth: employee.date_of_birth ?? '',
        gender: employee.gender ?? '',
        address: employee.address ?? '',
        emergency_contact_name: employee.emergency_contact_name ?? '',
        emergency_contact_phone: employee.emergency_contact_phone ?? '',
        hire_date: employee.hire_date ?? '',
        employment_status: employee.employment_status ?? 'contract',
        position_id: employee.position_id ? String(employee.position_id) : '',
        department_id: employee.department_id ? String(employee.department_id) : '',
        basic_salary: employee.basic_salary ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/employees/${employee.id}`);
    };

    return (
        <>
            <Head title="Edit Employee" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Employee</h1>
                    <Link href={`/employees/${employee.id}`}>
                        <Button variant="outline">Back</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Employee Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>Employee Number</Label>
                                <Input value={data.employee_number} onChange={(e) => setData('employee_number', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>First Name</Label>
                                <Input value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Last Name</Label>
                                <Input value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Phone</Label>
                                <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Hire Date</Label>
                                <Input type="date" value={data.hire_date} onChange={(e) => setData('hire_date', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Employment Status</Label>
                                <Select value={data.employment_status} onValueChange={(v) => setData('employment_status', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="permanent">Permanent</SelectItem>
                                        <SelectItem value="contract">Contract</SelectItem>
                                        <SelectItem value="intern">Intern</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Department</Label>
                                <Select value={data.department_id} onValueChange={(v) => setData('department_id', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        {departments.map((d) => (
                                            <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Position</Label>
                                <Select value={data.position_id} onValueChange={(v) => setData('position_id', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        {positions.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Basic Salary</Label>
                                <Input type="number" value={data.basic_salary} onChange={(e) => setData('basic_salary', e.target.value)} />
                            </div>

                            <div className="md:col-span-2">
                                <Button disabled={processing} type="submit">Update</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EmployeesEdit.layout = {
    breadcrumbs: [{ title: 'Employees', href: '/employees' }, { title: 'Edit', href: '#' }],
};