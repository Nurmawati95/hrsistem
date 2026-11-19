import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = { departments: any[] };

function DeptNode({ dept, level = 0 }: { dept: any; level?: number }) {
    return (
        <div className="ml-4 border-l pl-4">
            <div className="font-semibold">{dept.name}</div>
            {dept.employees?.length > 0 && (
                <ul className="ml-4 list-disc text-sm text-muted-foreground">
                    {dept.employees.map((e: any) => (
                        <li key={e.id}>
                            {e.first_name} {e.last_name} —{' '}
                            {e.position?.name ?? '-'}
                        </li>
                    ))}
                </ul>
            )}
            {dept.children?.map((c: any) => (
                <DeptNode key={c.id} dept={c} level={level + 1} />
            ))}
        </div>
    );
}

export default function OrganizationIndex({ departments }: Props) {
    const roots = departments.filter((d) => !d.parent_id);

    return (
        <>
            <Head title="Organization" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Struktur Organisasi</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Departemen & Karyawan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {roots.length === 0 && (
                            <p className="text-muted-foreground">
                                No departments.
                            </p>
                        )}
                        {roots.map((d) => (
                            <DeptNode key={d.id} dept={d} />
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

OrganizationIndex.layout = {
    breadcrumbs: [{ title: 'Struktur Organisasi', href: '/organization' }],
};
