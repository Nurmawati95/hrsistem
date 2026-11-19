import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';

type Props = {
    stats?: {
        employees: number;
        departments: number;
        pending_leaves: number;
        today_attendance: number;
    };
};

export default function Dashboard({ stats }: Props) {
    const items = [
        { title: 'Karyawan', value: stats?.employees ?? 0, href: '/employees' },
        {
            title: 'Departemen',
            value: stats?.departments ?? 0,
            href: '/departments',
        },
        {
            title: 'Cuti Menunggu',
            value: stats?.pending_leaves ?? 0,
            href: '/leave/requests',
        },
        {
            title: 'Absensi Hari Ini',
            value: stats?.today_attendance ?? 0,
            href: '/attendance',
        },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Dasbor</h1>
                <div className="grid gap-4 md:grid-cols-4">
                    {items.map((it) => (
                        <Link key={it.title} href={it.href}>
                            <Card className="transition hover:shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-sm text-muted-foreground">
                                        {it.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold">
                                        {it.value}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tautan Cepat</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <Link
                                href="/employees/create"
                                className="text-blue-600 hover:underline"
                            >
                                Tambah Karyawan
                            </Link>
                            <Link
                                href="/leave/requests"
                                className="text-blue-600 hover:underline"
                            >
                                Pengajuan Cuti
                            </Link>
                            <Link
                                href="/attendance"
                                className="text-blue-600 hover:underline"
                            >
                                Absensi
                            </Link>
                            <Link
                                href="/payroll/periods"
                                className="text-blue-600 hover:underline"
                            >
                                Penggajian
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dasbor',
            href: dashboard(),
        },
    ],
};
