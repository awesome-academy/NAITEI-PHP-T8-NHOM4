import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

export default function StatCard({ 
    title, 
    value, 
    icon: Icon, 
    color = 'blue', 
    trend = null, 
    trendUp = true 
}) {
    const colorClasses = {
        green: 'bg-green-100 text-green-800',
        blue: 'bg-blue-100 text-blue-800',
        purple: 'bg-purple-100 text-purple-800',
        orange: 'bg-orange-100 text-orange-800',
        red: 'bg-red-100 text-red-800'
    };

    const iconColorClasses = {
        green: 'text-green-600',
        blue: 'text-blue-600',
        purple: 'text-purple-600',
        orange: 'text-orange-600',
        red: 'text-red-600'
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    
                    {trend && (
                        <div className="flex items-center mt-2">
                            {trendUp ? (
                                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                            ) : (
                                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                            )}
                            <span className={`text-sm font-medium ${
                                trendUp ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {trend}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">vs last month</span>
                        </div>
                    )}
                </div>
                
                <div className={`p-3 rounded-full ${colorClasses[color]}`}>
                    <Icon className={`h-6 w-6 ${iconColorClasses[color]}`} />
                </div>
            </div>
        </div>
    );
}
