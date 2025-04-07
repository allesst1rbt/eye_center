<?php

namespace App\Console\Commands;

use App\Mail\BirthdayWishMail;
use Illuminate\Console\Command;
use App\Models\Order;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SendBirthdayWishes extends Command
{
    protected $signature = 'users:send-birthday-wishes';
    protected $description = 'Send birthday wishes to users';

    public function handle()
    {
        // Get users whose birthday is today
        $Orders = Order::where('customer_bithdate', '=', Carbon::now()->format('d/m/Y'))->get();

        foreach ($Orders as $Order) {
            try {
                $this->sendBirthdayEmail($Order);
                $this->info("Birthday wish sent to {$Order->customer_name}");
            } catch (\Exception $e) {
                $this->error("Failed to send birthday wish to {$Order->customer_name}: {$e->getMessage()}");
            }
        }
    }

    private function sendBirthdayEmail($Order)
    {
        Mail::send(new BirthdayWishMail($Order));
    }
}
