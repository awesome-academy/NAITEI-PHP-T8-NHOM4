import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Verify Your Email Address
                            </h2>
                            <p className="text-gray-600">
                                Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you?
                            </p>
                        </div>

                        {status === 'verification-link-sent' && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-700">
                                    A new verification link has been sent to the email address you provided during registration.
                                </p>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <p className="text-center text-sm text-gray-500">
                                If you didn't receive the email, we will gladly send you another.
                            </p>

                            <div className="space-y-4">
                                <PrimaryButton
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 py-3 rounded-lg font-medium transition duration-200"
                                    disabled={processing}
                                >
                                    {processing ? 'Sending...' : 'Resend Verification Email'}
                                </PrimaryButton>

                                <div className="text-center">
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition duration-200"
                                    >
                                        Log Out
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
