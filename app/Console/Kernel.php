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
             ->dailyAt('23:00')
             ->timezone('America/Manaus')
             ->withoutOverlapping()
             ->onFailure(function (Stringable $output) {
                 Log::error('orders:send-daily-email failed', ['output' => (string) $output]);
             });

        $schedule->command('users:send-birthday-wishes')
                ->dailyAt('09:00')
                ->timezone('America/Manaus')
                ->withoutOverlapping()
                ->onFailure(function (Stringable $output) {
                    Log::error('users:send-birthday-wishes failed', ['output' => (string) $output]);
                });
    }
}
