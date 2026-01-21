package com.example.Tech.Events.controller;

import com.example.Tech.Events.entity.Organization;
import com.example.Tech.Events.entity.Participant;
import com.example.Tech.Events.service.ImageUploadService;
import com.example.Tech.Events.service.OrganizationService;
import com.example.Tech.Events.service.ParticipantService;
import com.example.Tech.Events.service.OtpService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
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
    private final AuthenticationManager authenticationManager;
    private final OtpService otpService;

    @Autowired
    private ImageUploadService imageUploadService;

    @Autowired
    public AuthController(OrganizationService organizationService,
                          ParticipantService participantService,
                          BCryptPasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager,
                          OtpService otpService) {
        this.organizationService = organizationService;
        this.participantService = participantService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.otpService = otpService;
    }

    @PostMapping(value = "/register/organization", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerOrganization(
            @RequestPart("organization") String organizationJson,
            @RequestPart(value = "profilePhoto", required = false) MultipartFile profilePhoto,
            @RequestParam("otp") String otp) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Organization organization = objectMapper.readValue(organizationJson, Organization.class);

            if (!otpService.validateOtp(organization.getEmail(), otp)) {
                return ResponseEntity.badRequest().body("Invalid OTP");
            }

            if (organizationService.findByEmail(organization.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already in use");
            }

            if (profilePhoto != null && !profilePhoto.isEmpty()) {
                Map<String, String> uploadResult = imageUploadService.uploadImage(profilePhoto);
                organization.setProfileImageUrl(uploadResult.get("secure_url"));
                organization.setProfileImagePublicId(uploadResult.get("public_id"));
            }

            // Encode password strictly
            organization.setPassword(passwordEncoder.encode(organization.getPassword()));

            Organization savedOrg = organizationService.createOrganization(organization);
            return ResponseEntity.ok(savedOrg);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to process request: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Registration Error: " + e.getMessage());
        }
    }

    @PostMapping("/login/organization")
    public ResponseEntity<?> loginOrganization(@RequestBody Map<String, String> loginRequest, HttpServletRequest httpRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            SecurityContextHolder.getContext().setAuthentication(auth);
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());

            return ResponseEntity.ok(organizationService.findByEmail(email).get());
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PostMapping(value = "/register/participant", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerParticipant(
            @RequestPart("participant") String participantJson,
            @RequestPart(value = "profilePhoto", required = false) MultipartFile profilePhoto,
            @RequestParam("otp") String otp) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Participant participant = objectMapper.readValue(participantJson, Participant.class);

            if (!otpService.validateOtp(participant.getEmail(), otp)) {
                return ResponseEntity.badRequest().body("Invalid OTP");
            }

            if (participantService.getParticipantByEmail(participant.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already in use");
            }

            if (profilePhoto != null && !profilePhoto.isEmpty()) {
                Map<String, String> uploadResult = imageUploadService.uploadImage(profilePhoto);
                participant.setProfileImageUrl(uploadResult.get("secure_url"));
                participant.setProfileImagePublicId(uploadResult.get("public_id"));
            }

            participant.setPassword(passwordEncoder.encode(participant.getPassword()));

            Participant savedParticipant = participantService.createParticipant(participant);
            return ResponseEntity.ok(savedParticipant);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to process request: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Registration Error: " + e.getMessage());
        }
    }

    @PostMapping("/login/participant")
    public ResponseEntity<?> loginParticipant(@RequestBody Map<String, String> loginRequest, HttpServletRequest httpRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");

            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            SecurityContextHolder.getContext().setAuthentication(auth);
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());

            return ResponseEntity.ok(participantService.getParticipantByEmail(email).get());
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}