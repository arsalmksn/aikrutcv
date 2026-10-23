import { Form, Head } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Reset Password - Aikrut CV" />

            {status && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs sm:text-sm font-medium text-emerald-800">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    <span className="leading-relaxed">{status}</span>
                </div>
            )}

            <Form {...email.form()} className="flex flex-col gap-4">
                {({ processing, errors }) => (
                    <>
                        <div className="flex flex-col gap-4">
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
                                        autoFocus
                                        placeholder="Enter your email address"
                                        className="h-11 sm:h-12 rounded-xl border-neutral-200/90 pl-10 text-xs sm:text-sm placeholder:text-neutral-400 focus-visible:border-violet-600 focus-visible:ring-violet-500/20"
                                        required
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-11 sm:h-12 w-full rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-md shadow-violet-600/25 hover:shadow-lg hover:shadow-violet-600/35 transition-all flex items-center justify-center gap-2"
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                            >
                                {processing ? (
                                    <Spinner className="mr-2" />
                                ) : (
                                    <>
                                        <span>Email password reset link</span>
                                        <ArrowRight className="size-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Reset Password',
    description:
        'Enter your email address and we will send you a password reset link.',
};
