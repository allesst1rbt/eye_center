<?php

namespace App\Console\Commands;

use App\Jobs\SendBirthdayWishJob;
use App\Models\Order;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class SendBirthdayWishes extends Command
{
    protected $signature = 'users:send-birthday-wishes';
    protected $description = 'Send birthday wishes to users';

    public function handle(): void
    {
        Log::info('users:send-birthday-wishes started');

        $orders = Order::where('customer_birthdate', Carbon::now()->format('d/m/Y'))->get();

        foreach ($orders as $order) {
            if ($order->customer_email) {
                SendBirthdayWishJob::dispatch($order);
                $this->info("Birthday wish queued for {$order->customer_name}");
                Log::info("Birthday wish queued for {$order->customer_name}");
            }
        }

        Log::info('users:send-birthday-wishes finished', ['total' => $orders->count()]);
    }
}
