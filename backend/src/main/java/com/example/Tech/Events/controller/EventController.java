package com.example.Tech.Events.controller;

import com.example.Tech.Events.entity.Event;
import com.example.Tech.Events.entity.Participant;
import com.example.Tech.Events.repository.EventRepository;
import com.example.Tech.Events.repository.ParticipantRepository;
import com.example.Tech.Events.service.EmailService;
import com.example.Tech.Events.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    EventService eventService;

    @Autowired
    EventRepository eventRepository;

    @Autowired
    ParticipantRepository participantRepository;

    @Autowired
    EmailService emailService;


    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventService.createEvent(event);
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable String id) {
        Event event = eventService.getEventById(id);
        return event != null ? ResponseEntity.ok(event) : ResponseEntity.notFound().build();
    }

//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteEvent(@PathVariable String id) throws IOException {
//        eventService.deleteEvent(id);
//        return ResponseEntity.noContent().build();
//    }

    @PostMapping("/{eventId}/register")
    public ResponseEntity<String> registerParticipant(
            @PathVariable String eventId,
            @RequestBody Participant participant
    ) {
        boolean success = eventService.registerParticipant(eventId, participant);
        return success ?
                ResponseEntity.ok("Registration successful") :
                ResponseEntity.badRequest().body("Event is full");
    }
}