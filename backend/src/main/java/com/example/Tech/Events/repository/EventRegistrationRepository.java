package com.example.Tech.Events.repository;

import com.example.Tech.Events.entity.EventRegistration;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRegistrationRepository extends MongoRepository<EventRegistration, String> {
    // You can add custom query methods here if needed
}
