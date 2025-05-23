<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;
use Illuminate\Support\Facades\Mail;
use App\Mail\ExpireDateTerms;
use App\Services\MessageService;
use DateTime;
use Illuminate\Support\Carbon;

class SendOrderExpireDateMail extends Command
{
    protected $signature = 'orders:send-daily-email';
    protected $description = 'Send daily email to  orders next to expire';

    public function handle()
    {
       

        $orders = Order::where('order_remember', '=','false')->with('Term')->get();
        foreach ($orders as $order) {
            $expire_date =(int)explode(' ',$order->Term->days_to_expire)[0];
             
            $date = $order->created_at->clone()->startOfDay()->diffInDays(Carbon::today(), false);
           
           
            if ( $date === $expire_date ) {
                if ($order->customer_email) {
                    Mail::send(view: new ExpireDateTerms($order));
                }
                $this->sendMessage($order);


                $order->order_remember = "true";
                $order->save();
            }
        }

        // Create the mail class

        $this->info('Daily orders email sent successfully!');
    }

    public function sendMessage(Order $order)
    {
        $messageService = new MessageService();
        $result = $messageService->sendText(
            $order->customer_number,
            "Olá {$order->customer_name},\nÉ difícil acreditar, mas já faz {$order->Term->days_to_expire} desde que você adquiriu suas lentes e queremos saber se\ntem atendido suas necessidades. Você já pode adquirir reposição ou caso queira experimentar\noutro modelo, estamos a sua disposição. \nEstamos aqui para ajudar no que for necessário.\nEye Center."
        );

        if ($result['success']) {
            $this->info('Daily orders whatsapp sent successfully!');

        } else {
            $this->info('Daily orders whatsapp doesnt sent!');

        }
    }
}
