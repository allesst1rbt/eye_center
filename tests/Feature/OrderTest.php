<?php

namespace Tests\Feature;

use App\Jobs\SendOrderConfirmationJob;
use App\Jobs\SendOrderExpiryNotificationJob;
use App\Models\Lens;
use App\Models\Order;
use App\Models\Terms;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private User $admin;
    private array $authHeader;
    private array $adminHeader;

    protected function setUp(): void
    {
        parent::setUp();

        Queue::fake();

        $this->user        = User::factory()->create();
        $this->admin       = User::factory()->admin()->create();
        $this->authHeader  = ['Authorization' => 'Bearer ' . JWTAuth::fromUser($this->user)];
        $this->adminHeader = ['Authorization' => 'Bearer ' . JWTAuth::fromUser($this->admin)];
    }

    private function validOrderData(array $overrides = []): array
    {
        $lens  = Lens::factory()->create();
        $terms = Terms::factory()->create();

        return array_merge([
            'customer_name'      => 'João Silva',
            'customer_email'     => 'joao@test.com',
            'customer_number'    => '5511999999999',
            'customer_birthdate' => '15/06/1990',
            'lens_id'            => $lens->id,
            'terms_id'           => $terms->id,
        ], $overrides);
    }

    // --- Listing ---

    public function test_unauthenticated_user_cannot_list_orders(): void
    {
        $this->getJson('/api/order')->assertStatus(401);
    }

    public function test_authenticated_user_can_list_orders(): void
    {
        Order::factory(3)->create();

        $this->getJson('/api/order', $this->authHeader)
            ->assertStatus(200)
            ->assertJsonStructure(['data', 'total', 'current_page', 'per_page']);
    }

    public function test_orders_are_ordered_by_most_recent(): void
    {
        $old   = Order::factory()->create(['created_at' => now()->subDays(5)]);
        $recent = Order::factory()->create(['created_at' => now()]);

        $response = $this->getJson('/api/order', $this->authHeader)->assertStatus(200);

        $ids = collect($response->json('data'))->pluck('id')->toArray();
        $this->assertEquals($recent->id, $ids[0]);
    }

    public function test_orders_are_paginated(): void
    {
        Order::factory(5)->create();

        $this->getJson('/api/order?page=1&perPage=2', $this->authHeader)
            ->assertStatus(200)
            ->assertJsonFragment(['per_page' => 2])
            ->assertJsonCount(2, 'data');
    }

    // --- Show ---

    public function test_authenticated_user_can_view_order(): void
    {
        $order = Order::factory()->create();

        $this->getJson('/api/order/' . $order->id, $this->authHeader)
            ->assertStatus(200)
            ->assertJsonFragment(['id' => $order->id]);
    }

    public function test_viewing_nonexistent_order_returns_404(): void
    {
        $this->getJson('/api/order/9999', $this->authHeader)->assertStatus(404);
    }

    // --- Store ---

    public function test_authenticated_user_can_create_order(): void
    {
        $this->postJson('/api/order', $this->validOrderData(), $this->authHeader)
            ->assertStatus(201);

        $this->assertDatabaseHas('orders', ['customer_name' => 'João Silva']);
    }

    public function test_create_order_dispatches_confirmation_job(): void
    {
        $this->postJson('/api/order', $this->validOrderData(), $this->authHeader)
            ->assertStatus(201);

        Queue::assertPushed(SendOrderConfirmationJob::class);
    }

    public function test_create_order_with_2_day_term_dispatches_expiry_job(): void
    {
        $terms = Terms::factory()->create(['expire_date' => '2 dias']);
        $lens  = Lens::factory()->create();

        $this->postJson('/api/order', [
            'customer_name'      => 'Maria',
            'customer_number'    => '5511999999999',
            'customer_birthdate' => '01/01/1990',
            'lens_id'            => $lens->id,
            'terms_id'           => $terms->id,
        ], $this->authHeader)->assertStatus(201);

        Queue::assertPushed(SendOrderExpiryNotificationJob::class);
    }

    public function test_create_order_without_2_day_term_does_not_dispatch_expiry_job(): void
    {
        $terms = Terms::factory()->create(['expire_date' => '30 dias']);
        $lens  = Lens::factory()->create();

        $this->postJson('/api/order', [
            'customer_name'      => 'Maria',
            'customer_number'    => '5511999999999',
            'customer_birthdate' => '01/01/1990',
            'lens_id'            => $lens->id,
            'terms_id'           => $terms->id,
        ], $this->authHeader)->assertStatus(201);

        Queue::assertNotPushed(SendOrderExpiryNotificationJob::class);
    }

    public function test_create_order_requires_customer_name(): void
    {
        $this->postJson('/api/order', $this->validOrderData(['customer_name' => '']), $this->authHeader)
            ->assertStatus(422);
    }

    public function test_create_order_requires_customer_number(): void
    {
        $this->postJson('/api/order', $this->validOrderData(['customer_number' => '']), $this->authHeader)
            ->assertStatus(422);
    }

    public function test_create_order_requires_valid_lens_id(): void
    {
        $this->postJson('/api/order', $this->validOrderData(['lens_id' => 9999]), $this->authHeader)
            ->assertStatus(422);
    }

    public function test_create_order_requires_valid_terms_id(): void
    {
        $this->postJson('/api/order', $this->validOrderData(['terms_id' => 9999]), $this->authHeader)
            ->assertStatus(422);
    }

    public function test_create_order_rejects_invalid_email(): void
    {
        $this->postJson('/api/order', $this->validOrderData(['customer_email' => 'notanemail']), $this->authHeader)
            ->assertStatus(422);
    }

    public function test_create_order_allows_nullable_email(): void
    {
        $this->postJson('/api/order', $this->validOrderData(['customer_email' => null]), $this->authHeader)
            ->assertStatus(201);
    }

    public function test_unauthenticated_user_cannot_create_order(): void
    {
        $this->postJson('/api/order', $this->validOrderData())->assertStatus(401);
    }

    // --- Update ---

    public function test_authenticated_user_can_update_order(): void
    {
        $order = Order::factory()->create();

        $this->patchJson('/api/order/' . $order->id, ['customer_name' => 'Maria'], $this->authHeader)
            ->assertStatus(200)
            ->assertJsonFragment(['customer_name' => 'Maria']);

        $this->assertDatabaseHas('orders', ['id' => $order->id, 'customer_name' => 'Maria']);
    }

    public function test_update_with_invalid_email_returns_422(): void
    {
        $order = Order::factory()->create();

        $this->patchJson('/api/order/' . $order->id, ['customer_email' => 'bademail'], $this->authHeader)
            ->assertStatus(422);
    }

    public function test_unauthenticated_user_cannot_update_order(): void
    {
        $order = Order::factory()->create();

        $this->patchJson('/api/order/' . $order->id, ['customer_name' => 'Hacker'])->assertStatus(401);
    }

    // --- Delete ---

    public function test_admin_can_delete_order(): void
    {
        $order = Order::factory()->create();

        $this->deleteJson('/api/order/' . $order->id, [], $this->adminHeader)
            ->assertStatus(204);

        $this->assertDatabaseMissing('orders', ['id' => $order->id]);
    }

    public function test_non_admin_cannot_delete_order(): void
    {
        $order = Order::factory()->create();

        $this->deleteJson('/api/order/' . $order->id, [], $this->authHeader)
            ->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_delete_order(): void
    {
        $order = Order::factory()->create();

        $this->deleteJson('/api/order/' . $order->id)->assertStatus(401);
    }
}
