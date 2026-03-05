<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class MessageService
{
    private string $baseUrl;
    private string $apiKey;
    private string $instance;

    public function __construct()
    {
        $this->baseUrl = config('services.message_service.url');
        $this->apiKey = config('services.message_service.api_key');
        $this->instance = config('services.message_service.instance');
    }

    public function sendText(string $number, string $text): array
    {
        return $this->post('message/sendText/' . rawurlencode($this->instance), [
            'number' => $number,
            'text' => $text,
        ]);
    }

    /**
     * Send an image, video or document.
     *
     * @param string $number   Destination number (e.g. 5511999999999)
     * @param string $mediatype 'image' | 'video' | 'document'
     * @param string $media    URL or base64-encoded content
     * @param string $mimetype e.g. 'image/jpeg', 'video/mp4', 'application/pdf'
     * @param string $caption  Optional caption shown below the media
     * @param string $fileName File name (required for documents)
     */
    public function sendMedia(
        string $number,
        string $mediatype,
        string $media,
        string $mimetype,
        string $caption = '',
        string $fileName = ''
    ): array {
        $payload = [
            'number' => $number,
            'mediatype' => $mediatype,
            'mimetype' => $mimetype,
            'media' => $media,
        ];

        if ($caption) {
            $payload['caption'] = $caption;
        }

        if ($fileName) {
            $payload['fileName'] = $fileName;
        }

        return $this->post('message/sendMedia/' . rawurlencode($this->instance), $payload);
    }

    /**
     * Send an audio message (PTT voice note).
     *
     * @param string $number Destination number
     * @param string $audio  URL or base64-encoded OGG/OPUS audio
     */
    public function sendAudio(string $number, string $audio): array
    {
        return $this->post('message/sendWhatsAppAudio/' . rawurlencode($this->instance), [
            'number' => $number,
            'audio' => $audio,
        ]);
    }

    /**
     * Check if the WhatsApp instance is connected.
     */
    public function checkConnection(): array
    {
        try {
            $response = Http::withHeaders([
                'apikey' => $this->apiKey,
            ])->get("{$this->baseUrl}/instance/connectionState/" . rawurlencode($this->instance));

            if ($response->successful()) {
                return ['success' => true, 'data' => $response->json()];
            }

            return ['success' => false, 'error' => $response->body()];
        } catch (\Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    private function post(string $endpoint, array $payload): array
    {
        try {
            $response = Http::withHeaders([
                'apikey' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post("{$this->baseUrl}/{$endpoint}", $payload);

            if ($response->successful()) {
                return ['success' => true, 'data' => $response->json()];
            }

            return ['success' => false, 'error' => $response->body()];
        } catch (\Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
