import { Head } from '@inertiajs/react';
import { Building2, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Props = { departments: any[] };

function EmployeeChip({ employee }: { employee: any }) {
    return (
        <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs shadow-sm">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="size-3" />
            </span>
            <span className="font-medium">
                {employee.first_name} {employee.last_name}
            </span>
            {employee.position?.name && (
                <span className="text-muted-foreground">
                    · {employee.position.name}
                </span>
            )}
        </div>
    );
}

function DeptNode({ dept, level = 0 }: { dept: any; level?: number }) {
    return (
        <div className="relative">
            <Card className="border-l-4 border-l-primary shadow-sm">
                <CardContent className="space-y-3 p-4">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Building2 className="size-4" />
                            </span>
                            <div>
                                <h3 className="leading-tight font-semibold">
                                    {dept.name}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {dept.employees?.length ?? 0} karyawan
                                </p>
                            </div>
                        </div>
                        <Badge variant="secondary">Level {level + 1}</Badge>
                    </div>

                    {dept.employees?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {dept.employees.map((e: any) => (
                                <EmployeeChip key={e.id} employee={e} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {dept.children?.length > 0 && (
                <div className="mt-4 ml-6 space-y-4 border-l-2 border-dashed border-border pl-6">
                    {dept.children.map((c: any) => (
                        <DeptNode key={c.id} dept={c} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function OrganizationIndex({ departments }: Props) {
    const roots = departments.filter((d) => !d.parent_id);

    return (
        <>
            <Head title="Organization" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Struktur Organisasi
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Visualisasi departemen, posisi, dan karyawan.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">
                            {departments.length} departemen
                        </Badge>
                        <Badge variant="outline">
                            {departments.reduce(
                                (acc: number, d: any) =>
                                    acc + (d.employees?.length ?? 0),
                                0,
                            )}{' '}
                            karyawan
                        </Badge>
                    </div>
                </header>

                {roots.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            Belum ada departemen.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {roots.map((d) => (
                            <DeptNode key={d.id} dept={d} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

OrganizationIndex.layout = {
    breadcrumbs: [{ title: 'Struktur Organisasi', href: '/organization' }],
};
