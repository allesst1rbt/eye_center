<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BirthdayWishMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    public function __construct($order)
    {
        $this->order = $order;
    }

    public function build()
    {
        return $this->view('Mails.BirthdayMail')
            ->subject('Happy Birthday! 🎉')
            ->from(env('MAIL_FROM_ADDRESS'), 'EyeCenter')
            ->to($this->order->customer_email);
    }

}
