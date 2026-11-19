import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Karyawan
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola data karyawan dan status kerja.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/employees/create">Tambah Karyawan</Link>
                    </Button>
                </header>

                <Card>
                    <CardContent className="pt-6">
                        <form
                            onSubmit={submitSearch}
                            className="flex flex-col gap-2 sm:flex-row"
                        >
                            <div className="flex-1">
                                <Label htmlFor="search" className="sr-only">
                                    Cari
                                </Label>
                                <Input
                                    id="search"
                                    placeholder="Cari karyawan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button type="submit" variant="outline">
                                Cari
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Karyawan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="p-3 font-medium">
                                            Nomor
                                        </th>
                                        <th className="p-3 font-medium">
                                            Nama
                                        </th>
                                        <th className="p-3 font-medium">
                                            Email
                                        </th>
                                        <th className="p-3 font-medium">
                                            Departemen
                                        </th>
                                        <th className="p-3 font-medium">
                                            Jabatan
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
                                    {employees.data.map((emp: any) => (
                                        <tr
                                            key={emp.id}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-3 font-medium">
                                                {emp.employee_number}
                                            </td>
                                            <td className="p-3">
                                                {emp.first_name} {emp.last_name}
                                            </td>
                                            <td className="p-3">{emp.email}</td>
                                            <td className="p-3">
                                                {emp.department?.name ?? '-'}
                                            </td>
                                            <td className="p-3">
                                                {emp.position?.name ?? '-'}
                                            </td>
                                            <td className="p-3">
                                                <Badge variant="secondary">
                                                    {emp.employment_status}
                                                </Badge>
                                            </td>
                                            <td className="p-3">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/employees/${emp.id}`}
                                                    >
                                                        Lihat
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {employees.links && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {employees.links.map((link: any, i: number) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() =>
                                            link.url && router.visit(link.url)
                                        }
                                        className={`rounded-md border px-3 py-1 text-sm transition-colors ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-muted'
                                        }`}
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
