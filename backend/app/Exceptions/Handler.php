<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Validation\ValidationException;

class Handler extends ExceptionHandler
{
    protected $levels = [
    ];

    protected $dontReport = [
    ];

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register()
    {
        $this->renderable(function (Throwable $exception, $request) {
            if ($request->expectsJson()) {
                return $this->handleApiException($exception);
            }
        });
    }

    protected function handleApiException(Throwable $exception)
    {
        $response = [
            'message' => 'An unexpected error occurred. Please try again later.',
        ];

        if ($exception instanceof ValidationException) {
            return response()->json([
                'message' => 'Validation Error',
                'errors' => $exception->errors(),
            ], 422);
        }

        $statusCode = method_exists($exception, 'getStatusCode')
            ? $exception->getStatusCode()
            : 500;

        if (config('app.debug')) {
            $response['exception'] = get_class($exception);
            $response['message'] = $exception->getMessage();
            $response['trace'] = $exception->getTrace();
        }

        return response()->json($response, $statusCode);
    }
}
