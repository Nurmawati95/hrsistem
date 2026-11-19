import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <header className="flex flex-col gap-1">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Jabatan
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola jabatan per departemen.
                    </p>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle>Tambah Jabatan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="grid gap-3 md:grid-cols-4"
                        >
                            <div className="grid gap-2">
                                <Label>Nama</Label>
                                <Input
                                    placeholder="Nama jabatan"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Departemen</Label>
                                <Select
                                    value={data.department_id}
                                    onValueChange={(v) =>
                                        setData('department_id', v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih departemen" />
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
                        <CardTitle>Daftar Jabatan</CardTitle>
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
                                            Departemen
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
                                    {positions.map((p: any) => (
                                        <tr
                                            key={p.id}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-3 font-medium">
                                                {p.name}
                                            </td>
                                            <td className="p-3">
                                                {p.department?.name ?? '-'}
                                            </td>
                                            <td className="p-3">
                                                {p.description ?? '-'}
                                            </td>
                                            <td className="p-3">
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
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PositionsIndex.layout = {
    breadcrumbs: [{ title: 'Jabatan', href: '/positions' }],
};
