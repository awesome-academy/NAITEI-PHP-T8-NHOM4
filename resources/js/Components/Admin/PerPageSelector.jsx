import { router } from '@inertiajs/react';

export default function PerPageSelector({ current = 10, options = [5, 10, 25, 50, 100] }) {
    const handleChange = (perPage) => {
        const url = new URL(window.location);
        url.searchParams.set('per_page', perPage);
        url.searchParams.set('page', 1); // Reset to first page
        
        router.get(url.pathname + url.search, {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <div className="flex items-center space-x-2">
            <label htmlFor="per-page" className="text-sm text-gray-700">
                Show:
            </label>
            <select
                id="per-page"
                value={current}
                onChange={(e) => handleChange(parseInt(e.target.value))}
                className="border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
                {options.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <span className="text-sm text-gray-700">entries</span>
        </div>
    );
}
