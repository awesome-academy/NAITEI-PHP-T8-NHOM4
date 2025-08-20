import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Hero({ banners = [] }) {
    const [current, setCurrent] = useState(0);
    const { t } = useTranslation();

    // Auto slide every 7s
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 7000);

        return () => clearInterval(timer);
    }, [banners.length]);

    const goToBanner = (index) => {
        setCurrent(index);
    };

    return (
        <section className="relative bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    <div className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
                        <div className="text-center lg:text-left">
                            <span className="text-sm font-medium text-gray-500 tracking-wider uppercase">
                                {t(banners[current].subtitle, { defaultValue: banners[current].subtitle })}
                            </span>
                            <h1 className="text-4xl tracking-tight font-light text-gray-900 sm:text-5xl md:text-6xl">
                                <span className="block">{t(banners[current].title)}</span>
                            </h1>
                            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                {t(banners[current].description)}
                            </p>
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                <div className="rounded-md shadow">
                                    <Link
                                        href={route("products.index")}
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 md:py-4 md:text-lg md:px-10 transition-colors"
                                    >
                                        {t('hero.shopNow')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        {banners.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goToBanner(i)}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                    i === current ? 'bg-orange-500' : 'bg-gray-300'
                                }`}
                                aria-label={`Go to banner ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Banner container for slide animation */}
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 overflow-hidden relative">
                <div className="relative h-56 sm:h-72 md:h-96 lg:h-full w-full">
                    {banners.map((banner, index) => (
                        <img
                            key={index}
                            src={banner.main_image}
                            alt={t(banner.title)}
                            className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 ease-in-out
                                ${index === current ? 'translate-x-0 z-10 opacity-100' : 'translate-x-full z-0 opacity-0'}
                            `}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
