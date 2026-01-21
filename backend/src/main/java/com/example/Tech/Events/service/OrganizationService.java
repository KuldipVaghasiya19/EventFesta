package com.example.Tech.Events.service;

import com.example.Tech.Events.entity.Organization;
import com.example.Tech.Events.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OrganizationService {

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public Organization createOrganization(Organization organization) throws Exception {
        // Password is now encoded in AuthController to ensure consistency with OTP flow.
        Organization savedOrganization = organizationRepository.save(organization);
        emailService.sendRegistrationEmail(savedOrganization.getEmail(), savedOrganization.getName());
        return savedOrganization;
    }

    public Optional<Organization> getOrganizationById(String id) {
        return organizationRepository.findById(id);
    }

    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    public List<Organization> searchOrganizationsByName(String name) {
        return organizationRepository.findByNameContainingIgnoreCase(name);
    }

    public Organization updateOrganization(String id, Organization organizationDetails) {
        return organizationRepository.findById(id)
                .map(existingOrg -> {
                    if (organizationDetails.getName() != null) {
                        existingOrg.setName(organizationDetails.getName());
                    }
                    if (organizationDetails.getEmail() != null) {
                        existingOrg.setEmail(organizationDetails.getEmail());
                    }
                    if (organizationDetails.getAbout() != null) {
                        existingOrg.setAbout(organizationDetails.getAbout());
                    }
                    if (organizationDetails.getContact() != null) {
                        existingOrg.setContact(organizationDetails.getContact());
                    }
                    if (organizationDetails.getLocation() != null) {
                        existingOrg.setLocation(organizationDetails.getLocation());
                    }
                    if (organizationDetails.getSince() != 0) {
                        existingOrg.setSince(organizationDetails.getSince());
                    }
                    if (organizationDetails.getType() != null) {
                        existingOrg.setType(organizationDetails.getType());
                    }
                    return organizationRepository.save(existingOrg);
                })
                .orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));
    }

    public void deleteOrganization(String id) {
        organizationRepository.deleteById(id);
    }

    public Optional<Organization> findByEmail(String email) {
        return organizationRepository.findByEmail(email);
    }
}