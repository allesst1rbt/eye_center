<?php

namespace Tests\Unit;

use App\Jobs\SendBirthdayWishJob;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class SendBirthdayWishesCommandTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
    }

    public function test_dispatches_job_for_order_with_email_on_birthday(): void
    {
        Order::factory()->create([
            'customer_email'     => 'birthday@test.com',
            'customer_birthdate' => Carbon::now()->format('d/m/Y'),
        ]);

        $this->artisan('users:send-birthday-wishes')->assertExitCode(0);

        Queue::assertPushed(SendBirthdayWishJob::class);
    }

    public function test_skips_order_without_email_even_on_birthday(): void
    {
        Order::factory()->create([
            'customer_email'     => null,
            'customer_birthdate' => Carbon::now()->format('d/m/Y'),
        ]);

        $this->artisan('users:send-birthday-wishes')->assertExitCode(0);

        Queue::assertNotPushed(SendBirthdayWishJob::class);
    }

    public function test_skips_orders_whose_birthday_is_not_today(): void
    {
        Order::factory()->create([
            'customer_email'     => 'nottoday@test.com',
            'customer_birthdate' => '01/01/1990',
        ]);

        $this->artisan('users:send-birthday-wishes')->assertExitCode(0);

        Queue::assertNotPushed(SendBirthdayWishJob::class);
    }

    public function test_dispatches_job_only_for_orders_with_matching_birthday(): void
    {
        Order::factory()->create([
            'customer_email'     => 'yes@test.com',
            'customer_birthdate' => Carbon::now()->format('d/m/Y'),
        ]);
        Order::factory()->create([
            'customer_email'     => 'no@test.com',
            'customer_birthdate' => '01/01/1990',
        ]);

        $this->artisan('users:send-birthday-wishes');

        Queue::assertPushed(SendBirthdayWishJob::class, 1);
    }

    public function test_runs_successfully_with_no_orders(): void
    {
        $this->artisan('users:send-birthday-wishes')->assertExitCode(0);

        Queue::assertNotPushed(SendBirthdayWishJob::class);
    }
}
