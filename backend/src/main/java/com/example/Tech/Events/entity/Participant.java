package com.example.Tech.Events.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "participants")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

    @JsonIgnore
    @DBRef
    private List<Event> registerdEvents;

    private List<String> interest;

    private String role = "PARTICIPANT";
}
