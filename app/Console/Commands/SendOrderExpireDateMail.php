<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Services\OrderNotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class SendOrderExpireDateMail extends Command
{
    protected $signature = 'orders:send-daily-email';
    protected $description = 'Send daily email to orders next to expire';

    public function __construct(private OrderNotificationService $notificationService)
    {
        parent::__construct();
    }

    public function handle(): void
    {
        Log::info('orders:send-daily-email started');

        $orders = Order::where('order_remember', false)->with('Term')->get();
        $notified = 0;

        foreach ($orders as $order) {
            $daysElapsed = $order->created_at->clone()->startOfDay()->diffInDays(Carbon::today(), false);
            $expireDays = (int) explode(' ', $order->Term->days_to_expire)[0];

            if ($daysElapsed === $expireDays) {
                $this->notificationService->notifyOrderExpiring($order);
                $this->info("Expiry notification queued for {$order->customer_name}");
                Log::info("Expiry notification queued for {$order->customer_name}");
                $notified++;
            }
        }

        $this->info('Daily expiry check completed.');
        Log::info('orders:send-daily-email finished', ['notified' => $notified, 'total_checked' => $orders->count()]);
    }
}
