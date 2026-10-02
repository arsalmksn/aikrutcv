import { Form, Head } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import InputError from '@/components/input-error';
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
    isAdminLogin?: boolean;
};

export default function Login({ status, canResetPassword, isAdminLogin = false }: Props) {
    return (
        <>
            <Head title={isAdminLogin ? 'Login Administrator' : 'Log in'} />

            {isAdminLogin && (
                <div className="mb-2 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-center text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                        <ShieldCheck className="size-4 text-amber-600 dark:text-amber-400" />
                        <span>Portal Administrator</span>
                    </div>
                    <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80">
                        Khusus untuk pengelola sistem dan administrator Aikrut CV
                    </p>
                </div>
            )}

            <Form
                {...(typeof store.form === 'function' ? store.form() : { action: store.url(), method: 'post' })}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm"
                                            tabIndex={5}
                                        >
                                            Forgot your password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </div>

                        {isAdminLogin ? (
                            <div className="text-center text-xs text-muted-foreground">
                                Bukan administrator?{' '}
                                <TextLink href="/login" tabIndex={5}>
                                    Masuk sebagai Pengguna Biasa
                                </TextLink>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2.5 text-center text-sm text-muted-foreground">
                                <div>
                                    Don't have an account?{' '}
                                    <TextLink href={register()} tabIndex={5}>
                                        Sign up
                                    </TextLink>
                                </div>
                                <div className="text-xs">
                                    <TextLink
                                        href="/admin/login"
                                        className="inline-flex items-center gap-1 font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                                        tabIndex={6}
                                    >
                                        <ShieldCheck className="size-3.5" />
                                        <span>Portal Administrator</span>
                                    </TextLink>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
