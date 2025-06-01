package com.example.Tech.Events.repository;

import com.example.Tech.Events.entity.Participant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ParticipantRepository extends MongoRepository<Participant, String> {
    Optional<Participant> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Participant> findByUniversity(String university);
    @Query("{ 'tags': { $in: ?0 } }")
    List<Participant> findByTagsIn(List<String> tags);
}