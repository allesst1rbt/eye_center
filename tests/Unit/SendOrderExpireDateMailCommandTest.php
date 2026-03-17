<?php

namespace Tests\Unit;

use App\Jobs\SendOrderExpiryNotificationJob;
use App\Models\Order;
use App\Models\Terms;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class SendOrderExpireDateMailCommandTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
    }

    public function test_notifies_order_on_expiry_day(): void
    {
        $terms = Terms::factory()->create(['days_to_expire' => '30 dias']);

        Order::factory()->create([
            'terms_id'       => $terms->id,
            'order_remember' => false,
            'created_at'     => Carbon::now()->subDays(30),
        ]);

        $this->artisan('orders:send-daily-email')->assertExitCode(0);

        Queue::assertPushed(SendOrderExpiryNotificationJob::class);
    }

    public function test_skips_already_reminded_orders(): void
    {
        $terms = Terms::factory()->create(['days_to_expire' => '30 dias']);

        Order::factory()->create([
            'terms_id'       => $terms->id,
            'order_remember' => true,
            'created_at'     => Carbon::now()->subDays(30),
        ]);

        $this->artisan('orders:send-daily-email')->assertExitCode(0);

        Queue::assertNotPushed(SendOrderExpiryNotificationJob::class);
    }

    public function test_skips_orders_not_yet_at_expiry_day(): void
    {
        $terms = Terms::factory()->create(['days_to_expire' => '30 dias']);

        Order::factory()->create([
            'terms_id'       => $terms->id,
            'order_remember' => false,
            'created_at'     => Carbon::now()->subDays(15),
        ]);

        $this->artisan('orders:send-daily-email')->assertExitCode(0);

        Queue::assertNotPushed(SendOrderExpiryNotificationJob::class);
    }

    public function test_skips_orders_past_expiry_day(): void
    {
        $terms = Terms::factory()->create(['days_to_expire' => '30 dias']);

        Order::factory()->create([
            'terms_id'       => $terms->id,
            'order_remember' => false,
            'created_at'     => Carbon::now()->subDays(45),
        ]);

        $this->artisan('orders:send-daily-email')->assertExitCode(0);

        Queue::assertNotPushed(SendOrderExpiryNotificationJob::class);
    }

    public function test_outputs_completion_message(): void
    {
        $this->artisan('orders:send-daily-email')
            ->expectsOutput('Daily expiry check completed.')
            ->assertExitCode(0);
    }

    public function test_notifies_multiple_expiring_orders(): void
    {
        $terms = Terms::factory()->create(['days_to_expire' => '30 dias']);

        Order::factory(3)->create([
            'terms_id'       => $terms->id,
            'order_remember' => false,
            'created_at'     => Carbon::now()->subDays(30),
        ]);

        $this->artisan('orders:send-daily-email');

        Queue::assertPushed(SendOrderExpiryNotificationJob::class, 3);
    }
}
