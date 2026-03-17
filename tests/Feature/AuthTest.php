<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private function authHeader(User $user): array
    {
        return ['Authorization' => 'Bearer ' . JWTAuth::fromUser($user)];
    }

    public function test_login_with_valid_credentials_returns_token(): void
    {
        $user = User::factory()->create(['password' => bcrypt('password')]);

        $this->postJson('/api/login', [
            'email'    => $user->email,
            'password' => 'password',
        ])
            ->assertStatus(200)
            ->assertJsonStructure(['token']);
    }

    public function test_login_with_wrong_password_returns_401(): void
    {
        $user = User::factory()->create();

        $this->postJson('/api/login', [
            'email'    => $user->email,
            'password' => 'wrong-password',
        ])
            ->assertStatus(401)
            ->assertJson(['error' => 'Invalid credentials']);
    }

    public function test_login_with_nonexistent_email_returns_401(): void
    {
        $this->postJson('/api/login', [
            'email'    => 'nobody@test.com',
            'password' => 'password',
        ])->assertStatus(401);
    }

    public function test_get_user_with_valid_token_returns_user(): void
    {
        $user = User::factory()->create();

        $this->getJson('/api/user', $this->authHeader($user))
            ->assertStatus(200)
            ->assertJsonStructure(['user' => ['id', 'name', 'email']]);
    }

    public function test_get_user_without_token_returns_401(): void
    {
        $this->getJson('/api/user')->assertStatus(401);
    }

    public function test_get_user_returns_correct_user_data(): void
    {
        $user = User::factory()->create(['name' => 'Test User']);

        $this->getJson('/api/user', $this->authHeader($user))
            ->assertStatus(200)
            ->assertJsonFragment(['name' => 'Test User']);
    }

    public function test_logout_invalidates_token(): void
    {
        $user = User::factory()->create();

        $this->postJson('/api/logout', [], $this->authHeader($user))
            ->assertStatus(200)
            ->assertJson(['message' => 'Successfully logged out']);
    }

    public function test_logout_without_token_returns_401(): void
    {
        $this->postJson('/api/logout')->assertStatus(401);
    }
}
