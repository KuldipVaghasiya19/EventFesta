package com.example.Tech.Events.controller;

import com.example.Tech.Events.entity.Event;
import com.example.Tech.Events.entity.EventRegistration;
import com.example.Tech.Events.entity.Organization;
import com.example.Tech.Events.repository.OrganizationRepository;
import com.example.Tech.Events.service.EventRegistrationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8080"})
public class EventRegistrationController {

    private static final Logger logger = LoggerFactory.getLogger(EventRegistrationController.class);

    @Autowired
    private EventRegistrationService eventRegistrationService;

    @Autowired
    private OrganizationRepository organizationRepository;

    /**
     * Handles the registration for FREE events.
     * Paid event registrations are handled by the PaymentController.
     * This now accepts form data as a Map to align with the service layer.
     */
    @PostMapping("/api/participants/{participantId}/events/{eventId}/register")
    public ResponseEntity<?> registerForFreeEvent(
            @PathVariable String participantId,
            @PathVariable String eventId,
            @RequestBody Map<String, String> registrationFormData) { // Correctly accepts a Map
        try {
            logger.info("Received request for free registration for event: {} by participant: {}", eventId, participantId);

            // This call now matches the service method signature, fixing the error.
            EventRegistration savedRegistration = eventRegistrationService.registerParticipantForEvent(
                    participantId,
                    eventId,
                    registrationFormData,
                    null, // No Payment ID for free events
                    null  // No Order ID for free events
            );

            return ResponseEntity.ok(savedRegistration);
        } catch (Exception e) {
            logger.error("Error during free event registration: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }

    /**
     * Provides monthly participation analytics for a given organization.
     */
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

        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            result.add(monthMap.getOrDefault(i, Map.of(
                    "month", MONTHS[i - 1],
                    "participants", 0,
                    "present", 0,
                    "absent", 0
            )));
        }

        return ResponseEntity.ok(result);
    }
}
