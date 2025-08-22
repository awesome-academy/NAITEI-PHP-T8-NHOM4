import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';

export default function ProductOrders({ products }) {
    const orderData = [
        { category: 'Desktop', percentage: 59.5, trend: 2, color: 'bg-blue-500' },
        { category: 'Mobile', percentage: 35.7, trend: 8, color: 'bg-green-500' },
        { category: 'Tablet', percentage: 4.8, trend: -5, color: 'bg-orange-500' }
    ];

    // Calculate total for donut chart
    const total = orderData.reduce((sum, item) => sum + item.percentage, 0);
    let cumulativePercentage = 0;

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
            </div>
            <div className="flex items-center justify-center">
                <div className="relative">
                    {/* Donut Chart */}
                    <svg width="180" height="180" className="transform -rotate-90">
                        <circle
                            cx="90"
                            cy="90"
                            r="70"
                            fill="none"
                            stroke="#f3f4f6"
                            strokeWidth="20"
                        />
                        
                        {orderData.map((item, index) => {
                            const strokeDasharray = `${(item.percentage / 100) * 439.8} 439.8`;
                            const strokeDashoffset = -cumulativePercentage * 4.398;
                            cumulativePercentage += item.percentage;
                            
                            return (
                                <circle
                                    key={index}
                                    cx="90"
                                    cy="90"
                                    r="70"
                                    fill="none"
                                    stroke={item.color.replace('bg-', '').replace('-500', '')}
                                    strokeWidth="20"
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    className="transition-all duration-300"
                                />
                            );
                        })}
                    </svg>
                    
                    {/* Center Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">100%</div>
                            <div className="text-sm text-gray-500">Orders</div>
                        </div>
                    </div>
                </div>
                
                {/* Legend */}
                <div className="ml-8 space-y-4">
                    {orderData.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                            <div>
                                <h5 className="text-sm font-medium text-gray-900">
                                    {item.category} - {item.percentage}%
                                </h5>
                                <div className="flex items-center text-xs">
                                    <span className={item.trend > 0 ? 'text-green-600' : 'text-red-600'}>
                                        {item.trend > 0 ? '+' : ''}{item.trend}%
                                    </span>
                                    <ArrowTrendingUpIcon className={`h-3 w-3 ml-1 ${
                                        item.trend > 0 ? 'text-green-500 rotate-0' : 'text-red-500 rotate-180'
                                    }`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sales
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Revenue
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">View</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-md object-cover" src={product.image_path} alt={product.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.sales}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${parseFloat(product.revenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={route('admin.products.show', product.id)} className="text-indigo-600 hover:text-indigo-900">View</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
