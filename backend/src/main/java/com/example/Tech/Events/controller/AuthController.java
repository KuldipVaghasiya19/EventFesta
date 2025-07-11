package com.example.Tech.Events.controller;

import com.example.Tech.Events.entity.Organization;
import com.example.Tech.Events.entity.Participant;
import com.example.Tech.Events.service.ImageUploadService;
import com.example.Tech.Events.service.OrganizationService;
import com.example.Tech.Events.service.ParticipantService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.websocket.server.ServerEndpoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8080"})
@RequestMapping("/api/auth")
public class AuthController {

    private final OrganizationService organizationService;
    private final ParticipantService participantService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private ImageUploadService imageUploadService;

    @Autowired
    public AuthController(OrganizationService organizationService,
                          ParticipantService participantService,
                          BCryptPasswordEncoder passwordEncoder) {
        this.organizationService = organizationService;
        this.participantService = participantService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping(value = "/register/organization", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerOrganization(
            @RequestPart("organization") String organizationJson,
            @RequestPart(value = "profilePhoto", required = false) MultipartFile profilePhoto) {

        try {
            // Convert JSON string to Organization object
            ObjectMapper objectMapper = new ObjectMapper();
            Organization organization = objectMapper.readValue(organizationJson, Organization.class);

            // Check if email already exists
            if (organizationService.findByEmail(organization.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already in use");
            }

            // Upload profile photo
            if (profilePhoto != null && !profilePhoto.isEmpty()) {
                Map<String, String> uploadResult = imageUploadService.uploadImage(profilePhoto);
                organization.setProfileImageUrl(uploadResult.get("secure_url"));
                organization.setProfileImagePublicId(uploadResult.get("public_id"));
            }

            // Hash password if needed
            String rawPassword = organization.getPassword();
            if (!rawPassword.startsWith("$2a$")) {
                organization.setPassword(rawPassword);
            }

            Organization savedOrg = organizationService.createOrganization(organization);

            return ResponseEntity.ok(savedOrg);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to process request: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
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

        return ResponseEntity.ok(org);
    }


    @PostMapping(value = "/register/participant", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerParticipant(
            @RequestPart("participant") String participantJson,
            @RequestPart(value = "profilePhoto", required = false) MultipartFile profilePhoto) {

        try {
            // Convert JSON string to Participant object
            ObjectMapper objectMapper = new ObjectMapper();
            Participant participant = objectMapper.readValue(participantJson, Participant.class);

            // Check if email already exists
            if (participantService.getParticipantByEmail(participant.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already in use");
            }

            // Upload profile photo
            if (profilePhoto != null && !profilePhoto.isEmpty()) {
                Map<String, String> uploadResult = imageUploadService.uploadImage(profilePhoto);
                participant.setProfileImageUrl(uploadResult.get("secure_url"));
                participant.setProfileImagePublicId(uploadResult.get("public_id"));
            }

            // Hash password if needed
            String rawPassword = participant.getPassword();
            if (!rawPassword.startsWith("$2a$")) {
                participant.setPassword(rawPassword); // Ideally should encode with BCrypt
            }

            Participant savedParticipant = participantService.createParticipant(participant);

            return ResponseEntity.ok(savedParticipant);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to process request: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
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

        return ResponseEntity.ok(participant);
    }
}
