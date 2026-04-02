<?php

namespace App\Jobs;

use App\Mail\OrderDeliveryMail;
use App\Models\Order;
use App\Services\MessageService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendOrderDeliveryJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 30;

    public function __construct(public Order $order) {}

    public function handle(MessageService $messageService): void
    {
        if ($this->order->customer_email) {
            Mail::to($this->order->customer_email)->send(new OrderDeliveryMail($this->order));
        }

        $messageService->sendText($this->order->customer_number, $this->message());

        $this->order->order_delivery = true;
        $this->order->save();
    }

    private function message(): string
    {
        return "👁️ Olá {$this->order->customer_name}, tudo bem?\n\nPassamos para informar que as suas lentes de contato já estão prontas e disponíveis para retirada aqui na *Clínica Eye Center*! 🎉\n\nFique à vontade para passar por nossa clínica no horário de funcionamento para buscar o seu pedido.\n\nCaso tenha alguma dúvida ou precise remarcar, é só nos chamar aqui!\n\n*Atenciosamente,*\n*EYE CENTER.*";
    }
}
