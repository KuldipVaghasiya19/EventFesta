package com.example.Tech.Events.service;

import com.example.Tech.Events.entity.Event;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Set;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private static final String FROM_EMAIL = "eventfesta11@gmail.com";
    private static final String ADMIN_EMAIL = "admin@eventfesta.com"; // Admin email for BCC

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Sends a beautiful registration welcome email
     */
    public void sendRegistrationEmail(String to, String name) throws Exception {
        try {
            logger.info("Sending registration email to: {}", to);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setFrom(FROM_EMAIL);
            helper.setBcc(ADMIN_EMAIL); // Add BCC for admin monitoring
            helper.setSubject("🎉 Welcome to EventFesta - Registration Successful!");

            String htmlContent = buildRegistrationEmailContent(name);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Registration email sent successfully to: {}", to);

        } catch (Exception e) {
            logger.error("Failed to send registration email: {}", e.getMessage(), e);
            throw new Exception("Failed to send registration email: " + e.getMessage(), e);
        }
    }

    /**
     * Sends a beautiful event match notification email with matched tags
     */
    public void sendTagMatchEmail(String toEmail, String participantName, Event event, Set<String> matchedTags) throws Exception {
        try {
            logger.info("Sending tag match email to: {} with matched tags: {}", toEmail, matchedTags);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setFrom(FROM_EMAIL);
            helper.setBcc(ADMIN_EMAIL); // Add BCC for admin monitoring
            helper.setSubject("🎯 Perfect Match Found: " + event.getTitle() + " - Just for You!");

            String htmlContent = buildTagMatchEmailContent(participantName, event, matchedTags);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Tag match email sent successfully to: {}", toEmail);

        } catch (Exception e) {
            logger.error("Failed to send tag match email: {}", e.getMessage(), e);
            throw new Exception("Failed to send tag match email: " + e.getMessage(), e);
        }
    }


    /**
     * Overloaded method for backward compatibility
     */
    public void sendTagMatchEmail(String toEmail, String participantName, Event event) throws Exception {
        sendTagMatchEmail(toEmail, participantName, event, null);
    }

    /**
     * Sends QR code with event details via email
     */
    public void sendQRWithEventDetails(String toEmail, String participantName, Event event, BufferedImage qrImage)
            throws Exception {

        if (qrImage == null) {
            throw new IllegalArgumentException("QR code image cannot be null");
        }

        if (toEmail == null || toEmail.trim().isEmpty()) {
            throw new IllegalArgumentException("Email address cannot be null or empty");
        }

        try {
            logger.info("Converting QR image to base64 for email: {}", toEmail);

            // Convert BufferedImage to byte array
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            boolean writeSuccess = ImageIO.write(qrImage, "png", baos);

            if (!writeSuccess) {
                throw new IOException("Failed to write QR image to byte array");
            }

            byte[] imageBytes = baos.toByteArray();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            logger.info("Creating MIME message for QR code email");
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setFrom(FROM_EMAIL);
            helper.setBcc(ADMIN_EMAIL); // Add BCC for admin monitoring
            helper.setSubject("🎫 Your Event Ticket & QR Code - " + event.getTitle());

            String htmlContent = buildQREmailContent(participantName, event, base64Image);
            helper.setText(htmlContent, true);

            // Attach the QR code as a file
            helper.addAttachment("event-qr-code.png", new ByteArrayResource(imageBytes));

            logger.info("Sending QR code email");
            mailSender.send(message);
            logger.info("QR code email sent successfully to: {}", toEmail);

        } catch (IOException e) {
            logger.error("Failed to process QR image: {}", e.getMessage(), e);
            throw new Exception("Failed to process QR code image: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Failed to send QR code email: {}", e.getMessage(), e);
            throw new Exception("Failed to send QR code email: " + e.getMessage(), e);
        }
    }

    public void sendOtpEmail(String to, String otp) throws Exception {
        try {
            logger.info("Sending OTP email to: {}", to);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setFrom(FROM_EMAIL);
            helper.setSubject("Your OTP for EventFesta Registration");
            String htmlContent = "<h3>Your OTP is: " + otp + "</h3>";
            helper.setText(htmlContent, true);
            mailSender.send(message);
            logger.info("OTP email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send OTP email: {}", e.getMessage(), e);
            throw new Exception("Failed to send OTP email: " + e.getMessage(), e);
        }
    }

    /**
     * Builds HTML content for registration email
     */
    private String buildRegistrationEmailContent(String name) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<style>" +
                getCommonEmailStyles() +
                ".welcome-icon { font-size: 4rem; margin-bottom: 20px; }" +
                ".features { display: flex; flex-wrap: wrap; gap: 15px; margin: 25px 0; }" +
                ".feature { flex: 1; min-width: 200px; text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px; }" +
                ".feature-icon { font-size: 2rem; margin-bottom: 10px; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header' style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);'>" +
                "<div class='welcome-icon'>🎉</div>" +
                "<h1>Welcome to EventFesta!</h1>" +
                "<p style='margin: 0; font-size: 1.1rem; opacity: 0.9;'>Your gateway to amazing tech events</p>" +
                "</div>" +
                "<div class='content'>" +
                "<h2 style='color: #667eea; margin-bottom: 20px;'>Hello " + name + "! 👋</h2>" +
                "<p style='font-size: 1.1rem; line-height: 1.8;'>Congratulations! You've successfully joined the <strong>EventFesta</strong> community. Get ready to discover, participate, and network at the most exciting tech events!</p>" +
                "<div class='features'>" +
                "<div class='feature'>" +
                "<div class='feature-icon'>🎯</div>" +
                "<h4>Smart Matching</h4>" +
                "<p>Get personalized event recommendations based on your interests</p>" +
                "</div>" +
                "<div class='feature'>" +
                "<div class='feature-icon'>📱</div>" +
                "<h4>QR Check-in</h4>" +
                "<p>Easy event check-in with your personal QR codes</p>" +
                "</div>" +
                "<div class='feature'>" +
                "<div class='feature-icon'>🏆</div>" +
                "<h4>Track Progress</h4>" +
                "<p>Monitor your event participation and achievements</p>" +
                "</div>" +
                "</div>" +
                "<div class='cta-section'>" +
                "<h3>What's Next?</h3>" +
                "<p>Start exploring events that match your interests and skills. We'll notify you when perfect matches are available!</p>" +
                "</div>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>Ready to dive into the world of tech events? Let's make it happen! 🚀</p>" +
                "<p><strong>The EventFesta Team</strong></p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    /**
     * Builds HTML content for tag match email with matched tags
     */
    private String buildTagMatchEmailContent(String participantName, Event event, Set<String> matchedTags) {
        // Build matched tags HTML
        String matchedTagsHtml = "";
        if (matchedTags != null && !matchedTags.isEmpty()) {
            StringBuilder tagsBuilder = new StringBuilder();
            tagsBuilder.append("<div class='matched-tags'>");
            tagsBuilder.append("<h4 style='color: #667eea; margin-bottom: 15px;'>🎯 Why This Event Matches You:</h4>");
            tagsBuilder.append("<div class='tags-container'>");
            for (String tag : matchedTags) {
                tagsBuilder.append("<span class='tag-badge'>").append(tag).append("</span>");
            }
            tagsBuilder.append("</div>");
            tagsBuilder.append("<p style='font-size: 0.9rem; color: #666; margin-top: 10px;'>These are the interests that match between you and this event!</p>");
            tagsBuilder.append("</div>");
            matchedTagsHtml = tagsBuilder.toString();
        }

        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<style>" +
                getCommonEmailStyles() +
                ".match-badge { background: linear-gradient(45deg, #FF6B6B, #4ECDC4); color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold; margin-bottom: 20px; }" +
                ".event-card { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 20px 0; }" +
                ".event-type { background: #667eea; color: white; padding: 4px 12px; border-radius: 15px; font-size: 0.8rem; font-weight: bold; display: inline-block; margin-bottom: 15px; }" +
                ".detail-row { display: flex; align-items: center; margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #eee; }" +
                ".detail-icon { width: 30px; font-size: 1.2rem; }" +
                ".detail-text { flex: 1; }" +
                ".urgent { background: #ff4757; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }" +
                ".matched-tags { background: #e8f4fd; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #3498db; }" +
                ".tags-container { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0; }" +
                ".tag-badge { background: linear-gradient(45deg, #667eea, #764ba2); color: white; padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 500; display: inline-block; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header' style='background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);'>" +
                "<h1>🎯 Perfect Match Found!</h1>" +
                "<p style='margin: 0; font-size: 1.1rem; opacity: 0.9;'>An event tailored just for you</p>" +
                "</div>" +
                "<div class='content'>" +
                "<div class='match-badge'>✨ PERSONALIZED FOR YOU</div>" +
                "<h2>Hi " + participantName + "! 👋</h2>" +
                "<p style='font-size: 1.1rem; line-height: 1.8;'>Great news! We found an event that perfectly matches your interests and skills. This could be exactly what you're looking for!</p>" +
                matchedTagsHtml +
                "<div class='event-card'>" +
                "<div class='event-type'>" + (event.getType() != null ? event.getType().toString().toUpperCase() : "EVENT") + "</div>" +
                "<h3 style='color: #2c3e50; margin: 0 0 15px 0;'>" + event.getTitle() + "</h3>" +
                "<p style='color: #666; font-size: 1rem; line-height: 1.6; margin-bottom: 20px;'>" + event.getDescription() + "</p>" +
                "<div class='detail-row'>" +
                "<span class='detail-icon'>📅</span>" +
                "<span class='detail-text'><strong>Date:</strong> " + event.getEventDate() + "</span>" +
                "</div>" +
                "<div class='detail-row'>" +
                "<span class='detail-icon'>📍</span>" +
                "<span class='detail-text'><strong>Location:</strong> " + event.getLocation() + "</span>" +
                "</div>" +
                "<div class='detail-row'>" +
                "<span class='detail-icon'>💰</span>" +
                "<span class='detail-text'><strong>Registration Fee:</strong> ₹" + event.getRegistrationFees() + "</span>" +
                "</div>" +
                "<div class='detail-row'>" +
                "<span class='detail-icon'>👥</span>" +
                "<span class='detail-text'><strong>Participants:</strong> " + event.getCurrentParticipants() + "/" + event.getMaxParticipants() + " registered</span>" +
                "</div>" +
                "<div class='detail-row' style='border-bottom: none;'>" +
                "<span class='detail-icon'>⏰</span>" +
                "<span class='detail-text'><strong>Register By:</strong> " + event.getLastRegistertDate() + "</span>" +
                "</div>" +
                "</div>" +
                "<div class='urgent'>" +
                "<h4 style='margin: 0 0 10px 0;'>⚡ Don't Miss Out!</h4>" +
                "<p style='margin: 0;'>Limited seats available. Register now to secure your spot!</p>" +
                "</div>" +
                "<div class='cta-section'>" +
                "<p style='text-align: center; font-size: 1.1rem;'>Ready to take your skills to the next level? This event is waiting for you!</p>" +
                "</div>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>We're excited to see you grow! 🌟</p>" +
                "<p><strong>The EventFesta Team</strong></p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    /**
     * Builds HTML content for QR code email
     */
    private String buildQREmailContent(String participantName, Event event, String base64Image) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<style>" +
                getCommonEmailStyles() +
                ".ticket-container { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; padding: 30px; margin: 25px 0; color: white; text-align: center; }" +
                ".qr-container { background: white; border-radius: 12px; padding: 25px; margin: 25px auto; display: inline-block; box-shadow: 0 8px 25px rgba(0,0,0,0.15); }" +
                ".qr-image { border: 3px solid #667eea; border-radius: 8px; padding: 15px; background: white; display: block; margin: 0 auto; }" +
                ".ticket-number { font-size: 0.9rem; opacity: 0.8; margin-top: 15px; }" +
                ".instructions { background: #e8f4fd; border-left: 4px solid #3498db; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }" +
                ".event-details { background: #f8f9fa; border-radius: 12px; padding: 25px; margin: 25px 0; }" +
                ".detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 20px; }" +
                ".detail-item { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; }" +
                ".warning-box { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 25px 0; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header' style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);'>" +
                "<h1>🎫 Your Event Ticket</h1>" +
                "<p style='margin: 0; font-size: 1.1rem; opacity: 0.9;'>Everything you need for " + event.getTitle() + "</p>" +
                "</div>" +
                "<div class='content'>" +
                "<h2>Hello " + participantName + "! 🎉</h2>" +
                "<p style='font-size: 1.1rem; line-height: 1.8;'>Fantastic! Your registration for <strong>" + event.getTitle() + "</strong> is confirmed. Below is your digital ticket with QR code for easy check-in.</p>" +
                "<div class='ticket-container'>" +
                "<h3 style='margin: 0 0 20px 0;'>🎟️ DIGITAL TICKET</h3>" +
                "<div class='qr-container'>" +
                "<p style='color: #333; margin: 0 0 15px 0; font-weight: bold;'>Present this QR code at the venue:</p>" +
                "<img src='data:image/png;base64," + base64Image + "' class='qr-image' width='200' height='200' alt='Event QR Code'/>" +
                "<div class='ticket-number' style='color: #666;'>Ticket ID: " + generateTicketId() + "</div>" +
                "</div>" +
                "</div>" +
                "<div class='instructions'>" +
                "<h4 style='color: #2980b9; margin: 0 0 15px 0;'>📋 Check-in Instructions:</h4>" +
                "<ul style='margin: 0; padding-left: 20px; line-height: 1.8;'>" +
                "<li>Show this QR code (or the attached image) at the registration desk</li>" +
                "<li>You can display it on your phone or print this email</li>" +
                "<li>Arrive 15-30 minutes early for smooth check-in</li>" +
                "<li>Bring a valid ID for verification</li>" +
                "</ul>" +
                "</div>" +
                "<div class='event-details'>" +
                "<h3 style='color: #2c3e50; margin: 0 0 20px 0;'>📋 Event Details</h3>" +
                "<div class='detail-grid'>" +
                "<div class='detail-item'>" +
                "<h5 style='margin: 0 0 8px 0; color: #667eea;'>📅 Date & Time</h5>" +
                "<p style='margin: 0; font-weight: bold;'>" + event.getEventDate() + "</p>" +
                "</div>" +
                "<div class='detail-item'>" +
                "<h5 style='margin: 0 0 8px 0; color: #667eea;'>📍 Location</h5>" +
                "<p style='margin: 0; font-weight: bold;'>" + event.getLocation() + "</p>" +
                "</div>" +
                "<div class='detail-item'>" +
                "<h5 style='margin: 0 0 8px 0; color: #667eea;'>🏢 Organizer</h5>" +
                "<p style='margin: 0; font-weight: bold;'>" + event.getOrganizer().getName() + "</p>" +
                "</div>" +
                "<div class='detail-item'>" +
                "<h5 style='margin: 0 0 8px 0; color: #667eea;'>📝 Description</h5>" +
                "<p style='margin: 0; line-height: 1.5;'>" + event.getDescription() + "</p>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<div class='warning-box'>" +
                "<h4 style='color: #856404; margin: 0 0 10px 0;'>⚠️ Important Notes:</h4>" +
                "<ul style='margin: 0; padding-left: 20px; color: #856404; line-height: 1.6;'>" +
                "<li>This QR code is unique to you - do not share it</li>" +
                "<li>Save this email or download the attachment</li>" +
                "<li>Contact support if you have any issues</li>" +
                "</ul>" +
                "</div>" +
                "<div class='cta-section'>" +
                "<p style='text-align: center; font-size: 1.1rem;'>We're excited to see you at the event! 🚀</p>" +
                "</div>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>Get ready for an amazing experience! 🌟</p>" +
                "<p><strong>The EventFesta Team</strong></p>" +
                "<p style='font-size: 0.9rem; color: #666;'>Questions? Reply to this email or contact our support team.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    /**
     * Common CSS styles for all emails
     */
    private String getCommonEmailStyles() {
        return "body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }" +
                ".container { max-width: 650px; margin: 0 auto; background-color: white; box-shadow: 0 0 20px rgba(0,0,0,0.1); }" +
                ".header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }" +
                ".header h1 { margin: 0; font-size: 2.2rem; font-weight: 300; }" +
                ".content { padding: 30px; }" +
                ".content h2 { color: #2c3e50; margin-bottom: 20px; }" +
                ".content p { line-height: 1.8; margin-bottom: 15px; }" +
                ".cta-section { text-align: center; background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; }" +
                ".footer { background: #2c3e50; color: white; padding: 30px; text-align: center; }" +
                ".footer p { margin: 10px 0; }" +
                "@media only screen and (max-width: 600px) {" +
                ".container { margin: 0; box-shadow: none; }" +
                ".header { padding: 25px 20px; }" +
                ".header h1 { font-size: 1.8rem; }" +
                ".content { padding: 20px; }" +
                ".detail-grid { grid-template-columns: 1fr; }" +
                ".tags-container { justify-content: center; }" +
                "}";
    }

    /**
     * Generates a random ticket ID for display purposes
     */
    private String generateTicketId() {
        return "TKT-" + System.currentTimeMillis() % 100000;
    }
}