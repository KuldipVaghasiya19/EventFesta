package com.example.Tech.Events.controller;

import com.example.Tech.Events.entity.Participant;
import com.example.Tech.Events.entity.Event;
import com.example.Tech.Events.service.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/participants")
public class ParticipantController {

    @Autowired
    private ParticipantService participantService;

    @Autowired
    public ParticipantController(ParticipantService participantService) {
        this.participantService = participantService;
    }


//    // Get participant by ID
//    @GetMapping("/{id}")
//    public ResponseEntity<?> getParticipant(@PathVariable String id) {
//        return participantService.getParticipantById(id)
//                .map(participant -> {
//                    participant.setPassword(null);
//                    return ResponseEntity.ok(participant);
//                })
//                .orElse(ResponseEntity.notFound().build());
//    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateParticipant(
            @PathVariable String id,
            @RequestBody Participant participantDetails) {
        try {
            Participant updatedParticipant = participantService.updateParticipant(id, participantDetails);
            updatedParticipant.setPassword(null);
            return ResponseEntity.ok(updatedParticipant);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete participant
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteParticipant(@PathVariable String id) {
        try {
            participantService.deleteParticipant(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

//    // Register for event
//    @PostMapping("/{participantId}/events/{eventId}")
//    public ResponseEntity<?> registerForEvent(
//            @PathVariable String participantId,
//            @PathVariable String eventId) {
//        try {
//            // In a real implementation, you would fetch the Event object first
//            Event event = new Event();
//            event.setId(eventId);
//
//            Participant participant = participantService.registerForEvent(participantId, event);
//            participant.setPassword(null);
//            return ResponseEntity.ok(participant);
//        } catch (RuntimeException e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }


    // Get all registered events
    @GetMapping("/{participantId}/events")
    public ResponseEntity<?> getRegisteredEvents(@PathVariable String participantId) {
        try {
            List<Event> events = participantService.getRegisteredEvents(participantId);
            return ResponseEntity.ok(events);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Change password
    @PatchMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable String id,
            @RequestBody String newPassword) {
        try {
            Participant participant = participantService.changePassword(id, newPassword);
            participant.setPassword(null);
            return ResponseEntity.ok(participant);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get participant interests
    @GetMapping("/{participantId}/interests")
    public ResponseEntity<?> getParticipantInterests(@PathVariable String participantId) {
        try {
            // Validate participant ID
            if (participantId == null || participantId.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid participant ID");
                errorResponse.put("message", "Participant ID cannot be null or empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            List<String> interests = participantService.getParticipantInterests(participantId);

            // Check if participant exists (service returns null when participant not found)
            if (interests == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Participant not found");
                errorResponse.put("message", "No participant found with ID: " + participantId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }

            return ResponseEntity.ok(interests);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Internal server error");
            errorResponse.put("message", "Failed to retrieve interests");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Update participant interests (replace all)
    @PutMapping("/{participantId}/interests")
    public ResponseEntity<Map<String, Object>> updateParticipantInterests(
            @PathVariable String participantId,
            @RequestBody Map<String, Object> requestBody) {
        try {
            // Validate participant ID
            if (participantId == null || participantId.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid participant ID");
                errorResponse.put("message", "Participant ID cannot be null or empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            // Extract tags from request body with proper type checking
            List<String> tags = new ArrayList<>();
            Object tagsObj = requestBody.get("tags");

            if (tagsObj instanceof List) {
                List<?> rawTags = (List<?>) tagsObj;
                for (Object tag : rawTags) {
                    if (tag instanceof String) {
                        String tagStr = ((String) tag).trim();
                        if (!tagStr.isEmpty()) {
                            tags.add(tagStr);
                        }
                    }
                }
            } else if (tagsObj == null) {
                tags = new ArrayList<>(); // Empty list for null tags
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid request format");
                errorResponse.put("message", "Tags must be provided as an array");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            Participant updatedParticipant = participantService.updateParticipantInterests(participantId, tags);

            // Check if participant exists (service returns null when participant not found)
            if (updatedParticipant == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Participant not found");
                errorResponse.put("message", "No participant found with ID: " + participantId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Interests updated successfully");
            response.put("tags", updatedParticipant.getInterest() != null ? updatedParticipant.getInterest() : new ArrayList<>());
            response.put("participantId", participantId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to update interests");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Add single interest
    @PostMapping("/{participantId}/interests")
    public ResponseEntity<Map<String, Object>> addParticipantInterest(
            @PathVariable String participantId,
            @RequestBody Map<String, Object> requestBody) {
        try {
            // Validate participant ID
            if (participantId == null || participantId.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid participant ID");
                errorResponse.put("message", "Participant ID cannot be null or empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            // Extract and validate interest
            Object interestObj = requestBody.get("interest");
            if (interestObj == null || !(interestObj instanceof String)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid request format");
                errorResponse.put("message", "Interest must be provided as a string");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            String interest = ((String) interestObj).trim();
            if (interest.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid interest");
                errorResponse.put("message", "Interest cannot be empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            Participant updatedParticipant = participantService.addParticipantInterest(participantId, interest);

            // Check if participant exists (service returns null when participant not found)
            if (updatedParticipant == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Participant not found");
                errorResponse.put("message", "No participant found with ID: " + participantId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Interest added successfully");
            response.put("tags", updatedParticipant.getInterest() != null ? updatedParticipant.getInterest() : new ArrayList<>());
            response.put("addedInterest", interest);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to add interest");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Remove single interest
    @DeleteMapping("/{participantId}/interests/{interest}")
    public ResponseEntity<Map<String, Object>> removeParticipantInterest(
            @PathVariable String participantId,
            @PathVariable String interest) {
        try {
            // Validate participant ID
            if (participantId == null || participantId.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid participant ID");
                errorResponse.put("message", "Participant ID cannot be null or empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            // Validate interest
            if (interest == null || interest.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid interest");
                errorResponse.put("message", "Interest cannot be null or empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            // URL decode the interest parameter
            String decodedInterest = URLDecoder.decode(interest, "UTF-8");

            Participant updatedParticipant = participantService.removeParticipantInterest(participantId, decodedInterest);

            // Check if participant exists (service returns null when participant not found)
            if (updatedParticipant == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Participant not found");
                errorResponse.put("message", "No participant found with ID: " + participantId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Interest removed successfully");
            response.put("tags", updatedParticipant.getInterest() != null ? updatedParticipant.getInterest() : new ArrayList<>());
            response.put("removedInterest", decodedInterest);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to remove interest");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}