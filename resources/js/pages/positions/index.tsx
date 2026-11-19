import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Props = { positions: any[]; departments: any[] };

export default function PositionsIndex({ positions, departments }: Props) {
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        department_id: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/positions', { onSuccess: () => reset() });
    };

    const remove = (id: number) => {
        if (confirm('Delete this position?')) router.delete(`/positions/${id}`);
    };

    return (
        <>
            <Head title="Positions" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Jabatan</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Jabatan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="flex flex-wrap gap-2"
                        >
                            <Input
                                placeholder="Name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="w-48"
                            />
                            <Select
                                value={data.department_id}
                                onValueChange={(v) =>
                                    setData('department_id', v)
                                }
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((d) => (
                                        <SelectItem
                                            key={d.id}
                                            value={String(d.id)}
                                        >
                                            {d.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                placeholder="Description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                className="w-64"
                            />
                            <Button disabled={processing} type="submit">
                                Tambah
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Jabatan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="p-2">Nama</th>
                                    <th className="p-2">Departemen</th>
                                    <th className="p-2">Deskripsi</th>
                                    <th className="p-2">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {positions.map((p: any) => (
                                    <tr key={p.id} className="border-b">
                                        <td className="p-2">{p.name}</td>
                                        <td className="p-2">
                                            {p.department?.name ?? '-'}
                                        </td>
                                        <td className="p-2">
                                            {p.description ?? '-'}
                                        </td>
                                        <td className="p-2">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => remove(p.id)}
                                            >
                                                Hapus
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

PositionsIndex.layout = {
    breadcrumbs: [{ title: 'Jabatan', href: '/positions' }],
};
