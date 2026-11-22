import { Head, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayout from '@/layouts/settings/layout';

type CompanySettingType = {
    id: number;
    company_name: string;
    tagline: string;
    email: string;
    phone: string;
    address: string;
    work_hours: string;
    announcement_title: string;
    announcement_content: string;
    announcement_active: boolean;
    leave_policy: string;
    attendance_policy: string;
};

type Props = {
    setting: CompanySettingType;
    status?: string;
};

export default function CompanySettings({ setting, status }: Props) {
    const { data, setData, patch, processing, errors, recentlySuccessful } =
        useForm({
            company_name: setting?.company_name ?? '',
            tagline: setting?.tagline ?? '',
            email: setting?.email ?? '',
            phone: setting?.phone ?? '',
            address: setting?.address ?? '',
            work_hours: setting?.work_hours ?? '',
            announcement_title: setting?.announcement_title ?? '',
            announcement_content: setting?.announcement_content ?? '',
            announcement_active: setting?.announcement_active ?? true,
            leave_policy: setting?.leave_policy ?? '',
            attendance_policy: setting?.attendance_policy ?? '',
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch('/settings/company', {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <SettingsLayout>
            <Head title="Informasi Perusahaan & Portal" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Informasi Perusahaan & Portal Publik"
                    description="Kelola nama perusahaan, kontak, jam operasional, kebijakan, dan pengumuman yang tampil pada portal publik dan dashboard."
                />

                {status && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {/* Identitas Perusahaan */}
                    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                        <h3 className="text-sm font-bold tracking-wide text-foreground uppercase">
                            Identitas Perusahaan
                        </h3>

                        <div className="grid gap-2">
                            <Label htmlFor="company_name">
                                Nama Perusahaan / Organisasi
                            </Label>
                            <Input
                                id="company_name"
                                value={data.company_name}
                                onChange={(e) =>
                                    setData('company_name', e.target.value)
                                }
                                required
                                placeholder="Contoh: PT Nusantara Solusi SDM"
                            />
                            <InputError message={errors.company_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tagline">
                                Slogan / Deskripsi Singkat
                            </Label>
                            <Input
                                id="tagline"
                                value={data.tagline}
                                onChange={(e) =>
                                    setData('tagline', e.target.value)
                                }
                                required
                                placeholder="Contoh: Sistem Informasi Kepegawaian & Operasional Terpadu"
                            />
                            <InputError message={errors.tagline} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Resmi HR</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                    placeholder="hr@perusahaan.co.id"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">
                                    Nomor Telepon / WhatsApp HR
                                </Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData('phone', e.target.value)
                                    }
                                    required
                                    placeholder="+62 21 555-0199"
                                />
                                <InputError message={errors.phone} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="work_hours">
                                Jam Kerja / Jam Layanan Kantor
                            </Label>
                            <Input
                                id="work_hours"
                                value={data.work_hours}
                                onChange={(e) =>
                                    setData('work_hours', e.target.value)
                                }
                                required
                                placeholder="Senin - Jumat: 08:30 - 17:30 WIB"
                            />
                            <InputError message={errors.work_hours} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address">
                                Alamat Kantor Lengkap
                            </Label>
                            <textarea
                                id="address"
                                rows={2}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                placeholder="Alamat lengkap gedung dan kota"
                            />
                            <InputError message={errors.address} />
                        </div>
                    </div>

                    {/* Pengumuman Terkini */}
                    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold tracking-wide text-foreground uppercase">
                                Pengumuman Portal Publik & Pegawai
                            </h3>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="announcement_active"
                                    checked={data.announcement_active}
                                    onCheckedChange={(checked) =>
                                        setData(
                                            'announcement_active',
                                            Boolean(checked),
                                        )
                                    }
                                />
                                <Label
                                    htmlFor="announcement_active"
                                    className="cursor-pointer text-xs font-medium"
                                >
                                    Tampilkan di Portal
                                </Label>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="announcement_title">
                                Judul Pengumuman
                            </Label>
                            <Input
                                id="announcement_title"
                                value={data.announcement_title}
                                onChange={(e) =>
                                    setData(
                                        'announcement_title',
                                        e.target.value,
                                    )
                                }
                                placeholder="Contoh: Pengumuman Operasional & Libur Bersama"
                            />
                            <InputError message={errors.announcement_title} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="announcement_content">
                                Isi Pengumuman
                            </Label>
                            <textarea
                                id="announcement_content"
                                rows={3}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                value={data.announcement_content}
                                onChange={(e) =>
                                    setData(
                                        'announcement_content',
                                        e.target.value,
                                    )
                                }
                                placeholder="Isi pesan penting untuk pegawai atau pengunjung portal"
                            />
                            <InputError message={errors.announcement_content} />
                        </div>
                    </div>

                    {/* Kebijakan Ringkas */}
                    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                        <h3 className="text-sm font-bold tracking-wide text-foreground uppercase">
                            Kebijakan Operasional HR
                        </h3>

                        <div className="grid gap-2">
                            <Label htmlFor="attendance_policy">
                                Kebijakan Presensi & Keterlambatan
                            </Label>
                            <textarea
                                id="attendance_policy"
                                rows={2}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                value={data.attendance_policy}
                                onChange={(e) =>
                                    setData('attendance_policy', e.target.value)
                                }
                                placeholder="Ketentuan toleransi jam masuk dan shift"
                            />
                            <InputError message={errors.attendance_policy} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="leave_policy">
                                Kebijakan Pengajuan Cuti & Izin
                            </Label>
                            <textarea
                                id="leave_policy"
                                rows={2}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                value={data.leave_policy}
                                onChange={(e) =>
                                    setData('leave_policy', e.target.value)
                                }
                                placeholder="Ketentuan batas pengajuan cuti dan bukti sakit"
                            />
                            <InputError message={errors.leave_policy} />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[#12284c] hover:bg-[#1b3a6b]"
                        >
                            {processing
                                ? 'Menyimpan...'
                                : 'Simpan Informasi Perusahaan'}
                        </Button>

                        {recentlySuccessful && (
                            <p className="text-xs font-semibold text-emerald-600">
                                Berhasil disimpan.
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </SettingsLayout>
    );
}
