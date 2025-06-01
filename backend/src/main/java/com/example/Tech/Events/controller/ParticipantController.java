package com.example.Tech.Events.controller;

import com.example.Tech.Events.entity.Participant;
import com.example.Tech.Events.entity.Event;
import com.example.Tech.Events.service.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participants")
public class ParticipantController {

    private final ParticipantService participantService;

    @Autowired
    public ParticipantController(ParticipantService participantService) {
        this.participantService = participantService;
    }


    // Get participant by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getParticipant(@PathVariable String id) {
        return participantService.getParticipantById(id)
                .map(participant -> {
                    participant.setPassword(null);
                    return ResponseEntity.ok(participant);
                })
                .orElse(ResponseEntity.notFound().build());
    }

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

    // Register for event
    @PostMapping("/{participantId}/events/{eventId}")
    public ResponseEntity<?> registerForEvent(
            @PathVariable String participantId,
            @PathVariable String eventId) {
        try {
            // In a real implementation, you would fetch the Event object first
            Event event = new Event();
            event.setId(eventId);

            Participant participant = participantService.registerForEvent(participantId, event);
            participant.setPassword(null);
            return ResponseEntity.ok(participant);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


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
}