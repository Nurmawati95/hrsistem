import { Head, Link, useForm } from '@inertiajs/react';
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
    departments: any[];
    positions: any[];
    users: any[];
};

export default function EmployeesCreate({ departments, positions, users }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        employee_number: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        address: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        hire_date: '',
        employment_status: 'contract',
        position_id: '',
        department_id: '',
        basic_salary: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/employees');
    };

    return (
        <>
            <Head title="Add Employee" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Tambah Karyawan</h1>
                    <Link href="/employees">
                        <Button variant="outline">Back</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Detail Karyawan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>Nomor Karyawan</Label>
                                <Input
                                    value={data.employee_number}
                                    onChange={(e) => setData('employee_number', e.target.value)}
                                />
                                {errors.employee_number && (
                                    <p className="text-sm text-red-500">{errors.employee_number}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label>Pengguna Terkait (opsional)</Label>
                                <Select value={data.user_id} onValueChange={(v) => setData('user_id', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="None" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((u) => (
                                            <SelectItem key={u.id} value={String(u.id)}>
                                                {u.name} ({u.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Nama Depan</Label>
                                <Input
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                />
                                {errors.first_name && <p className="text-sm text-red-500">{errors.first_name}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label>Nama Belakang</Label>
                                <Input
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                />
                                {errors.last_name && <p className="text-sm text-red-500">{errors.last_name}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label>Telepon</Label>
                                <Input
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Tanggal Lahir</Label>
                                <Input
                                    type="date"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Jenis Kelamin</Label>
                                <Select value={data.gender} onValueChange={(v) => setData('gender', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Laki-laki</SelectItem>
                                        <SelectItem value="female">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2 md:col-span-2">
                                <Label>Alamat</Label>
                                <Input
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Nama Kontak Darurat</Label>
                                <Input
                                    value={data.emergency_contact_name}
                                    onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Telepon Kontak Darurat</Label>
                                <Input
                                    value={data.emergency_contact_phone}
                                    onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Tanggal Masuk</Label>
                                <Input
                                    type="date"
                                    value={data.hire_date}
                                    onChange={(e) => setData('hire_date', e.target.value)}
                                />
                                {errors.hire_date && <p className="text-sm text-red-500">{errors.hire_date}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label>Status Kepegawaian</Label>
                                <Select value={data.employment_status} onValueChange={(v) => setData('employment_status', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="permanent">Tetap</SelectItem>
                                        <SelectItem value="contract">Kontrak</SelectItem>
                                        <SelectItem value="intern">Magang</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Departemen</Label>
                                <Select value={data.department_id} onValueChange={(v) => setData('department_id', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((d) => (
                                            <SelectItem key={d.id} value={String(d.id)}>
                                                {d.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Jabatan</Label>
                                <Select value={data.position_id} onValueChange={(v) => setData('position_id', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {positions.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Gaji Pokok</Label>
                                <Input
                                    type="number"
                                    value={data.basic_salary}
                                    onChange={(e) => setData('basic_salary', e.target.value)}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Button disabled={processing} type="submit">
                                    Simpan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EmployeesCreate.layout = {
    breadcrumbs: [{ title: 'Employees', href: '/employees' }, { title: 'Create', href: '/employees/create' }],
};