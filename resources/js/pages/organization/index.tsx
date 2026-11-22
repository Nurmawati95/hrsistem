import { Head, Link } from '@inertiajs/react';
import { Building2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Props = { departments: any[] };

function EmployeeChip({ employee }: { employee: any }) {
    return (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-xs shadow-2xs dark:border-slate-800 dark:bg-slate-800/60">
            <span className="flex size-5 items-center justify-center rounded-full bg-[#16325c]/10 text-[#16325c] dark:text-sky-400">
                <Users className="size-2.5" />
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
                {employee.first_name} {employee.last_name}
            </span>
            {employee.position?.name && (
                <span className="text-[11px] text-slate-400">
                    · {employee.position.name}
                </span>
            )}
        </div>
    );
}

function DeptNode({ dept, level = 0 }: { dept: any; level?: number }) {
    return (
        <div className="relative">
            <div className="rounded-xl border border-l-4 border-slate-200 border-l-[#16325c] bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-[#16325c]/10 text-[#16325c] dark:text-sky-400">
                            <Building2 className="size-4" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    {dept.name}
                                </h3>
                                {level > 0 && (
                                    <span className="py-0.2 rounded bg-slate-100 px-1.5 font-mono text-[9px] text-slate-500 uppercase">
                                        Sub-Unit
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {dept.description ?? 'Unit kerja operasional'}
                            </p>
                        </div>
                    </div>

                    <span className="self-start rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-[#16325c] sm:self-auto dark:bg-slate-800 dark:text-sky-400">
                        {dept.employees?.length ?? 0} Pegawai
                    </span>
                </div>

                {dept.employees && dept.employees.length > 0 && (
                    <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                        <span className="mb-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            Anggota & Staf Terdaftar:
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {dept.employees.map((emp: any) => (
                                <EmployeeChip key={emp.id} employee={emp} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {dept.children && dept.children.length > 0 && (
                <div className="mt-4 ml-6 space-y-4 border-l-2 border-dashed border-slate-200 pl-4 dark:border-slate-800">
                    {dept.children.map((child: any) => (
                        <DeptNode
                            key={child.id}
                            dept={child}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function OrganizationIndex({ departments }: Props) {
    const rootDepts = departments.filter((d) => !d.parent_id);

    return (
        <>
            <Head title="Struktur Organisasi - HR Sistem" />

            <div className="flex h-full flex-1 flex-col gap-6 bg-[#f8fafc] p-4 sm:p-6 lg:p-8 dark:bg-slate-950">
                {/* Header */}
                <header className="flex flex-col gap-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold tracking-widest text-[#16325c] uppercase dark:text-sky-400">
                                LOKET 02 · ORGANISASI
                            </span>
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                Organogram & Hierarki
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0f274a] dark:text-white">
                            Bagan Struktur Organisasi
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Peta hierarki unit kerja perusahaan dan penempatan
                            staf pada masing-masing divisi.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="h-9 text-xs font-semibold"
                        >
                            <Link href="/departments">
                                Kelola Unit Departemen
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="h-9 text-xs font-semibold"
                        >
                            <Link href="/positions">Kelola Master Jabatan</Link>
                        </Button>
                    </div>
                </header>

                {/* Organogram Structure Tree */}
                <div className="space-y-4">
                    {rootDepts.length === 0 ? (
                        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
                            Belum ada struktur departemen yang dibuat.
                        </div>
                    ) : (
                        rootDepts.map((d) => <DeptNode key={d.id} dept={d} />)
                    )}
                </div>
            </div>
        </>
    );
}

OrganizationIndex.layout = {
    breadcrumbs: [{ title: 'Struktur Organisasi', href: '/organization' }],
};
