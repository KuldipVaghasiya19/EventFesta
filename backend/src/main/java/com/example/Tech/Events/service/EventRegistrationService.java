package com.example.Tech.Events.service;

import com.example.Tech.Events.entity.Event;
import com.example.Tech.Events.entity.EventRegistration;
import com.example.Tech.Events.entity.Participant;
import com.example.Tech.Events.repository.EventRegistrationRepository;
import com.example.Tech.Events.repository.EventRepository;
import com.example.Tech.Events.repository.ParticipantRepository;
import com.example.Tech.Events.util.QrCodeGenerator;
import com.google.zxing.WriterException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.Map;
import java.util.UUID;

@Service
public class EventRegistrationService {

    private static final Logger logger = LoggerFactory.getLogger(EventRegistrationService.class);

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public EventRegistration registerParticipantForEvent(
            String participantId,
            String eventId,
            Map<String, String> registrationFormData,
            String paymentId,
            String orderId) {

        // Check for duplicate registration
        if (eventRegistrationRepository.existsByParticipantIdAndEventId(participantId, eventId)) {
            throw new RuntimeException("Participant is already registered for this event.");
        }

        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Participant not found with ID: " + participantId));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));

        // Build the registration object from the form data and fetched entities
        EventRegistration newRegistration = EventRegistration.builder()
                .participant(participant)
                .event(event)
                .collegeOrOrganization(event.getOrganizer())
                .participantName(registrationFormData.get("participantName"))
                .registeredEmail(registrationFormData.get("contactEmail")) // Use contactEmail for consistency
                .contactEmail(registrationFormData.get("contactEmail"))
                .phoneNumber(registrationFormData.get("phoneNumber"))
                .yearOrDesignation(registrationFormData.get("yearOrDesignation"))
                .expectation(registrationFormData.get("expectation"))
                .attendanceCode(UUID.randomUUID().toString().substring(0, 6).toUpperCase())
                .isPresent(false)
                .paymentId(paymentId) // Will be null for free events
                .orderId(orderId)     // Will be null for free events
                .build();

        EventRegistration savedRegistration = eventRegistrationRepository.save(newRegistration);
        logger.info("Registration saved with ID: {}", savedRegistration.getId());

        if (event.getEventRegistrations() == null) {
            event.setEventRegistrations(new ArrayList<>());
        }
        event.getEventRegistrations().add(savedRegistration);
        eventRepository.save(event);

        if (participant.getRegisterdEvents() == null) {
            participant.setRegisterdEvents(new ArrayList<>());
        }
        participant.getRegisterdEvents().add(event);
        participantRepository.save(participant);

        try {
            BufferedImage qrImage = QrCodeGenerator.generateQRCodeImage(savedRegistration.getAttendanceCode());
            String emailAddress = savedRegistration.getContactEmail();
            if (emailAddress != null && !emailAddress.trim().isEmpty()) {
                emailService.sendQRWithEventDetails(emailAddress, participant.getName(), event, qrImage);
                logger.info("QR code email sent successfully to {}", emailAddress);
            }
        } catch (WriterException e) {
            logger.error("Registration successful but failed to generate or send QR code email: {}", e.getMessage(), e);
            // Do not throw an error here, the registration itself was successful
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return savedRegistration;
    }
}