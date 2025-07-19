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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
            // Convert event JSON string to Event object
//            ObjectMapper objectMapper = new ObjectMapper();
            System.out.println(eventJson);
            Event event = objectMapper.readValue(eventJson, Event.class);
            System.out.println(event.getRemainingSeats());
            // Find organization
            Optional<Organization> optionalOrg = organizationRepository.findById(id);
            if (optionalOrg.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Organization not found");
            }

            Organization organization = optionalOrg.get();
            event.setOrganizer(organization);

            // Upload image to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(imageFile.getBytes(), Map.of());
            String imageUrl = uploadResult.get("secure_url").toString();
            event.setImageUrl(imageUrl); // assuming you have an `imageUrl` field

            // Save event
            Event savedEvent = eventService.createEvent(event);

            // Update organization
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("🔍 Principal: " + authentication.getPrincipal());
        System.out.println("🔍 Authorities: " + authentication.getAuthorities());

        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found");
        }

        Event event = eventOpt.get();
        List<EventRegistration> registrations = event.getEventRegistrations();

        if (registrations == null || registrations.isEmpty()) {
            // To provide the event details even if there are no participants,
            // we create a map with the event and an empty participant list.
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
            details.put("phone", reg.getPhoneNumber()); // Get phone number from registration
            details.put("location", p.getUniversity());
            details.put("profileImageUrl", p.getProfileImageUrl());
            details.put("isPresent", reg.isPresent()); // Add attendance status
            return details;
        }).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("event", event);
        response.put("participants", participantDetails);
        System.out.println("REsponse"+response);

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

//    @PutMapping("/{id}")
//    public ResponseEntity<Organization> updateOrganization(
//            @PathVariable String id,
//            @RequestBody Organization organizationDetails) {
//        try {
//            Organization updatedOrg = organizationService.updateOrganization(id, organizationDetails);
//            return ResponseEntity.ok(updatedOrg);
//        } catch (RuntimeException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrganization(@PathVariable String id) {
        organizationService.deleteOrganization(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/api/attendance/verify")
    public ResponseEntity<?> verifyAttendanceCode(@RequestBody Map<String, String> request) {
        String code = request.get("attendanceCode");
        Optional<EventRegistration> optionalReg = eventRegistrationRepository.findByAttendanceCode(code);

        if (optionalReg.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid attendance code");
        }

        EventRegistration registration = optionalReg.get();

        Map<String, Object> response = new HashMap<>();
        response.put("participantName", registration.getParticipantName());
        response.put("registeredEmail", registration.getRegisteredEmail());
        response.put("isPresent", registration.isPresent());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/attendance/mark")
    public ResponseEntity<?> markAttendance(@RequestBody Map<String, Object> request) {
        String code = (String) request.get("attendanceCode");
        boolean isPresent = (boolean) request.get("isPresent");

        Optional<EventRegistration> optionalReg = eventRegistrationRepository.findByAttendanceCode(code);
        if (optionalReg.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid attendance code");
        }

        EventRegistration registration = optionalReg.get();
        registration.setPresent(isPresent);
        eventRegistrationRepository.save(registration);

        return ResponseEntity.ok("Attendance status updated");
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