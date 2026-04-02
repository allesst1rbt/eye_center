<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Services\OrderNotificationService;
use Carbon\Carbon;
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

        $lastMonthStart = Carbon::now()->subMonth()->startOfMonth();
        $lastMonthEnd   = Carbon::now()->subMonth()->endOfMonth();

        $orders = Order::where(function ($query) use ($lastMonthStart, $lastMonthEnd) {
                $query->whereNull('created_at')
                      ->orWhereNotBetween('created_at', [$lastMonthStart, $lastMonthEnd]);
            })
            ->get();
        $notified = 0;

        foreach ($orders as $index => $order) {
            $this->notificationService->notifyOrderCreated($order, $index * 30);
            $this->info("Confirmation queued for {$order->customer_name}");
            Log::info("Confirmation queued for {$order->customer_name}");
            $notified++;
        }

        $this->info("Done. {$notified} confirmation(s) queued.");
        Log::info('orders:send-confirmation finished', ['notified' => $notified]);
    }
}
