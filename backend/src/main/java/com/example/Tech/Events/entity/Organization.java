package com.example.Tech.Events.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "organizations")
@Data
@AllArgsConstructor
public class Organization {

    public enum OrganizationType {
        EDUCATIONAL,
        GOVERNMENT,
        CORPORATE,
        OTHER
    }

    @Id
    private String id;

    @NonNull
    private String name;

    @NonNull
    private OrganizationType type;

    @NonNull
    private String location;

    @NonNull
    private String email;

    @NonNull
    private String password;

    @NonNull
    private int since;

    private String about;

    private String contact;

    private String profileImageUrl;

    private String profileImagePublicId;


    private int totalOrganizedEvents;

    @JsonIgnore
    @DBRef
    private List<Event> organizedEvents;

    private String role = "ORGANIZATION";


    public Organization(String name, OrganizationType type, String location, String email, String password, int since) {
        this.name = name;
        this.type = type;
        this.location = location;
        this.email = email;
        this.password = password;
        this.since = since;
    }

    public Organization() {}

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

    public @NonNull OrganizationType getType() {
        return type;
    }

    public void setType(@NonNull OrganizationType type) {
        this.type = type;
    }

    public @NonNull String getLocation() {
        return location;
    }

    public void setLocation(@NonNull String location) {
        this.location = location;
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

    public int getSince() {
        return since;
    }

    public void setSince(int since) {
        this.since = since;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
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

    public List<Event> getOrganizedEvents() {
        return organizedEvents;
    }

    public void setOrganizedEvents(List<Event> organizedEvents) {
        this.organizedEvents = organizedEvents;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public int getTotalOrganizedEvents() {
        return totalOrganizedEvents;
    }

    public void setTotalOrganizedEvents(int totalOrganizedEvents) {
        this.totalOrganizedEvents = totalOrganizedEvents;
    }
}
