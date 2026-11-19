import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type PageProps = {
    employees: {
        data: any[];
        links: any[];
        meta?: any;
    };
    filters: { search?: string };
};

export default function EmployeesIndex({ employees, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/employees', { search }, { preserveState: true });
    };

    return (
        <>
            <Head title="Employees" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Karyawan</h1>
                    <Link href="/employees/create">
                        <Button>Tambah Karyawan</Button>
                    </Link>
                </div>

                <form onSubmit={submitSearch} className="flex gap-2">
                    <Input
                        placeholder="Cari karyawan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button type="submit" variant="outline">
                        Search
                    </Button>
                </form>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Karyawan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="p-2">Nomor</th>
                                        <th className="p-2">Nama</th>
                                        <th className="p-2">Email</th>
                                        <th className="p-2">Departemen</th>
                                        <th className="p-2">Jabatan</th>
                                        <th className="p-2">Status</th>
                                        <th className="p-2">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.data.map((emp: any) => (
                                        <tr key={emp.id} className="border-b">
                                            <td className="p-2">
                                                {emp.employee_number}
                                            </td>
                                            <td className="p-2">
                                                {emp.first_name} {emp.last_name}
                                            </td>
                                            <td className="p-2">{emp.email}</td>
                                            <td className="p-2">
                                                {emp.department?.name ?? '-'}
                                            </td>
                                            <td className="p-2">
                                                {emp.position?.name ?? '-'}
                                            </td>
                                            <td className="p-2">
                                                {emp.employment_status}
                                            </td>
                                            <td className="p-2">
                                                <Link
                                                    href={`/employees/${emp.id}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Lihat
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {employees.links && (
                            <div className="mt-4 flex gap-2">
                                {employees.links.map((link: any, i: number) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() =>
                                            link.url && router.visit(link.url)
                                        }
                                        className={`rounded border px-3 py-1 text-sm ${link.active ? 'bg-primary text-primary-foreground' : ''}`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EmployeesIndex.layout = {
    breadcrumbs: [{ title: 'Karyawan', href: '/employees' }],
};
