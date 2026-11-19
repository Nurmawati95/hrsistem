import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-slate-50 p-6 md:p-10 dark:bg-slate-950">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="flex size-12 items-center justify-center rounded-xl bg-[#12284c] text-white shadow-md ring-2 ring-slate-100 transition-transform group-hover:scale-105 dark:ring-slate-800">
                                <AppLogoIcon className="size-7 text-white" />
                            </div>
                            <div className="text-center">
                                <span className="font-mono text-[11px] font-bold tracking-widest text-[#16325c] uppercase dark:text-sky-400">
                                    HR SISTEM
                                </span>
                                <p className="text-[10px] text-slate-500 font-medium">Portal Kepegawaian & Pelayanan SDM</p>
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-1 text-center">
                            <h1 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h1>
                            {description && (
                                <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-6">
                        {children}
                    </div>
                </div>

                <div className="mt-6 text-center text-xs text-slate-400">
                    &copy; {new Date().getFullYear()} HR Sistem — Akses Terproteksi & Akuntabel
                </div>
            </div>
        </div>
    );
}
