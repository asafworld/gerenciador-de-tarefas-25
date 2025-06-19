<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /* --------- REGISTRO --------- */
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        return $this->respondWithToken(JWTAuth::fromUser($user), $user, 201);
    }

    /* --------- LOGIN --------- */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciais inválidas.'],
            ]);
        }

        return $this->respondWithToken($token, auth('api')->user());
    }

    /* --------- LOGOUT --------- */
    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Logout efetuado']);
    }

    /* --------- REFRESH --------- */
    public function refresh()
    {
        return $this->respondWithToken(auth('api')->refresh(), auth('api')->user());
    }

    /* --------- PERFIL --------- */
    public function me()
    {
        return response()->json(auth('api')->user());
    }

    /* --------- Helper --------- */
    protected function respondWithToken($token, $user, $status = 200)
    {
        return response()->json([
            'user'         => $user,
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth('api')->factory()->getTTL() * 60, // segundos
        ], $status);
    }
}
