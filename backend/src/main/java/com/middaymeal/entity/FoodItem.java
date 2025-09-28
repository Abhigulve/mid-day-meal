package com.middaymeal.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;

@Entity
@Table(name = "food_items")
public class FoodItem extends BaseEntity {
    
    @NotBlank
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "name_marathi")
    private String nameMarathi;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "category")
    @Enumerated(EnumType.STRING)
    private FoodCategory category;
    
    @Column(name = "unit")
    @Enumerated(EnumType.STRING)
    private Unit unit;
    
    @DecimalMin("0.0")
    @Column(name = "cost_per_unit", precision = 10, scale = 2)
    private BigDecimal costPerUnit;
    
    @Column(name = "nutritional_info")
    private String nutritionalInfo;
    
    @Column(name = "active", nullable = false)
    private Boolean active = true;
    
    // Enums
    public enum FoodCategory {
        GRAINS, VEGETABLES, FRUITS, DAIRY, PROTEINS, SPICES, OIL, OTHERS
    }
    
    public enum Unit {
        KG, GRAM, LITRE, ML, PIECE, PACKET, BAG
    }
    
    // Constructors
    public FoodItem() {}
    
    public FoodItem(String name, FoodCategory category, Unit unit) {
        this.name = name;
        this.category = category;
        this.unit = unit;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getNameMarathi() {
        return nameMarathi;
    }
    
    public void setNameMarathi(String nameMarathi) {
        this.nameMarathi = nameMarathi;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public FoodCategory getCategory() {
        return category;
    }
    
    public void setCategory(FoodCategory category) {
        this.category = category;
    }
    
    public Unit getUnit() {
        return unit;
    }
    
    public void setUnit(Unit unit) {
        this.unit = unit;
    }
    
    public BigDecimal getCostPerUnit() {
        return costPerUnit;
    }
    
    public void setCostPerUnit(BigDecimal costPerUnit) {
        this.costPerUnit = costPerUnit;
    }
    
    public String getNutritionalInfo() {
        return nutritionalInfo;
    }
    
    public void setNutritionalInfo(String nutritionalInfo) {
        this.nutritionalInfo = nutritionalInfo;
    }
    
    public Boolean getActive() {
        return active;
    }
    
    public void setActive(Boolean active) {
        this.active = active;
    }
}