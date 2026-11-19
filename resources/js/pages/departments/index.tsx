import { Head, router, useForm } from '@inertiajs/react';
import { Building2, Plus, Trash2 } from 'lucide-react';
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
        if (confirm('Hapus departemen ini?'))
            router.delete(`/departments/${id}`);
    };

    return (
        <>
            <Head title="Departemen - HR Sistem" />

            <div className="flex h-full flex-1 flex-col gap-6 bg-[#f8fafc] p-6 lg:p-8 dark:bg-slate-950">
                {/* Header */}
                <header className="flex flex-col gap-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold tracking-widest text-[#16325c] uppercase dark:text-sky-400">
                                LOKET 02 · ORGANISASI
                            </span>
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                Master Unit Kerja
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0f274a] dark:text-white">
                            Departemen & Divisi
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Pengelolaan struktur unit kerja, departemen, dan
                            hierarki organisasi.
                        </p>
                    </div>
                </header>

                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Form Tambah Departemen */}
                    <div className="rounded-xl border border-t-4 border-slate-200 border-t-[#16325c] bg-white p-5 shadow-xs lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Building2 className="size-4 text-[#16325c] dark:text-sky-400" />
                                <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase dark:text-white">
                                    Tambah Departemen Baru
                                </h3>
                            </div>
                        </div>

                        <form onSubmit={submit} className="mt-4 grid gap-3">
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">
                                    Nama Departemen
                                </Label>
                                <Input
                                    placeholder="Contoh: Keuangan, IT & Operasional"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="h-9 text-xs"
                                    required
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">
                                    Deskripsi / Tugas Pokok
                                </Label>
                                <Input
                                    placeholder="Deskripsi singkat fungsi departemen"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    className="h-9 text-xs"
                                />
                            </div>

                            <Button
                                disabled={processing}
                                type="submit"
                                className="mt-2 h-9 bg-[#12284c] text-xs font-semibold tracking-wider text-white uppercase shadow-sm hover:bg-[#1b3a6b]"
                            >
                                <Plus className="mr-1.5 size-3.5" />
                                Daftarkan Departemen
                            </Button>
                        </form>
                    </div>

                    {/* Table Daftar Departemen */}
                    <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/70 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                            <span className="font-mono text-xs font-bold tracking-wider text-[#0f274a] uppercase dark:text-white">
                                DAFTAR DEPARTEMEN AKTIF
                            </span>
                            <span className="rounded-full bg-slate-200 px-2 py-0.5 font-mono text-[10px] text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                {departments.length} unit
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/80">
                                        <th className="p-3.5 pl-5">
                                            Nama Unit Departemen
                                        </th>
                                        <th className="p-3.5">Deskripsi</th>
                                        <th className="p-3.5 pr-5 text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {departments.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="p-6 text-center text-slate-400"
                                            >
                                                Belum ada departemen terdaftar.
                                            </td>
                                        </tr>
                                    ) : (
                                        departments.map((d: any) => (
                                            <tr
                                                key={d.id}
                                                className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                                            >
                                                <td className="p-3.5 pl-5 font-semibold text-slate-900 dark:text-slate-100">
                                                    {d.name}
                                                </td>
                                                <td className="p-3.5 text-slate-500">
                                                    {d.description ?? '-'}
                                                </td>
                                                <td className="p-3.5 pr-5 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
                                                        onClick={() =>
                                                            remove(d.id)
                                                        }
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

DepartmentsIndex.layout = {
    breadcrumbs: [{ title: 'Departemen', href: '/departments' }],
};
