// src/Components/Footer.jsx
import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-light mb-6">Flatlogic</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <div className="flex space-x-4">
                            {/* Social Icons */}
                            {/* ... keep your original icons here */}
                        </div>
                    </div>

                    {/* Link Sections */}
                    {[
                        { title: 'COMPANY', links: ['About Us', 'Careers', 'Contact', 'Blog'] },
                        { title: 'MY ACCOUNT', links: ['Account', 'Orders', 'Wishlist', 'Returns'] },
                        { title: 'CUSTOMER SERVICE', links: ['Help Center', 'Shipping Info', 'Returns', 'Size Guide'] },
                    ].map((section, idx) => (
                        <div key={idx}>
                            <h4 className="font-medium mb-6">{section.title}</h4>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href="#" className="hover:text-white transition-colors">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">© 2024 Flatlogic. All rights reserved.</p>
                    <div className="flex items-center mt-4 md:mt-0">
                        <span className="text-gray-400 text-sm mr-4">Newsletter:</span>
                        <div className="flex">
                            <input 
                                type="email" 
                                placeholder="Enter your email"
                                className="px-4 py-2 bg-gray-800 text-white text-sm border border-gray-700 focus:border-orange-500 focus:outline-none"
                            />
                            <button className="bg-orange-500 text-white px-6 py-2 text-sm font-medium hover:bg-orange-600 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
