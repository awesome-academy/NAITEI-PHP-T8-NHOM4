import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

export default function ProductOrders() {
    const orderData = [
        { category: 'Desktop', percentage: 59.5, trend: 2, color: 'bg-blue-500' },
        { category: 'Mobile', percentage: 35.7, trend: 8, color: 'bg-green-500' },
        { category: 'Tablet', percentage: 4.8, trend: -5, color: 'bg-orange-500' }
    ];

    // Calculate total for donut chart
    const total = orderData.reduce((sum, item) => sum + item.percentage, 0);
    let cumulativePercentage = 0;

    return (
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
    );
}
