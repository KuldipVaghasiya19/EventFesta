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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    /**
     * Loads user data by email. Spring Security calls this method during authentication.
     * It first checks for an organization with the given email. If not found, it checks for a participant.
     *
     * @param email The email address of the user trying to log in.
     * @return UserDetails object containing user credentials and authorities (roles).
     * @throws UsernameNotFoundException if no user (neither organization nor participant) is found with the email.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // First, try to find an Organization with the given email
        Optional<Organization> organization = organizationRepository.findByEmail(email);
        if (organization.isPresent()) {
            Organization org = organization.get();
            List<GrantedAuthority> authorities = new ArrayList<>();
            // The role must be prefixed with "ROLE_" for Spring Security's hasRole() method to work correctly.
            authorities.add(new SimpleGrantedAuthority("ROLE_" + org.getRole().toUpperCase()));

            return new User(org.getEmail(), org.getPassword(), authorities);
        }

        // If no Organization is found, try to find a Participant
        Optional<Participant> participant = participantRepository.findByEmail(email);
        if (participant.isPresent()) {
            Participant part = participant.get();
            List<GrantedAuthority> authorities = new ArrayList<>();
            // The role must be prefixed with "ROLE_"
            authorities.add(new SimpleGrantedAuthority("ROLE_" + part.getRole().toUpperCase()));

            return new User(part.getEmail(), part.getPassword(), authorities);
        }

        // If neither an Organization nor a Participant is found, throw an exception
        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}