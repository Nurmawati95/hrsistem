import { Head, useForm } from '@inertiajs/react';
import type { ChangeEvent, FormEventHandler } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayout from '@/layouts/settings/layout';

type CompanySettingType = {
    id: number;
    qris_image: string | null;
    qris_string: string | null;
};

type Props = {
    setting: CompanySettingType;
    status?: string;
};

export default function QrisSettings({ setting, status }: Props) {
    const { data, setData, patch, processing, errors, recentlySuccessful } =
        useForm({
            qris_image: null as File | null,
            qris_string: setting?.qris_string ?? '',
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch('/settings/qris', {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <SettingsLayout>
            <Head title="Pengaturan QRIS" />
            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="QRIS Pembayaran Kasbon"
                    description="Upload gambar QRIS statis, sistem akan mengekstrak string QRIS-nya. Anda bisa mengedit string tersebut, lalu simpan. String ini akan digunakan untuk generate QRIS dinamis saat karyawan membayar cicilan."
                />

                {status && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                        {setting?.qris_image && (
                            <div className="flex items-center gap-4">
                                <img
                                    src={`/uploads/qris/${setting.qris_image}`}
                                    alt="QRIS"
                                    className="size-32 rounded-lg border object-contain"
                                />
                                <span className="text-xs text-muted-foreground">
                                    QRIS saat ini
                                </span>
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="qris_image">
                                Upload QRIS Baru (PNG/JPG)
                            </Label>
                            <Input
                                id="qris_image"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData(
                                        'qris_image',
                                        e.target.files?.[0] ?? null,
                                    )
                                }
                                className="h-9 text-xs"
                            />
                            <InputError message={errors.qris_image} />
                            <p className="text-[10px] text-muted-foreground">
                                Setelah upload, string QRIS akan otomatis
                                diekstrak dari gambar.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                        <h3 className="text-sm font-bold tracking-wide text-foreground uppercase">
                            String QRIS Statis
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Hasil scan QRIS. Anda bisa mengedit dan memodifikasi
                            string ini sebelum disimpan.
                        </p>
                        <div className="grid gap-2">
                            <Label htmlFor="qris_string">
                                String QRIS (hasil scan)
                            </Label>
                            <textarea
                                id="qris_string"
                                rows={6}
                                value={data.qris_string}
                                onChange={(
                                    e: ChangeEvent<HTMLTextAreaElement>,
                                ) => setData('qris_string', e.target.value)}
                                placeholder="Upload gambar QRIS untuk mengekstrak string, atau ketik manual..."
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-sm text-xs shadow-xs placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                            />
                            <InputError message={errors.qris_string} />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[#12284c] hover:bg-[#1b3a6b]"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan QRIS'}
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

QrisSettings.layout = {
    title: 'Pengaturan QRIS',
    description:
        'Upload dan kelola gambar QRIS untuk pembayaran cicilan kasbon',
};
