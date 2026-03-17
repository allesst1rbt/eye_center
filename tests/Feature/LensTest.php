<?php

namespace Tests\Feature;

use App\Models\Lens;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class LensTest extends TestCase
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

    public function test_unauthenticated_user_cannot_list_lenses(): void
    {
        $this->getJson('/api/lens')->assertStatus(401);
    }

    public function test_authenticated_user_can_list_lenses(): void
    {
        Lens::factory(3)->create();

        $this->getJson('/api/lens', $this->authHeader)
            ->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_list_lenses_returns_empty_array_when_none_exist(): void
    {
        $this->getJson('/api/lens', $this->authHeader)
            ->assertStatus(200)
            ->assertJson([]);
    }

    // --- Show ---

    public function test_authenticated_user_can_view_lens(): void
    {
        $lens = Lens::factory()->create(['name' => 'Test Lens']);

        $this->getJson('/api/lens/' . $lens->id, $this->authHeader)
            ->assertStatus(200)
            ->assertJsonFragment(['name' => 'Test Lens']);
    }

    public function test_viewing_nonexistent_lens_returns_404(): void
    {
        $this->getJson('/api/lens/9999', $this->authHeader)->assertStatus(404);
    }

    // --- Store ---

    public function test_admin_can_create_lens(): void
    {
        $this->postJson('/api/lens', ['name' => 'New Lens'], $this->adminHeader)
            ->assertStatus(201)
            ->assertJsonFragment(['name' => 'New Lens']);

        $this->assertDatabaseHas('lenses', ['name' => 'New Lens']);
    }

    public function test_non_admin_cannot_create_lens(): void
    {
        $this->postJson('/api/lens', ['name' => 'New Lens'], $this->authHeader)
            ->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_create_lens(): void
    {
        $this->postJson('/api/lens', ['name' => 'New Lens'])->assertStatus(401);
    }

    public function test_create_lens_requires_name(): void
    {
        $this->postJson('/api/lens', ['name' => ''], $this->adminHeader)
            ->assertStatus(422);
    }

    public function test_create_lens_requires_unique_name(): void
    {
        Lens::factory()->create(['name' => 'Existing Lens']);

        $this->postJson('/api/lens', ['name' => 'Existing Lens'], $this->adminHeader)
            ->assertStatus(422);
    }

    // --- Update ---

    public function test_admin_can_update_lens(): void
    {
        $lens = Lens::factory()->create(['name' => 'Old Name']);

        $this->patchJson('/api/lens/' . $lens->id, ['name' => 'Updated Name'], $this->adminHeader)
            ->assertStatus(200)
            ->assertJsonFragment(['name' => 'Updated Name']);

        $this->assertDatabaseHas('lenses', ['id' => $lens->id, 'name' => 'Updated Name']);
    }

    public function test_non_admin_cannot_update_lens(): void
    {
        $lens = Lens::factory()->create();

        $this->patchJson('/api/lens/' . $lens->id, ['name' => 'Updated'], $this->authHeader)
            ->assertStatus(403);
    }

    // --- Delete ---

    public function test_admin_can_delete_lens(): void
    {
        $lens = Lens::factory()->create();

        $this->deleteJson('/api/lens/' . $lens->id, [], $this->adminHeader)
            ->assertStatus(204);

        $this->assertDatabaseMissing('lenses', ['id' => $lens->id]);
    }

    public function test_non_admin_cannot_delete_lens(): void
    {
        $lens = Lens::factory()->create();

        $this->deleteJson('/api/lens/' . $lens->id, [], $this->authHeader)
            ->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_delete_lens(): void
    {
        $lens = Lens::factory()->create();

        $this->deleteJson('/api/lens/' . $lens->id)->assertStatus(401);
    }
}
