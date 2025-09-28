package com.middaymeal.controller;

import com.middaymeal.entity.Menu;
import com.middaymeal.service.MenuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/menus")
@Tag(name = "Menu Management", description = "APIs for managing meal menus")
@CrossOrigin(origins = "*")
public class MenuController {
    
    private final MenuService menuService;
    
    @Autowired
    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }
    
    @GetMapping
    @Operation(summary = "Get all active menus")
    public ResponseEntity<List<Menu>> getAllMenus() {
        List<Menu> menus = menuService.getAllActiveMenus();
        return ResponseEntity.ok(menus);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get menu by ID")
    public ResponseEntity<Menu> getMenuById(@PathVariable Long id) {
        return menuService.getMenuById(id)
                .map(menu -> ResponseEntity.ok(menu))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/date/{date}/mealType/{mealType}")
    @Operation(summary = "Get menu by date and meal type")
    public ResponseEntity<Menu> getMenuByDateAndMealType(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PathVariable Menu.MealType mealType) {
        return menuService.getMenuByDateAndMealType(date, mealType)
                .map(menu -> ResponseEntity.ok(menu))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/month/{month}/year/{year}")
    @Operation(summary = "Get menus for a specific month and year")
    public ResponseEntity<List<Menu>> getMenusForMonth(@PathVariable Integer month, @PathVariable Integer year) {
        List<Menu> menus = menuService.getMenusForMonth(month, year);
        return ResponseEntity.ok(menus);
    }
    
    @GetMapping("/period")
    @Operation(summary = "Get menus for a date range")
    public ResponseEntity<List<Menu>> getMenusForPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Menu.MealType mealType) {
        
        List<Menu> menus;
        if (mealType != null) {
            menus = menuService.getMenusForPeriodAndMealType(startDate, endDate, mealType);
        } else {
            menus = menuService.getMenusForPeriod(startDate, endDate);
        }
        return ResponseEntity.ok(menus);
    }
    
    @GetMapping("/current-week")
    @Operation(summary = "Get menus for current week")
    public ResponseEntity<List<Menu>> getCurrentWeekMenus() {
        List<Menu> menus = menuService.getCurrentWeekMenus();
        return ResponseEntity.ok(menus);
    }
    
    @GetMapping("/current-month")
    @Operation(summary = "Get menus for current month")
    public ResponseEntity<List<Menu>> getCurrentMonthMenus() {
        List<Menu> menus = menuService.getCurrentMonthMenus();
        return ResponseEntity.ok(menus);
    }
    
    @PostMapping
    @Operation(summary = "Create a new menu")
    public ResponseEntity<Menu> createMenu(@Valid @RequestBody Menu menu) {
        Menu createdMenu = menuService.createMenu(menu);
        return new ResponseEntity<>(createdMenu, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing menu")
    public ResponseEntity<Menu> updateMenu(@PathVariable Long id, @Valid @RequestBody Menu menuDetails) {
        try {
            Menu updatedMenu = menuService.updateMenu(id, menuDetails);
            return ResponseEntity.ok(updatedMenu);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a menu (soft delete)")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        try {
            menuService.deleteMenu(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}