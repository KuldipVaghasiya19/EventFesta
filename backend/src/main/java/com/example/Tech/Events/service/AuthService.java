package com.example.Tech.Events.service;

import com.example.Tech.Events.constant.ErrorMessages;
import com.example.Tech.Events.entity.Organization;
import com.example.Tech.Events.entity.Participant;
import com.example.Tech.Events.exception.BadRequestException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class AuthService {

    private final OrganizationService organizationService;
    private final ParticipantService participantService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final OtpService otpService;
    private final ImageUploadService imageUploadService;
    private final ObjectMapper objectMapper;

    @Autowired
    public AuthService(OrganizationService organizationService, ParticipantService participantService,
                       BCryptPasswordEncoder passwordEncoder, AuthenticationManager authenticationManager,
                       OtpService otpService, ImageUploadService imageUploadService) {
        this.organizationService = organizationService;
        this.participantService = participantService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.otpService = otpService;
        this.imageUploadService = imageUploadService;
        this.objectMapper = new ObjectMapper();
    }

    public Organization registerOrganization(String organizationJson, MultipartFile profilePhoto, String otp) throws Exception {
        Organization organization = objectMapper.readValue(organizationJson, Organization.class);

        if (!otpService.validateOtp(organization.getEmail(), otp)) {
            throw new BadRequestException(ErrorMessages.INVALID_OTP);
        }

        if (organizationService.findByEmail(organization.getEmail()).isPresent()) {
            throw new BadRequestException(ErrorMessages.EMAIL_ALREADY_EXISTS);
        }

        if (profilePhoto != null && !profilePhoto.isEmpty()) {
            Map<String, String> uploadResult = imageUploadService.uploadImage(profilePhoto);
            organization.setProfileImageUrl(uploadResult.get("secure_url"));
            organization.setProfileImagePublicId(uploadResult.get("public_id"));
        }

        organization.setPassword(passwordEncoder.encode(organization.getPassword()));
        return organizationService.createOrganization(organization);
    }

    public Participant registerParticipant(String participantJson, MultipartFile profilePhoto, String otp) throws Exception {
        Participant participant = objectMapper.readValue(participantJson, Participant.class);

        if (!otpService.validateOtp(participant.getEmail(), otp)) {
            throw new BadRequestException(ErrorMessages.INVALID_OTP);
        }

        if (participantService.getParticipantByEmail(participant.getEmail()).isPresent()) {
            throw new BadRequestException(ErrorMessages.EMAIL_ALREADY_EXISTS);
        }

        if (profilePhoto != null && !profilePhoto.isEmpty()) {
            Map<String, String> uploadResult = imageUploadService.uploadImage(profilePhoto);
            participant.setProfileImageUrl(uploadResult.get("secure_url"));
            participant.setProfileImagePublicId(uploadResult.get("public_id"));
        }

        participant.setPassword(passwordEncoder.encode(participant.getPassword()));
        return participantService.createParticipant(participant);
    }

    public Authentication authenticateUser(String email, String password) {
        try {
            return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        } catch (Exception e) {
            throw new BadRequestException(ErrorMessages.INVALID_CREDENTIALS);
        }
    }
}