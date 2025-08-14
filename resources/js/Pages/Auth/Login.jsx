import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: '', //Can be username or email
        password: '',
        remember: false,
    });

    const { t } = useTranslation();

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title={t('login_title', 'Log in')} />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                {t('welcome_back', 'Welcome Back')}
                            </h2>
                            <p className="text-gray-600">{t('sign_in_to_account', 'Sign in to your account')}</p>
                        </div>

                        {status && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-700">{status}</p>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="login" value={t('username_or_email', 'Username or Email')} className="text-sm font-medium text-gray-700" />
                                <TextInput
                                    id="login"
                                    type="text"
                                    name="login"
                                    value={data.login}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('login', e.target.value)}
                                    placeholder="Enter username or email"
                                    required
                                />
                                <InputError message={errors.login || errors.email || errors.username} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value={t('password', 'Password')} className="text-sm font-medium text-gray-700" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">{t('remember_me', 'Remember me')}</span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition duration-200"
                                    >
                                        {t('forgot_password', 'Forgot password?')}
                                    </Link>
                                )}
                            </div>

                            <div className="space-y-4">
                                <PrimaryButton 
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 py-3 rounded-lg font-medium transition duration-200" 
                                    disabled={processing}
                                >
                                    {processing ? t('signing_in', 'Signing in...') : t('sign_in', 'Sign In')}
                                </PrimaryButton>

                                <div className="text-center">
                                    <span className="text-sm text-gray-600">{t('dont_have_account', "Don't have an account? ")} </span>
                                    <Link
                                        href={route('register')}
                                        className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition duration-200"
                                    >
                                        {t('sign_up', 'Sign up')}
                                    </Link>
                                </div>
                            </div>
                        </form>
                        <a href={route('auth.google.redirect')}
                            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
                                <path fill="#4285f4" d="M533.5 278.4c0-17.7-1.6-34.7-4.6-51.2H272v96.8h147.2c-6.3 34.3-25 63.4-53.3 83v68h85.9c50.3-46.4 81.7-114.8 81.7-196.6z"/>
                                <path fill="#34a853" d="M272 544.3c72.3 0 133.1-23.9 177.5-64.8l-85.9-68c-23.9 16.1-54.3 25.7-91.6 25.7-70.5 0-130.2-47.6-151.6-111.4h-89.4v69.7C85.2 483.7 171.7 544.3 272 544.3z"/>
                                <path fill="#fbbc04" d="M120.4 325.7c-9.3-27.9-9.3-57.8 0-85.7V170.3H31C-10.3 249.4-10.3 339.5 31 418.6l89.4-69z"/>
                                <path fill="#ea4335" d="M272 107.2c39.4 0 74.8 13.6 102.7 40.2l77-77C403.1 24.4 344.3 0 272 0 171.7 0 85.2 60.6 31 170.3l89.4 69c21.4-63.8 81.1-111.4 151.6-111.4z"/>
                            </svg>
                            Sign in with Google
                        </a>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
