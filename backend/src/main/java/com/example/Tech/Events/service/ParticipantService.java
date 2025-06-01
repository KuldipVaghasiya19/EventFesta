package com.example.Tech.Events.service;

import com.example.Tech.Events.entity.Participant;
import com.example.Tech.Events.entity.Event;
import com.example.Tech.Events.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ParticipantService {

    @Autowired
    private final ParticipantRepository participantRepository;

    @Autowired
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    public ParticipantService(ParticipantRepository participantRepository,
                              BCryptPasswordEncoder passwordEncoder) {
        this.participantRepository = participantRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Participant createParticipant(Participant participant) {

        String hashedPassword = passwordEncoder.encode(participant.getPassword());
        participant.setPassword(hashedPassword);
        participant.setTotaleventsRegisterd(0);
        participant.setCurrentlyStudyingOrNot(true);

        Participant savedParticipant = participantRepository.save(participant);

        emailService.sendRegistrationEmail(savedParticipant.getEmail(), savedParticipant.getName());


        return savedParticipant;
    }

    // Get participant by ID
    public Optional<Participant> getParticipantById(String id) {
        return participantRepository.findById(id);
    }

    // Get participant by email
    public Optional<Participant> getParticipantByEmail(String email) {
        return participantRepository.findByEmail(email);
    }

    // Get all participants
    public List<Participant> getAllParticipants() {
        return participantRepository.findAll();
    }

    // Update participant details
    public Participant updateParticipant(String id, Participant participantDetails) {
        return participantRepository.findById(id)
                .map(participant -> {
                    participant.setName(participantDetails.getName());
                    participant.setUniversity(participantDetails.getUniversity());
                    participant.setCourse(participantDetails.getCourse());
                    participant.setImgUrl(participantDetails.getImgUrl());
                    participant.setCurrentlyStudyingOrNot(participantDetails.isCurrentlyStudyingOrNot());
                    return participantRepository.save(participant);
                })
                .orElseThrow(() -> new RuntimeException("Participant not found with id: " + id));
    }

    // Delete participant
    public void deleteParticipant(String id) {
        participantRepository.deleteById(id);
    }

    // Register for an event
    public Participant registerForEvent(String participantId, Event event) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Participant not found"));

        if (!participant.getRegisterdEvents().contains(event)) {
            participant.getRegisterdEvents().add(event);
            participant.setTotaleventsRegisterd(participant.getRegisterdEvents().size()+1);
        }

        return participantRepository.save(participant);
    }

    // Get all events registered by participant
    public List<Event> getRegisteredEvents(String participantId) {
        return participantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Participant not found"))
                .getRegisterdEvents();
    }

    // Change password
    public Participant changePassword(String participantId, String newPassword) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Participant not found"));

        participant.setPassword(passwordEncoder.encode(newPassword));
        return participantRepository.save(participant);
    }
}