import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = { employee: any };

export default function EmployeesShow({ employee }: Props) {
    return (
        <>
            <Head title={`${employee.first_name} ${employee.last_name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        {employee.first_name} {employee.last_name}
                    </h1>
                    <div className="flex gap-2">
                        <Link href={`/employees/${employee.id}/edit`}>
                            <Button variant="outline">Ubah</Button>
                        </Link>
                        <Link href="/employees">
                            <Button variant="ghost">Kembali</Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Biodata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p><strong>Nomor Karyawan:</strong> {employee.employee_number}</p>
                            <p><strong>Email:</strong> {employee.email}</p>
                            <p><strong>Telepon:</strong> {employee.phone ?? '-'}</p>
                            <p><strong>Tanggal Lahir:</strong> {employee.date_of_birth ?? '-'}</p>
                            <p><strong>Jenis Kelamin:</strong> {employee.gender ?? '-'}</p>
                            <p><strong>Alamat:</strong> {employee.address ?? '-'}</p>
                            <p><strong>Tanggal Masuk:</strong> {employee.hire_date}</p>
                            <p><strong>Status:</strong> {employee.employment_status}</p>
                            <p><strong>Departemen:</strong> {employee.department?.name ?? '-'}</p>
                            <p><strong>Jabatan:</strong> {employee.position?.name ?? '-'}</p>
                            <p><strong>Gaji Pokok:</strong> {employee.basic_salary}</p>
                            <p><strong>Kontak Darurat:</strong> {employee.emergency_contact_name ?? '-'} ({employee.emergency_contact_phone ?? '-'})</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Riwayat Jabatan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                {(employee.job_histories ?? []).map((jh: any) => (
                                    <li key={jh.id} className="border-b pb-2">
                                        <p>{jh.position?.name ?? '-'} — {jh.department?.name ?? '-'}</p>
                                        <p className="text-muted-foreground">{jh.start_date} to {jh.end_date ?? 'present'}</p>
                                        {jh.notes && <p>{jh.notes}</p>}
                                    </li>
                                ))}
                                {(!employee.job_histories || employee.job_histories.length === 0) && <p className="text-muted-foreground">No records.</p>}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pendidikan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                {(employee.educations ?? []).map((ed: any) => (
                                    <li key={ed.id} className="border-b pb-2">
                                        <p><strong>{ed.institution}</strong> — {ed.degree} {ed.field_of_study}</p>
                                        <p className="text-muted-foreground">{ed.start_date} to {ed.end_date ?? 'present'}</p>
                                    </li>
                                ))}
                                {(!employee.educations || employee.educations.length === 0) && <p className="text-muted-foreground">No records.</p>}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Dokumen</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                {(employee.documents ?? []).map((doc: any) => (
                                    <li key={doc.id} className="border-b pb-2">
                                        <p>{doc.type} — {doc.original_name ?? doc.file_path}</p>
                                    </li>
                                ))}
                                {(!employee.documents || employee.documents.length === 0) && <p className="text-muted-foreground">No documents.</p>}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

EmployeesShow.layout = {
    breadcrumbs: [{ title: 'Employees', href: '/employees' }, { title: 'Detail', href: '#' }],
};