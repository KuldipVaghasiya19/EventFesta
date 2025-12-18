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

        if (eventRegistrationRepository.existsByParticipantIdAndEventId(participantId, eventId)) {
            throw new RuntimeException("Participant is already registered for this event.");
        }

        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Participant not found with ID: " + participantId));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));

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
                .paymentId(paymentId)
                .orderId(orderId)
                .build();

        EventRegistration savedRegistration = eventRegistrationRepository.save(newRegistration);

        if (event.getEventRegistrations() == null) {
            event.setEventRegistrations(new ArrayList<>());
        }
        event.getEventRegistrations().add(savedRegistration);
        event.setCurrentParticipants(event.getCurrentParticipants()+1);
        eventRepository.save(event);

        if (participant.getRegisterdEvents() == null) {
            participant.setRegisterdEvents(new ArrayList<>());
        }
        participant.getRegisterdEvents().add(event);
        participantRepository.save(participant);
        System.out.println(event.getCurrentParticipants());

        System.out.println(event.getCurrentParticipants());

        try {
            BufferedImage qrImage = QrCodeGenerator.generateQRCodeImage(savedRegistration.getAttendanceCode());
            String emailAddress = savedRegistration.getContactEmail();
            if (emailAddress != null && !emailAddress.trim().isEmpty()) {
                emailService.sendQRWithEventDetails(emailAddress, participant.getName(), event, qrImage);
                logger.info("QR code email sent successfully to {}", emailAddress);
            }
        } catch (WriterException e) {
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return savedRegistration;
    }
}