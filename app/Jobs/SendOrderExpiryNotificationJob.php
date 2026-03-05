<?php

namespace App\Jobs;

use App\Mail\ExpireDateTerms;
use App\Models\Order;
use App\Services\MessageService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendOrderExpiryNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 30;

    public function __construct(public Order $order) {}

    public function handle(MessageService $messageService): void
    {
        if ($this->order->customer_email) {
            Mail::to($this->order->customer_email)->send(new ExpireDateTerms($this->order));
        }

        $messageService->sendText($this->order->customer_number, $this->message());

        $this->order->order_remember = true;
        $this->order->save();
    }

    private function message(): string
    {
        return "👁️ Olá {$this->order->customer_name}, tudo bem?\n\nJá se passaram {$this->order->Term->days_to_expire} desde que você adquiriu suas lentes conosco e gostaríamos de saber se elas têm atendido suas necessidades.\n\nSe precisar de reposição ou quiser experimentar outro modelo, estamos à disposição para te ajudar! 😊\n\nConte com a gente!\nEye Center";
    }
}
