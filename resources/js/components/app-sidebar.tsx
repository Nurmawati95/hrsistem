import { Link } from '@inertiajs/react';
import {
    CalendarDays,
    ClipboardList,
    DollarSign,
    LayoutGrid,
    Settings,
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

const mainNavItems: NavItem[] = [
    {
        title: 'Dasbor',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Karyawan',
        href: '/employees',
        icon: Users,
    },
    {
        title: 'Struktur Organisasi',
        href: '/organization',
        icon: Settings,
    },
    {
        title: 'Shift & Jadwal',
        href: '/shifts',
        icon: CalendarDays,
    },
    {
        title: 'Absensi',
        href: '/attendance',
        icon: ClipboardList,
    },
    {
        title: 'Cuti & Izin',
        href: '/leave/requests',
        icon: CalendarDays,
    },
    {
        title: 'Penggajian',
        href: '/payroll/periods',
        icon: DollarSign,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
