import { useState, useEffect } from 'react';

export default function RevenueChart() {
    const [chartData] = useState({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [12000, 19000, 15000, 25000, 22000, 30000]
    });

    // Tính toán max value để scale chart
    const maxValue = Math.max(...chartData.data);
    const chartHeight = 300;

    return (
        <div className="relative">
            {/* Chart Container */}
            <div className="relative h-80 w-full">
                <svg width="100%" height={chartHeight} className="overflow-visible">
                    {/* Grid Lines */}
                    {[0, 1, 2, 3, 4].map((line) => (
                        <line
                            key={line}
                            x1="0"
                            y1={line * (chartHeight / 4)}
                            x2="100%"
                            y2={line * (chartHeight / 4)}
                            stroke="#f3f4f6"
                            strokeWidth="1"
                        />
                    ))}
                    
                    {/* Area Chart */}
                    <defs>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                    
                    {/* Create path for area */}
                    <path
                        d={`M 0 ${chartHeight - (chartData.data[0] / maxValue) * chartHeight} 
                           ${chartData.data.map((value, index) => 
                               `L ${(index * 100) / (chartData.data.length - 1)}% ${chartHeight - (value / maxValue) * chartHeight}`
                           ).join(' ')} 
                           L 100% ${chartHeight} L 0 ${chartHeight} Z`}
                        fill="url(#areaGradient)"
                        stroke="#3b82f6"
                        strokeWidth="2"
                    />
                    
                    {/* Data Points */}
                    {chartData.data.map((value, index) => (
                        <circle
                            key={index}
                            cx={`${(index * 100) / (chartData.data.length - 1)}%`}
                            cy={chartHeight - (value / maxValue) * chartHeight}
                            r="4"
                            fill="#3b82f6"
                            className="hover:r-6 transition-all cursor-pointer"
                        />
                    ))}
                </svg>
                
                {/* X-Axis Labels */}
                <div className="flex justify-between mt-4 text-sm text-gray-600">
                    {chartData.labels.map((label, index) => (
                        <span key={index}>{label}</span>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center space-x-6">
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Revenue ($)</span>
                </div>
            </div>
        </div>
    );
}
