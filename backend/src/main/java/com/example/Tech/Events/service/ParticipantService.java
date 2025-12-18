package com.example.Tech.Events.service;

import com.example.Tech.Events.entity.Participant;
import com.example.Tech.Events.entity.Event;
import com.example.Tech.Events.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ParticipantService {

    private final ParticipantRepository participantRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    public ParticipantService(ParticipantRepository participantRepository,
                              BCryptPasswordEncoder passwordEncoder) {
        this.participantRepository = participantRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Participant createParticipant(Participant participant) throws Exception {
        // The password is now encoded in the controller, so we don't need to encode it again here.
        participant.setTotaleventsRegisterd(0);
        participant.setCurrentlyStudyingOrNot(true);

        Participant savedParticipant = participantRepository.save(participant);
        emailService.sendRegistrationEmail(savedParticipant.getEmail(), savedParticipant.getName());

        return savedParticipant;
    }

    public Optional<Participant> getParticipantById(String id) {
        return participantRepository.findById(id);
    }

    public Optional<Participant> getParticipantByEmail(String email) {
        return participantRepository.findByEmail(email);
    }

    public List<Participant> getAllParticipants() {
        return participantRepository.findAll();
    }

    public Participant updateParticipant(String id, Participant participantDetails) {
        return participantRepository.findById(id)
                .map(participant -> {
                    if (participantDetails.getName() != null) {
                        participant.setName(participantDetails.getName());
                    }
                    if (participantDetails.getUniversity() != null) {
                        participant.setUniversity(participantDetails.getUniversity());
                    }
                    if (participantDetails.getCourse() != null) {
                        participant.setCourse(participantDetails.getCourse());
                    }
                    participant.setCurrentlyStudyingOrNot(participantDetails.isCurrentlyStudyingOrNot());
                    return participantRepository.save(participant);
                })
                .orElseThrow(() -> new RuntimeException("Participant not found with id: " + id));
    }

    public void deleteParticipant(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Participant ID cannot be null or empty");
        }

        if (!participantRepository.existsById(id)) {
            throw new RuntimeException("Participant not found with ID: " + id);
        }

        participantRepository.deleteById(id);
    }

    public List<Event> getRegisteredEvents(String id) {
        return participantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Participant not found"))
                .getRegisterdEvents();
    }

    public Participant changePassword(String id, String newPassword) {
        Participant participant = participantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Participant not found"));

        participant.setPassword(passwordEncoder.encode(newPassword));
        return participantRepository.save(participant);
    }

    public List<String> getParticipantInterests(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Participant ID cannot be null or empty");
        }

        Optional<Participant> participantOpt = participantRepository.findById(id);

        if (!participantOpt.isPresent()) {
            throw new RuntimeException("Participant not found with ID: " + id);
        }

        Participant participant = participantOpt.get();
        return participant.getInterest() != null ? participant.getInterest() : List.of();
    }

    public Participant updateParticipantInterests(String id, List<String> tags) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Participant ID cannot be null or empty");
        }

        if (tags == null) {
            throw new IllegalArgumentException("Tags list cannot be null");
        }

        Optional<Participant> participantOpt = participantRepository.findById(id);

        if (!participantOpt.isPresent()) {
            throw new RuntimeException("Participant not found with ID: " + id);
        }

        Participant participant = participantOpt.get();

        List<String> cleanedTags = tags.stream()
                .filter(tag -> tag != null && !tag.trim().isEmpty())
                .map(String::trim)
                .distinct()
                .collect(Collectors.toList());

        if (cleanedTags.size() > 50) {
            throw new RuntimeException("Maximum 50 interests allowed");
        }

        for (String tag : cleanedTags) {
            if (tag.length() > 50) {
                throw new RuntimeException("Interest '" + tag + "' is too long. Maximum 50 characters allowed.");
            }
        }

        participant.setInterest(cleanedTags);
        return participantRepository.save(participant);
    }

    public Participant addParticipantInterest(String id, String interest) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Participant ID cannot be null or empty");
        }

        if (interest == null || interest.trim().isEmpty()) {
            throw new IllegalArgumentException("Interest cannot be null or empty");
        }

        Optional<Participant> participantOpt = participantRepository.findById(id);

        if (!participantOpt.isPresent()) {
            throw new RuntimeException("Participant not found with ID: " + id);
        }

        Participant participant = participantOpt.get();
        String cleanedInterest = interest.trim();

        if (cleanedInterest.length() > 50) {
            throw new RuntimeException("Interest is too long. Maximum 50 characters allowed.");
        }

        if (participant.getInterest() == null) {
            participant.setInterest(new java.util.ArrayList<>());
        }

        boolean alreadyExists = participant.getInterest().stream()
                .anyMatch(tag -> tag.equalsIgnoreCase(cleanedInterest));

        if (alreadyExists) {
            throw new RuntimeException("Interest '" + cleanedInterest + "' already exists");
        }

        if (participant.getInterest().size() >= 50) {
            throw new RuntimeException("Maximum 50 interests allowed");
        }

        participant.getInterest().add(cleanedInterest);
        return participantRepository.save(participant);
    }

    public Participant removeParticipantInterest(String id, String interest) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Participant ID cannot be null or empty");
        }

        if (interest == null || interest.trim().isEmpty()) {
            throw new IllegalArgumentException("Interest cannot be null or empty");
        }

        Optional<Participant> participantOpt = participantRepository.findById(id);

        if (!participantOpt.isPresent()) {
            throw new RuntimeException("Participant not found with ID: " + id);
        }

        Participant participant = participantOpt.get();
        String cleanedInterest = interest.trim();

        if (participant.getInterest() == null) {
            participant.setInterest(new java.util.ArrayList<>());
        }

        boolean removed = participant.getInterest().remove(cleanedInterest);

        if (!removed) {
            throw new RuntimeException("Interest '" + cleanedInterest + "' not found");
        }

        return participantRepository.save(participant);
    }

    public Participant getParticipantByIdRequired(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Participant ID cannot be null or empty");
        }

        Optional<Participant> participantOpt = participantRepository.findById(id);

        if (!participantOpt.isPresent()) {
            throw new RuntimeException("Participant not found with ID: " + id);
        }

        return participantOpt.get();
    }

    public Participant getParticipantByEmailRequired(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }

        Optional<Participant> participantOpt = participantRepository.findByEmail(email);

        if (!participantOpt.isPresent()) {
            throw new RuntimeException("Participant not found with email: " + email);
        }

        return participantOpt.get();
    }

    public Participant updateParticipant(Participant participant) {
        if (participant == null) {
            throw new IllegalArgumentException("Participant cannot be null");
        }

        if (participant.getId() == null || participant.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("Participant ID cannot be null or empty");
        }

        Optional<Participant> existingParticipantOpt = participantRepository.findById(participant.getId());

        if (!existingParticipantOpt.isPresent()) {
            throw new RuntimeException("Participant not found with ID: " + participant.getId());
        }

        return participantRepository.save(participant);
    }

    public boolean participantExists(String id) {
        if (id == null || id.trim().isEmpty()) {
            return false;
        }

        return participantRepository.existsById(id);
    }
}