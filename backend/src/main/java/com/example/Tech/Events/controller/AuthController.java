package com.example.Tech.Events.controller;

import com.example.Tech.Events.constant.ApiPaths;
import com.example.Tech.Events.entity.Organization;
import com.example.Tech.Events.entity.Participant;
import com.example.Tech.Events.dto.payload.ApiResponse;
import com.example.Tech.Events.service.AuthService;
import com.example.Tech.Events.service.OrganizationService;
import com.example.Tech.Events.service.ParticipantService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8080"})
@RequestMapping(ApiPaths.AUTH)
public class AuthController {

    private final AuthService authService;
    private final OrganizationService organizationService;
    private final ParticipantService participantService;

    @Autowired
    public AuthController(AuthService authService, OrganizationService organizationService, ParticipantService participantService) {
        this.authService = authService;
        this.organizationService = organizationService;
        this.participantService = participantService;
    }

    @PostMapping(value = "/register/organization", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Organization>> registerOrganization(
            @RequestPart("organization") String organizationJson,
            @RequestPart(value = "profilePhoto", required = false) MultipartFile profilePhoto,
            @RequestParam("otp") String otp) throws Exception {

        Organization savedOrg = authService.registerOrganization(organizationJson, profilePhoto, otp);
        return ResponseEntity.ok(new ApiResponse<>(true, "Organization registered successfully", savedOrg));
    }

    @PostMapping("/login/organization")
    public ResponseEntity<ApiResponse<Organization>> loginOrganization(@RequestBody Map<String, String> loginRequest, HttpServletRequest httpRequest) {
        String email = loginRequest.get("email");
        Authentication auth = authService.authenticateUser(email, loginRequest.get("password"));

        setSessionAuth(httpRequest, auth);
        Organization org = organizationService.findByEmail(email).get(); // Safe because auth succeeded

        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", org));
    }

    @PostMapping(value = "/register/participant", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Participant>> registerParticipant(
            @RequestPart("participant") String participantJson,
            @RequestPart(value = "profilePhoto", required = false) MultipartFile profilePhoto,
            @RequestParam("otp") String otp) throws Exception {

        Participant savedParticipant = authService.registerParticipant(participantJson, profilePhoto, otp);
        return ResponseEntity.ok(new ApiResponse<>(true, "Participant registered successfully", savedParticipant));
    }

    @PostMapping("/login/participant")
    public ResponseEntity<ApiResponse<Participant>> loginParticipant(@RequestBody Map<String, String> loginRequest, HttpServletRequest httpRequest) {
        String email = loginRequest.get("email");
        Authentication auth = authService.authenticateUser(email, loginRequest.get("password"));

        setSessionAuth(httpRequest, auth);
        Participant participant = participantService.getParticipantByEmail(email).get(); // Safe because auth succeeded

        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", participant));
    }

    // Helper method to keep controller dry
    private void setSessionAuth(HttpServletRequest httpRequest, Authentication auth) {
        SecurityContextHolder.getContext().setAuthentication(auth);
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());
    }
}