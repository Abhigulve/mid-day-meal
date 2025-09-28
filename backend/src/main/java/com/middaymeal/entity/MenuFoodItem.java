package com.middaymeal.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
@Table(name = "menu_food_items")
public class MenuFoodItem extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id", nullable = false)
    private Menu menu;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_item_id", nullable = false)
    private FoodItem foodItem;
    
    @NotNull
    @DecimalMin("0.0")
    @Column(name = "quantity_per_student", precision = 10, scale = 3, nullable = false)
    private BigDecimal quantityPerStudent;
    
    @Column(name = "notes")
    private String notes;
    
    // Constructors
    public MenuFoodItem() {}
    
    public MenuFoodItem(Menu menu, FoodItem foodItem, BigDecimal quantityPerStudent) {
        this.menu = menu;
        this.foodItem = foodItem;
        this.quantityPerStudent = quantityPerStudent;
    }
    
    // Getters and Setters
    public Menu getMenu() {
        return menu;
    }
    
    public void setMenu(Menu menu) {
        this.menu = menu;
    }
    
    public FoodItem getFoodItem() {
        return foodItem;
    }
    
    public void setFoodItem(FoodItem foodItem) {
        this.foodItem = foodItem;
    }
    
    public BigDecimal getQuantityPerStudent() {
        return quantityPerStudent;
    }
    
    public void setQuantityPerStudent(BigDecimal quantityPerStudent) {
        this.quantityPerStudent = quantityPerStudent;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
}