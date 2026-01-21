package com.example.Tech.Events.service;

import com.example.Tech.Events.entity.Organization;
import com.example.Tech.Events.entity.Participant;
import com.example.Tech.Events.repository.OrganizationRepository;
import com.example.Tech.Events.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Check if user is Organization
        Optional<Organization> org = organizationRepository.findByEmail(email);
        if (org.isPresent()) {
            return new User(
                    org.get().getEmail(),
                    org.get().getPassword(),
                    // MUST have ROLE_ prefix for hasRole() to work
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ORGANIZATION"))
            );
        }

        // Check if user is Participant
        Optional<Participant> participant = participantRepository.findByEmail(email);
        if (participant.isPresent()) {
            return new User(
                    participant.get().getEmail(),
                    participant.get().getPassword(),
                    // MUST have ROLE_ prefix for hasRole() to work
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_PARTICIPANT"))
            );
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}