<?php

namespace App\Mail;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DailyRevenueReportMail extends Mailable
{
    use Queueable, SerializesModels;

    public $revenueData;
    public $reportDate;

    /**
     * Create a new message instance.
     */
    public function __construct($revenueData, Carbon $reportDate)
    {
        $this->revenueData = $revenueData;
        $this->reportDate = $reportDate;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Daily Revenue Report - ' . $this->reportDate->format('M d, Y'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.daily-revenue-report',
            with: [
                'revenueData' => $this->revenueData,
                'reportDate' => $this->reportDate,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
