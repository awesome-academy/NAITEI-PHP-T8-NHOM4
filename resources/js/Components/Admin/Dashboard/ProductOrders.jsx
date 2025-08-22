import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

export default function ProductOrders({ products = [] }) {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500'];

    const totalSales = products.reduce((sum, product) => sum + Number(product.sales), 0);

    let cumulativePercentage = 0;

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center p-6 gap-8">
                {products.length > 0 ? (
                    <>
                        <div className="relative">
                            {/* Donut Chart */}
                            <svg width="180" height="180" className="transform -rotate-90">
                                <circle cx="90" cy="90" r="70" fill="none" stroke="#f3f4f6" strokeWidth="20" />
                                {products.map((product, index) => {
                                    const percentage = totalSales > 0 ? (product.sales / totalSales) * 100 : 0;
                                    const strokeDasharray = `${(percentage / 100) * 439.8} 439.8`;
                                    const strokeDashoffset = -cumulativePercentage * 4.398;
                                    cumulativePercentage += percentage;
                                    return (
                                        <circle
                                            key={product.id}
                                            cx="90"
                                            cy="90"
                                            r="70"
                                            fill="none"
                                            stroke={colors[index % colors.length].replace('bg-', '').replace('-500', '')}
                                            strokeWidth="20"
                                            strokeDasharray={strokeDasharray}
                                            strokeDashoffset={strokeDashoffset}
                                            className="transition-all duration-300"
                                        />
                                    );
                                })}
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{totalSales}</div>
                                    <div className="text-sm text-gray-500">Total Sales</div>
                                </div>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="space-y-4">
                            {products.map((product, index) => {
                                const percentage = totalSales > 0 ? (product.sales / totalSales) * 100 : 0;
                                return (
                                    <div key={product.id} className="flex items-center space-x-3">
                                        <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`}></div>
                                        <div>
                                            <h5 className="text-sm font-medium text-gray-900">{product.name}</h5>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <span>{product.sales} sales ({percentage.toFixed(1)}%)</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <p className="text-sm text-gray-500 py-10">No product sales data available.</p>
                )}
            </div>
        </div>
    );
}
