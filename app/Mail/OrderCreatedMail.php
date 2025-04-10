<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class OrderCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function build()
    {
        return $this->view('Mails.OrderCreatedMail')
            ->subject('Eye Center agradece a sua preferência! Veja como aproveitar ao máximo a sua
adaptação de lentes')
            ->from(env('MAIL_FROM_ADDRESS'))
            ->to($this->order->customer_email);
    }
}
