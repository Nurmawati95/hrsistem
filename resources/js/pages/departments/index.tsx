import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Props = { departments: any[] };

export default function DepartmentsIndex({ departments }: Props) {
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        parent_id: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/departments', { onSuccess: () => reset() });
    };

    const remove = (id: number) => {
        if (confirm('Delete this department?'))
            router.delete(`/departments/${id}`);
    };

    return (
        <>
            <Head title="Departments" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Departemen</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Departemen</CardTitle>
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
                        <CardTitle>Daftar Departemen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="p-2">Nama</th>
                                    <th className="p-2">Induk</th>
                                    <th className="p-2">Deskripsi</th>
                                    <th className="p-2">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departments.map((d: any) => (
                                    <tr key={d.id} className="border-b">
                                        <td className="p-2">{d.name}</td>
                                        <td className="p-2">
                                            {d.parent?.name ?? '-'}
                                        </td>
                                        <td className="p-2">
                                            {d.description ?? '-'}
                                        </td>
                                        <td className="p-2">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => remove(d.id)}
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

DepartmentsIndex.layout = {
    breadcrumbs: [{ title: 'Departemen', href: '/departments' }],
};
