<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;
use Illuminate\Support\Facades\Mail;
use App\Mail\ExpireDateTerms;
use App\Services\MessageService;

class SendOrderExpireDateMail extends Command
{
    protected $signature = 'orders:send-daily-email';
    protected $description = 'Send daily email to  orders next to expire';

    public function handle()
    {
       

        // Get today's orders
        $orders = Order::with('terms')->get();
        foreach ($orders as $order) {
            $dateToAdd =explode(' ',$order->terms->expire_date)[0];
            $date = $order->created_at->diffInDays($order->created_at->copy()->addDays($dateToAdd));
            //zap here
            if ($dateToAdd === 5 && $date ===5 ) {
                if ($order->customer_email) {
                    Mail::send(view: new ExpireDateTerms($order));
                }
                $this->sendMessage($order);
            }
            if ($dateToAdd >30 && $dateToAdd <= 45 && $date ===10) {
                if ($order->customer_email) {
                    Mail::send(view: new ExpireDateTerms($order));
                }
                $this->sendMessage($order);

            }
            if ($dateToAdd >45  && $date === 30) {
                if ($order->customer_email) {
                    Mail::send(view: new ExpireDateTerms($order));
                }
                $this->sendMessage($order);
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
            'Your message here'
        );

        if ($result['success']) {
            $this->info('Daily orders whatsapp sent successfully!');

        } else {
            $this->info('Daily orders whatsapp doesnt sent!');

        }
    }
}
