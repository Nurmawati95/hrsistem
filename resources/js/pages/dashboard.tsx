import { Head, Link } from '@inertiajs/react';
import { Building2, CalendarCheck, ClipboardList, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
        {
            title: 'Karyawan',
            value: stats?.employees ?? 0,
            href: '/employees',
            icon: Users,
            hint: 'Total karyawan aktif',
        },
        {
            title: 'Departemen',
            value: stats?.departments ?? 0,
            href: '/departments',
            icon: Building2,
            hint: 'Unit organisasi',
        },
        {
            title: 'Cuti Menunggu',
            value: stats?.pending_leaves ?? 0,
            href: '/leave/requests',
            icon: CalendarCheck,
            hint: 'Perlu persetujuan',
        },
        {
            title: 'Absensi Hari Ini',
            value: stats?.today_attendance ?? 0,
            href: '/attendance',
            icon: ClipboardList,
            hint: 'Sudah check-in',
        },
    ];

    const quickActions = [
        { label: 'Tambah Karyawan', href: '/employees/create' },
        { label: 'Pengajuan Cuti', href: '/leave/requests' },
        { label: 'Absensi', href: '/attendance' },
        { label: 'Penggajian', href: '/payroll/periods' },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <header className="flex flex-col gap-1">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Dasboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Ringkasan operasional HR hari ini.
                    </p>
                </header>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {items.map((it) => {
                        const Icon = it.icon;
                        return (
                            <Link
                                key={it.title}
                                href={it.href}
                                className="group"
                            >
                                <Card className="h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            {it.title}
                                        </CardTitle>
                                        <span className="rounded-md bg-primary/10 p-2 text-primary">
                                            <Icon className="size-4" />
                                        </span>
                                    </CardHeader>
                                    <CardContent className="space-y-1">
                                        <p className="text-3xl font-bold tracking-tight">
                                            {it.value}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {it.hint}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </section>

                <section className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tautan Cepat</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {quickActions.map((action) => (
                                <Button
                                    key={action.label}
                                    variant="outline"
                                    size="sm"
                                    asChild
                                >
                                    <Link href={action.href}>
                                        {action.label}
                                    </Link>
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Panduan Singkat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p>
                                Mulai dari check-in karyawan, lalu proses
                                pengajuan cuti dan payroll per periode.
                            </p>
                            <p>Gunakan menu samping untuk berpindah modul.</p>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dasboard',
            href: dashboard(),
        },
    ],
};
