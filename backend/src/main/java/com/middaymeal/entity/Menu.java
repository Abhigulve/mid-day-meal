package com.middaymeal.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "menus")
public class Menu extends BaseEntity {
    
    @NotNull
    @Column(name = "date", nullable = false)
    private LocalDate date;
    
    @NotNull
    @Column(name = "meal_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private MealType mealType;
    
    @Column(name = "menu_description")
    private String menuDescription;
    
    @Column(name = "menu_description_marathi")
    private String menuDescriptionMarathi;
    
    @Column(name = "month")
    private Integer month;
    
    @Column(name = "year")
    private Integer year;
    
    @Column(name = "active", nullable = false)
    private Boolean active = true;
    
    // Relationships
    @OneToMany(mappedBy = "menu", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MenuFoodItem> menuFoodItems;
    
    // Enums
    public enum MealType {
        BREAKFAST, LUNCH, SNACK, DINNER
    }
    
    // Constructors
    public Menu() {}
    
    public Menu(LocalDate date, MealType mealType) {
        this.date = date;
        this.mealType = mealType;
        this.month = date.getMonthValue();
        this.year = date.getYear();
    }
    
    // Getters and Setters
    public LocalDate getDate() {
        return date;
    }
    
    public void setDate(LocalDate date) {
        this.date = date;
        if (date != null) {
            this.month = date.getMonthValue();
            this.year = date.getYear();
        }
    }
    
    public MealType getMealType() {
        return mealType;
    }
    
    public void setMealType(MealType mealType) {
        this.mealType = mealType;
    }
    
    public String getMenuDescription() {
        return menuDescription;
    }
    
    public void setMenuDescription(String menuDescription) {
        this.menuDescription = menuDescription;
    }
    
    public String getMenuDescriptionMarathi() {
        return menuDescriptionMarathi;
    }
    
    public void setMenuDescriptionMarathi(String menuDescriptionMarathi) {
        this.menuDescriptionMarathi = menuDescriptionMarathi;
    }
    
    public Integer getMonth() {
        return month;
    }
    
    public void setMonth(Integer month) {
        this.month = month;
    }
    
    public Integer getYear() {
        return year;
    }
    
    public void setYear(Integer year) {
        this.year = year;
    }
    
    public Boolean getActive() {
        return active;
    }
    
    public void setActive(Boolean active) {
        this.active = active;
    }
    
    public List<MenuFoodItem> getMenuFoodItems() {
        return menuFoodItems;
    }
    
    public void setMenuFoodItems(List<MenuFoodItem> menuFoodItems) {
        this.menuFoodItems = menuFoodItems;
    }
}