import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-2">
            <SidebarGroupLabel className="font-mono text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                LOKET LAYANAN HR
            </SidebarGroupLabel>
            <SidebarMenu className="mt-1 space-y-1">
                {items.map((item, index) => {
                    const active = isCurrentUrl(item.href);
                    const counter = String(index).padStart(2, '0');

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.title }}
                                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                                    active
                                        ? 'bg-[#16325c] text-white shadow-xs'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                                }`}
                            >
                                <Link
                                    href={item.href}
                                    prefetch
                                    className="flex w-full items-center"
                                >
                                    {active && (
                                        <span className="absolute top-1.5 bottom-1.5 left-0 w-1 rounded-r-sm bg-amber-400" />
                                    )}

                                    {item.icon && (
                                        <item.icon
                                            className={`size-4 shrink-0 ${active ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-400'}`}
                                        />
                                    )}

                                    <span className="flex-1 truncate font-medium">
                                        {item.title}
                                    </span>

                                    <span
                                        className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                                            active
                                                ? 'bg-white/15 text-amber-200'
                                                : 'text-slate-400 group-hover:text-slate-500'
                                        }`}
                                    >
                                        {counter}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
