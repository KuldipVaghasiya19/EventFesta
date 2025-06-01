package com.example.Tech.Events.controller;

import com.cloudinary.Cloudinary;
import com.example.Tech.Events.entity.Event;
import com.example.Tech.Events.entity.Organization;
import com.example.Tech.Events.entity.Participant;
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

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
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

    @PostMapping(value = "/{id}/create-event", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createEvent(
            @PathVariable String id,
            @RequestPart("event") String eventJson,
            @RequestPart("image") MultipartFile imageFile) {

        try {
            // Convert event JSON string to Event object
//            ObjectMapper objectMapper = new ObjectMapper();
            Event event = objectMapper.readValue(eventJson, Event.class);

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

    @GetMapping("/event/participants")
    public ResponseEntity<?> getParticipantsByEventTitle(@RequestParam String title) {
        try {
            Event event = eventService.findByTitle(title);
            List<Participant> participants = event.getRegisterdParticipants();

            List<Map<String, Object>> result = participants.stream().map(p -> {
                Map<String, Object> map = new HashMap<>();
                map.put("name", p.getName());
                map.put("email", p.getEmail());
                return map;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(result);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }


    @PostMapping
    public Organization createOrganization(@RequestBody Organization organization) {
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
}