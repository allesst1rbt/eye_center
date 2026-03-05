<?php

namespace App\Services;

use App\Jobs\SendOrderConfirmationJob;
use App\Jobs\SendOrderExpiryNotificationJob;
use App\Models\Order;

class OrderNotificationService
{
    public function notifyOrderCreated(Order $order): void
    {
        SendOrderConfirmationJob::dispatch($order);
    }

    public function notifyOrderExpiring(Order $order): void
    {
        SendOrderExpiryNotificationJob::dispatch($order);
    }
}
