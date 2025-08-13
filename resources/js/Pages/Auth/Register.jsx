import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        fname: '',
        lname: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Create Account
                            </h2>
                            <p className="text-gray-600">Join us today and get started</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="username" value="Username" className="text-sm font-medium text-gray-700" />
                                <TextInput
                                    id="username"
                                    name="username"
                                    value={data.username}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('username', e.target.value)}
                                    required
                                />
                                <InputError message={errors.username} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="fname" value="First Name" className="text-sm font-medium text-gray-700" />
                                    <TextInput
                                        id="fname"
                                        name="fname"
                                        value={data.fname}
                                        className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                                        autoComplete="given-name"
                                        onChange={(e) => setData('fname', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.fname} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="lname" value="Last Name" className="text-sm font-medium text-gray-700" />
                                    <TextInput
                                        id="lname"
                                        name="lname"
                                        value={data.lname}
                                        className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                                        autoComplete="family-name"
                                        onChange={(e) => setData('lname', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.lname} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" className="text-sm font-medium text-gray-700" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                                    autoComplete="email"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password" className="text-sm font-medium text-gray-700" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-sm font-medium text-gray-700" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <Link
                                    href={route('login')}
                                    className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition duration-200"
                                >
                                    Already registered?
                                </Link>

                                <PrimaryButton 
                                    className="ml-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 px-8 py-3 rounded-lg font-medium transition duration-200" 
                                    disabled={processing}
                                >
                                    {processing ? 'Creating...' : 'Register'}
                                </PrimaryButton>
                            </div>
                        </form>
                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="bg-white px-3 text-gray-500">or</span>
                                </div>
                            </div>

                            <a
                                href={route('auth.google.redirect')}
                                className="mt-6 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
                                    <path fill="#4285f4" d="M533.5 278.4c0-17.7-1.6-34.7-4.6-51.2H272v96.8h147.2c-6.3 34.3-25 63.4-53.3 83v68h85.9c50.3-46.4 81.7-114.8 81.7-196.6z"/>
                                    <path fill="#34a853" d="M272 544.3c72.3 0 133.1-23.9 177.5-64.8l-85.9-68c-23.9 16.1-54.3 25.7-91.6 25.7-70.5 0-130.2-47.6-151.6-111.4h-89.4v69.7C85.2 483.7 171.7 544.3 272 544.3z"/>
                                    <path fill="#fbbc04" d="M120.4 325.7c-9.3-27.9-9.3-57.8 0-85.7V170.3H31C-10.3 249.4-10.3 339.5 31 418.6l89.4-69z"/>
                                    <path fill="#ea4335" d="M272 107.2c39.4 0 74.8 13.6 102.7 40.2l77-77C403.1 24.4 344.3 0 272 0 171.7 0 85.2 60.6 31 170.3l89.4 69c21.4-63.8 81.1-111.4 151.6-111.4z"/>
                                </svg>
                                Sign up with Google
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
