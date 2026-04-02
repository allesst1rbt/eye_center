<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Services\OrderNotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendOrderDeliveryMail extends Command
{
    protected $signature = 'orders:send-delivery';
    protected $description = 'Send order delivery notification to orders that have not been notified yet';

    public function __construct(private OrderNotificationService $notificationService)
    {
        parent::__construct();
    }

    public function handle(): void
    {
        Log::info('orders:send-delivery started');

        $orders = Order::where('order_delivery', false)->get();
        $notified = 0;

        foreach ($orders as $index => $order) {
            $this->notificationService->notifyOrderDelivered($order, $index * 30);
            $this->info("Delivery notification queued for {$order->customer_name}");
            Log::info("Delivery notification queued for {$order->customer_name}");
            $notified++;
        }

        $this->info("Done. {$notified} delivery notification(s) queued.");
        Log::info('orders:send-delivery finished', ['notified' => $notified]);
    }
}
