package com.example.Tech.Events.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "participants")
@Data
@Getter
@Setter
public class Participant {

    @Id
    private String id;

    @NonNull
    private String name;

    @NonNull
    private String email;

    @NonNull
    private String password;

    @NonNull
    private String university;

    @NonNull
    private String course;

    private String profileImageUrl;

    private String profileImagePublicId;

    private boolean currentlyStudyingOrNot;

    private int totaleventsRegisterd;

    private String role = "PARTICIPANT";

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public @NonNull String getName() {
        return name;
    }

    public void setName(@NonNull String name) {
        this.name = name;
    }

    public @NonNull String getEmail() {
        return email;
    }

    public void setEmail(@NonNull String email) {
        this.email = email;
    }

    public @NonNull String getPassword() {
        return password;
    }

    public void setPassword(@NonNull String password) {
        this.password = password;
    }

    public @NonNull String getUniversity() {
        return university;
    }

    public void setUniversity(@NonNull String university) {
        this.university = university;
    }

    public @NonNull String getCourse() {
        return course;
    }

    public void setCourse(@NonNull String course) {
        this.course = course;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public String getProfileImagePublicId() {
        return profileImagePublicId;
    }

    public void setProfileImagePublicId(String profileImagePublicId) {
        this.profileImagePublicId = profileImagePublicId;
    }

    public boolean isCurrentlyStudyingOrNot() {
        return currentlyStudyingOrNot;
    }

    public void setCurrentlyStudyingOrNot(boolean currentlyStudyingOrNot) {
        this.currentlyStudyingOrNot = currentlyStudyingOrNot;
    }

    public int getTotaleventsRegisterd() {
        return totaleventsRegisterd;
    }

    public void setTotaleventsRegisterd(int totaleventsRegisterd) {
        this.totaleventsRegisterd = totaleventsRegisterd;
    }

    public List<Event> getRegisterdEvents() {
        return registerdEvents;
    }

    public void setRegisterdEvents(List<Event> registerdEvents) {
        this.registerdEvents = registerdEvents;
    }

    @JsonIgnore
    @DBRef
    private List<Event> registerdEvents;



    private List<String> tags = new ArrayList<>();

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }


}
