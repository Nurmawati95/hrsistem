import { Head, router, useForm } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = { periods: any[] };

export default function PayrollPeriods({ periods }: Props) {
    const form = useForm({
        name: '',
        start_date: '',
        end_date: '',
        pay_date: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/payroll/periods', { onSuccess: () => form.reset() });
    };

    return (
        <>
            <Head title="Payroll Periods" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <header className="flex flex-col gap-1">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Periode Penggajian
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola periode penggajian dan proses payroll.
                    </p>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Periode</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="grid gap-4 md:grid-cols-5"
                        >
                            <div className="grid gap-2 md:col-span-2">
                                <Label>Nama</Label>
                                <Input
                                    placeholder="Nama periode"
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData('name', e.target.value)
                                    }
                                />
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
                            <div className="grid gap-2">
                                <Label>Tanggal Bayar</Label>
                                <Input
                                    type="date"
                                    value={form.data.pay_date}
                                    onChange={(e) =>
                                        form.setData('pay_date', e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    disabled={form.processing}
                                    type="submit"
                                    className="w-full"
                                >
                                    Tambah
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Periode</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="p-3 font-medium">
                                            Nama
                                        </th>
                                        <th className="p-3 font-medium">
                                            Mulai
                                        </th>
                                        <th className="p-3 font-medium">
                                            Selesai
                                        </th>
                                        <th className="p-3 font-medium">
                                            Tanggal Bayar
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
                                    {periods.map((p: any) => (
                                        <tr
                                            key={p.id}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-3 font-medium">
                                                {p.name}
                                            </td>
                                            <td className="p-3">
                                                {p.start_date}
                                            </td>
                                            <td className="p-3">
                                                {p.end_date}
                                            </td>
                                            <td className="p-3">
                                                {p.pay_date}
                                            </td>
                                            <td className="p-3">
                                                <Badge
                                                    variant={
                                                        p.status === 'processed'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {p.status}
                                                </Badge>
                                            </td>
                                            <td className="p-3">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        router.visit(
                                                            `/payroll/periods/${p.id}`,
                                                        )
                                                    }
                                                >
                                                    Lihat
                                                </Button>
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

PayrollPeriods.layout = {
    breadcrumbs: [{ title: 'Periode Penggajian', href: '/payroll/periods' }],
};
