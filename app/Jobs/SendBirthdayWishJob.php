<?php

namespace App\Jobs;

use App\Mail\BirthdayWishMail;
use App\Models\Order;
use App\Services\MessageService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendBirthdayWishJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(public Order $order) {}

    public function handle(MessageService $messageService): void
    {
        if ($this->order->customer_email) {
            Mail::to($this->order->customer_email)->send(new BirthdayWishMail($this->order));
        }

        if ($this->order->customer_number) {
            $messageService->sendText($this->order->customer_number, $this->message());
        }
    }

    private function message(): string
    {
        return "🎉 Olá, {$this->order->customer_name}! 🎂\n\nO Eye Center deseja a você um Feliz Aniversário e que você sempre possa ver o melhor da vida!\n\nPara comemorarmos essa data especial, durante o seu mês, aproveite *10% de desconto* em nossos serviços.\n\n*Atenciosamente,*\n*Eye Center.*";
    }
}
