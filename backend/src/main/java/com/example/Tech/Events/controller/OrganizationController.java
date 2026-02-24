package com.example.Tech.Events.controller;

import com.cloudinary.Cloudinary;
import com.example.Tech.Events.entity.Event;
import com.example.Tech.Events.entity.EventRegistration;
import com.example.Tech.Events.entity.Organization;
import com.example.Tech.Events.entity.Participant;
import com.example.Tech.Events.repository.EventRegistrationRepository;
import com.example.Tech.Events.repository.EventRepository;
import com.example.Tech.Events.repository.OrganizationRepository;
import com.example.Tech.Events.service.EventService;
import com.example.Tech.Events.service.ImageUploadService;
import com.example.Tech.Events.service.OrganizationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8080"})
@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    @Autowired
    private OrganizationService organizationService;

    @Autowired
    private EventService eventService;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ImageUploadService imageUploadService;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;

    @Autowired
    private EventRepository eventRepository;

    @PostMapping(value = "/{id}/create-event", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createEvent(
            @PathVariable String id,
            @RequestPart("event") String eventJson,
            @RequestPart("image") MultipartFile imageFile) {

        try {
            Event event = objectMapper.readValue(eventJson, Event.class);

            Optional<Organization> optionalOrg = organizationRepository.findById(id);
            if (optionalOrg.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Organization not found");
            }

            Organization organization = optionalOrg.get();
            event.setOrganizer(organization);

            Map uploadResult = cloudinary.uploader().upload(imageFile.getBytes(), Map.of());
            String imageUrl = uploadResult.get("secure_url").toString();
            event.setImageUrl(imageUrl);

            Event savedEvent = eventService.createEvent(event);

            if (organization.getOrganizedEvents() == null) {
                organization.setOrganizedEvents(new ArrayList<>());
            }

            if (!organization.getOrganizedEvents().contains(savedEvent)) {
                organization.getOrganizedEvents().add(savedEvent);
                organization.setTotalOrganizedEvents(organization.getTotalOrganizedEvents() + 1);
                organizationRepository.save(organization);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(savedEvent);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error while creating event: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Organization> updateOrganization(
            @PathVariable String id,
            @RequestBody Organization organizationDetails) {
        try {
            Organization updatedOrg = organizationService.updateOrganization(id, organizationDetails);
            return ResponseEntity.ok(updatedOrg);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/events")
    public ResponseEntity<?> getOrganizedEvents(@PathVariable String id) {
        Optional<Organization> optionalOrg = organizationRepository.findById(id);

        if (optionalOrg.isEmpty()) {
            return ResponseEntity.status(404).body("Organization not found");
        }

        Organization organization = optionalOrg.get();

        List<Event> events = organization.getOrganizedEvents();
        if (events == null) {
            events = new ArrayList<>();
        }

        return ResponseEntity.ok(events);
    }


    @GetMapping("/{id}/{eventName}")
    public ResponseEntity<Map<String, Object>> getEventDetailsByOrgIdAndName(
            @PathVariable String id,
            @PathVariable String eventName) {

        Optional<Organization> optionalOrg = organizationRepository.findById(id);
        if (optionalOrg.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Organization organization = optionalOrg.get();

        for (Event event : organization.getOrganizedEvents()) {
            if (event.getTitle().equalsIgnoreCase(eventName)) {
                Map<String, Object> map = new HashMap<>();
                map.put("name", event.getTitle());
                map.put("description", event.getDescription());
                map.put("MaxParticipants", event.getMaxParticipants());
                map.put("currentParticipants", event.getCurrentParticipants());
                map.put("speakers", event.getSpeakers());
                map.put("judges", event.getJudges());
                map.put("price", event.getPrizes());
                map.put("lastDateToRegister", event.getLastRegistertDate());
                map.put("dateAndTime", event.getEventDate());
                map.put("location", event.getLocation());

                return ResponseEntity.ok(map);
            }
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/events/{eventId}/participants")
    public ResponseEntity<?> getParticipantsByEventId(@PathVariable String eventId) {

    //  Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found");
        }

        Event event = eventOpt.get();
        List<EventRegistration> registrations = event.getEventRegistrations();

        if (registrations == null || registrations.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("event", event);
            response.put("participants", Collections.emptyList());
            return ResponseEntity.ok(response);
        }
        System.out.println("registration : %s{}".formatted(registrations));

        List<Map<String, Object>> participantDetails = registrations.stream().map(reg -> {
            Participant p = reg.getParticipant();
            Map<String, Object> details = new HashMap<>();

            details.put("id", p.getId());
            details.put("name", p.getName());
            details.put("email", p.getEmail());
            details.put("phone", reg.getPhoneNumber());
            details.put("location", p.getUniversity());
            details.put("profileImageUrl", p.getProfileImageUrl());
            details.put("isPresent", reg.isPresent());
            return details;
        }).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("event", event);
        response.put("participants", participantDetails);
        System.out.println("REsponse" + response);

        return ResponseEntity.ok(response);
    }


    @PostMapping
    public Organization createOrganization(@RequestBody Organization organization) throws Exception {
        return organizationService.createOrganization(organization);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Organization> getOrganizationById(@PathVariable String id) {
        Optional<Organization> organization = organizationService.getOrganizationById(id);
        return organization.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Organization> getAllOrganizations() {
        return organizationService.getAllOrganizations();
    }

    @GetMapping("/search")
    public List<Organization> searchOrganizations(@RequestParam String name) {
        return organizationService.searchOrganizationsByName(name);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrganization(@PathVariable String id) {
        organizationService.deleteOrganization(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/attendance/verify")
    public ResponseEntity<?> verifyAttendanceCode(@RequestBody Map<String, String> request) {
        String code = request.get("attendanceCode");

        // 1. Validate Input
        if (code == null || code.trim().isEmpty()) {
            // FIX: Return JSON error so frontend doesn't crash
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Attendance code is required"));
        }

        // 2. Lookup Registration
        Optional<EventRegistration> optionalReg = eventRegistrationRepository.findByAttendanceCode(code);

        // 3. Handle Invalid Code
        if (optionalReg.isEmpty()) {
            // FIX: Return JSON error instead of plain string
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Invalid attendance code"));
        }

        // 4. Success Logic
        EventRegistration registration = optionalReg.get();

        Map<String, Object> response = new HashMap<>();
        response.put("registeredEmail", registration.getRegisteredEmail());
        response.put("participantName", registration.getParticipantName());
        response.put("isPresent", registration.isPresent());

        // Extra details for validation on frontend
        if (registration.getEvent() != null) {
            response.put("eventName", registration.getEvent().getTitle());
            response.put("eventId", registration.getEvent().getId());
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/attendance/mark")
    public ResponseEntity<?> markAttendance(@RequestBody Map<String, Object> request) {
        String code = (String) request.get("attendanceCode");
        Boolean isPresent = (Boolean) request.get("isPresent"); // Supports true or false

        if (code == null || isPresent == null) {
            return ResponseEntity.badRequest().body("Attendance Code and status (isPresent) are required");
        }

        Optional<EventRegistration> optionalReg = eventRegistrationRepository.findByAttendanceCode(code);

        if (optionalReg.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid attendance code");
        }

        EventRegistration registration = optionalReg.get();

        // Update the status
        registration.setPresent(isPresent);

        // Save to database
        eventRegistrationRepository.save(registration);

        return ResponseEntity.ok(Map.of(
                "message", "Attendance marked successfully",
                "participantName", registration.getParticipantName(),
                "newStatus", isPresent ? "Present" : "Absent"
        ));
    }

    @GetMapping("/api/events/{eventId}/attendance-summary")
    public ResponseEntity<?> getEventAttendanceSummary(@PathVariable String eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found");
        }

        List<EventRegistration> registrations = eventRegistrationRepository.findByEventId(eventId);

        Map<String, Object> summary = new HashMap<>();
        List<Map<String, Object>> presentList = new ArrayList<>();
        List<Map<String, Object>> absentList = new ArrayList<>();

        for (EventRegistration reg : registrations) {
            Map<String, Object> participantData = new HashMap<>();
            participantData.put("participantName", reg.getParticipantName());
            participantData.put("registeredEmail", reg.getRegisteredEmail());
            participantData.put("phoneNumber", reg.getPhoneNumber());
            participantData.put("yearOrDesignation", reg.getYearOrDesignation());

            if (reg.isPresent()) {
                presentList.add(participantData);
            } else {
                absentList.add(participantData);
            }
        }

        summary.put("totalRegistrations", registrations.size());
        summary.put("presentCount", presentList.size());
        summary.put("absentCount", absentList.size());
        summary.put("presentParticipants", presentList);
        summary.put("absentParticipants", absentList);

        return ResponseEntity.ok(summary);
    }
}