<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Revenue Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #3490dc;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f8f9fa;
            padding: 20px;
            border: 1px solid #dee2e6;
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .metric-card {
            background: white;
            padding: 15px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }
        .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #3490dc;
        }
        .metric-label {
            font-size: 14px;
            color: #6c757d;
            margin-top: 5px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 2px solid #3490dc;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #dee2e6;
        }
        th {
            background-color: #e9ecef;
            font-weight: bold;
        }
        .footer {
            background-color: #6c757d;
            color: white;
            padding: 15px;
            text-align: center;
            border-radius: 0 0 8px 8px;
            font-size: 14px;
        }
        .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        .status-completed { background-color: #d4edda; color: #155724; }
        .status-pending { background-color: #fff3cd; color: #856404; }
        .status-processing { background-color: #cce7ff; color: #004085; }
        .status-canceled { background-color: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Daily Revenue Report</h1>
        <p>{{ $reportDate->format('F d, Y') }}</p>
    </div>

    <div class="content">
        <!-- Key Metrics -->
        <div class="section">
            <div class="section-title">Revenue Summary</div>
            <div class="metrics">
                <div class="metric-card">
                    <div class="metric-value" style="color: #28a745;">${{ number_format($revenueData['actual_revenue'], 2) }}</div>
                    <div class="metric-label">Actual Revenue<br>(Confirmed Orders)</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value" style="color: #ffc107;">${{ number_format($revenueData['potential_revenue'], 2) }}</div>
                    <div class="metric-label">Potential Revenue<br>(Pending Orders)</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value" style="color: #17a2b8;">{{ $revenueData['confirmed_orders'] }}</div>
                    <div class="metric-label">Confirmed Orders<br>(Processing/Completed)</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value" style="color: #6c757d;">{{ $revenueData['pending_orders'] }}</div>
                    <div class="metric-label">Pending Orders</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value" style="color: #dc3545;">{{ $revenueData['canceled_orders'] }}</div>
                    <div class="metric-label">Canceled Orders</div>
                </div>
            </div>
        </div>

        <!-- Detailed Revenue Breakdown -->
        <div class="section">
            <h2 class="section-title">Revenue Breakdown</h2>
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Orders</th>
                        <th>Revenue</th>
                        <th>Tax</th>
                        <th>Shipping</th>
                        <th>Avg Order Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Confirmed Revenue</strong> <small>(Processing/Completed)</small></td>
                        <td>{{ $revenueData['confirmed_orders'] }}</td>
                        <td>${{ number_format($revenueData['actual_revenue'], 2) }}</td>
                        <td>${{ number_format($revenueData['actual_tax'], 2) }}</td>
                        <td>${{ number_format($revenueData['actual_shipping'], 2) }}</td>
                        <td>${{ number_format($revenueData['actual_avg_order_value'], 2) }}</td>
                    </tr>
                    <tr style="background-color: #fff3cd;">
                        <td><strong>Potential Revenue</strong> <small>(Pending)</small></td>
                        <td>{{ $revenueData['pending_orders'] }}</td>
                        <td>${{ number_format($revenueData['potential_revenue'], 2) }}</td>
                        <td>${{ number_format($revenueData['potential_tax'], 2) }}</td>
                        <td>${{ number_format($revenueData['potential_shipping'], 2) }}</td>
                        <td>${{ number_format($revenueData['pending_avg_order_value'], 2) }}</td>
                    </tr>
                    <tr style="background-color: #f8d7da;">
                        <td><strong>Lost Revenue</strong> <small>(Canceled)</small></td>
                        <td>{{ $revenueData['canceled_orders'] }}</td>
                        <td>${{ number_format($revenueData['canceled_revenue'], 2) }}</td>
                        <td>${{ number_format($revenueData['canceled_tax'], 2) }}</td>
                        <td>${{ number_format($revenueData['canceled_shipping'], 2) }}</td>
                        <td>{{ $revenueData['canceled_orders'] > 0 ? '$' . number_format($revenueData['canceled_revenue'] / $revenueData['canceled_orders'], 2) : '$0.00' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Orders by Status -->
        @if(!empty($revenueData['orders_by_status']))
        <div class="section">
            <h2 class="section-title">Orders by Status</h2>
            <table>
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Count</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($revenueData['orders_by_status'] as $status => $count)
                    <tr>
                        <td>
                            <span class="status-badge status-{{ $status }}">
                                {{ ucfirst($status) }}
                            </span>
                        </td>
                        <td>{{ $count }}</td>
                        <td>{{ $revenueData['total_orders_updated'] > 0 ? round(($count / $revenueData['total_orders_updated']) * 100, 1) : 0 }}%</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif

        <!-- Top Products -->
        @if($revenueData['top_products']->isNotEmpty())
        <div class="section">
            <h2 class="section-title">Top 5 Products by Revenue</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity Sold</th>
                        <th>Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($revenueData['top_products'] as $product)
                    <tr>
                        <td>{{ $product->name }}</td>
                        <td>{{ $product->total_quantity }}</td>
                        <td>${{ number_format($product->total_revenue, 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif

        <!-- Summary -->
        <div class="section">
            <h2 class="section-title">Summary</h2>
            <p><strong>Report Period:</strong> {{ $reportDate->format('F d, Y') }}</p>
            <p><strong>Generated At:</strong> {{ now()->format('F d, Y \a\t g:i A') }}</p>
            @if($revenueData['total_orders_updated'] > 0)
            <p>Today's order status updates: <strong>{{ $revenueData['total_orders_updated'] }}</strong> orders were updated.</p>
            <p>Confirmed revenue: <strong>${{ number_format($revenueData['actual_revenue'], 2) }}</strong> from {{ $revenueData['confirmed_orders'] }} orders.</p>
            <p>Potential revenue: <strong>${{ number_format($revenueData['potential_revenue'], 2) }}</strong> from {{ $revenueData['pending_orders'] }} pending orders.</p>
            @if($revenueData['canceled_orders'] > 0)
            <p><span style="color: #dc3545;">⚠️ {{ $revenueData['canceled_orders'] }} orders were canceled today ({{ $revenueData['cancelation_rate'] }}% cancelation rate)</span></p>
            @endif
            @else
            <p>No order status updates were recorded for this date.</p>
            @endif
        </div>
    </div>

    <div class="footer">
        <p>This is an automated report from your E-commerce System</p>
        <p>Generated on {{ now()->format('F d, Y \a\t g:i A') }}</p>
    </div>
</body>
</html>
