package com.example.Tech.Events.controller;

import com.example.Tech.Events.entity.Event;
import com.example.Tech.Events.entity.EventRegistration;
import com.example.Tech.Events.entity.Participant;
import com.example.Tech.Events.repository.EventRegistrationRepository;
import com.example.Tech.Events.repository.EventRepository;
import com.example.Tech.Events.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

@RestController
public class EventRegistrationController {

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;


    @PostMapping("/api/participants/{participantId}/events/{eventId}/register")
    public ResponseEntity<?> registerForEvent(
            @PathVariable String participantId,
            @PathVariable String eventId,
            @RequestBody EventRegistration registration) {

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

        registration.setParticipant(participant);
        registration.setEvent(event);
        registration.setCollegeOrOrganization(event.getOrganizer());

        String attendanceCode = UUID.randomUUID().toString().substring(0, 8);
        registration.setAttendanceCode(attendanceCode);

        EventRegistration savedRegistration = eventRegistrationRepository.save(registration);

        if (event.getRegisterdParticipants() == null) {
            event.setRegisterdParticipants(new ArrayList<>());
        }
        if (!event.getRegisterdParticipants().contains(participant)) {
            event.getRegisterdParticipants().add(participant);
            eventRepository.save(event);
        }

        if (participant.getRegisterdEvents() == null) {
            participant.setRegisterdEvents(new ArrayList<>());
        }
        if (!participant.getRegisterdEvents().contains(event)) {
            participant.getRegisterdEvents().add(event);
            participantRepository.save(participant);
        }

        return ResponseEntity.ok(savedRegistration);
    }





}
