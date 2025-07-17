package com.example.Tech.Events.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@Document(collection = "events")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Event {

    public enum EventType {
        CONFERENCE,
        WORKSHOP,
        SEMINAR
    }

    @Id
    private String id;

    @NonNull
    private String title;

    @NonNull
    private String description;

    @NonNull
    private EventType type;

    @NonNull
    private Date eventDate;

    @NonNull
    private Date lastRegistertDate;

    @NonNull
    private String location;

    @NonNull
    private double registrationFees;

    @NonNull
    private int maxParticipants;

    private int currentParticipants = 0;

    private String imagePublicId;
    private String imageUrl;

    private List<String> tags;

    private List<Speaker> speakers;
    private List<Judge> judges;
    private Prize prizes;
    private List<Schedule> schedule;

    @JsonIgnore
    @DBRef
    private List<Participant> registerdParticipants;

    @JsonIgnore
    @DBRef
    private Organization organizer;

    public int getRemainingSeats() {
        return maxParticipants - currentParticipants;
    }

    public boolean registerParticipant(Participant participant) {
        if (currentParticipants < maxParticipants) {
            registerdParticipants.add(participant);
            currentParticipants++;
            return true;
        }
        return false;
    }

    public boolean removeParticipant() {
        if (currentParticipants > 0) {
            currentParticipants--;
            return true;
        }
        return false;
    }

    @Data
    @Getter
    @Setter
    public static class Speaker {
        private String name;
        private String company;

        public Speaker() {
        }

        public Speaker(String name, String company) {
            this.name = name;
            this.company = company;
        }


    }


    @Data
    @Getter
    @Setter
    public static class Judge {
        private String name;
        private String company;

        public Judge() {
        }

        public Judge(String name, String company) {
            this.name = name;
            this.company = company;
        }


    }

    @Data
    @Getter
    @Setter
    public static class Prize {
        private String first;
        private String second;
        private String third;

        public Prize() {
        }

        public Prize(String first, String second, String third) {
            this.first = first;
            this.second = second;
            this.third = third;
        }
    }

    @Setter
    @Getter
    public static class Schedule {
        private String time;
        private String title;
        private String speaker;

        public Schedule() {}

        public Schedule(String time, String title, String speaker) {
            this.time = time;
            this.title = title;
            this.speaker = speaker;
        }

    }

}
