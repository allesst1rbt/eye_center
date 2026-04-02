<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderDeliveryMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function build()
    {
        return $this->view('Mails.OrderDeliveryMail')
            ->subject('Suas lentes estão prontas para retirada! - Eye Center')
            ->from(env('MAIL_FROM_ADDRESS'), 'EyeCenter')
            ->to($this->order->customer_email);
    }
}
