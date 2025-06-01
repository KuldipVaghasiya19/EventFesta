package com.example.Tech.Events.service;

import com.example.Tech.Events.entity.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendRegistrationEmail(String to, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("eventfesta11@gmail.com");
        message.setTo(to);
        message.setSubject("Registration Successful in EVentFesta");
        message.setText("Hello " + name + ",\n\nYou have successfully registered as a participant in Tech Events.\n\nRegards,\nTech Events Team");
        mailSender.send(message);
    }

    public void sendTagMatchEmail(String toEmail, String participantName, Event event) {
        String subject = "🎯 New Event Matching Your Interests: " + event.getTitle();

        String body = "Hello " + participantName + ",\n\n" +
                "We're excited to let you know that a new event has been added that matches your interests!\n\n" +
                "📅 *Event Details*\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "📌 Title        : " + event.getTitle() + "\n" +
                "📝 Description  : " + event.getDescription() + "\n" +
                "🏷️ Type         : " + event.getType().toString().toUpperCase() + "\n" +
                "📍 Location     : " + event.getLocation() + "\n" +
                "🗓️ Date         : " + event.getEventDate().toString() + "\n" +
                "🕙 Time         : " + event.getTime() + "\n" +
                "💰 Fee          : ₹" + event.getRegistrationFees() + "\n" +
                "👥 Participants : " + event.getCurrentParticipants() + "/" + event.getMaxParticipants() + "\n" +
                "🕐 Register By : " + event.getLastRegistertDate() + "\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Don't miss out on this opportunity. We hope to see you there!\n\n" +
                "Best regards,\n" +
                "Tech Events Team";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("eventfesta11@gmail.com");

        mailSender.send(message);
    }


}
