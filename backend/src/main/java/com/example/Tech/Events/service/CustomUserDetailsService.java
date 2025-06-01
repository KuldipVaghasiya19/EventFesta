package com.example.Tech.Events.service;

import com.example.Tech.Events.repository.OrganizationRepository;
import com.example.Tech.Events.repository.ParticipantRepository;
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

    private final OrganizationRepository organizationRepository;
    private final ParticipantRepository participantRepository;

    private static final String ROLE_ORGANIZATION = "ROLE_ORGANIZATION";
    private static final String ROLE_PARTICIPANT = "ROLE_PARTICIPANT";

    public CustomUserDetailsService(OrganizationRepository organizationRepository,
                                    ParticipantRepository participantRepository) {
        this.organizationRepository = organizationRepository;
        this.participantRepository = participantRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        String normalizedEmail = email.toLowerCase();

        Optional<UserDetails> orgUser = organizationRepository.findByEmail(normalizedEmail)
                .map(org -> new User(org.getEmail(), org.getPassword(),
                        Collections.singleton(new SimpleGrantedAuthority(ROLE_ORGANIZATION))));

        Optional<UserDetails> participantUser = participantRepository.findByEmail(normalizedEmail)
                .map(participant -> new User(participant.getEmail(), participant.getPassword(),
                        Collections.singleton(new SimpleGrantedAuthority(ROLE_PARTICIPANT))));

        return orgUser.or(() -> participantUser)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}
