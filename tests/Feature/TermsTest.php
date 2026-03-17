<?php

namespace Tests\Feature;

use App\Models\Terms;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class TermsTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private User $admin;
    private array $authHeader;
    private array $adminHeader;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user        = User::factory()->create();
        $this->admin       = User::factory()->admin()->create();
        $this->authHeader  = ['Authorization' => 'Bearer ' . JWTAuth::fromUser($this->user)];
        $this->adminHeader = ['Authorization' => 'Bearer ' . JWTAuth::fromUser($this->admin)];
    }

    // --- Listing ---

    public function test_unauthenticated_user_cannot_list_terms(): void
    {
        $this->getJson('/api/terms')->assertStatus(401);
    }

    public function test_authenticated_user_can_list_terms(): void
    {
        Terms::factory(3)->create();

        $this->getJson('/api/terms', $this->authHeader)
            ->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_list_terms_returns_empty_array_when_none_exist(): void
    {
        $this->getJson('/api/terms', $this->authHeader)
            ->assertStatus(200)
            ->assertJson([]);
    }

    // --- Show ---

    public function test_authenticated_user_can_view_term(): void
    {
        $term = Terms::factory()->create(['expire_date' => '30 dias']);

        $this->getJson('/api/terms/' . $term->id, $this->authHeader)
            ->assertStatus(200)
            ->assertJsonFragment(['expire_date' => '30 dias']);
    }

    public function test_viewing_nonexistent_term_returns_404(): void
    {
        $this->getJson('/api/terms/9999', $this->authHeader)->assertStatus(404);
    }

    // --- Store ---

    public function test_admin_can_create_term(): void
    {
        $this->postJson('/api/terms', [
            'expire_date'    => '30 dias',
            'days_to_expire' => '30 dias',
        ], $this->adminHeader)
            ->assertStatus(201)
            ->assertJsonFragment(['expire_date' => '30 dias']);

        $this->assertDatabaseHas('terms', ['expire_date' => '30 dias']);
    }

    public function test_non_admin_cannot_create_term(): void
    {
        $this->postJson('/api/terms', [
            'expire_date'    => '30 dias',
            'days_to_expire' => '30 dias',
        ], $this->authHeader)->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_create_term(): void
    {
        $this->postJson('/api/terms', [
            'expire_date'    => '30 dias',
            'days_to_expire' => '30 dias',
        ])->assertStatus(401);
    }

    public function test_create_term_requires_expire_date(): void
    {
        $this->postJson('/api/terms', ['days_to_expire' => '30 dias'], $this->adminHeader)
            ->assertStatus(422);
    }

    public function test_create_term_requires_days_to_expire(): void
    {
        $this->postJson('/api/terms', ['expire_date' => '30 dias'], $this->adminHeader)
            ->assertStatus(422);
    }

    // --- Update ---

    public function test_admin_can_update_term(): void
    {
        $term = Terms::factory()->create();

        $this->patchJson('/api/terms/' . $term->id, ['expire_date' => '60 dias'], $this->adminHeader)
            ->assertStatus(200)
            ->assertJsonFragment(['expire_date' => '60 dias']);

        $this->assertDatabaseHas('terms', ['id' => $term->id, 'expire_date' => '60 dias']);
    }

    public function test_non_admin_cannot_update_term(): void
    {
        $term = Terms::factory()->create();

        $this->patchJson('/api/terms/' . $term->id, ['expire_date' => '60 dias'], $this->authHeader)
            ->assertStatus(403);
    }

    // --- Delete ---

    public function test_admin_can_delete_term(): void
    {
        $term = Terms::factory()->create();

        $this->deleteJson('/api/terms/' . $term->id, [], $this->adminHeader)
            ->assertStatus(204);

        $this->assertDatabaseMissing('terms', ['id' => $term->id]);
    }

    public function test_non_admin_cannot_delete_term(): void
    {
        $term = Terms::factory()->create();

        $this->deleteJson('/api/terms/' . $term->id, [], $this->authHeader)
            ->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_delete_term(): void
    {
        $term = Terms::factory()->create();

        $this->deleteJson('/api/terms/' . $term->id)->assertStatus(401);
    }
}
