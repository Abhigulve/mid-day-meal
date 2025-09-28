package com.middaymeal.controller;

import com.middaymeal.entity.School;
import com.middaymeal.service.SchoolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schools")
@Tag(name = "School Management", description = "APIs for managing schools")
@CrossOrigin(origins = "*")
public class SchoolController {
    
    private final SchoolService schoolService;
    
    @Autowired
    public SchoolController(SchoolService schoolService) {
        this.schoolService = schoolService;
    }
    
    @GetMapping
    @Operation(summary = "Get all active schools")
    public ResponseEntity<List<School>> getAllSchools() {
        List<School> schools = schoolService.getAllActiveSchools();
        return ResponseEntity.ok(schools);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get school by ID")
    public ResponseEntity<School> getSchoolById(@PathVariable Long id) {
        return schoolService.getSchoolById(id)
                .map(school -> ResponseEntity.ok(school))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/code/{code}")
    @Operation(summary = "Get school by code")
    public ResponseEntity<School> getSchoolByCode(@PathVariable String code) {
        return schoolService.getSchoolByCode(code)
                .map(school -> ResponseEntity.ok(school))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @Operation(summary = "Create a new school")
    public ResponseEntity<School> createSchool(@Valid @RequestBody School school) {
        School createdSchool = schoolService.createSchool(school);
        return new ResponseEntity<>(createdSchool, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing school")
    public ResponseEntity<School> updateSchool(@PathVariable Long id, @Valid @RequestBody School schoolDetails) {
        try {
            School updatedSchool = schoolService.updateSchool(id, schoolDetails);
            return ResponseEntity.ok(updatedSchool);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a school (soft delete)")
    public ResponseEntity<Void> deleteSchool(@PathVariable Long id) {
        try {
            schoolService.deleteSchool(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search schools by name, code, or city")
    public ResponseEntity<List<School>> searchSchools(@RequestParam String query) {
        List<School> schools = schoolService.searchSchools(query);
        return ResponseEntity.ok(schools);
    }
    
    @GetMapping("/city/{city}")
    @Operation(summary = "Get schools by city")
    public ResponseEntity<List<School>> getSchoolsByCity(@PathVariable String city) {
        List<School> schools = schoolService.getSchoolsByCity(city);
        return ResponseEntity.ok(schools);
    }
    
    @GetMapping("/state/{state}")
    @Operation(summary = "Get schools by state")
    public ResponseEntity<List<School>> getSchoolsByState(@PathVariable String state) {
        List<School> schools = schoolService.getSchoolsByState(state);
        return ResponseEntity.ok(schools);
    }
    
    @GetMapping("/count")
    @Operation(summary = "Get total count of active schools")
    public ResponseEntity<Long> getTotalSchoolsCount() {
        Long count = schoolService.getTotalActiveSchools();
        return ResponseEntity.ok(count);
    }
}