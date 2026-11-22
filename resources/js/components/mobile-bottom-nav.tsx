import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { adminNavItems, karyawanNavItems } from '@/components/app-sidebar';
import type { NavItem } from '@/types';

const MAX_VISIBLE = 4;

export function MobileBottomNav() {
    const isMobile = useIsMobile();
    const { role } = usePage().props as { role?: string };
    const { isCurrentUrl } = useCurrentUrl();
    const [open, setOpen] = useState(false);

    if (!isMobile) return null;

    const isAdmin = role === 'admin';
    const items = isAdmin ? adminNavItems : karyawanNavItems;

    const visible = items.slice(0, MAX_VISIBLE);
    const rest = items.slice(MAX_VISIBLE);
    const hasMore = rest.length > 0;

    return (
        <>
            <nav
                className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/95 backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-900/95"
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
                <div className="flex items-stretch justify-around px-1 pt-1">
                    {visible.map((item) => {
                        const active = isCurrentUrl(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                prefetch
                                className={cn(
                                    'flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium transition-colors',
                                    active
                                        ? 'text-[#16325c] dark:text-sky-400'
                                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
                                )}
                            >
                                {Icon && (
                                    <Icon
                                        className={cn(
                                            'size-5',
                                            active
                                                ? 'text-[#16325c] dark:text-sky-400'
                                                : 'text-slate-400',
                                        )}
                                    />
                                )}
                                <span className="truncate">{shortLabel(item.title)}</span>
                            </Link>
                        );
                    })}
                    {hasMore && (
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <button
                                    type="button"
                                    className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                >
                                    <Menu className="size-5 text-slate-400" />
                                    <span>Lainnya</span>
                                </button>
                            </SheetTrigger>
                            <SheetContent
                                side="bottom"
                                className="rounded-t-2xl border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] dark:border-slate-800 dark:bg-slate-900"
                            >
                                <SheetHeader>
                                    <SheetTitle className="text-left text-sm font-bold">
                                        Menu Lainnya
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="mt-4 grid grid-cols-3 gap-2">
                                    {items.map((item) => {
                                        const active = isCurrentUrl(item.href);
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                prefetch
                                                onClick={() => setOpen(false)}
                                                className={cn(
                                                    'flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3 text-[11px] font-medium transition-colors',
                                                    active
                                                        ? 'border-[#16325c] bg-[#16325c]/5 text-[#16325c] dark:border-sky-400 dark:bg-sky-400/10 dark:text-sky-400'
                                                        : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
                                                )}
                                            >
                                                {Icon && <Icon className="size-5" />}
                                                <span className="text-center leading-tight">
                                                    {item.title}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </SheetContent>
                        </Sheet>
                    )}
                </div>
            </nav>
        </>
    );
}

function shortLabel(title: string): string {
    const map: Record<string, string> = {
        'Dashboard Utama': 'Dashboard',
        'Master Karyawan': 'Karyawan',
        'Struktur Organisasi': 'Organisasi',
        'Shift & Jadwal Kerja': 'Shift',
        'Absensi & Presensi': 'Absensi',
        'Cuti & Izin Pegawai': 'Cuti',
        'Penggajian & Slip Gaji': 'Gaji',
        'Kasbon & Cicilan': 'Kasbon',
    };
    return map[title] ?? title;
}
