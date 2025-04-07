<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('orders:send-daily-email')
                 ->daily()
                 ->at('23:00'); 
        $schedule->command('users:send-birthday-wishes')
                 ->dailyAt('09:00');
    }
}
