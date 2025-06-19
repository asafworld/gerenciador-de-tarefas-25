<?php

use Illuminate\Support\Arr;
use App\Models\User;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

it('Registers and logs in a user', function () {
    $data = ['name' => 'Bob', 'email' => 'bob@test.com', 'password' => 'password', 'password_confirmation' => 'password'];

    $this->postJson('/api/auth/register', $data)
        ->assertCreated()
        ->assertJsonStructure(['access_token']);

    $this->postJson('/api/auth/login', Arr::only($data, ['email', 'password']))
        ->assertOk()
        ->assertJsonStructure(['access_token']);
});

it('logs out and invalidates the previous token', function () {
    $user  = User::factory()->create();
    $token = JWTAuth::fromUser($user);

    /** Logout */
    $this->withHeader('Authorization', "Bearer {$token}")
        ->postJson('/api/auth/logout')
        ->assertOk();

    /** Old token must now falhar */
    $this->withHeader('Authorization', "Bearer {$token}")
        ->getJson('/api/auth/me')
        ->assertUnauthorized();
});

it('refreshes a token and returns a usable new one', function () {
    $user  = User::factory()->create();
    $token = JWTAuth::fromUser($user);

    $new = $this->withHeader('Authorization', "Bearer {$token}")
        ->postJson('/api/auth/refresh')
        ->assertOk()
        ->json('access_token');

    expect($new)->not->toBeEmpty();

    // new token válid
    $this->withHeader('Authorization', "Bearer {$new}")
        ->getJson('/api/auth/me')
        ->assertOk()
        ->assertJsonPath('id', $user->id);
});
