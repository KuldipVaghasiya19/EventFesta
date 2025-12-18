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

import java.sql.SQLOutput;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        List<GrantedAuthority> authorities = new ArrayList<>();
        Optional<Organization> organization = organizationRepository.findByEmail(email);
        if (organization.isPresent()) {
            Organization org = organization.get();
            authorities.add(new SimpleGrantedAuthority("ROLE_ORGANIZATION"));
            return new User(org.getEmail(), org.getPassword(), authorities);
        }

        Optional<Participant> participant = participantRepository.findByEmail(email);
        if (participant.isPresent()) {
            Participant part = participant.get();
            authorities.add(new SimpleGrantedAuthority("ROLE_PARTICIPANT"));
            return new User(part.getEmail(), part.getPassword(), authorities);
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
