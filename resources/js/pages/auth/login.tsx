import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Masuk ke Portal HR" />

            <PasskeyVerify />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                    Alamat Email Pegawai
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="nama@perusahaan.co.id"
                                    className="h-10 text-xs"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                        Kata Sandi
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs text-[#16325c] hover:underline dark:text-sky-400"
                                            tabIndex={5}
                                        >
                                            Lupa kata sandi?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="h-10 text-xs"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-2.5">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                                    Ingat sesi perangkat ini
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full h-10 bg-[#12284c] hover:bg-[#1b3a6b] font-semibold text-xs tracking-wider uppercase text-white shadow-sm"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner className="mr-2" />}
                                Masuk ke Portal
                            </Button>
                        </div>

                        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                            Belum memiliki akun?{' '}
                            <TextLink href={register()} tabIndex={5} className="font-semibold text-[#16325c] hover:underline dark:text-sky-400">
                                Registrasi Pegawai
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-center text-xs font-medium text-emerald-700 border border-emerald-200">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Masuk ke Portal Karyawan',
    description: 'Masukkan email dan kata sandi akun HR Anda untuk melanjutkan',
};
