package com.example.Tech.Events.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@Document(collection = "events")
@Data
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
    private LocalTime time;

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
    @NoArgsConstructor
    public static class Speaker {
        private String name;
        private String company;

        public Speaker(String name, String company) {
            this.name = name;
            this.company = company;
        }

        public Speaker() {}

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getCompany() {
            return company;
        }

        public void setCompany(String company) {
            this.company = company;
        }
    }


    @Data
    @NoArgsConstructor
    public static class Judge {
        private String name;
        private String company;

        public Judge(String name, String company) {
            this.name = name;
            this.company = company;
        }

        public Judge() {}

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getCompany() {
            return company;
        }

        public void setCompany(String company) {
            this.company = company;
        }
    }

    @Data
    @NoArgsConstructor
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

        public String getFirst() {
            return first;
        }

        public void setFirst(String first) {
            this.first = first;
        }

        public String getSecond() {
            return second;
        }

        public void setSecond(String second) {
            this.second = second;
        }

        public String getThird() {
            return third;
        }

        public void setThird(String third) {
            this.third = third;
        }
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public @NonNull String getTitle() {
        return title;
    }

    public void setTitle(@NonNull String title) {
        this.title = title;
    }

    public @NonNull String getDescription() {
        return description;
    }

    public void setDescription(@NonNull String description) {
        this.description = description;
    }

    public @NonNull EventType getType() {
        return type;
    }

    public void setType(@NonNull EventType type) {
        this.type = type;
    }

    public @NonNull Date getEventDate() {
        return eventDate;
    }

    public void setEventDate(@NonNull Date eventDate) {
        this.eventDate = eventDate;
    }

    public @NonNull Date getLastRegistertDate() {
        return lastRegistertDate;
    }

    public void setLastRegistertDate(@NonNull Date lastRegistertDate) {
        this.lastRegistertDate = lastRegistertDate;
    }

    public @NonNull LocalTime getTime() {
        return time;
    }

    public void setTime(@NonNull LocalTime time) {
        this.time = time;
    }

    public @NonNull String getLocation() {
        return location;
    }

    public void setLocation(@NonNull String location) {
        this.location = location;
    }

    public double getRegistrationFees() {
        return registrationFees;
    }

    public void setRegistrationFees(double registrationFees) {
        this.registrationFees = registrationFees;
    }

    public int getMaxParticipants() {
        return maxParticipants;
    }

    public void setMaxParticipants(int maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public int getCurrentParticipants() {
        return currentParticipants;
    }

    public void setCurrentParticipants(int currentParticipants) {
        this.currentParticipants = currentParticipants;
    }

    public String getImagePublicId() {
        return imagePublicId;
    }

    public void setImagePublicId(String imagePublicId) {
        this.imagePublicId = imagePublicId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<Speaker> getSpeakers() {
        return speakers;
    }

    public void setSpeakers(List<Speaker> speakers) {
        this.speakers = speakers;
    }

    public List<Judge> getJudges() {
        return judges;
    }

    public void setJudges(List<Judge> judges) {
        this.judges = judges;
    }

    public Prize getPrizes() {
        return prizes;
    }

    public void setPrizes(Prize prizes) {
        this.prizes = prizes;
    }

    public List<Participant> getRegisterdParticipants() {
        return registerdParticipants;
    }

    public void setRegisterdParticipants(List<Participant> registerdParticipants) {
        this.registerdParticipants = registerdParticipants;
    }

    public Organization getOrganizer() {
        return organizer;
    }

    public void setOrganizer(Organization organizer) {
        this.organizer = organizer;
    }
}
