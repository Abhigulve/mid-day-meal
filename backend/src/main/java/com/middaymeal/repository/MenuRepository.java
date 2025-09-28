package com.middaymeal.repository;

import com.middaymeal.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {
    
    Optional<Menu> findByDateAndMealType(LocalDate date, Menu.MealType mealType);
    
    List<Menu> findByMonthAndYearAndActiveTrue(Integer month, Integer year);
    
    List<Menu> findByDateBetweenAndActiveTrue(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT m FROM Menu m WHERE m.date >= :startDate AND m.date <= :endDate AND m.mealType = :mealType AND m.active = true ORDER BY m.date")
    List<Menu> findMenusForPeriod(@Param("startDate") LocalDate startDate, 
                                  @Param("endDate") LocalDate endDate, 
                                  @Param("mealType") Menu.MealType mealType);
    
    List<Menu> findByActiveTrue();
}