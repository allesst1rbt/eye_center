<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class ExpireDateTerms extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function build()
    {
        return $this->view('Mails.ExpireDateMail')
            ->subject('Hora de renovar suas lentes!')
            ->from(env('MAIL_FROM_ADDRESS'), 'EyeCenter')
            ->to($this->order->customer_email);
    }
}
