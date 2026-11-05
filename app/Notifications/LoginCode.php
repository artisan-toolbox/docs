<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LoginCode extends Notification
{
    public function __construct(#[\SensitiveParameter] public readonly string $code) {}

    /**
     * @return list<string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your Artisan Toolbox sign-in code')
            ->greeting('Sign in to Artisan Toolbox')
            ->line('Your sign-in code is '.$this->code.'.')
            ->line('This code expires in 10 minutes and can only be used once in the browser that requested it.')
            ->line('If you did not request this code, you can ignore this email.');
    }
}
