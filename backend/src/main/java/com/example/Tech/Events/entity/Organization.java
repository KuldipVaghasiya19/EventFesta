package com.example.Tech.Events.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "organizations")
@Data
@Getter
@Setter
@NoArgsConstructor
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


}