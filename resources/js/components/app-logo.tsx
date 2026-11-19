import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo({ className = '' }: { className?: string }) {
    const { name } = usePage().props;
    const displayName = name && name !== 'Laravel' ? name : 'HR SISTEM';

    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#12284c] to-[#1e3e70] text-white shadow-sm ring-1 ring-white/20">
                <AppLogoIcon className="size-6 text-white" />
            </div>
            <div className="flex flex-col text-left">
                <span className="text-xs font-bold tracking-wider text-foreground uppercase">
                    {displayName}
                </span>
                <span className="text-[10px] font-medium tracking-tight text-muted-foreground">
                    Portal Kepegawaian
                </span>
            </div>
        </div>
    );
}
