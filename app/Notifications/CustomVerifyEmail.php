<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomVerifyEmail extends Notification
{
    use Queueable;

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail']; // ← Envoie uniquement par e-mail
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return MailMessage
     */
    public function toMail($notifiable)
    {
        $hash = sha1($notifiable->getEmailForVerification());
        $url = url("verifyemail/{$notifiable->id}/{$hash}");

        return (new MailMessage)
            ->subject('Vérifiez votre e-mail')
            ->line('Cliquez sur le bouton ci-dessous pour vérifier votre adresse e-mail.')
            ->action('Vérifier mon e-mail', $url)
            ->line('Si vous n’avez pas créé de compte, veuillez ignorer cet e-mail.');
    }
}