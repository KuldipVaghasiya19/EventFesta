package com.example.Tech.Events.repository;

import com.example.Tech.Events.entity.Event;
import com.example.Tech.Events.entity.EventRegistration;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface EventRegistrationRepository extends MongoRepository<EventRegistration, String> {


    Optional<EventRegistration> findByAttendanceCode(String attendanceCode);
    List<EventRegistration> findByEventId(String eventId);
    List<EventRegistration> findByEvent_EventDateBetween(Date start, Date end);
    List<EventRegistration> findByEventIdIn(List<String> eventIds);
    boolean existsByParticipantIdAndEventId(String participantId, String eventId);

}