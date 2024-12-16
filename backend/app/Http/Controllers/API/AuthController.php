<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Throwable;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email',
                'password' => 'required|string|min:6|confirmed',
            ]);

            if (User::where('email', $validatedData['email'])->exists()) {
                return response()->json([
                    'message' => 'Email already exists.',
                ], 409);
            }

            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'User registered successfully.',
                'access_token' => $token,
                'token_type' => 'Bearer',
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'An error occurred during registration.',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong.',
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'message' => 'The provided credentials are incorrect.',
                ], 401);
            }

            $user->tokens()->delete();

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful.',
                'access_token' => $token,
                'token_type' => 'Bearer',
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'An error occurred during login.',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong.',
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Logout successful.',
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'An error occurred during logout.',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong.',
            ], 500);
        }
    }
public function changePassword(Request $request)
{
    try {
        $validatedData = $request->validate([
            'currentPassword' => 'required|string',
            'newPassword' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($validatedData['currentPassword'], $user->password)) {
            return response()->json([
                'message' => 'The current password is incorrect.',
            ], 400);
        }

        if ($validatedData['currentPassword'] === $validatedData['newPassword']) {
            return response()->json([
                'message' => 'The new password must be different from the current password.',
            ], 400);
        }

        $user->password = Hash::make($validatedData['newPassword']);
        $user->save();

        return response()->json([
            'message' => 'Password changed successfully.',
        ], 200);
    } catch (Throwable $e) {
        return response()->json([
            'message' => 'An error occurred while changing the password.',
            'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong.',
        ], 500);
    }
}

}
