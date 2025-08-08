import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function Hero({ banners = [] }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 7000); // auto slide every 7s

        return () => clearInterval(timer);
    }, []);

    const currentBanner = banners[current];

    return (
        <section className="relative bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    <div className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
                        <div className="text-center lg:text-left">
                            <span className="text-sm font-medium text-gray-500 tracking-wider uppercase">
                                {currentBanner.subtitle}
                            </span>
                            <h1 className="text-4xl tracking-tight font-light text-gray-900 sm:text-5xl md:text-6xl">
                                <span className="block">{currentBanner.title}</span>
                            </h1>
                            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                {currentBanner.description}
                            </p>
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                <div className="rounded-md shadow">
                                    <Link
                                        href={route("products.index")}
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 md:py-4 md:text-lg md:px-10 transition-colors"
                                    >
                                        Shop Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        {banners.map((_, i) => (
                            <span
                                key={i}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                    i === current ? 'bg-orange-500' : 'bg-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Banner main_image */}
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                <img
                    className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full transition-all duration-500"
                    src={currentBanner.main_image}
                    alt={currentBanner.title}
                />
            </div>
        </section>
    );
}
