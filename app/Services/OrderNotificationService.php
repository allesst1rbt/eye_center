<?php

namespace App\Services;

use App\Jobs\SendOrderConfirmationJob;
use App\Jobs\SendOrderExpiryNotificationJob;
use App\Models\Order;

class OrderNotificationService
{
    public function notifyOrderCreated(Order $order, int $delaySeconds = 30): void
    {
        SendOrderConfirmationJob::dispatch($order)->delay(now()->addSeconds($delaySeconds));
    }

    public function notifyOrderExpiring(Order $order): void
    {
        SendOrderExpiryNotificationJob::dispatch($order)->delay(now()->addSeconds(30));
    }
}
