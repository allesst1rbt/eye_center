<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('orders:send-daily-email')
                 ->daily()
                 ->at('23:00')
                 ->onFailure(fn() => Log::error('orders:send-daily-email failed'));

        $schedule->command('users:send-birthday-wishes')
                 ->dailyAt('09:00')
                 ->onFailure(fn() => Log::error('users:send-birthday-wishes failed'));
    }
}
