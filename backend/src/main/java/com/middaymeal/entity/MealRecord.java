package com.middaymeal.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Entity
@Table(name = "meal_records")
public class MealRecord extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id", nullable = false)
    private Menu menu;
    
    @NotNull
    @Column(name = "date", nullable = false)
    private LocalDate date;
    
    @Min(0)
    @Column(name = "students_present", nullable = false)
    private Integer studentsPresent;
    
    @Min(0)
    @Column(name = "meals_served", nullable = false)
    private Integer mealsServed;
    
    @Column(name = "teacher_in_charge")
    private String teacherInCharge;
    
    @Column(name = "remarks")
    private String remarks;
    
    @Column(name = "photo_url")
    private String photoUrl;
    
    @Column(name = "meal_quality")
    @Enumerated(EnumType.STRING)
    private MealQuality mealQuality;
    
    // Enums
    public enum MealQuality {
        EXCELLENT, GOOD, AVERAGE, POOR
    }
    
    // Constructors
    public MealRecord() {}
    
    public MealRecord(School school, Menu menu, LocalDate date, Integer studentsPresent, Integer mealsServed) {
        this.school = school;
        this.menu = menu;
        this.date = date;
        this.studentsPresent = studentsPresent;
        this.mealsServed = mealsServed;
    }
    
    // Getters and Setters
    public School getSchool() {
        return school;
    }
    
    public void setSchool(School school) {
        this.school = school;
    }
    
    public Menu getMenu() {
        return menu;
    }
    
    public void setMenu(Menu menu) {
        this.menu = menu;
    }
    
    public LocalDate getDate() {
        return date;
    }
    
    public void setDate(LocalDate date) {
        this.date = date;
    }
    
    public Integer getStudentsPresent() {
        return studentsPresent;
    }
    
    public void setStudentsPresent(Integer studentsPresent) {
        this.studentsPresent = studentsPresent;
    }
    
    public Integer getMealsServed() {
        return mealsServed;
    }
    
    public void setMealsServed(Integer mealsServed) {
        this.mealsServed = mealsServed;
    }
    
    public String getTeacherInCharge() {
        return teacherInCharge;
    }
    
    public void setTeacherInCharge(String teacherInCharge) {
        this.teacherInCharge = teacherInCharge;
    }
    
    public String getRemarks() {
        return remarks;
    }
    
    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
    
    public String getPhotoUrl() {
        return photoUrl;
    }
    
    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
    
    public MealQuality getMealQuality() {
        return mealQuality;
    }
    
    public void setMealQuality(MealQuality mealQuality) {
        this.mealQuality = mealQuality;
    }
}