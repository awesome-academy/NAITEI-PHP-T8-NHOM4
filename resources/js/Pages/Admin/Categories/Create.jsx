import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useTranslation } from 'react-i18next';
import TextareaInput from '@/Components/TextareaInput'; 

export default function Create({ auth }) {
    const { t } = useTranslation();

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.categories.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout user={auth.user} title={t('add_category')}>
            <Head title={t('add_category')} />
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">{t('create_category')}</h1>
                    <p className="text-sm text-gray-500 mt-1">{t('create_category_description')}</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="bg-white shadow-sm ring-1 ring-gray-200 rounded-xl p-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <InputLabel htmlFor="name" value={t('name')} />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    placeholder={t('name_placeholder')}
                                    isFocused
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value={t('description_optional')} />
                                <TextareaInput
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="mt-1 block w-full"
                                    rows={5}
                                    placeholder={t('description_placeholder')}
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <Link href={route('admin.categories.index')}>
                            <SecondaryButton type="button">{t('cancel')}</SecondaryButton>
                        </Link>
                        <PrimaryButton disabled={processing}>
                            {processing ? t('saving') : t('create')}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
