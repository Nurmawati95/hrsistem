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
                    <h1 className="text-2xl font-bold">
                        Penggajian: {period.name}
                    </h1>
                    <div className="flex gap-2">
                        {period.status !== 'processed' &&
                            period.status !== 'paid' && (
                                <Button onClick={process}>
                                    Proses Penggajian
                                </Button>
                            )}
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Slip Gaji</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="p-2">Karyawan</th>
                                        <th className="p-2">Gaji Pokok</th>
                                        <th className="p-2">Lembur</th>
                                        <th className="p-2">Pendapatan</th>
                                        <th className="p-2">Potongan</th>
                                        <th className="p-2">Gaji Bersih</th>
                                        <th className="p-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(period.payrolls ?? []).map((pr: any) => (
                                        <tr key={pr.id} className="border-b">
                                            <td className="p-2">
                                                {pr.employee?.first_name}{' '}
                                                {pr.employee?.last_name}
                                            </td>
                                            <td className="p-2">
                                                {money(pr.basic_salary)}
                                            </td>
                                            <td className="p-2">
                                                {money(pr.overtime_pay)}
                                            </td>
                                            <td className="p-2">
                                                {money(pr.total_earnings)}
                                            </td>
                                            <td className="p-2">
                                                {money(pr.total_deductions)}
                                            </td>
                                            <td className="p-2 font-bold">
                                                {money(pr.net_salary)}
                                            </td>
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
    breadcrumbs: [
        { title: 'Penggajian', href: '/payroll/periods' },
        { title: 'Detail', href: '#' },
    ],
};
