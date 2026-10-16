import { Form, Head } from '@inertiajs/react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
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
    statusType?: 'success' | 'warning' | 'error';
    canResetPassword: boolean;
    isAdminLogin?: boolean;
    email?: string;
};

export default function Login({
    status,
    statusType = 'success',
    canResetPassword,
    isAdminLogin = false,
    email = '',
}: Props) {
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

            {status && (
                <div
                    className={
                        statusType === 'warning'
                            ? 'mb-4 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-sm font-medium text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300'
                            : 'mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-center text-sm font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300'
                    }
                >
                    {statusType === 'warning' && (
                        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    )}
                    <span className="leading-tight">{status}</span>
                </div>
            )}

            <Form
                {...(isAdminLogin
                    ? { action: '/admin/login', method: 'post' }
                    : typeof store.form === 'function'
                      ? store.form()
                      : { action: store.url(), method: 'post' })}
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
                                    defaultValue={email}
                                    required
                                    autoFocus={!email}
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
                                    autoFocus={Boolean(email)}
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
                            <div className="text-center text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <TextLink href={register()} tabIndex={5}>
                                    Sign up
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
