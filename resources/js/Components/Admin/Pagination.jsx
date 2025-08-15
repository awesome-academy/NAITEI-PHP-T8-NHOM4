import { Link } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Pagination({ pagination, preserveScroll = true, preserveState = true }) {
    if (!pagination || pagination.last_page <= 1) return null;

    const { current_page, last_page, from, to, total, prev_page_url, next_page_url, path } = pagination;

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 7;
        const halfRange = Math.floor(maxPagesToShow / 2);

        let startPage = Math.max(1, current_page - halfRange);
        let endPage = Math.min(last_page, current_page + halfRange);

        // Adjust if we're near the beginning or end
        if (current_page <= halfRange) {
            endPage = Math.min(last_page, maxPagesToShow);
        }
        if (current_page > last_page - halfRange) {
            startPage = Math.max(1, last_page - maxPagesToShow + 1);
        }

        // Add first page if not included
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) {
                pages.push('...');
            }
        }

        // Add the range of pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Add last page if not included
        if (endPage < last_page) {
            if (endPage < last_page - 1) {
                pages.push('...');
            }
            pages.push(last_page);
        }

        return pages;
    };

    const buildPageUrl = (page) => {
        const url = new URL(path, window.location.origin);
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('page', page);
        url.search = currentParams.toString();
        return url.pathname + url.search;
    };

    return (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            {/* Mobile pagination info */}
            <div className="flex-1 flex justify-between sm:hidden">
                {prev_page_url ? (
                    <Link
                        href={prev_page_url}
                        preserveScroll={preserveScroll}
                        preserveState={preserveState}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Previous
                    </Link>
                ) : (
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed">
                        Previous
                    </span>
                )}
                
                {next_page_url ? (
                    <Link
                        href={next_page_url}
                        preserveScroll={preserveScroll}
                        preserveState={preserveState}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Next
                    </Link>
                ) : (
                    <span className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed">
                        Next
                    </span>
                )}
            </div>

            {/* Desktop pagination */}
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{from}</span> to{' '}
                        <span className="font-medium">{to}</span> of{' '}
                        <span className="font-medium">{total}</span> results
                    </p>
                </div>

                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {/* Previous button */}
                        {prev_page_url ? (
                            <Link
                                href={prev_page_url}
                                preserveScroll={preserveScroll}
                                preserveState={preserveState}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <span className="sr-only">Previous</span>
                                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                            </Link>
                        ) : (
                            <span className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-gray-100 text-sm font-medium text-gray-400 cursor-not-allowed">
                                <span className="sr-only">Previous</span>
                                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                        )}

                        {/* Page numbers */}
                        {getPageNumbers().map((page, index) => {
                            if (page === '...') {
                                return (
                                    <span
                                        key={`ellipsis-${index}`}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                    >
                                        ...
                                    </span>
                                );
                            }

                            const isCurrentPage = page === current_page;
                            
                            return isCurrentPage ? (
                                <span
                                    key={page}
                                    aria-current="page"
                                    className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                >
                                    {page}
                                </span>
                            ) : (
                                <Link
                                    key={page}
                                    href={buildPageUrl(page)}
                                    preserveScroll={preserveScroll}
                                    preserveState={preserveState}
                                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                >
                                    {page}
                                </Link>
                            );
                        })}

                        {/* Next button */}
                        {next_page_url ? (
                            <Link
                                href={next_page_url}
                                preserveScroll={preserveScroll}
                                preserveState={preserveState}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <span className="sr-only">Next</span>
                                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                            </Link>
                        ) : (
                            <span className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-gray-100 text-sm font-medium text-gray-400 cursor-not-allowed">
                                <span className="sr-only">Next</span>
                                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                        )}
                    </nav>
                </div>
            </div>
        </div>
    );
}
