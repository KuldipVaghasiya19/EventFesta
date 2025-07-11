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

    Optional<Participant> findByEmailAndPassword(String email, String password);

    @Query("{'interest': {$regex: ?0, $options: 'i'}}")
    List<Participant> findByInterestContainingIgnoreCase(String interest);

    List<Participant> findByInterestIn(List<String> interests);

    List<Participant> findByCourse(String course);

    @Query("{'currentlyStudyingOrNot': ?0}")
    List<Participant> findByCurrentlyStudyingOrNot(boolean currentlyStudyingOrNot);

    List<Participant> findByRole(String role);

    List<Participant> findByUniversityAndCourse(String university, String course);

    List<Participant> findByTotaleventsRegisterdGreaterThan(int count);

    @Query("{'name': {$regex: ?0, $options: 'i'}}")
    List<Participant> findByNameContainingIgnoreCase(String name);

    @Query("{'university': ?0, 'course': ?1, 'currentlyStudyingOrNot': ?2}")
    List<Participant> findByUniversityAndCourseAndCurrentlyStudying(
            String university, String course, boolean currentlyStudyingOrNot);

    long countByUniversity(String university);

    long countByCourse(String course);

    void deleteByEmail(String email);

    List<Participant> findByInterest(String interest);

    long countByInterest(String interest);

    List<Participant> findByInterestAndUniversity(String interest, String university);

    List<Participant> findByInterestAndCourse(String interest, String course);
}