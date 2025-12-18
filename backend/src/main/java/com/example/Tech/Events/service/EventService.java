package com.example.Tech.Events.service;

import com.example.Tech.Events.entity.Event;
import com.example.Tech.Events.entity.EventRegistration;
import com.example.Tech.Events.entity.Participant;
import com.example.Tech.Events.repository.EventRepository;
import com.example.Tech.Events.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private final EventRepository eventRepository;

    @Autowired
    private final ImageUploadService cloudinaryService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    public EventService(EventRepository eventRepository, ImageUploadService cloudinaryService) {
        this.eventRepository = eventRepository;
        this.cloudinaryService = cloudinaryService;
    }


    public Event createEvent(Event event) throws Exception {
        Event savedEvent = eventRepository.save(event);

        System.out.println("Saved Event Tags: " + savedEvent.getTags());
        List<String> eventTags = event.getTags();
        if (eventTags == null || eventTags.isEmpty()) return savedEvent;

        // Convert event tags to a lowercase set for case-insensitive comparison
        Set<String> lowerCaseEventTagSet = eventTags.stream()
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        List<Participant> allParticipants = participantRepository.findAll();

        for (Participant participant : allParticipants) {
            List<String> participantTags = participant.getInterest();
            if (participantTags == null || participantTags.isEmpty()) continue;

            // Find the original participant tags that have a case-insensitive match
            Set<String> matchedTags = participantTags.stream()
                    .filter(tag -> lowerCaseEventTagSet.contains(tag.toLowerCase()))
                    .collect(Collectors.toSet());


            System.out.println("Matched Tags for " + participant.getName() + ": " + matchedTags);
            System.out.println("Saved Event Tags: " + savedEvent.getTags());

            if (!matchedTags.isEmpty()) {
                emailService.sendTagMatchEmail(
                        participant.getEmail(),
                        participant.getName(),
                        event,
                        matchedTags
                );
            }
        }

        return savedEvent;
    }

    public Event findByTitle(String title) {
        return eventRepository.findByTitle(title);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(String id) {
        return eventRepository.findById(id).orElse(null);
    }


    public boolean registerParticipant(String eventId, EventRegistration registration) {
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event != null && event.getCurrentParticipants() < event.getMaxParticipants()) {
            if (event.getEventRegistrations() == null) {
                event.setEventRegistrations(new java.util.ArrayList<>());
            }
            event.getEventRegistrations().add(registration);
            event.setCurrentParticipants(event.getCurrentParticipants() + 1);
            eventRepository.save(event);
            return true;
        }
        return false;
    }
}