<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewOrderNotification extends Notification
{
    use Queueable;

    protected $order;

    /**
     * Create a new notification instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // Chúng ta sẽ gửi thông báo qua 2 kênh: lưu vào DB và gửi email
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = route('admin.orders.show', $this->order->id);

        return (new MailMessage)
            ->subject('New Order Received!')
            ->greeting('Hello, Admin!')
            ->line('A new order has been placed on your website.')
            ->line('Order ID: ' . $this->order->id)
            ->line('Total Amount: $' . number_format($this->order->total_amount, 2))
            ->action('View Order', $url)
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'user_name' => $this->order->user->full_name, 
            'total_amount' => $this->order->total_amount,
            'message' => "New order #{$this->order->id} has been placed."
        ];
    }
}