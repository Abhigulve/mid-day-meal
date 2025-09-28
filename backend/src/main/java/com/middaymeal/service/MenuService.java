package com.middaymeal.service;

import com.middaymeal.entity.Menu;
import com.middaymeal.entity.MenuFoodItem;
import com.middaymeal.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MenuService {
    
    private final MenuRepository menuRepository;
    
    @Autowired
    public MenuService(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }
    
    public List<Menu> getAllActiveMenus() {
        return menuRepository.findByActiveTrue();
    }
    
    public Optional<Menu> getMenuById(Long id) {
        return menuRepository.findById(id);
    }
    
    public Optional<Menu> getMenuByDateAndMealType(LocalDate date, Menu.MealType mealType) {
        return menuRepository.findByDateAndMealType(date, mealType);
    }
    
    public List<Menu> getMenusForMonth(Integer month, Integer year) {
        return menuRepository.findByMonthAndYearAndActiveTrue(month, year);
    }
    
    public List<Menu> getMenusForPeriod(LocalDate startDate, LocalDate endDate) {
        return menuRepository.findByDateBetweenAndActiveTrue(startDate, endDate);
    }
    
    public List<Menu> getMenusForPeriodAndMealType(LocalDate startDate, LocalDate endDate, Menu.MealType mealType) {
        return menuRepository.findMenusForPeriod(startDate, endDate, mealType);
    }
    
    public Menu createMenu(Menu menu) {
        return menuRepository.save(menu);
    }
    
    public Menu updateMenu(Long id, Menu menuDetails) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu not found with id: " + id));
        
        menu.setDate(menuDetails.getDate());
        menu.setMealType(menuDetails.getMealType());
        menu.setMenuDescription(menuDetails.getMenuDescription());
        menu.setMenuDescriptionMarathi(menuDetails.getMenuDescriptionMarathi());
        
        return menuRepository.save(menu);
    }
    
    public void deleteMenu(Long id) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu not found with id: " + id));
        menu.setActive(false);
        menuRepository.save(menu);
    }
    
    public List<Menu> getCurrentWeekMenus() {
        LocalDate startOfWeek = LocalDate.now().with(java.time.DayOfWeek.MONDAY);
        LocalDate endOfWeek = startOfWeek.plusDays(6);
        return getMenusForPeriod(startOfWeek, endOfWeek);
    }
    
    public List<Menu> getCurrentMonthMenus() {
        LocalDate now = LocalDate.now();
        return getMenusForMonth(now.getMonthValue(), now.getYear());
    }
}