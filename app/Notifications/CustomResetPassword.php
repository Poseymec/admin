<?php

// app/Notifications/CustomResetPassword.php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomResetPassword extends Notification
{
    use Queueable;

    public function __construct(public string $token) {}

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail']; // ← Indique que la notification est envoyée par e-mail
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return MailMessage
     */
    public function toMail($notifiable)
    {
        $url = url("reset-password?token={$this->token}&email={$notifiable->email}");

        return (new MailMessage)
            ->subject('Réinitialiser votre mot de passe')
            ->line('Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe.')
            ->action('Réinitialiser', $url);
    }
}