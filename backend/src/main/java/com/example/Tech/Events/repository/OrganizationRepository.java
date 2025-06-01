package com.example.Tech.Events.repository;

import com.example.Tech.Events.entity.Organization;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends MongoRepository<Organization, String> {
    Optional<Organization> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Organization> findByNameContainingIgnoreCase(String name);
}