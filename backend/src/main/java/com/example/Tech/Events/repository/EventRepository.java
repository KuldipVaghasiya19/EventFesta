package com.example.Tech.Events.repository;

import com.example.Tech.Events.entity.Event;
import com.example.Tech.Events.entity.Participant;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Date;
import java.util.List;

public interface EventRepository extends MongoRepository<Event, String> {
    Event findByTitle(String title);
    List<Event> findByEventDateBetween(Date start, Date end);
}