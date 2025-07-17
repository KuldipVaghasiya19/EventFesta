package com.example.Tech.Events.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder())
                .and()
                .build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests(authz -> authz
                        // --- Public Endpoints ---
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/events", "/api/events/{id}").permitAll()

                        // --- Organization Role Authorization ---
                        // ✅ DEBUGGING STEP: Changed .hasRole("ORGANIZATION") to .authenticated()
                        // This will test if the user is being authenticated correctly for this endpoint.
                        .requestMatchers("/api/organizations/{id}/create-event").authenticated()

                        .requestMatchers("/api/organizations/{id}/events").hasRole("ORGANIZATION")
                        .requestMatchers("/api/organizations/events/{eventId}/participants").hasRole("ORGANIZATION")
                        .requestMatchers("/api/organizations/**").hasRole("ORGANIZATION")

                        // --- Participant Role Authorization ---
                        .requestMatchers("/api/events/{eventId}/register").hasRole("PARTICIPANT")
                        .requestMatchers("/api/participants/**").hasRole("PARTICIPANT")

                        // --- Authenticated Users ---
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}
