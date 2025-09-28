package com.middaymeal.repository;

import com.middaymeal.entity.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    
    List<FoodItem> findByActiveTrue();
    
    List<FoodItem> findByCategory(FoodItem.FoodCategory category);
    
    List<FoodItem> findByCategoryAndActiveTrue(FoodItem.FoodCategory category);
    
    @Query("SELECT f FROM FoodItem f WHERE f.active = true AND " +
           "(LOWER(f.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(f.nameMarathi) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<FoodItem> searchFoodItems(@Param("search") String search);
}