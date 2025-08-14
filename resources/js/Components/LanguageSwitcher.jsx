import { Link, usePage } from '@inertiajs/react';

export default function LanguageSwitcher() {
    const { locale } = usePage().props;

    return (
        <Link
            href={route('lang.change', {
                lang: locale === 'vi' ? 'en' : 'vi',
                redirect: window.location.pathname + window.location.search,
            })}
            className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
            {locale === 'vi' ? 'VI' : 'EN'}
        </Link>
    );
}
