import { Form, Head } from '@inertiajs/react';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import SocialAuthButtons from '@/components/auth/social-auth-buttons';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Create Account - Aikrut CV" />

            {/* Social Authentication Buttons */}
            <SocialAuthButtons mode="register" />

            <Form
                {...(typeof store.form === 'function'
                    ? store.form()
                    : { action: store.url(), method: 'post' })}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="flex flex-col gap-4">
                            {/* Full Name Field */}
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="name"
                                    className="text-xs font-semibold tracking-wide text-neutral-700"
                                >
                                    Full Name
                                </Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                                        <User className="size-4" />
                                    </div>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Enter your full name"
                                        className="h-11 sm:h-12 rounded-xl border-neutral-200/90 pl-10 text-xs sm:text-sm placeholder:text-neutral-400 focus-visible:border-violet-600 focus-visible:ring-violet-500/20"
                                    />
                                </div>
                                <InputError message={errors.name} />
                            </div>

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
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        className="h-11 sm:h-12 rounded-xl border-neutral-200/90 pl-10 text-xs sm:text-sm placeholder:text-neutral-400 focus-visible:border-violet-600 focus-visible:ring-violet-500/20"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="password"
                                    className="text-xs font-semibold tracking-wide text-neutral-700"
                                >
                                    Password
                                </Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Create a password"
                                    passwordrules={passwordRules}
                                    leftIcon={<Lock className="size-4" />}
                                    className="h-11 sm:h-12 rounded-xl border-neutral-200/90 text-xs sm:text-sm placeholder:text-neutral-400 focus-visible:border-violet-600 focus-visible:ring-violet-500/20"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-xs font-semibold tracking-wide text-neutral-700"
                                >
                                    Confirm Password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm your password"
                                    passwordrules={passwordRules}
                                    leftIcon={<Lock className="size-4" />}
                                    className="h-11 sm:h-12 rounded-xl border-neutral-200/90 text-xs sm:text-sm placeholder:text-neutral-400 focus-visible:border-violet-600 focus-visible:ring-violet-500/20"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="mt-2 h-11 sm:h-12 w-full rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-md shadow-violet-600/25 hover:shadow-lg hover:shadow-violet-600/35 transition-all flex items-center justify-center gap-2"
                                tabIndex={5}
                                disabled={processing}
                                data-test="register-user-button"
                            >
                                {processing ? (
                                    <Spinner className="mr-2" />
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <ArrowRight className="size-4" />
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Terms of Service & Privacy Policy Notice */}
                        <p className="mt-2 text-center text-xs leading-relaxed text-neutral-500">
                            By creating an account, you agree to our{' '}
                            <span className="font-semibold text-violet-600 hover:underline cursor-pointer">
                                Terms of Service
                            </span>{' '}
                            and{' '}
                            <span className="font-semibold text-violet-600 hover:underline cursor-pointer">
                                Privacy Policy
                            </span>
                            .
                        </p>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create Account',
    description: '',
};
