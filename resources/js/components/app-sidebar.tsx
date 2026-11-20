import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import {
    Building2,
    CalendarDays,
    ClipboardList,
    DollarSign,
    LayoutGrid,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard Utama',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Master Karyawan',
        href: '/employees',
        icon: Users,
    },
    {
        title: 'Struktur Organisasi',
        href: '/organization',
        icon: Building2,
    },
    {
        title: 'Shift & Jadwal Kerja',
        href: '/shifts',
        icon: CalendarDays,
    },
    {
        title: 'Absensi & Presensi',
        href: '/attendance',
        icon: ClipboardList,
    },
    {
        title: 'Cuti & Izin Pegawai',
        href: '/leave/requests',
        icon: CalendarDays,
    },
    {
        title: 'Penggajian & Slip Gaji',
        href: '/payroll/periods',
        icon: DollarSign,
    },
];

const karyawanNavItems: NavItem[] = [
    {
        title: 'Dashboard Utama',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Master Karyawan',
        href: '/employees',
        icon: Users,
    },
    {
        title: 'Cuti & Izin Pegawai',
        href: '/leave/requests',
        icon: CalendarDays,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { role } = usePage().props as { role?: string };

    const isAdmin = role === 'admin';
    const items = isAdmin ? adminNavItems : karyawanNavItems;

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-r border-slate-200/80 dark:border-slate-800"
        >
            <SidebarHeader className="border-b border-slate-100 p-3 dark:border-slate-800/80">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={items} />
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-100 p-2 dark:border-slate-800/80">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
