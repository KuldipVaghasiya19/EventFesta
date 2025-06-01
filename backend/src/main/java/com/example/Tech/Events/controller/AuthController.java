package com.example.Tech.Events.controller;

import com.example.Tech.Events.entity.Organization;
import com.example.Tech.Events.entity.Participant;
import com.example.Tech.Events.service.OrganizationService;
import com.example.Tech.Events.service.ParticipantService;
import jakarta.websocket.server.ServerEndpoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final OrganizationService organizationService;
    private final ParticipantService participantService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(OrganizationService organizationService,
                          ParticipantService participantService,
                          BCryptPasswordEncoder passwordEncoder) {
        this.organizationService = organizationService;
        this.participantService = participantService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register/organization")
    public ResponseEntity<?> registerOrganization(@RequestBody Organization organization) {
        if (organizationService.findByEmail(organization.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        String rawPassword = organization.getPassword();
        if (!rawPassword.startsWith("$2a$")) {
            organization.setPassword(rawPassword);
        }

        Organization savedOrg = organizationService.createOrganization(organization);
        savedOrg.setPassword(null);

        System.out.println(savedOrg);
        return ResponseEntity.ok(savedOrg);
    }

    @PostMapping("/login/organization")
    public ResponseEntity<?> loginOrganization(@RequestBody Organization loginRequest) {
        Optional<Organization> orgOptional = organizationService.findByEmail(loginRequest.getEmail());
        if (orgOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Organization not found");
        }

        Organization org = orgOptional.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), org.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        org.setPassword(null);
        return ResponseEntity.ok(org);
    }


    @PostMapping("/register/participant")
    public ResponseEntity<?> registerParticipant(@RequestBody Participant participant) {
        if (participantService.getParticipantByEmail(participant.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        String rawPassword = participant.getPassword();
        if (!rawPassword.startsWith("$2a$")) {
            participant.setPassword(rawPassword);
        }

        Participant savedParticipant = participantService.createParticipant(participant);
        savedParticipant.setPassword(null);
        return ResponseEntity.ok(savedParticipant);
    }

    @PostMapping("/login/participant")
    public ResponseEntity<?> loginParticipant(@RequestBody Participant loginRequest) {
        Optional<Participant> participantOpt = participantService.getParticipantByEmail(loginRequest.getEmail());
        if (participantOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Participant not found");
        }

        Participant participant = participantOpt.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), participant.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        participant.setPassword(null);
        return ResponseEntity.ok(participant);
    }
}
