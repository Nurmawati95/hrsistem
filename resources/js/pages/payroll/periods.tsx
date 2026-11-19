import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Payroll Periods</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Add Period</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-wrap gap-2">
                            <Input placeholder="Name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                            <Input type="date" value={form.data.start_date} onChange={(e) => form.setData('start_date', e.target.value)} />
                            <Input type="date" value={form.data.end_date} onChange={(e) => form.setData('end_date', e.target.value)} />
                            <Input type="date" value={form.data.pay_date} onChange={(e) => form.setData('pay_date', e.target.value)} />
                            <Button disabled={form.processing} type="submit">Add</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Periods</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="p-2">Name</th>
                                    <th className="p-2">Start</th>
                                    <th className="p-2">End</th>
                                    <th className="p-2">Pay Date</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {periods.map((p: any) => (
                                    <tr key={p.id} className="border-b">
                                        <td className="p-2">{p.name}</td>
                                        <td className="p-2">{p.start_date}</td>
                                        <td className="p-2">{p.end_date}</td>
                                        <td className="p-2">{p.pay_date}</td>
                                        <td className="p-2">{p.status}</td>
                                        <td className="p-2">
                                            <Button size="sm" className="mr-1" onClick={() => router.visit(`/payroll/periods/${p.id}`)}>
                                                View
                                            </Button>
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

PayrollPeriods.layout = {
    breadcrumbs: [{ title: 'Payroll Periods', href: '/payroll/periods' }],
};