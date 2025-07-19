package com.example.Tech.Events.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "event_registrations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRegistration {

    @Id
    private String id;

    @NonNull
    private String participantName;

    @NonNull
    private String registeredEmail;

    @NonNull
    private String contactEmail;

    @NonNull
    private String phoneNumber;

    @NonNull
    @DBRef
    @JsonIgnore
    private Organization collegeOrOrganization;

    @NonNull
    private String yearOrDesignation;

    private String expectation;

    private LocalDateTime registrationTime = LocalDateTime.now();

    private boolean isPresent = false;

    private String attendanceCode;

    @NonNull
    @DBRef
    @JsonIgnore
    private Event event;

    @NonNull
    @DBRef
    @JsonIgnore
    private Participant participant;
}