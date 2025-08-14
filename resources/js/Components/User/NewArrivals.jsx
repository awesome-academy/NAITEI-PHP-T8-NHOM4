import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function NewArrivals({ products = [] }) {
    const { t } = useTranslation();
    const displayProducts = products;

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-light text-gray-900 mb-4">{t('newArrivals.title')}</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        {t('newArrivals.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayProducts.slice(0, 9).map((product) => (
                        <a href={route('products.show', product.id)} key={product.id}>
                            <div key={product.id} className="group cursor-pointer">
                                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
                                    <img
                                        src={product.main_image}
                                        alt={product.name}
                                        className="h-64 w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                        {product.category}
                                    </p>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-lg font-light text-gray-900">
                                        ${product.price}
                                    </p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/products"
                        className="inline-block border border-gray-300 text-gray-900 px-8 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        {t('newArrivals.viewMore')}
                    </Link>
                </div>
            </div>
        </section>
    );
}
