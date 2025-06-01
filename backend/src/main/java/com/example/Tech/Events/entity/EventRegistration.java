package com.example.Tech.Events.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "event_registrations")
@Data
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

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public @NonNull String getParticipantName() {
        return participantName;
    }

    public void setParticipantName(@NonNull String participantName) {
        this.participantName = participantName;
    }

    public @NonNull String getRegisteredEmail() {
        return registeredEmail;
    }

    public void setRegisteredEmail(@NonNull String registeredEmail) {
        this.registeredEmail = registeredEmail;
    }

    public @NonNull String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(@NonNull String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public @NonNull String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(@NonNull String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public @NonNull Organization getCollegeOrOrganization() {
        return collegeOrOrganization;
    }

    public void setCollegeOrOrganization(@NonNull Organization collegeOrOrganization) {
        this.collegeOrOrganization = collegeOrOrganization;
    }

    public @NonNull String getYearOrDesignation() {
        return yearOrDesignation;
    }

    public void setYearOrDesignation(@NonNull String yearOrDesignation) {
        this.yearOrDesignation = yearOrDesignation;
    }

    public String getExpectation() {
        return expectation;
    }

    public void setExpectation(String expectation) {
        this.expectation = expectation;
    }

    public LocalDateTime getRegistrationTime() {
        return registrationTime;
    }

    public void setRegistrationTime(LocalDateTime registrationTime) {
        this.registrationTime = registrationTime;
    }

    public boolean isPresent() {
        return isPresent;
    }

    public void setPresent(boolean present) {
        isPresent = present;
    }

    public String getAttendanceCode() {
        return attendanceCode;
    }

    public void setAttendanceCode(String attendanceCode) {
        this.attendanceCode = attendanceCode;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Participant getParticipant() {
        return participant;
    }

    public void setParticipant(Participant participant) {
        this.participant = participant;
    }
}

