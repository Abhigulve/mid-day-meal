package com.middaymeal.repository;

import com.middaymeal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    List<User> findByActiveTrue();
    
    List<User> findByRole(User.Role role);
    
    List<User> findBySchoolIdAndActiveTrue(Long schoolId);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
}