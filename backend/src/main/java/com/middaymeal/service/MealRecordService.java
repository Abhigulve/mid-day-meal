package com.middaymeal.service;

import com.middaymeal.entity.MealRecord;
import com.middaymeal.repository.MealRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MealRecordService {
    
    private final MealRecordRepository mealRecordRepository;
    
    @Autowired
    public MealRecordService(MealRecordRepository mealRecordRepository) {
        this.mealRecordRepository = mealRecordRepository;
    }
    
    public List<MealRecord> getAllMealRecords() {
        return mealRecordRepository.findAll();
    }
    
    public Optional<MealRecord> getMealRecordById(Long id) {
        return mealRecordRepository.findById(id);
    }
    
    public Optional<MealRecord> getMealRecordBySchoolMenuAndDate(Long schoolId, Long menuId, LocalDate date) {
        return mealRecordRepository.findBySchoolIdAndMenuIdAndDate(schoolId, menuId, date);
    }
    
    public List<MealRecord> getMealRecordsBySchoolAndPeriod(Long schoolId, LocalDate startDate, LocalDate endDate) {
        return mealRecordRepository.findSchoolMealRecordsInPeriod(schoolId, startDate, endDate);
    }
    
    public List<MealRecord> getMealRecordsByPeriod(LocalDate startDate, LocalDate endDate) {
        return mealRecordRepository.findByDateBetween(startDate, endDate);
    }
    
    public List<MealRecord> getMealRecordsByDate(LocalDate date) {
        return mealRecordRepository.findByDate(date);
    }
    
    public MealRecord createMealRecord(MealRecord mealRecord) {
        return mealRecordRepository.save(mealRecord);
    }
    
    public MealRecord updateMealRecord(Long id, MealRecord mealRecordDetails) {
        MealRecord mealRecord = mealRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meal record not found with id: " + id));
        
        mealRecord.setStudentsPresent(mealRecordDetails.getStudentsPresent());
        mealRecord.setMealsServed(mealRecordDetails.getMealsServed());
        mealRecord.setTeacherInCharge(mealRecordDetails.getTeacherInCharge());
        mealRecord.setRemarks(mealRecordDetails.getRemarks());
        mealRecord.setMealQuality(mealRecordDetails.getMealQuality());
        mealRecord.setPhotoUrl(mealRecordDetails.getPhotoUrl());
        
        return mealRecordRepository.save(mealRecord);
    }
    
    public void deleteMealRecord(Long id) {
        mealRecordRepository.deleteById(id);
    }
    
    public Long getTotalMealsServedInPeriod(LocalDate startDate, LocalDate endDate) {
        Long total = mealRecordRepository.getTotalMealsServedInPeriod(startDate, endDate);
        return total != null ? total : 0L;
    }
    
    public Long getTotalStudentsPresentInPeriod(LocalDate startDate, LocalDate endDate) {
        Long total = mealRecordRepository.getTotalStudentsPresentInPeriod(startDate, endDate);
        return total != null ? total : 0L;
    }
    
    public List<MealRecord> getTodaysMealRecords() {
        return getMealRecordsByDate(LocalDate.now());
    }
    
    public List<MealRecord> getThisWeekMealRecords() {
        LocalDate startOfWeek = LocalDate.now().with(java.time.DayOfWeek.MONDAY);
        LocalDate endOfWeek = startOfWeek.plusDays(6);
        return getMealRecordsByPeriod(startOfWeek, endOfWeek);
    }
}