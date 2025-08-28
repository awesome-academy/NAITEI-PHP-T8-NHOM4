<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use App\Models\User;
use App\Notifications\NewOrderNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;

class SendNewOrderNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(OrderPlaced $event): void
    {
        $admins = User::whereHas('role', function ($query) {
            $query->where('name', 'admin');
        })->get();

        if ($admins->isNotEmpty()) {
            Notification::send($admins, new NewOrderNotification($event->order));
        }
    }
}
