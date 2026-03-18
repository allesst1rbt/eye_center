<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class MessageService
{
    private string $url;
    private string $apiKey;

    public function __construct()
    {
        $this->url = config('services.message_service.url');
        $this->apiKey = config('services.message_service.api_key');
    }

    public function sendText(string $number, string $text): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->url, [
                'to' => $number,
                'text' => $text,
            ]);

            if ($response->successful()) {
                return ['success' => true, 'data' => $response->json()];
            }

            return ['success' => false, 'error' => $response->body()];
        } catch (\Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
