import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <header className="flex flex-col gap-1">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Departemen
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola struktur departemen dan hierarki.
                    </p>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Departemen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="grid gap-3 md:grid-cols-3"
                        >
                            <div className="grid gap-2">
                                <Label>Nama</Label>
                                <Input
                                    placeholder="Nama departemen"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Deskripsi</Label>
                                <Input
                                    placeholder="Deskripsi"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    disabled={processing}
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
                        <CardTitle>Daftar Departemen</CardTitle>
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
                                            Induk
                                        </th>
                                        <th className="p-3 font-medium">
                                            Deskripsi
                                        </th>
                                        <th className="p-3 font-medium">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departments.map((d: any) => (
                                        <tr
                                            key={d.id}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-3 font-medium">
                                                {d.name}
                                            </td>
                                            <td className="p-3">
                                                {d.parent?.name ?? '-'}
                                            </td>
                                            <td className="p-3">
                                                {d.description ?? '-'}
                                            </td>
                                            <td className="p-3">
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
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

DepartmentsIndex.layout = {
    breadcrumbs: [{ title: 'Departemen', href: '/departments' }],
};
