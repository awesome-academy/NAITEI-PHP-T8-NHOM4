import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function RevenueChart({ chartData }) {

    const maxValue = Math.max(...chartData.data);
    const chartHeight = 300;

    const currentMonthRevenue = chartData.data.reduce((sum, value) => sum + value, 0);
    const previousMonthRevenue = chartData.previousData ? 
        chartData.previousData.reduce((sum, value) => sum + value, 0) : 0;
    
    const growthPercentage = previousMonthRevenue > 0 ? 
        ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1) : 0;
    
    const isPositiveGrowth = growthPercentage >= 0;
    const averageDailyRevenue = (currentMonthRevenue / chartData.data.length).toFixed(0);
    const highestDay = Math.max(...chartData.data);
    const lowestDay = Math.min(...chartData.data);

    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Current Period',
                data: chartData.data,
                fill: true,
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return;
                    
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
                    gradient.addColorStop(1, 'rgba(79, 70, 229, 0.02)');
                    return gradient;
                },
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 3,
                tension: 0.4,
                pointBackgroundColor: 'rgba(79, 70, 229, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: 'rgba(79, 70, 229, 1)',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 3,
                shadowOffsetX: 3,
                shadowOffsetY: 3,
                shadowBlur: 10,
                shadowColor: 'rgba(79, 70, 229, 0.2)',
            },
            ...(chartData.previousData ? [{
                label: 'Previous Period',
                data: chartData.previousData,
                fill: false,
                borderColor: 'rgba(156, 163, 175, 0.5)',
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgba(156, 163, 175, 0.7)',
                pointBorderColor: '#fff',
                pointBorderWidth: 1,
            }] : [])
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 15,
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                    }
                }
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(79, 70, 229, 0.5)',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
                displayColors: true,
                callbacks: {
                    title: function(context) {
                        return context[0].label;
                    },
                    label: function(context) {
                        const value = context.parsed.y;
                        const formatted = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }).format(value);
                        return `${context.dataset.label}: ${formatted}`;
                    }
                }
            },
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    color: 'rgba(156, 163, 175, 0.1)',
                    drawBorder: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: 'rgba(107, 114, 128, 0.8)',
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif",
                    },
                    maxTicksLimit: 8,
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    color: 'rgba(156, 163, 175, 0.1)',
                    drawBorder: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: 'rgba(107, 114, 128, 0.8)',
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif",
                    },
                    callback: function(value) {
                        return new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }).format(value);
                    },
                },
            },
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
        animation: {
            duration: 2000,
            easing: 'easeInOutQuart',
        },
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                    <p className="text-sm text-gray-500 mt-1">Daily revenue for the selected period</p>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                            {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                            }).format(currentMonthRevenue)}
                        </p>
                        <p className="text-xs text-gray-500">Total Revenue</p>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                        {isPositiveGrowth ? (
                            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                        ) : (
                            <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                            isPositiveGrowth ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {Math.abs(growthPercentage)}%
                        </span>
                        <span className="text-xs text-gray-500">vs last period</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                        <CurrencyDollarIcon className="h-4 w-4 text-blue-500" />
                        <span className="text-xs font-medium text-gray-600">Avg/Day</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                        ${Number(averageDailyRevenue).toLocaleString()}
                    </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                        <span className="text-xs font-medium text-gray-600">Highest</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                        ${highestDay.toLocaleString()}
                    </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                        <ArrowTrendingDownIcon className="h-4 w-4 text-orange-500" />
                        <span className="text-xs font-medium text-gray-600">Lowest</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                        ${lowestDay.toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="relative" style={{ height: '300px' }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
}
