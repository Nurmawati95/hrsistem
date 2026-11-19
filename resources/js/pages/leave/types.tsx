import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = { leaveTypes: any[] };

export default function LeaveTypes({ leaveTypes }: Props) {
    const form = useForm({ name: '', days_allowed: 0, is_paid: true, description: '' });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/leave/types', { onSuccess: () => form.reset() });
    };

    const remove = (id: number) => {
        if (confirm('Delete leave type?')) router.delete(`/leave/types/${id}`);
    };

    return (
        <>
            <Head title="Leave Types" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Jenis Cuti</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Jenis Cuti</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-wrap gap-2">
                            <Input placeholder="Name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                            <Input type="number" placeholder="Days allowed" value={form.data.days_allowed} onChange={(e) => form.setData('days_allowed', Number(e.target.value))} />
                            <Input placeholder="Description" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                            <Button disabled={form.processing} type="submit">Tambah</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Jenis Cuti</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="p-2">Nama</th>
                                    <th className="p-2">Hari Diizinkan</th>
                                    <th className="p-2">Berbayar</th>
                                    <th className="p-2">Deskripsi</th>
                                    <th className="p-2">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaveTypes.map((lt: any) => (
                                    <tr key={lt.id} className="border-b">
                                        <td className="p-2">{lt.name}</td>
                                        <td className="p-2">{lt.days_allowed}</td>
                                        <td className="p-2">{lt.is_paid ? 'Yes' : 'No'}</td>
                                        <td className="p-2">{lt.description ?? '-'}</td>
                                        <td className="p-2">
                                            <Button variant="destructive" size="sm" onClick={() => remove(lt.id)}>Hapus</Button>
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

LeaveTypes.layout = {
    breadcrumbs: [{ title: 'Jenis Cuti', href: '/leave/types' }],
};