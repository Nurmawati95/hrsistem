import { Head, router, useForm } from '@inertiajs/react';
import { Briefcase, Plus, Trash2 } from 'lucide-react';
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
        if (confirm('Hapus jabatan ini?')) router.delete(`/positions/${id}`);
    };

    return (
        <>
            <Head title="Jabatan - HR Sistem" />

            <div className="flex h-full flex-1 flex-col gap-6 bg-[#f8fafc] p-4 sm:p-6 lg:p-8 dark:bg-slate-950">
                {/* Header */}
                <header className="flex flex-col gap-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold tracking-widest text-[#16325c] uppercase dark:text-sky-400">
                                LOKET 02 · ORGANISASI
                            </span>
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                Master Jabatan Pegawai
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0f274a] dark:text-white">
                            Posisi & Jenjang Jabatan
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Pengelolaan standardisasi gelar jabatan dan
                            penempatan divisi kerja pegawai.
                        </p>
                    </div>
                </header>

                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Form Tambah Posisi */}
                    <div className="rounded-xl border border-t-4 border-slate-200 border-t-[#16325c] bg-white p-5 shadow-xs lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Briefcase className="size-4 text-[#16325c] dark:text-sky-400" />
                                <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase dark:text-white">
                                    Tambah Jabatan Baru
                                </h3>
                            </div>
                        </div>

                        <form onSubmit={submit} className="mt-4 grid gap-3">
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">
                                    Nama Jabatan
                                </Label>
                                <Input
                                    placeholder="Contoh: HR Specialist / Software Engineer"
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
                                    Departemen Naungan
                                </Label>
                                <Select
                                    value={data.department_id}
                                    onValueChange={(v) =>
                                        setData('department_id', v)
                                    }
                                >
                                    <SelectTrigger className="h-9 text-xs">
                                        <SelectValue placeholder="Pilih unit departemen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((d) => (
                                            <SelectItem
                                                key={d.id}
                                                value={String(d.id)}
                                                className="text-xs"
                                            >
                                                {d.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">
                                    Deskripsi Tugas
                                </Label>
                                <Input
                                    placeholder="Tanggung jawab ringkas posisi ini"
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
                                Simpan Data Jabatan
                            </Button>
                        </form>
                    </div>

                    {/* Table Daftar Jabatan */}
                    <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/70 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                            <span className="font-mono text-xs font-bold tracking-wider text-[#0f274a] uppercase dark:text-white">
                                DAFTAR JABATAN RESMI
                            </span>
                            <span className="rounded-full bg-slate-200 px-2 py-0.5 font-mono text-[10px] text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                {positions.length} posisi
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/80">
                                        <th className="p-3.5 pl-5">
                                            Nama Jabatan
                                        </th>
                                        <th className="p-3.5">Departemen</th>
                                        <th className="p-3.5">Deskripsi</th>
                                        <th className="p-3.5 pr-5 text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {positions.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="p-6 text-center text-slate-400"
                                            >
                                                Belum ada jabatan terdaftar.
                                            </td>
                                        </tr>
                                    ) : (
                                        positions.map((p: any) => (
                                            <tr
                                                key={p.id}
                                                className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                                            >
                                                <td className="p-3.5 pl-5 font-semibold text-slate-900 dark:text-slate-100">
                                                    {p.name}
                                                </td>
                                                <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">
                                                    {p.department?.name ?? '-'}
                                                </td>
                                                <td className="p-3.5 text-slate-500">
                                                    {p.description ?? '-'}
                                                </td>
                                                <td className="p-3.5 pr-5 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
                                                        onClick={() =>
                                                            remove(p.id)
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

PositionsIndex.layout = {
    breadcrumbs: [{ title: 'Jabatan', href: '/positions' }],
};
