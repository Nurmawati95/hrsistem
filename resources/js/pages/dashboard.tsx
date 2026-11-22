import { Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    Building2,
    CalendarCheck,
    CheckCircle2,
    Clock,
    DollarSign,
    FileText,
    HelpCircle,
    PlusCircle,
    Settings,
    Shield,
    Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';

type Props = {
    stats?: {
        employees: number;
        departments: number;
        pending_leaves: number;
        today_attendance: number;
    };
};

export default function Dashboard({ stats }: Props) {
    const today = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date());

    const counters = [
        {
            num: '01',
            title: 'Pegawai Aktif',
            value: stats?.employees ?? 0,
            href: '/employees',
            icon: Users,
            tag: 'Master Pegawai',
            hint: 'Total terdaftar dalam database',
            color: 'border-l-4 border-l-[#16325c] bg-white',
            badgeClass: 'bg-slate-100 text-slate-800',
        },
        {
            num: '02',
            title: 'Unit & Departemen',
            value: stats?.departments ?? 0,
            href: '/departments',
            icon: Building2,
            tag: 'Organisasi',
            hint: 'Divisi struktural aktif',
            color: 'border-l-4 border-l-sky-600 bg-white',
            badgeClass: 'bg-sky-50 text-sky-800',
        },
        {
            num: '03',
            title: 'Antrean Cuti Menunggu',
            value: stats?.pending_leaves ?? 0,
            href: '/leave/requests',
            icon: CalendarCheck,
            tag: 'Perlu Verifikasi',
            hint: 'Pengajuan cuti belum diproses',
            color: 'border-l-4 border-l-amber-500 bg-white',
            badgeClass: 'bg-amber-100 text-amber-900 font-semibold',
        },
        {
            num: '04',
            title: 'Presensi Masuk Hari Ini',
            value: stats?.today_attendance ?? 0,
            href: '/attendance',
            icon: Clock,
            tag: 'Real-time',
            hint: 'Check-in pegawai tercatat',
            color: 'border-l-4 border-l-emerald-600 bg-white',
            badgeClass: 'bg-emerald-100 text-emerald-900 font-semibold',
        },
    ];

    const quickDesk = [
        {
            label: 'Tambah Pegawai Baru',
            desc: 'Daftarkan pegawai ke sistem',
            href: '/employees/create',
            icon: PlusCircle,
            primary: true,
        },
        {
            label: 'Loket Presensi',
            desc: 'Catat atau periksa presensi',
            href: '/attendance',
            icon: Clock,
        },
        {
            label: 'Verifikasi Cuti',
            desc: 'Setujui atau tolak izin',
            href: '/leave/requests',
            icon: CalendarCheck,
        },
        {
            label: 'Periode Payroll',
            desc: 'Kelola penggajian pegawai',
            href: '/payroll/periods',
            icon: DollarSign,
        },
        {
            label: 'Shift Kerja',
            desc: 'Atur jadwal jam kerja',
            href: '/shifts',
            icon: FileText,
        },
        {
            label: 'Info Perusahaan',
            desc: 'Atur profil & pengumuman',
            href: '/settings/company',
            icon: Settings,
        },
    ];

    return (
        <>
            <Head title="Dashboard - HR Sistem" />

            <div className="flex h-full flex-1 flex-col gap-6 bg-[#f8fafc] p-4 sm:p-6 lg:p-8 dark:bg-slate-950">
                {/* Header Banner resembling Institutional Service Desk */}
                <header className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold tracking-widest text-[#16325c] uppercase dark:text-sky-400">
                                LOKET OPERASIONAL UTAMA
                            </span>
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                                <span className="mr-1 size-1.5 animate-pulse rounded-full bg-emerald-500" />
                                Sistem Siap
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#0f274a] dark:text-white">
                            Pusat Komando & Administrasi HR
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Pemantauan langsung data pegawai, kehadiran
                            real-time, dan antrean persetujuan.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-right dark:border-slate-800 dark:bg-slate-800/60">
                            <span className="block text-[10px] font-medium text-slate-400 uppercase">
                                TANGGAL HARI INI
                            </span>
                            <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">
                                {today}
                            </span>
                        </div>
                    </div>
                </header>

                {/* 4 Stat Ticket Stubs */}
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {counters.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.num}
                                href={item.href}
                                className="group relative block transition-all duration-200 hover:-translate-y-0.5"
                            >
                                <div
                                    className={`relative flex flex-col justify-between rounded-xl border border-slate-200 p-5 shadow-xs transition-shadow duration-200 group-hover:shadow-md dark:border-slate-800 dark:bg-slate-900 ${item.color}`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-[11px] font-bold text-slate-400">
                                                LOKET {item.num}
                                            </span>
                                            <span
                                                className={`rounded px-2 py-0.5 text-[10px] tracking-wide uppercase ${item.badgeClass}`}
                                            >
                                                {item.tag}
                                            </span>
                                        </div>

                                        <div className="mt-3 flex items-baseline justify-between">
                                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                {item.title}
                                            </span>
                                            <Icon className="size-4 text-slate-400 transition-colors group-hover:text-[#16325c]" />
                                        </div>

                                        <p className="mt-2 font-mono text-3xl font-extrabold tracking-tight text-[#0f274a] dark:text-white">
                                            {item.value}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                        <span className="truncate">
                                            {item.hint}
                                        </span>
                                        <ArrowUpRight className="size-3.5 text-[#16325c] opacity-60 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </section>

                {/* Quick Desk / Tindakan Cepat */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold tracking-wider text-slate-800 uppercase dark:text-slate-200">
                            Meja Tindakan Cepat (Quick Desk)
                        </h2>
                        <span className="text-xs text-slate-500">
                            Akses langsung fungsi operasional harian
                        </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                        {quickDesk.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className={`group flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                                        action.primary
                                            ? 'border-[#16325c] bg-[#16325c] text-white hover:bg-[#1f4277]'
                                            : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <Icon
                                            className={`size-5 ${
                                                action.primary
                                                    ? 'text-amber-400'
                                                    : 'text-[#16325c] dark:text-sky-400'
                                            }`}
                                        />
                                        <ArrowUpRight
                                            className={`size-3.5 opacity-40 transition-opacity group-hover:opacity-100 ${
                                                action.primary
                                                    ? 'text-white'
                                                    : 'text-slate-500'
                                            }`}
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs leading-tight font-bold">
                                            {action.label}
                                        </p>
                                        <p
                                            className={`mt-1 text-[10px] ${
                                                action.primary
                                                    ? 'text-slate-200'
                                                    : 'text-slate-500 dark:text-slate-400'
                                            }`}
                                        >
                                            {action.desc}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* Workflow Guidance & System Standards */}
                <section className="grid gap-6 lg:grid-cols-2">
                    {/* Alur Kerja Harian */}
                    <Card className="border-slate-200/90 shadow-xs dark:border-slate-800">
                        <CardHeader className="border-b border-slate-100 pb-3 dark:border-slate-800">
                            <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-wider text-[#0f274a] uppercase dark:text-white">
                                <CheckCircle2 className="size-4 text-emerald-600" />
                                Standar Alur Kerja Harian HR
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4 text-xs text-slate-600 dark:text-slate-300">
                            <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                                <span className="font-mono font-bold text-[#16325c] dark:text-sky-400">
                                    01.
                                </span>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                                        Presensi & Monitoring Shift
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                        Cek rekapitulasi check-in masuk dan
                                        toleransi keterlambatan pegawai pada
                                        modul Absensi.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                                <span className="font-mono font-bold text-[#16325c] dark:text-sky-400">
                                    02.
                                </span>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                                        Verifikasi Berkas Cuti & Izin
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                        Tinjau permohonan cuti yang masuk. Kuota
                                        cuti terpotong otomatis saat disetujui.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                                <span className="font-mono font-bold text-[#16325c] dark:text-sky-400">
                                    03.
                                </span>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                                        Penyesuaian Data & Penggajian
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                        Pastikan unit departemen dan jabatan
                                        pegawai telah sinkron sebelum memproses
                                        periode payroll.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Informasi Portal & Status Keamanan */}
                    <Card className="border-slate-200/90 shadow-xs dark:border-slate-800">
                        <CardHeader className="border-b border-slate-100 pb-3 dark:border-slate-800">
                            <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-wider text-[#0f274a] uppercase dark:text-white">
                                <Shield className="size-4 text-[#16325c] dark:text-sky-400" />
                                Informasi Sistem & Keamanan Akun
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3.5 pt-4 text-xs">
                            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                                Portal HR Sistem menggunakan enkripsi session
                                dan autentikasi multi-faktor (2FA) serta
                                mendukung Passkey biometrik untuk menjaga
                                kerahasiaan data kepegawaian.
                            </p>

                            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                                <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                                    <span className="text-[10px] font-medium text-slate-400 uppercase">
                                        Pengaturan Informasi
                                    </span>
                                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">
                                        Portal Publik & Perusahaan
                                    </p>
                                    <Link
                                        href="/settings/company"
                                        className="mt-2 inline-flex items-center text-[11px] font-semibold text-[#16325c] hover:underline dark:text-sky-400"
                                    >
                                        Kelola Informasi →
                                    </Link>
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                                    <span className="text-[10px] font-medium text-slate-400 uppercase">
                                        Keamanan Pengguna
                                    </span>
                                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">
                                        2FA & Kredensial Passkey
                                    </p>
                                    <Link
                                        href="/settings/security"
                                        className="mt-2 inline-flex items-center text-[11px] font-semibold text-[#16325c] hover:underline dark:text-sky-400"
                                    >
                                        Periksa Keamanan →
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard Utama',
            href: dashboard(),
        },
    ],
};
