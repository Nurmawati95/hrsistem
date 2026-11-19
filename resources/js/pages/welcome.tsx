import { Head, Link, usePage } from '@inertiajs/react';
import {
    Building2,
    CalendarCheck,
    CheckCircle2,
    ChevronRight,
    Clock,
    FileText,
    Info,
    Lock,
    Mail,
    MapPin,
    Phone,
    Shield,
    Users,
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { dashboard, login } from '@/routes';

type CompanySettingType = {
    company_name: string;
    tagline: string;
    email: string;
    phone: string;
    address: string;
    work_hours: string;
    announcement_title?: string;
    announcement_content?: string;
    announcement_active?: boolean;
    leave_policy?: string;
    attendance_policy?: string;
};

type Props = {
    company?: CompanySettingType;
    stats?: {
        employees: number;
        departments: number;
        today_attendance: number;
    };
};

export default function Welcome({ company, stats }: Props) {
    const { auth } = usePage().props;

    const companyData: CompanySettingType = company ?? {
        company_name: 'PT Nusantara Solusi SDM',
        tagline: 'Sistem Informasi Kepegawaian & Operasional Terpadu',
        email: 'hrd@nusantara-sdm.co.id',
        phone: '+62 21 555-0188',
        address:
            'Gedung Menara Pratama Lt. 14, Jl. Jend. Sudirman Kav. 28, Jakarta Selatan 12920',
        work_hours: 'Senin - Jumat: 08:30 - 17:30 WIB',
        announcement_title: 'Pengumuman Pelayanan & Operasional',
        announcement_content:
            'Pengajuan cuti dan rekapitulasi presensi periode ini diproses melalui loket digital HR Sistem. Harap pastikan check-in dilakukan setiap hari kerja.',
        announcement_active: true,
        leave_policy:
            'Pengajuan cuti diajukan minimal 3 hari kerja sebelum tanggal cuti melalui sistem.',
        attendance_policy:
            'Presensi masuk dibuka 30 menit sebelum shift dimulai dengan toleransi keterlambatan maksimal 15 menit.',
    };

    const modules = [
        {
            num: '01',
            title: 'Presensi & Kehadiran',
            desc: 'Check-in dan check-out digital harian, validasi shift, rekapitulasi jam kerja terintegrasi real-time.',
            icon: Clock,
            tag: 'Harian',
        },
        {
            num: '02',
            title: 'Pengajuan Cuti & Izin',
            desc: 'Pengajuan cuti tahunan, sakit, dan izin dengan sistem persetujuan berjenjang dan pemotongan kuota otomatis.',
            icon: CalendarCheck,
            tag: 'Self-Service',
        },
        {
            num: '03',
            title: 'Penggajian & Slip Gaji',
            desc: 'Pemrosesan gaji berkala per periode, slip gaji transparan, potongan, dan tunjangan tercatat rapi.',
            icon: FileText,
            tag: 'Periode',
        },
        {
            num: '04',
            title: 'Data Induk Pegawai',
            desc: 'Manajemen berkas pegawai, riwayat jabatan, riwayat pendidikan, status kerja, dan nomor induk karyawan.',
            icon: Users,
            tag: 'Master Data',
        },
        {
            num: '05',
            title: 'Departemen & Posisi',
            desc: 'Pengelolaan hierarki departemen, pembagian unit kerja, dan standardisasi level jabatan organisasi.',
            icon: Building2,
            tag: 'Organisasi',
        },
        {
            num: '06',
            title: 'Keamanan & Autentikasi',
            desc: 'Akses terproteksi dengan Two-Factor Authentication (2FA) dan passkey biometrik standar industri.',
            icon: Shield,
            tag: 'Keamanan',
        },
    ];

    return (
        <>
            <Head title={`Beranda - ${companyData.company_name}`} />

            <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased selection:bg-[#1e3a6a] selection:text-white">
                {/* Announcement Bar if Active */}
                {companyData.announcement_active &&
                    companyData.announcement_content && (
                        <div className="border-b border-amber-200 bg-amber-50/90 px-4 py-2.5 text-xs text-amber-950">
                            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-sm bg-amber-600 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
                                        PENGUMUMAN
                                    </span>
                                    <span className="font-semibold">
                                        {companyData.announcement_title}:
                                    </span>
                                    <span>
                                        {companyData.announcement_content}
                                    </span>
                                </div>
                                <span className="hidden items-center gap-1.5 font-mono text-[11px] text-amber-800 md:inline-flex">
                                    <Clock className="size-3.5" />
                                    {companyData.work_hours}
                                </span>
                            </div>
                        </div>
                    )}

                {/* Top Navigation */}
                <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-[#12284c] text-white shadow-sm ring-1 ring-black/5">
                                <AppLogoIcon className="size-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold tracking-wider text-[#0f274a] uppercase">
                                    HR SISTEM
                                </span>
                                <span className="text-[11px] font-medium text-slate-500">
                                    {companyData.company_name}
                                </span>
                            </div>
                        </div>

                        {/* Middle links */}
                        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
                            <a
                                href="#fitur"
                                className="transition-colors hover:text-[#12284c]"
                            >
                                Layanan & Fitur
                            </a>
                            <a
                                href="#kebijakan"
                                className="transition-colors hover:text-[#12284c]"
                            >
                                Kebijakan HR
                            </a>
                            <a
                                href="#kontak"
                                className="transition-colors hover:text-[#12284c]"
                            >
                                Informasi Kantor
                            </a>
                        </nav>

                        {/* Auth actions */}
                        <div className="flex items-center gap-3">
                            {auth?.user ? (
                                <Button
                                    asChild
                                    className="bg-[#12284c] hover:bg-[#1b3a6b]"
                                >
                                    <Link href={dashboard()}>
                                        Buka Dashboard
                                        <ChevronRight className="ml-1 size-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <Button
                                    asChild
                                    className="bg-[#12284c] font-medium shadow-sm hover:bg-[#1b3a6b]"
                                >
                                    <Link href={login()}>
                                        <Lock className="mr-1.5 size-4" />
                                        Masuk Portal
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-[#f1f5f9] py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid items-center gap-12 lg:grid-cols-12">
                            {/* Left copy */}
                            <div className="lg:col-span-7">
                                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-[#12284c] shadow-xs">
                                    <span className="size-2 animate-pulse rounded-full bg-emerald-500"></span>
                                    PORTAL KEPEGAWAIAN RESMI & TERPADU
                                </div>
                                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0b1c36] sm:text-4xl lg:text-5xl">
                                    Manajemen SDM dan Pelayanan Pegawai Berbasis
                                    Digital
                                </h1>
                                <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                                    {companyData.tagline}. Seluruh operasional
                                    kehadiran, pengajuan izin, pembaruan data,
                                    hingga transparansi penggajian dalam satu
                                    portal terpusat.
                                </p>

                                <div className="mt-8 flex flex-wrap items-center gap-4">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="bg-[#12284c] px-6 text-sm font-semibold shadow-sm hover:bg-[#1b3a6b]"
                                    >
                                        <Link
                                            href={
                                                auth?.user
                                                    ? dashboard()
                                                    : login()
                                            }
                                        >
                                            {auth?.user
                                                ? 'Menuju Dashboard HR'
                                                : 'Login Pegawai / Admin'}
                                            <ChevronRight className="ml-1 size-4" />
                                        </Link>
                                    </Button>
                                    <a
                                        href="#kebijakan"
                                        className="inline-flex items-center text-sm font-medium text-slate-700 underline-offset-4 hover:underline"
                                    >
                                        Panduan Operasional & Kontak
                                    </a>
                                </div>

                                {/* Security and trust note */}
                                <div className="mt-8 flex items-center gap-6 border-t border-slate-200/80 pt-6 text-xs text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="size-4 text-emerald-600" />
                                        <span>Presensi Terverifikasi</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Shield className="size-4 text-emerald-600" />
                                        <span>Enkripsi 2FA / Passkey</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Building2 className="size-4 text-emerald-600" />
                                        <span>Data Akuntabel</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Service Ticket Card Preview */}
                            <div className="lg:col-span-5">
                                <div className="relative rounded-2xl border border-slate-300/80 bg-white p-6 shadow-xl shadow-slate-200/50">
                                    {/* Card Header resembling Loket Antrian */}
                                    <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-4">
                                        <div>
                                            <span className="font-mono text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                                                LOKET STATUS OPERASIONAL
                                            </span>
                                            <h3 className="text-base font-bold text-[#0f274a]">
                                                Ringkasan Hari Ini
                                            </h3>
                                        </div>
                                        <div className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                                            Layanan Aktif
                                        </div>
                                    </div>

                                    {/* Mini Metrics */}
                                    <div className="mt-5 grid grid-cols-2 gap-3 font-mono">
                                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5">
                                            <span className="text-[11px] font-medium text-slate-500">
                                                Presensi Hari Ini
                                            </span>
                                            <p className="mt-1 text-2xl font-bold text-[#0f274a]">
                                                {stats?.today_attendance ?? 0}
                                            </p>
                                            <span className="font-sans text-[10px] text-emerald-600">
                                                ✓ Check-in tercatat
                                            </span>
                                        </div>
                                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5">
                                            <span className="text-[11px] font-medium text-slate-500">
                                                Pegawai Terdaftar
                                            </span>
                                            <p className="mt-1 text-2xl font-bold text-[#0f274a]">
                                                {stats?.employees ?? 0}
                                            </p>
                                            <span className="font-sans text-[10px] text-slate-500">
                                                Pegawai aktif
                                            </span>
                                        </div>
                                    </div>

                                    {/* Operational hours notice */}
                                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-600">
                                        <div className="flex items-start gap-2">
                                            <Clock className="mt-0.5 size-4 shrink-0 text-[#12284c]" />
                                            <div>
                                                <p className="font-semibold text-slate-800">
                                                    Jam Kerja Standar:
                                                </p>
                                                <p className="mt-0.5 font-mono text-[11px]">
                                                    {companyData.work_hours}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick action button inside card */}
                                    <div className="mt-5">
                                        <Button
                                            asChild
                                            className="w-full bg-[#12284c] hover:bg-[#1b3a6b]"
                                        >
                                            <Link
                                                href={
                                                    auth?.user
                                                        ? dashboard()
                                                        : login()
                                                }
                                            >
                                                {auth?.user
                                                    ? 'Masuk ke Dashboard'
                                                    : 'Login ke Portal Karyawan'}
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Modules & Services Section */}
                <section id="fitur" className="py-16 sm:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center text-center">
                            <span className="rounded-sm bg-[#12284c]/10 px-2.5 py-1 font-mono text-xs font-semibold tracking-wider text-[#12284c] uppercase">
                                LOKET DIGITAL TERPADU
                            </span>
                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#0f274a] sm:text-3xl">
                                Layanan & Modul Kepegawaian
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm text-slate-600">
                                Setiap fungsi terorganisasi dengan standar loket
                                administrasi yang tertib, terukur, dan
                                transparan bagi setiap tingkatan peran.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {modules.map((m) => {
                                const Icon = m.icon;
                                return (
                                    <div
                                        key={m.num}
                                        className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono text-2xl font-extrabold text-slate-300 transition-colors group-hover:text-[#12284c]">
                                                    {m.num}
                                                </span>
                                                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-slate-600 uppercase">
                                                    {m.tag}
                                                </span>
                                            </div>
                                            <div className="mt-4 flex items-center gap-2.5">
                                                <div className="flex size-9 items-center justify-center rounded-lg bg-[#12284c]/10 text-[#12284c]">
                                                    <Icon className="size-5" />
                                                </div>
                                                <h3 className="text-base font-bold text-slate-900">
                                                    {m.title}
                                                </h3>
                                            </div>
                                            <p className="mt-3 text-xs leading-relaxed text-slate-600">
                                                {m.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Policies & Institutional Information (Configured by Admin) */}
                <section
                    id="kebijakan"
                    className="border-t border-slate-200 bg-white py-16 sm:py-20"
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-12">
                            <div className="lg:col-span-5">
                                <span className="font-mono text-xs font-semibold tracking-wider text-[#12284c] uppercase">
                                    KETENTUAN OPERASIONAL
                                </span>
                                <h2 className="mt-2 text-2xl font-bold text-[#0f274a] sm:text-3xl">
                                    Kebijakan & Informasi Kepegawaian
                                </h2>
                                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                    Informasi ini dikelola langsung oleh tim
                                    Administrator HR untuk memastikan
                                    keselarasan operasional seluruh unit kerja
                                    dan transparansi aturan bagi pegawai.
                                </p>

                                <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="flex items-start gap-3">
                                        <Info className="mt-0.5 size-5 shrink-0 text-[#12284c]" />
                                        <div className="text-xs">
                                            <p className="font-bold text-slate-800">
                                                Perubahan Data Pegawai?
                                            </p>
                                            <p className="mt-1 text-slate-600">
                                                Pegawai dapat memperbarui kontak
                                                atau dokumen melalui portal
                                                mandiri, atau menghubungi
                                                administrator HR untuk perubahan
                                                data struktural.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 lg:col-span-7">
                                {/* Policy 1: Attendance */}
                                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
                                    <div className="flex items-center gap-2.5">
                                        <Clock className="size-5 text-[#12284c]" />
                                        <h3 className="text-base font-bold text-slate-900">
                                            Kebijakan Presensi & Keterlambatan
                                        </h3>
                                    </div>
                                    <p className="mt-2.5 text-sm leading-relaxed text-slate-700">
                                        {companyData.attendance_policy ??
                                            'Presensi masuk wajib dilakukan sebelum jam kerja dimulai dengan toleransi keterlambatan sesuai shift kerja.'}
                                    </p>
                                </div>

                                {/* Policy 2: Leave */}
                                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
                                    <div className="flex items-center gap-2.5">
                                        <CalendarCheck className="size-5 text-[#12284c]" />
                                        <h3 className="text-base font-bold text-slate-900">
                                            Ketentuan Pengajuan Cuti & Izin
                                        </h3>
                                    </div>
                                    <p className="mt-2.5 text-sm leading-relaxed text-slate-700">
                                        {companyData.leave_policy ??
                                            'Pengajuan cuti tahunan diajukan melalui sistem secara terpadu untuk mendapatkan verifikasi atasan dan konfirmasi HR.'}
                                    </p>
                                </div>

                                {/* Policy 3: Work Hours */}
                                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
                                    <div className="flex items-center gap-2.5">
                                        <Building2 className="size-5 text-[#12284c]" />
                                        <h3 className="text-base font-bold text-slate-900">
                                            Jadwal & Jam Operasional Kantor
                                        </h3>
                                    </div>
                                    <p className="mt-2.5 font-mono text-sm font-semibold text-[#12284c]">
                                        {companyData.work_hours}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact & Footer Section */}
                <footer
                    id="kontak"
                    className="border-t border-slate-300 bg-[#0b1a30] text-white"
                >
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Brand info */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-white">
                                        <AppLogoIcon className="size-5 text-white" />
                                    </div>
                                    <span className="font-bold tracking-wider text-white uppercase">
                                        HR SISTEM
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400">
                                    {companyData.company_name}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {companyData.tagline}
                                </p>
                            </div>

                            {/* Office Address */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                                    Alamat Kantor
                                </h4>
                                <div className="flex items-start gap-2 text-xs text-slate-400">
                                    <MapPin className="mt-0.5 size-4 shrink-0 text-amber-400" />
                                    <span>{companyData.address}</span>
                                </div>
                            </div>

                            {/* Contact HR */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                                    Kontak Resmi HR
                                </h4>
                                <div className="space-y-1.5 text-xs text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Mail className="size-4 text-amber-400" />
                                        <span>{companyData.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="size-4 text-amber-400" />
                                        <span>{companyData.phone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Portal Access */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                                    Akses Portal
                                </h4>
                                <div className="flex flex-col gap-1.5 text-xs text-slate-400">
                                    <Link
                                        href={login()}
                                        className="transition-colors hover:text-white"
                                    >
                                        → Login Pegawai
                                    </Link>
                                    <Link
                                        href={login()}
                                        className="transition-colors hover:text-white"
                                    >
                                        → Login Administrator
                                    </Link>
                                    <a
                                        href="#kebijakan"
                                        className="transition-colors hover:text-white"
                                    >
                                        → Kebijakan Presensi & Cuti
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
                            © {new Date().getFullYear()}{' '}
                            {companyData.company_name} — Seluruh Hak Cipta
                            Dilindungi.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
