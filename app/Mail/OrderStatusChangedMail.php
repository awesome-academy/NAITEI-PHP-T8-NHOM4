<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderStatusChangedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function build()
    {
        $statusSubject = match ($this->order->status) {
            'pending'    => 'Your order is waiting for approval.',
            'processing' => 'Your order has been approved.',
            'completed'  => 'Your order has been completed.',
            'canceled'   => 'Your order has been closed.',
            default      => 'Your order status has changed.',
        };

        return $this->subject($statusSubject)
            ->view('email')
            ->with([
                'order' => $this->order,
            ]);
    }
}
