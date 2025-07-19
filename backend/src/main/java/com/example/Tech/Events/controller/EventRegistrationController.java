// --- EventRegistrationController.java ---
package com.example.Tech.Events.controller;

import com.example.Tech.Events.entity.Event;
import com.example.Tech.Events.entity.EventRegistration;
import com.example.Tech.Events.entity.Organization;
import com.example.Tech.Events.entity.Participant;
import com.example.Tech.Events.repository.EventRegistrationRepository;
import com.example.Tech.Events.repository.EventRepository;
import com.example.Tech.Events.repository.OrganizationRepository;
import com.example.Tech.Events.repository.ParticipantRepository;
import com.example.Tech.Events.service.EmailService;
import com.example.Tech.Events.service.EventRegistrationService;
import com.example.Tech.Events.util.QrCodeGenerator;
import com.google.zxing.WriterException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.awt.image.BufferedImage;
import java.time.LocalDateTime;
import java.util.*;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8080"})
public class EventRegistrationController {

    private static final Logger logger = LoggerFactory.getLogger(EventRegistrationController.class);

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private EventRepository eventRepository;



    @Autowired
    private EmailService emailService;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;


    @PostMapping("/api/participants/{participantId}/events/{eventId}/register")
    public ResponseEntity<?> registerForEvent(
            @PathVariable String participantId,
            @PathVariable String eventId,
            @RequestBody EventRegistration registration) {

        try {
            Optional<Participant> participantOpt = participantRepository.findById(participantId);
            if (participantOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Participant not found");
            }

            Optional<Event> eventOpt = eventRepository.findById(eventId);
            if (eventOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found");
            }

            Participant participant = participantOpt.get();
            Event event = eventOpt.get();

            // Set references for registration
            registration.setParticipant(participant);
            registration.setEvent(event);
            registration.setCollegeOrOrganization(event.getOrganizer());

            String attendanceCode = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            registration.setAttendanceCode(attendanceCode);
            registration.setPresent(false);

            EventRegistration savedRegistration = eventRegistrationRepository.save(registration);
            logger.info("Registration saved successfully with ID: {}", savedRegistration.getId());

            // Add participant to event
            if (event.getEventRegistrations() == null) {
                event.setEventRegistrations(new ArrayList<>());
            }
            if (!event.getEventRegistrations().contains(registration)) {
                event.getEventRegistrations().add(registration);
                eventRepository.save(event);
                logger.info("Participant '{}' added to event '{}'", participant.getName(), event.getTitle());
            }

            // Add event to participant
            if (participant.getRegisterdEvents() == null) {
                participant.setRegisterdEvents(new ArrayList<>());
            }
            if (!participant.getRegisterdEvents().contains(event)) {
                participant.getRegisterdEvents().add(event);
                participantRepository.save(participant);
                logger.info("Event '{}' added to participant '{}'", event.getTitle(), participant.getName());
            }

            // Send QR Code Email
            try {
                logger.info("Generating QR code for attendance code: {}", attendanceCode);
                BufferedImage qrImage = QrCodeGenerator.generateQRCodeImage(attendanceCode);
                logger.info("QR code generated successfully");

                String emailAddress = registration.getRegisteredEmail();
                if (emailAddress == null || emailAddress.trim().isEmpty()) {
                    logger.warn("No email address provided for registration");
                    return ResponseEntity.ok(savedRegistration);
                }

                logger.info("Sending QR code email to: {}", emailAddress);
                emailService.sendQRWithEventDetails(
                        emailAddress,
                        participant.getName(),
                        event,
                        qrImage
                );
                logger.info("QR code email sent successfully");

            } catch (WriterException e) {
                logger.error("Failed to generate QR code: {}", e.getMessage(), e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Registration successful but failed to generate QR code: " + e.getMessage());

            } catch (Exception e) {
                logger.error("Failed to send QR code email: {}", e.getMessage(), e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Registration successful but failed to send QR code email: " + e.getMessage());
            }

            return ResponseEntity.ok(savedRegistration);

        } catch (Exception e) {
            logger.error("Unexpected error during registration: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }


    @GetMapping("/{orgId}/analytics/monthly-participants")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyAnalyticsForOrganization(@PathVariable String orgId) {
        Optional<Organization> optionalOrg = organizationRepository.findById(orgId);
        if (optionalOrg.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }

        Organization organization = optionalOrg.get();
        List<Event> events = organization.getOrganizedEvents();

        if (events == null || events.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        String[] MONTHS = {"Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};

        Map<Integer, Map<String, Object>> monthMap = new HashMap<>();

        for (Event event : events) {
            List<EventRegistration> registrations = event.getEventRegistrations();
            if (registrations != null) {
                for (EventRegistration reg : registrations) {
                    LocalDateTime regDate = reg.getRegistrationTime();
                    int month = regDate.getMonthValue(); // 1 to 12

                    Map<String, Object> monthData = monthMap.getOrDefault(month, new HashMap<>());
                    monthData.put("month", MONTHS[month - 1]);

                    int participants = (int) monthData.getOrDefault("participants", 0);
                    int present = (int) monthData.getOrDefault("present", 0);
                    int absent = (int) monthData.getOrDefault("absent", 0);

                    monthData.put("participants", participants + 1);
                    if (reg.isPresent()) {
                        monthData.put("present", present + 1);
                    } else {
                        monthData.put("absent", absent + 1);
                    }

                    monthMap.put(month, monthData);
                }
            }
        }

        // Ensure all 12 months are present in the final result
        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            result.add(monthMap.getOrDefault(i, Map.of(
                    "month", MONTHS[i - 1],
                    "participants", 0,
                    "present", 0,
                    "absent", 0
            )));
        }

        System.out.println(result);
        return ResponseEntity.ok(result);
    }



}