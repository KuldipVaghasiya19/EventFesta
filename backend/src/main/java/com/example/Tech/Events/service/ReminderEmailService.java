package com.example.Tech.Events.service;

import com.example.Tech.Events.entity.Event;
import com.example.Tech.Events.entity.Participant;
import com.example.Tech.Events.repository.EventRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReminderEmailService {

    private final JavaMailSender mailSender;
    private final EventRepository eventRepository;

    @Scheduled(cron = "0 0 0 * * *")
    public void sendEventReminders() {
        Date now = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(now);
        cal.add(Calendar.HOUR, 24);
        Date next24Hours = cal.getTime();

        List<Event> events = eventRepository.findByEventDateBetween(now, next24Hours);

        for (Event event : events) {
            sendReminderToParticipants(event);
        }
    }

    private void sendReminderToParticipants(Event event) {
        if (event.getEventRegistrations() == null || event.getEventRegistrations().isEmpty()) {
            return;
        }

        List<String> emails = event.getEventRegistrations().stream()
                .map(registration -> registration.getParticipant().getEmail())
                .collect(Collectors.toList());

        if (emails.isEmpty()) return;

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setSubject("🔔 Event Reminder: " + event.getTitle() + " - Tomorrow!");
            helper.setText(createPlainTextContent(event), createHtmlContent(event));

            helper.setFrom("eventfesta11@gmail.com");
            helper.setBcc(emails.toArray(new String[0]));

            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace(); // use logger in prod
        }
    }

    private String createPlainTextContent(Event event) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("EEEE, MMMM dd, yyyy");
        return String.format(
                "Event Reminder: %s\n\n" +
                        "Dear Participant,\n\n" +
                        "This is a friendly reminder that you have registered for the upcoming event:\n\n" +
                        "Event: %s\n" +
                        "Date: %s\n" +
                        "Time: %s\n" +
                        "Location: %s\n\n" +
                        "We look forward to seeing you there!\n\n" +
                        "Best regards,\n" +
                        "Event Team\n" +
                        "EventFesta",
                event.getTitle(),
                event.getTitle(),
                dateFormat.format(event.getEventDate()),
                event.getLocation()
        );
    }

    private String createHtmlContent(Event event) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("EEEE, MMMM dd, yyyy");

        return String.format("""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Event Reminder</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f4f4f4;
                    }
                    .container {
                        background-color: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                    }
                    .header {
                        background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 28px;
                        font-weight: 300;
                    }
                    .header .icon {
                        font-size: 48px;
                        margin-bottom: 10px;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .greeting {
                        font-size: 18px;
                        color: #555;
                        margin-bottom: 20px;
                    }
                    .event-details {
                        background-color: #f8f9fa;
                        border-left: 4px solid #667eea;
                        padding: 25px;
                        margin: 25px 0;
                        border-radius: 5px;
                    }
                    .event-title {
                        font-size: 24px;
                        font-weight: 600;
                        color: #333;
                        margin-bottom: 20px;
                    }
                    .detail-item {
                        display: flex;
                        align-items: center;
                        margin-bottom: 15px;
                        font-size: 16px;
                    }
                    .detail-item:last-child {
                        margin-bottom: 0;
                    }
                    .detail-icon {
                        width: 20px;
                        margin-right: 12px;
                        color: #667eea;
                        font-weight: bold;
                    }
                    .detail-text {
                        color: #555;
                    }
                    .cta-section {
                        text-align: center;
                        margin: 30px 0;
                    }
                    .cta-button {
                        display: inline-block;
                        background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%);
                        color: white;
                        padding: 12px 30px;
                        text-decoration: none;
                        border-radius: 25px;
                        font-weight: 600;
                        transition: transform 0.2s;
                    }
                    .cta-button:hover {
                        transform: translateY(-2px);
                    }
                    .footer {
                        background-color: #f8f9fa;
                        padding: 25px 30px;
                        text-align: center;
                        color: #666;
                        font-size: 14px;
                    }
                    .footer .brand {
                        font-weight: 600;
                        color: #667eea;
                        margin-bottom: 5px;
                    }
                    .highlight {
                        background-color: #fff3cd;
                        padding: 15px;
                        border-radius: 5px;
                        border-left: 4px solid #ffc107;
                        margin: 20px 0;
                    }
                    .highlight-text {
                        color: #856404;
                        font-weight: 500;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="icon">📅</div>
                        <h1>Event Reminder</h1>
                    </div>
                    
                    <div class="content">
                        <div class="greeting">
                            Dear Valued Participant,
                        </div>
                        
                        <p>We hope this message finds you well. This is a friendly reminder about your upcoming event registration.</p>
                        
                        <div class="highlight">
                            <div class="highlight-text">
                                ⏰ <strong>Don't forget!</strong> Your event is scheduled for tomorrow.
                            </div>
                        </div>
                        
                        <div class="event-details">
                            <div class="event-title">%s</div>
                            
                            <div class="detail-item">
                                <div class="detail-icon">📅</div>
                                <div class="detail-text"><strong>Date:</strong> %s</div>
                            </div>
                            
                            <div class="detail-item">
                                <div class="detail-icon">🕐</div>
                                <div class="detail-text"><strong>Time:</strong> %s</div>
                            </div>
                            
                            <div class="detail-item">
                                <div class="detail-icon">📍</div>
                                <div class="detail-text"><strong>Location:</strong> %s</div>
                            </div>
                        </div>
                        
                        
                        <p>We're excited to see you there! If you have any questions or need to make changes to your registration, please don't hesitate to contact us.</p>
                        
                        <p>Thank you for your participation, and we look forward to a successful event.</p>
                    </div>
                    
                    <div class="footer">
                        <div class="brand">EventFesta</div>
                        <div>Making every event memorable</div>
                        <div style="margin-top: 15px; font-size: 12px; color: #999;">
                            This is an automated reminder. Please do not reply to this email.
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """,
                event.getTitle(),
                dateFormat.format(event.getEventDate()),
                event.getLocation()
        );
    }
}