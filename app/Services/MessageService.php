<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class MessageService
{
    private string $baseUrl;
    private string $apiKey;

    public function __construct()
    {
        $this->baseUrl = env('MESSAGE_SERVICE_URL', 'http://0.0.0.0:8081');
        $this->apiKey = env('MESSAGE_SERVICE_API_KEY', 'mude-me');
    }

    public function sendText(string $number, string $text)
    {
        try {
            $response = Http::withHeaders([
                'apikey' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/message/sendText/Eye Center', [
                'number' => $number,
                'text' => $text
            ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json()
                ];
            }

            return [
                'success' => false,
                'error' => $response->body()
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}
