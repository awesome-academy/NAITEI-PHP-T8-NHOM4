import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

export default function BrowserStats() {
    const browserData = [
        {
            name: 'Google Chrome',
            percentage: 73,
            value: 800,
            trend: 'up',
            time: '13:16',
            color: 'bg-green-500'
        },
        {
            name: 'Firefox',
            percentage: 19,
            value: 100,
            trend: 'up',
            time: '13:26',
            color: 'bg-orange-500'
        },
        {
            name: 'Safari',
            percentage: 8,
            value: -200,
            trend: 'down',
            time: '13:16',
            color: 'bg-blue-500'
        },
        {
            name: 'Internet Explorer',
            percentage: 27,
            value: -450,
            trend: 'down',
            time: '13:16',
            color: 'bg-red-500'
        }
    ];

    return (
        <div className="space-y-4">
            {browserData.map((browser, index) => (
                <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h6 className="text-sm font-medium text-gray-900">{browser.name}</h6>
                            <span className="text-xs text-gray-500">{browser.percentage}%</span>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center text-sm">
                                <span className={browser.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                                    {browser.value > 0 ? '+' : ''}{browser.value}
                                </span>
                                {browser.trend === 'up' ? (
                                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 ml-1" />
                                ) : (
                                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 ml-1" />
                                )}
                            </div>
                            <span className="text-xs text-gray-500">{browser.time}</span>
                        </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full ${browser.color}`}
                            style={{ width: `${browser.percentage}%` }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
