import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = { period: any };

export default function PayrollShow({ period }: Props) {
    const process = () => router.post(`/payroll/periods/${period.id}/process`);

    const money = (v: any) => Number(v ?? 0).toLocaleString('id-ID');

    return (
        <>
            <Head title={`Payroll ${period.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Payroll: {period.name}</h1>
                    <div className="flex gap-2">
                        {period.status !== 'processed' && period.status !== 'paid' && (
                            <Button onClick={process}>Process Payroll</Button>
                        )}
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Payslips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="p-2">Employee</th>
                                        <th className="p-2">Basic</th>
                                        <th className="p-2">OT Pay</th>
                                        <th className="p-2">Earnings</th>
                                        <th className="p-2">Deductions</th>
                                        <th className="p-2">Net Salary</th>
                                        <th className="p-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(period.payrolls ?? []).map((pr: any) => (
                                        <tr key={pr.id} className="border-b">
                                            <td className="p-2">{pr.employee?.first_name} {pr.employee?.last_name}</td>
                                            <td className="p-2">{money(pr.basic_salary)}</td>
                                            <td className="p-2">{money(pr.overtime_pay)}</td>
                                            <td className="p-2">{money(pr.total_earnings)}</td>
                                            <td className="p-2">{money(pr.total_deductions)}</td>
                                            <td className="p-2 font-bold">{money(pr.net_salary)}</td>
                                            <td className="p-2">{pr.status}</td>
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

PayrollShow.layout = {
    breadcrumbs: [{ title: 'Payroll', href: '/payroll/periods' }, { title: 'Detail', href: '#' }],
};