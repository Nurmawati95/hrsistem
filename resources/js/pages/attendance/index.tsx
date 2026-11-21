import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    Camera,
    Calendar,
    CheckCircle2,
    Clock,
    FileSpreadsheet,
    LogIn,
    LogOut,
    MapPin,
    PlusCircle,
    Upload,
    UserCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

type Props = {
    attendances: { data: any[]; links: any[] };
    employees: any[];
    filters: { date?: string };
};

export default function AttendanceIndex({
    attendances,
    employees,
    filters,
}: Props) {
    const checkInForm = useForm({
        employee_id: '',
        location: '',
        photo: '' as string,
    });
    const checkOutForm = useForm({
        employee_id: '',
        location: '',
        photo: '' as string,
    });

    // Karyawan hanya melihat dirinya sendiri: auto-pilih pegawai.
    useEffect(() => {
        if (employees.length === 1) {
            checkInForm.setData('employee_id', String(employees[0].id));
            checkOutForm.setData('employee_id', String(employees[0].id));
        }
    }, [employees]);
    const manualForm = useForm({
        employee_id: '',
        date: new Date().toISOString().slice(0, 10),
        check_in_at: '',
        check_out_at: '',
        status: 'present',
        late_minutes: 0,
        overtime_minutes: 0,
        notes: '',
    });

    const doCheckIn = (e: React.FormEvent) => {
        e.preventDefault();
        checkInForm.post('/attendance/check-in', {
            onSuccess: () => checkInForm.reset(),
        });
    };
    const doCheckOut = (e: React.FormEvent) => {
        e.preventDefault();
        checkOutForm.post('/attendance/check-out', {
            onSuccess: () => checkOutForm.reset(),
        });
    };
    const doManual = (e: React.FormEvent) => {
        e.preventDefault();
        manualForm.post('/attendance', { onSuccess: () => manualForm.reset() });
    };

    // GPS capture
    const captureGps = (
        setter: (loc: string) => void,
        onError: (msg: string) => void,
    ) => {
        if (!navigator.geolocation) {
            onError(
                'Browser tidak mendukung GPS. Silakan ketik lokasi manual.',
            );
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setter(`${latitude.toFixed(6)},${longitude.toFixed(6)}`);
            },
            (err) => {
                if (err.code === 1) {
                    onError(
                        'Izin lokasi ditolak. Silakan ketik lokasi manual.',
                    );
                } else if (
                    err.message.toLowerCase().includes('secure') ||
                    err.message.toLowerCase().includes('origin')
                ) {
                    onError(
                        'GPS memerlukan HTTPS. Silakan ketik lokasi manual (contoh: Kantor Pusat).',
                    );
                } else {
                    onError('Gagal mendapatkan lokasi: ' + err.message);
                }
            },
            { enableHighAccuracy: true, timeout: 10000 },
        );
    };

    // Selfie capture via file input (works on HTTP & mobile)
    const handleSelfieFile = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (dataUrl: string) => void,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                setter(reader.result);
            }
        };
        reader.readAsDataURL(file);
        // reset input so same file can be re-selected
        e.target.value = '';
    };

    // Camera selfie capture (requires HTTPS)
    const [cameraOpen, setCameraOpen] = useState<'in' | 'out' | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const startCamera = async (mode: 'in' | 'out') => {
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
            });
            setCameraOpen(mode);
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 50);
        } catch (err) {
            setCameraError('Gagal mengakses kamera: ' + (err as Error).message);
        }
    };

    const captureSelfie = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

        if (cameraOpen === 'in') {
            checkInForm.setData('photo', dataUrl);
        } else if (cameraOpen === 'out') {
            checkOutForm.setData('photo', dataUrl);
        }

        const stream = video.srcObject as MediaStream | null;
        stream?.getTracks().forEach((t) => t.stop());
        setCameraOpen(null);
    };

    const closeCamera = () => {
        if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream)
                .getTracks()
                .forEach((t) => t.stop());
        }
        setCameraOpen(null);
    };

    const filterDate = (date: string) => {
        router.get('/attendance', { date }, { preserveState: true });
    };

    const getStatusTicket = (status: string, lateMinutes: number) => {
        const s = (status ?? '').toLowerCase();
        if (lateMinutes > 0 || s.includes('late') || s.includes('terlambat')) {
            return (
                <span className="inline-flex items-center rounded-sm border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-amber-800">
                    TERLAMBAT ({lateMinutes}m)
                </span>
            );
        }
        if (s.includes('present') || s.includes('hadir')) {
            return (
                <span className="inline-flex items-center rounded-sm border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-800">
                    TEPAT WAKTU
                </span>
            );
        }
        if (s.includes('absent') || s.includes('alfa')) {
            return (
                <span className="inline-flex items-center rounded-sm border border-red-200 bg-red-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-red-800">
                    ALFA
                </span>
            );
        }
        return (
            <span className="inline-flex items-center rounded-sm border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700">
                {status}
            </span>
        );
    };

    return (
        <>
            <Head title="Absensi & Presensi - HR Sistem" />

            <div className="flex h-full flex-1 flex-col gap-6 bg-[#f8fafc] p-6 lg:p-8 dark:bg-slate-950">
                {/* Header */}
                <header className="flex flex-col gap-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold tracking-widest text-[#16325c] uppercase dark:text-sky-400">
                                LOKET 04 · KEHADIRAN
                            </span>
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                Presensi Harian
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0f274a] dark:text-white">
                            Loket Presensi & Kehadiran Pegawai
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Pencatatan waktu masuk, keluar, status
                            keterlambatan, dan jam lembur pegawai.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-500">
                            Tanggal Operasional:
                        </span>
                        <Input
                            type="date"
                            defaultValue={
                                filters.date ??
                                new Date().toISOString().slice(0, 10)
                            }
                            onChange={(e) => filterDate(e.target.value)}
                            className="h-9 w-40 bg-slate-50 font-mono text-xs font-semibold"
                        />
                    </div>
                </header>

                {/* Camera selfie capture modal */}
                {cameraOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                        <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl dark:bg-slate-900">
                            <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                                Ambil Foto Selfie —{' '}
                                {cameraOpen === 'in' ? 'Check-In' : 'Check-Out'}
                            </h3>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="aspect-[4/3] w-full rounded-lg bg-black object-cover"
                            />
                            <canvas ref={canvasRef} className="hidden" />
                            {cameraError && (
                                <p className="mt-2 text-xs text-red-500">
                                    {cameraError}
                                </p>
                            )}
                            <div className="mt-3 flex gap-2">
                                <Button
                                    type="button"
                                    className="flex-1 bg-[#12284c] text-xs font-semibold text-white"
                                    onClick={captureSelfie}
                                >
                                    <Camera className="mr-1.5 size-4" />
                                    Ambil Foto
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="text-xs"
                                    onClick={closeCamera}
                                >
                                    Batal
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Check-in / Check-out Desk */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Check In Box */}
                    <div className="rounded-xl border border-t-4 border-slate-200 border-t-emerald-600 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="flex size-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                                    <LogIn className="size-4" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Loket Check-In Masuk
                                </h3>
                            </div>
                            <span className="rounded bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                                MASUK KERJA
                            </span>
                        </div>

                        <form onSubmit={doCheckIn} className="mt-4 grid gap-3">
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">
                                    Nama Pegawai
                                </Label>
                                <Select
                                    value={checkInForm.data.employee_id}
                                    onValueChange={(v) =>
                                        checkInForm.setData('employee_id', v)
                                    }
                                >
                                    <SelectTrigger className="h-9 text-xs">
                                        <SelectValue placeholder="Pilih pegawai yang check-in" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((e) => (
                                            <SelectItem
                                                key={e.id}
                                                value={String(e.id)}
                                                className="text-xs"
                                            >
                                                {e.employee_number} -{' '}
                                                {e.first_name} {e.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">
                                    Lokasi / Titik Presensi (GPS)
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Koordinat GPS atau keterangan"
                                        value={checkInForm.data.location}
                                        onChange={(e) =>
                                            checkInForm.setData(
                                                'location',
                                                e.target.value,
                                            )
                                        }
                                        className="h-9 flex-1 text-xs"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-9 px-3 text-xs"
                                        onClick={() =>
                                            captureGps(
                                                (loc) =>
                                                    checkInForm.setData(
                                                        'location',
                                                        loc,
                                                    ),
                                                (msg) => alert(msg),
                                            )
                                        }
                                    >
                                        <MapPin className="size-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">
                                    Foto Selfie Check-In
                                </Label>
                                <div className="flex items-center gap-3">
                                    {checkInForm.data.photo ? (
                                        <img
                                            src={checkInForm.data.photo}
                                            alt="Selfie check-in"
                                            className="size-16 rounded-lg border object-cover"
                                        />
                                    ) : (
                                        <div className="flex size-16 items-center justify-center rounded-lg border border-dashed text-slate-400">
                                            <Camera className="size-6" />
                                        </div>
                                    )}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-9 text-xs"
                                        onClick={() => startCamera('in')}
                                    >
                                        <Camera className="mr-1.5 size-4" />
                                        Ambil Selfie (Kamera)
                                    </Button>
                                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-xs font-semibold shadow-xs hover:bg-accent">
                                        <Upload className="size-4" />
                                        Upload Foto
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                                handleSelfieFile(e, (dataUrl) =>
                                                    checkInForm.setData(
                                                        'photo',
                                                        dataUrl,
                                                    ),
                                                )
                                            }
                                        />
                                    </label>
                                    {checkInForm.data.photo && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="h-9 px-2 text-xs text-red-500"
                                            onClick={() =>
                                                checkInForm.setData('photo', '')
                                            }
                                        >
                                            Hapus
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <Button
                                disabled={
                                    checkInForm.processing ||
                                    !checkInForm.data.employee_id
                                }
                                type="submit"
                                className="mt-1 h-9 bg-emerald-700 text-xs font-semibold tracking-wider text-white uppercase hover:bg-emerald-800"
                            >
                                Catat Check-In Masuk
                            </Button>
                        </form>
                    </div>

                    {/* Check Out Box */}
                    <div className="rounded-xl border border-t-4 border-slate-200 border-t-amber-600 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="flex size-7 items-center justify-center rounded-md bg-amber-50 text-amber-700">
                                    <LogOut className="size-4" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Loket Check-Out Pulang
                                </h3>
                            </div>
                            <span className="rounded bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-700">
                                SELESAI KERJA
                            </span>
                        </div>

                        <form onSubmit={doCheckOut} className="mt-4 grid gap-3">
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">
                                    Nama Pegawai
                                </Label>
                                <Select
                                    value={checkOutForm.data.employee_id}
                                    onValueChange={(v) =>
                                        checkOutForm.setData('employee_id', v)
                                    }
                                >
                                    <SelectTrigger className="h-9 text-xs">
                                        <SelectValue placeholder="Pilih pegawai yang check-out" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((e) => (
                                            <SelectItem
                                                key={e.id}
                                                value={String(e.id)}
                                                className="text-xs"
                                            >
                                                {e.employee_number} -{' '}
                                                {e.first_name} {e.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">
                                    Lokasi / Catatan (GPS)
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Koordinat GPS atau keterangan"
                                        value={checkOutForm.data.location}
                                        onChange={(e) =>
                                            checkOutForm.setData(
                                                'location',
                                                e.target.value,
                                            )
                                        }
                                        className="h-9 flex-1 text-xs"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-9 px-3 text-xs"
                                        onClick={() =>
                                            captureGps(
                                                (loc) =>
                                                    checkOutForm.setData(
                                                        'location',
                                                        loc,
                                                    ),
                                                (msg) => alert(msg),
                                            )
                                        }
                                    >
                                        <MapPin className="size-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">
                                    Foto Selfie Check-Out
                                </Label>
                                <div className="flex items-center gap-3">
                                    {checkOutForm.data.photo ? (
                                        <img
                                            src={checkOutForm.data.photo}
                                            alt="Selfie check-out"
                                            className="size-16 rounded-lg border object-cover"
                                        />
                                    ) : (
                                        <div className="flex size-16 items-center justify-center rounded-lg border border-dashed text-slate-400">
                                            <Camera className="size-6" />
                                        </div>
                                    )}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-9 text-xs"
                                        onClick={() => startCamera('out')}
                                    >
                                        <Camera className="mr-1.5 size-4" />
                                        Ambil Selfie (Kamera)
                                    </Button>
                                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-xs font-semibold shadow-xs hover:bg-accent">
                                        <Upload className="size-4" />
                                        Upload Foto
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                                handleSelfieFile(e, (dataUrl) =>
                                                    checkOutForm.setData(
                                                        'photo',
                                                        dataUrl,
                                                    ),
                                                )
                                            }
                                        />
                                    </label>
                                    {checkOutForm.data.photo && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="h-9 px-2 text-xs text-red-500"
                                            onClick={() =>
                                                checkOutForm.setData(
                                                    'photo',
                                                    '',
                                                )
                                            }
                                        >
                                            Hapus
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <Button
                                disabled={
                                    checkOutForm.processing ||
                                    !checkOutForm.data.employee_id
                                }
                                type="submit"
                                className="mt-1 h-9 bg-amber-600 text-xs font-semibold tracking-wider text-white uppercase hover:bg-amber-700"
                            >
                                Catat Check-Out Pulang
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Riwayat Absensi Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/70 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold tracking-wider text-[#0f274a] uppercase dark:text-white">
                                JURNAL LOG PRESENSI HARIAN
                            </span>
                            <span className="rounded-full bg-slate-200 px-2 py-0.5 font-mono text-[10px] text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                {attendances.data.length} rekaman
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400">
                                    <th className="p-3.5 pl-5">
                                        NIP & Nama Pegawai
                                    </th>
                                    <th className="p-3.5">Tanggal</th>
                                    <th className="p-3.5">Check-In</th>
                                    <th className="p-3.5">Check-Out</th>
                                    <th className="p-3.5">Foto Selfie</th>
                                    <th className="p-3.5">Lokasi GPS</th>
                                    <th className="p-3.5">Status Kehadiran</th>
                                    <th className="p-3.5">Terlambat</th>
                                    <th className="p-3.5 pr-5">Lembur</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {attendances.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="p-8 text-center text-xs text-slate-400"
                                        >
                                            Belum ada catatan presensi untuk
                                            tanggal yang dipilih.
                                        </td>
                                    </tr>
                                ) : (
                                    attendances.data.map((a: any) => (
                                        <tr
                                            key={a.id}
                                            className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                                        >
                                            <td className="p-3.5 pl-5">
                                                <p className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {a.employee?.first_name}{' '}
                                                    {a.employee?.last_name}
                                                </p>
                                                <p className="font-mono text-[10px] text-slate-400">
                                                    {
                                                        a.employee
                                                            ?.employee_number
                                                    }
                                                </p>
                                            </td>
                                            <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                                                {a.date}
                                            </td>
                                            <td className="p-3.5 font-mono font-semibold text-emerald-700">
                                                {a.check_in_at
                                                    ? a.check_in_at.slice(
                                                          11,
                                                          16,
                                                      ) || a.check_in_at
                                                    : '-'}
                                            </td>
                                            <td className="p-3.5 font-mono font-semibold text-amber-700">
                                                {a.check_out_at
                                                    ? a.check_out_at.slice(
                                                          11,
                                                          16,
                                                      ) || a.check_out_at
                                                    : '-'}
                                            </td>
                                            <td className="p-3.5">
                                                <div className="flex items-center gap-1.5">
                                                    {a.check_in_photo ? (
                                                        <img
                                                            src={`/uploads/attendance/${a.check_in_photo}`}
                                                            alt="Selfie in"
                                                            className="size-10 rounded-md border object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-slate-300">
                                                            -
                                                        </span>
                                                    )}
                                                    {a.check_out_photo ? (
                                                        <img
                                                            src={`/uploads/attendance/${a.check_out_photo}`}
                                                            alt="Selfie out"
                                                            className="size-10 rounded-md border object-cover"
                                                        />
                                                    ) : null}
                                                </div>
                                            </td>
                                            <td className="p-3.5 font-mono text-[10px] text-slate-500">
                                                {a.check_in_location ? (
                                                    <div className="space-y-0.5">
                                                        <p className="text-emerald-700">
                                                            IN:{' '}
                                                            {
                                                                a.check_in_location
                                                            }
                                                        </p>
                                                        {a.check_out_location && (
                                                            <p className="text-amber-700">
                                                                OUT:{' '}
                                                                {
                                                                    a.check_out_location
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="p-3.5">
                                                {getStatusTicket(
                                                    a.status,
                                                    a.late_minutes ?? 0,
                                                )}
                                            </td>
                                            <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                                                {a.late_minutes > 0
                                                    ? `${a.late_minutes} mnt`
                                                    : '-'}
                                            </td>
                                            <td className="p-3.5 pr-5 font-mono text-slate-600 dark:text-slate-400">
                                                {a.overtime_minutes > 0
                                                    ? `${a.overtime_minutes} mnt`
                                                    : '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

AttendanceIndex.layout = {
    breadcrumbs: [{ title: 'Absensi & Presensi', href: '/attendance' }],
};
