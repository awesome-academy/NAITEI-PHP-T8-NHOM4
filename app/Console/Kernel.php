<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Send daily revenue report at 7:00 AM every day
        $schedule->command('report:daily-revenue')
                 ->dailyAt('07:00')
                 ->timezone('Asia/Ho_Chi_Minh')
                 ->description('Send daily revenue report to admin');

        // Test command
        // $schedule->command('report:daily-revenue')
        //          ->everyMinute()
        //          ->timezone('Asia/Ho_Chi_Minh')
        //          ->description('Send daily revenue report to admin - TESTING MODE');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
