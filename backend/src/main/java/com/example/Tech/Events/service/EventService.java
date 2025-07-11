package com.example.Tech.Events.service;

import com.example.Tech.Events.entity.Event;
import com.example.Tech.Events.entity.Participant;
import com.example.Tech.Events.repository.EventRepository;
import com.example.Tech.Events.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class EventService {

    private final EventRepository eventRepository;
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

        Set<String> eventTagSet = new HashSet<>(eventTags);

        List<Participant> allParticipants = participantRepository.findAll();

        for (Participant participant : allParticipants) {
            List<String> participantTags = participant.getInterest();
            if (participantTags == null || participantTags.isEmpty()) continue;

            Set<String> participantTagSet = new HashSet<>(participantTags);
            participantTagSet.retainAll(eventTagSet);

            System.out.println("common Tags: " + participantTagSet);

            System.out.println("Saved Event Tags: " + savedEvent.getTags());
            if (!participantTagSet.isEmpty()) {
                emailService.sendTagMatchEmail(
                        participant.getEmail(),
                        participant.getName(),
                        event
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

//    public void deleteEvent(String id) throws IOException {
//        Event event = eventRepository.findById(id).orElse(null);
//        if (event != null && event.getImagePublicId() != null) {
//            imageu.deleteImage(event.getImagePublicId());
//        }
//        eventRepository.deleteById(id);
//    }

    public boolean registerParticipant(String eventId, Participant participant) {
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event != null && event.getCurrentParticipants() < event.getMaxParticipants()) {
            event.getRegisterdParticipants().add(participant);
            event.setCurrentParticipants(event.getCurrentParticipants() + 1);
            eventRepository.save(event);
            return true;
        }
        return false;
    }
}