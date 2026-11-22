import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Briefcase,
    Building2,
    Eye,
    FileSpreadsheet,
    FileText,
    GraduationCap,
    Pencil,
    Plus,
    Search,
    Upload,
    UserCheck,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type PageProps = {
    employees: {
        data: any[];
        links: any[];
        meta?: any;
    };
    filters: { search?: string };
    isAdmin: boolean;
    userPosition?: string | null;
    stats?: {
        total: number;
        permanent: number;
        contract: number;
        intern: number;
        departments: number;
    };
    recent?: any[];
};

export default function EmployeesIndex({
    employees,
    filters,
    isAdmin,
    userPosition,
    stats,
    recent,
}: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const importForm = useForm({ file: null as File | null });

    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/employees', { search }, { preserveState: true });
    };

    const getStatusBadge = (status: string) => {
        const s = (status ?? '').toLowerCase();
        if (s.includes('permanent') || s.includes('tetap')) {
            return (
                <span className="inline-flex items-center rounded-sm border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-800">
                    ● TETAP
                </span>
            );
        }
        if (s.includes('contract') || s.includes('kontrak')) {
            return (
                <span className="inline-flex items-center rounded-sm border border-sky-200 bg-sky-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-sky-800">
                    ● KONTRAK
                </span>
            );
        }
        if (s.includes('intern') || s.includes('magang')) {
            return (
                <span className="inline-flex items-center rounded-sm border border-purple-200 bg-purple-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-purple-800">
                    ● MAGANG
                </span>
            );
        }
        return (
            <span className="inline-flex items-center rounded-sm border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700">
                {status ?? '-'}
            </span>
        );
    };

    return (
        <>
            <Head title="Master Karyawan - HR Sistem" />

            <div className="flex h-full flex-1 flex-col gap-6 bg-[#f8fafc] p-4 sm:p-6 lg:p-8 dark:bg-slate-950">
                {/* Header */}
                <header className="flex flex-col gap-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold tracking-widest text-[#16325c] uppercase dark:text-sky-400">
                                LOKET 01 · MASTER DATA
                            </span>
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                Database SDM
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0f274a] dark:text-white">
                            Data Induk Karyawan
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Pencatatan profil pegawai, nomor induk (NIP), status
                            ketenagakerjaan, dan unit divisi.
                        </p>
                    </div>

                    {isAdmin && (
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                asChild
                                className="bg-[#12284c] text-xs font-semibold tracking-wider text-white uppercase shadow-sm hover:bg-[#1b3a6b]"
                            >
                                <Link href="/employees/create">
                                    <Plus className="mr-1.5 size-4" />
                                    Tambah Pegawai Baru
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="text-xs font-semibold"
                            >
                                <a href="/employees/export">
                                    <FileSpreadsheet className="mr-1.5 size-4" />
                                    Export Excel
                                </a>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="text-xs font-semibold"
                            >
                                <a href="/employees/export/pdf">
                                    <FileText className="mr-1.5 size-4" />
                                    Export PDF
                                </a>
                            </Button>
                            <a
                                href="/employees/template"
                                className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-xs font-semibold shadow-xs hover:bg-accent"
                            >
                                <FileSpreadsheet className="size-4" />
                                Template Excel
                            </a>
                            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-xs font-semibold shadow-xs hover:bg-accent">
                                <Upload className="size-4" />
                                Import Excel
                                <input
                                    type="file"
                                    name="file"
                                    accept=".xlsx,.xls,.csv"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            importForm.setData('file', file);
                                            importForm.post(
                                                '/employees/import',
                                                {
                                                    forceFormData: true,
                                                    onSuccess: () => {
                                                        importForm.reset();
                                                        e.target.value = '';
                                                    },
                                                },
                                            );
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    )}
                </header>

                {/* 5 Stat Cards */}
                <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {[
                        {
                            title: 'Total Pegawai',
                            value: stats?.total ?? 0,
                            hint: 'Seluruh arsip terdaftar',
                            icon: Users,
                            border: 'border-l-4 border-l-[#16325c]',
                        },
                        {
                            title: 'Pegawai Tetap',
                            value: stats?.permanent ?? 0,
                            hint: 'Status permanen (PKWTT)',
                            icon: UserCheck,
                            border: 'border-l-4 border-l-emerald-600',
                        },
                        {
                            title: 'Pegawai Kontrak',
                            value: stats?.contract ?? 0,
                            hint: 'Perjanjian waktu tertentu',
                            icon: Briefcase,
                            border: 'border-l-4 border-l-sky-600',
                        },
                        {
                            title: 'Magang / Intern',
                            value: stats?.intern ?? 0,
                            hint: 'Program magang aktif',
                            icon: GraduationCap,
                            border: 'border-l-4 border-l-purple-600',
                        },
                        {
                            title: 'Unit Departemen',
                            value: stats?.departments ?? 0,
                            hint: 'Divisi operasional',
                            icon: Building2,
                            border: 'border-l-4 border-l-amber-500',
                        },
                    ].map((s) => {
                        const Icon = s.icon;
                        return (
                            <div
                                key={s.title}
                                className={`rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 ${s.border}`}
                            >
                                <div className="flex items-center justify-between text-slate-400">
                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                        {s.title}
                                    </span>
                                    <Icon className="size-4" />
                                </div>
                                <p className="mt-2 font-mono text-2xl font-bold text-[#0f274a] dark:text-white">
                                    {s.value}
                                </p>
                                <p className="mt-1 truncate text-[10px] text-slate-400">
                                    {s.hint}
                                </p>
                            </div>
                        );
                    })}
                </section>

                {/* Search & Filter Toolbar */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <form
                        onSubmit={submitSearch}
                        className="flex flex-col justify-between gap-2.5 sm:flex-row sm:items-center"
                    >
                        <div className="relative max-w-md flex-1">
                            <Search className="absolute top-2.5 left-3 size-4 text-slate-400" />
                            <Input
                                id="search"
                                placeholder="Cari berdasarkan nama, NIP, atau email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-9 bg-slate-50 pl-9 text-xs dark:bg-slate-800"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="submit"
                                variant="outline"
                                size="sm"
                                className="h-9 text-xs font-semibold"
                            >
                                <Search className="mr-1 size-3.5" />
                                Filter Data
                            </Button>
                            {search && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 text-xs text-slate-500"
                                    onClick={() => {
                                        setSearch('');
                                        router.get('/employees');
                                    }}
                                >
                                    Reset
                                </Button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Main Employee Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/70 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold tracking-wider text-[#0f274a] uppercase dark:text-white">
                                DAFTAR INDUK PEGAWAI
                            </span>
                            <span className="rounded-full bg-slate-200 px-2 py-0.5 font-mono text-[10px] text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                {employees.data.length} baris
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400">
                                    <th className="p-3.5">Foto</th>
                                    <th className="p-3.5 pl-5">NIP / Nomor</th>
                                    <th className="p-3.5">Nama Lengkap</th>
                                    <th className="p-3.5">Email Kantor</th>
                                    <th className="p-3.5">Departemen</th>
                                    <th className="p-3.5">Jabatan</th>
                                    <th className="p-3.5">Status Kerja</th>
                                    <th className="p-3.5 pr-5 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {employees.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="p-8 text-center text-xs text-slate-400"
                                        >
                                            Tidak ada data karyawan ditemukan.
                                            Silakan tambahkan data baru.
                                        </td>
                                    </tr>
                                ) : (
                                    employees.data.map((emp: any) => (
                                        <tr
                                            key={emp.id}
                                            className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                                        >
                                            <td className="p-3.5">
                                                {emp.profile_photo_url ? (
                                                    <img
                                                        src={
                                                            emp.profile_photo_url
                                                        }
                                                        alt={
                                                            emp.first_name +
                                                            ' ' +
                                                            emp.last_name
                                                        }
                                                        className="size-8 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                                                    />
                                                ) : (
                                                    <div className="flex size-8 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                                                        {(emp.first_name?.charAt(
                                                            0,
                                                        ) ?? '') +
                                                            (emp.last_name?.charAt(
                                                                0,
                                                            ) ?? '')}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3.5 pl-5 font-mono font-semibold text-[#16325c] dark:text-sky-400">
                                                {emp.employee_number}
                                            </td>
                                            <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                                                {emp.first_name} {emp.last_name}
                                            </td>
                                            <td className="p-3.5 font-mono text-[11px] text-slate-500">
                                                {emp.email}
                                            </td>
                                            <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">
                                                {emp.department?.name ?? '-'}
                                            </td>
                                            <td className="p-3.5 text-slate-600 dark:text-slate-400">
                                                {emp.position?.name ?? '-'}
                                            </td>
                                            <td className="p-3.5">
                                                {getStatusBadge(
                                                    emp.employment_status,
                                                )}
                                            </td>
                                            <td className="p-3.5 pr-5 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                    className="h-7 text-[11px] font-semibold text-[#16325c] hover:bg-slate-100 dark:text-sky-400 dark:hover:bg-slate-800"
                                                >
                                                    <Link
                                                        href={`/employees/${emp.id}`}
                                                    >
                                                        <Eye className="mr-1 size-3" />
                                                        Rincian
                                                    </Link>
                                                </Button>
                                                {isAdmin && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        asChild
                                                        className="ml-2 h-7 text-[11px] font-semibold text-[#16325c] hover:bg-slate-100 dark:text-sky-400 dark:hover:bg-slate-800"
                                                    >
                                                        <Link
                                                            href={`/employees/${emp.id}/edit`}
                                                        >
                                                            <Pencil className="mr-1 size-3" />
                                                            Ubah
                                                        </Link>
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {employees.links && employees.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-5 py-3 dark:border-slate-800">
                            <span className="text-[11px] text-slate-500">
                                Halaman Navigasi
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {employees.links.map((link: any, i: number) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() =>
                                            link.url && router.visit(link.url)
                                        }
                                        className={`rounded border px-2.5 py-1 font-mono text-xs transition-colors ${
                                            link.active
                                                ? 'border-[#12284c] bg-[#12284c] text-white'
                                                : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

EmployeesIndex.layout = {
    breadcrumbs: [{ title: 'Master Karyawan', href: '/employees' }],
};
