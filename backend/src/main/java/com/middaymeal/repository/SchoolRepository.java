package com.middaymeal.repository;

import com.middaymeal.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolRepository extends JpaRepository<School, Long> {
    
    Optional<School> findByCode(String code);
    
    List<School> findByActiveTrue();
    
    List<School> findByCity(String city);
    
    List<School> findByState(String state);
    
    @Query("SELECT s FROM School s WHERE s.active = true AND " +
           "(LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.code) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.city) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<School> searchSchools(@Param("search") String search);
    
    @Query("SELECT COUNT(s) FROM School s WHERE s.active = true")
    Long countActiveSchools();
}