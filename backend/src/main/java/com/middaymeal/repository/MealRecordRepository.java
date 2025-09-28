package com.middaymeal.repository;

import com.middaymeal.entity.MealRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MealRecordRepository extends JpaRepository<MealRecord, Long> {
    
    Optional<MealRecord> findBySchoolIdAndMenuIdAndDate(Long schoolId, Long menuId, LocalDate date);
    
    List<MealRecord> findBySchoolIdAndDateBetween(Long schoolId, LocalDate startDate, LocalDate endDate);
    
    List<MealRecord> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<MealRecord> findByDate(LocalDate date);
    
    @Query("SELECT SUM(mr.mealsServed) FROM MealRecord mr WHERE mr.date BETWEEN :startDate AND :endDate")
    Long getTotalMealsServedInPeriod(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(mr.studentsPresent) FROM MealRecord mr WHERE mr.date BETWEEN :startDate AND :endDate")
    Long getTotalStudentsPresentInPeriod(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT mr FROM MealRecord mr WHERE mr.school.id = :schoolId AND mr.date BETWEEN :startDate AND :endDate ORDER BY mr.date DESC")
    List<MealRecord> findSchoolMealRecordsInPeriod(@Param("schoolId") Long schoolId, 
                                                   @Param("startDate") LocalDate startDate, 
                                                   @Param("endDate") LocalDate endDate);
}