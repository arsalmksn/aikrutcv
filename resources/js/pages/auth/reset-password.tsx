import { Form, Head } from '@inertiajs/react';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    return (
        <>
            <Head title="Reset Password - Aikrut CV" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
                className="flex flex-col gap-4"
            >
                {({ processing, errors }) => (
                    <div className="flex flex-col gap-4">
                        {/* Email Address */}
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
                                    autoComplete="email"
                                    value={email}
                                    className="h-11 sm:h-12 rounded-xl border-neutral-200/90 pl-10 text-xs sm:text-sm bg-neutral-50/70 text-neutral-600 cursor-not-allowed"
                                    readOnly
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {/* New Password */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="password"
                                className="text-xs font-semibold tracking-wide text-neutral-700"
                            >
                                New Password
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                autoFocus
                                placeholder="Enter new password"
                                passwordrules={passwordRules}
                                leftIcon={<Lock className="size-4" />}
                                className="h-11 sm:h-12 rounded-xl border-neutral-200/90 text-xs sm:text-sm placeholder:text-neutral-400 focus-visible:border-violet-600 focus-visible:ring-violet-500/20"
                            />
                            <InputError message={errors.password} />
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="password_confirmation"
                                className="text-xs font-semibold tracking-wide text-neutral-700"
                            >
                                Confirm New Password
                            </Label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                autoComplete="new-password"
                                placeholder="Confirm your new password"
                                passwordrules={passwordRules}
                                leftIcon={<Lock className="size-4" />}
                                className="h-11 sm:h-12 rounded-xl border-neutral-200/90 text-xs sm:text-sm placeholder:text-neutral-400 focus-visible:border-violet-600 focus-visible:ring-violet-500/20"
                            />
                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 h-11 sm:h-12 w-full rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-md shadow-violet-600/25 hover:shadow-lg hover:shadow-violet-600/35 transition-all flex items-center justify-center gap-2"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing ? (
                                <Spinner className="mr-2" />
                            ) : (
                                <>
                                    <span>Reset Password</span>
                                    <ArrowRight className="size-4" />
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Set New Password',
    description: 'Please choose a strong, secure password for your account.',
};
