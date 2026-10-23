import { Form, Head } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    Lock,
    Mail,
    ShieldCheck,
} from 'lucide-react';
import SocialAuthButtons from '@/components/auth/social-auth-buttons';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
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
            <Head
                title={
                    isAdminLogin ? 'Admin Console' : 'Sign in to your account'
                }
            />

            {/* Status Feedback Notification */}
            {status && (
                <div
                    className={cn(
                        'mb-5 flex items-start gap-3 rounded-xl border p-4 text-xs sm:text-sm leading-relaxed transition-all',
                        statusType === 'warning'
                            ? 'border-amber-500/30 bg-amber-500/10 text-amber-800'
                            : statusType === 'error'
                              ? 'border-red-500/30 bg-red-500/10 text-red-800'
                              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800',
                    )}
                >
                    {statusType === 'warning' ? (
                        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                    ) : statusType === 'error' ? (
                        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-600" />
                    ) : (
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    )}
                    <span className="font-medium">{status}</span>
                </div>
            )}

            {/* Social Authentication Buttons (Shown for regular user login) */}
            {!isAdminLogin && <SocialAuthButtons mode="login" />}

            <Form
                {...(isAdminLogin
                    ? { action: '/admin/login', method: 'post' }
                    : typeof store.form === 'function'
                      ? store.form()
                      : { action: store.url(), method: 'post' })}
                resetOnSuccess={['password']}
                className="flex flex-col gap-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="flex flex-col gap-4">
                            {/* Email Address Field */}
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="email"
                                    className="text-xs font-semibold tracking-wide text-neutral-700"
                                >
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                                        <Mail className="size-4" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        defaultValue={email}
                                        required
                                        autoFocus={!email}
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="Enter your email address"
                                        className="h-11 sm:h-12 rounded-xl border-neutral-200/90 pl-10 text-xs sm:text-sm placeholder:text-neutral-400 focus-visible:border-violet-600 focus-visible:ring-violet-500/20"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="password"
                                        className="text-xs font-semibold tracking-wide text-neutral-700"
                                    >
                                        Password
                                    </Label>
                                    {canResetPassword && !isAdminLogin && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-medium text-neutral-500 transition-colors hover:text-violet-600"
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
                                    placeholder="Enter your password"
                                    leftIcon={<Lock className="size-4" />}
                                    className="h-11 sm:h-12 rounded-xl border-neutral-200/90 text-xs sm:text-sm placeholder:text-neutral-400 focus-visible:border-violet-600 focus-visible:ring-violet-500/20"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember Me Checkbox */}
                            <div className="flex items-center gap-2 pt-0.5">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="rounded border-neutral-300 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="cursor-pointer text-xs sm:text-sm font-normal text-neutral-500 select-none hover:text-neutral-800"
                                >
                                    Remember me
                                </Label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="mt-2 h-11 sm:h-12 w-full rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-md shadow-violet-600/25 hover:shadow-lg hover:shadow-violet-600/35 transition-all flex items-center justify-center gap-2"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing ? (
                                    <Spinner className="mr-2" />
                                ) : isAdminLogin ? (
                                    <ShieldCheck className="size-4" />
                                ) : null}
                                <span>
                                    {isAdminLogin
                                        ? 'Sign in to Console'
                                        : 'Sign In'}
                                </span>
                                {!isAdminLogin && !processing && (
                                    <ArrowRight className="size-4" />
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Sign In',
    description: '',
};
