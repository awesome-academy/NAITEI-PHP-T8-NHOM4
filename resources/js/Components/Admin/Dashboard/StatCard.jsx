import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export default function StatCard({ 
    title, 
    value, 
    icon, 
    color = 'blue', 
    trend = null, 
    trendUp = true 
}) {
    const { t } = useTranslation();

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
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{t(title)}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                
                {trend && (
                    <div className="flex items-center mt-2">
                        {trendUp ? (
                            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                            <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span
                            className={`text-sm font-medium ${
                                trendUp ? 'text-green-600' : 'text-red-600'
                            }`}
                        >
                            {trend}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                            {t('vs_last_month')}
                        </span>
                    </div>
                )}
            </div>
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
                {icon}
            </div>
        </div>
    );
}
