<?php

namespace Tests\Unit;

use App\Jobs\SendOrderConfirmationJob;
use App\Jobs\SendOrderExpiryNotificationJob;
use App\Models\Order;
use App\Services\OrderNotificationService;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class OrderNotificationServiceTest extends TestCase
{
    private OrderNotificationService $service;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->service = new OrderNotificationService();
    }

    public function test_notify_order_created_dispatches_confirmation_job(): void
    {
        $order     = new Order();
        $order->id = 1;

        $this->service->notifyOrderCreated($order);

        Queue::assertPushed(SendOrderConfirmationJob::class, function ($job) use ($order) {
            return $job->order->id === $order->id;
        });
    }

    public function test_notify_order_expiring_dispatches_expiry_notification_job(): void
    {
        $order     = new Order();
        $order->id = 2;

        $this->service->notifyOrderExpiring($order);

        Queue::assertPushed(SendOrderExpiryNotificationJob::class, function ($job) use ($order) {
            return $job->order->id === $order->id;
        });
    }

    public function test_notify_order_created_does_not_dispatch_expiry_job(): void
    {
        $this->service->notifyOrderCreated(new Order());

        Queue::assertNotPushed(SendOrderExpiryNotificationJob::class);
    }

    public function test_notify_order_expiring_does_not_dispatch_confirmation_job(): void
    {
        $this->service->notifyOrderExpiring(new Order());

        Queue::assertNotPushed(SendOrderConfirmationJob::class);
    }

    public function test_multiple_orders_each_dispatch_own_job(): void
    {
        $order1     = new Order();
        $order1->id = 10;
        $order2     = new Order();
        $order2->id = 11;

        $this->service->notifyOrderCreated($order1);
        $this->service->notifyOrderCreated($order2);

        Queue::assertPushed(SendOrderConfirmationJob::class, 2);
    }
}
