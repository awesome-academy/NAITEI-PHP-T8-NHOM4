<?php

namespace App\Console\Commands;

use App\Config\Role;
use App\Mail\DailyRevenueReportMail;
use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class DailyRevenueReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'report:daily-revenue {--date= : Specific date to generate report (YYYY-MM-DD format)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send daily revenue report to admin via email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Get date parameter or use yesterday as default
        $date = $this->option('date') 
            ? Carbon::parse($this->option('date'))
            : Carbon::yesterday();

        $this->info("Generating revenue report for: {$date->format('Y-m-d')}");

        try {
            // Get revenue data for the specified date
            $revenueData = $this->getRevenueData($date);
            
            // Get admin users (assuming role_id = 1 is admin)
            $adminUsers = User::where('role_id', Role::ADMIN)->get();
            
            if ($adminUsers->isEmpty()) {
                $this->warn('No admin users found to send report to.');
                return 1;
            }

            // Send email to each admin
            foreach ($adminUsers as $admin) {
                Mail::to($admin->email)->send(new DailyRevenueReportMail($revenueData, $date));
                $this->info("Report sent to: {$admin->email}");
            }

            $this->info("Daily revenue report sent successfully!");
            return 0;

        } catch (\Exception $e) {
            $this->error("Failed to send revenue report: " . $e->getMessage());
            return 1;
        }
    }

    /**
     * Get revenue data for the specified date
     */
    private function getRevenueData(Carbon $date): array
    {
        $startOfDay = $date->startOfDay();
        $endOfDay = $date->copy()->endOfDay();

        // Get all orders updated on the specified date
        $allOrdersUpdated = Order::whereBetween('updated_at', [$startOfDay, $endOfDay])->get();

        // Separate orders by status updated today
        $pendingOrders = $allOrdersUpdated->where('status', 'pending');
        $confirmedOrders = $allOrdersUpdated->whereIn('status', ['processing', 'completed']);
        $canceledOrders = $allOrdersUpdated->where('status', 'canceled');

        // Calculate potential revenue (pending orders)
        $potentialRevenue = $pendingOrders->sum('total_amount');
        $potentialTax = $pendingOrders->sum('tax');
        $potentialShipping = $pendingOrders->sum('shipping_fee');

        // Calculate actual revenue (confirmed orders)
        $actualRevenue = $confirmedOrders->sum('total_amount');
        $actualTax = $confirmedOrders->sum('tax');
        $actualShipping = $confirmedOrders->sum('shipping_fee');

        // Calculate canceled orders metrics
        $totalCanceledOrders = $canceledOrders->count();
        $canceledRevenue = $canceledOrders->sum('total_amount');
        $canceledTax = $canceledOrders->sum('tax');
        $canceledShipping = $canceledOrders->sum('shipping_fee');
        $totalOrdersUpdated = $allOrdersUpdated->count();
        $cancelationRate = $totalOrdersUpdated > 0 ? ($totalCanceledOrders / $totalOrdersUpdated) * 100 : 0;

        // Get orders by status
        $ordersByStatus = $allOrdersUpdated->groupBy('status')->map->count();

        // Get top products from confirmed orders only
        $topProducts = Order::whereBetween('orders.updated_at', [$startOfDay, $endOfDay])
            ->whereIn('orders.status', ['processing', 'completed'])
            ->join('order_details', 'orders.id', '=', 'order_details.order_id')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->selectRaw('products.name, SUM(order_details.quantity) as total_quantity, SUM(order_details.product_price * order_details.quantity) as total_revenue')
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_revenue')
            ->limit(5)
            ->get();

        // Calculate average order values
        $pendingAvgOrderValue = $pendingOrders->count() > 0 ? $potentialRevenue / $pendingOrders->count() : 0;
        $actualAvgOrderValue = $confirmedOrders->count() > 0 ? $actualRevenue / $confirmedOrders->count() : 0;

        return [
            'date' => $date->format('Y-m-d'),
            
            // Potential revenue (pending orders)
            'pending_orders' => $pendingOrders->count(),
            'potential_revenue' => $potentialRevenue,
            'potential_tax' => $potentialTax,
            'potential_shipping' => $potentialShipping,
            'pending_avg_order_value' => $pendingAvgOrderValue,
            
            // Actual revenue (confirmed orders)
            'confirmed_orders' => $confirmedOrders->count(),
            'actual_revenue' => $actualRevenue,
            'actual_tax' => $actualTax,
            'actual_shipping' => $actualShipping,
            'actual_avg_order_value' => $actualAvgOrderValue,
            
            // Cancelation metrics
            'canceled_orders' => $totalCanceledOrders,
            'canceled_revenue' => $canceledRevenue,
            'canceled_tax' => $canceledTax,
            'canceled_shipping' => $canceledShipping,
            'cancelation_rate' => round($cancelationRate, 2),
            
            // Summary metrics
            'total_orders_updated' => $totalOrdersUpdated,
            'total_revenue_all' => $potentialRevenue + $actualRevenue,
            'orders_by_status' => $ordersByStatus,
            'top_products' => $topProducts,
        ];
    }
}
