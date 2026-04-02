<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Services\OrderNotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendOrderConfirmationMail extends Command
{
    protected $signature = 'orders:send-confirmation';
    protected $description = 'Send order confirmation to purchases that have not been sent yet';

    public function __construct(private OrderNotificationService $notificationService)
    {
        parent::__construct();
    }

    public function handle(): void
    {
        Log::info('orders:send-confirmation started');

        $orders = Order::where('order_confirmation', 0)->get();
        $notified = 0;

        foreach ($orders as $order) {
            $this->notificationService->notifyOrderCreated($order);
            $this->info("Confirmation queued for {$order->customer_name}");
            Log::info("Confirmation queued for {$order->customer_name}");
            $notified++;
        }

        $this->info("Done. {$notified} confirmation(s) queued.");
        Log::info('orders:send-confirmation finished', ['notified' => $notified]);
    }
}
