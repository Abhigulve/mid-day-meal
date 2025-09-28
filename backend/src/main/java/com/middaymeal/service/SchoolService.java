package com.middaymeal.service;

import com.middaymeal.entity.School;
import com.middaymeal.repository.SchoolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SchoolService {
    
    private final SchoolRepository schoolRepository;
    
    @Autowired
    public SchoolService(SchoolRepository schoolRepository) {
        this.schoolRepository = schoolRepository;
    }
    
    public List<School> getAllActiveSchools() {
        return schoolRepository.findByActiveTrue();
    }
    
    public Optional<School> getSchoolById(Long id) {
        return schoolRepository.findById(id);
    }
    
    public Optional<School> getSchoolByCode(String code) {
        return schoolRepository.findByCode(code);
    }
    
    public School createSchool(School school) {
        return schoolRepository.save(school);
    }
    
    public School updateSchool(Long id, School schoolDetails) {
        School school = schoolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("School not found with id: " + id));
        
        school.setName(schoolDetails.getName());
        school.setCode(schoolDetails.getCode());
        school.setAddress(schoolDetails.getAddress());
        school.setCity(schoolDetails.getCity());
        school.setState(schoolDetails.getState());
        school.setPincode(schoolDetails.getPincode());
        school.setPhone(schoolDetails.getPhone());
        school.setEmail(schoolDetails.getEmail());
        school.setPrincipalName(schoolDetails.getPrincipalName());
        school.setTotalStudents(schoolDetails.getTotalStudents());
        
        return schoolRepository.save(school);
    }
    
    public void deleteSchool(Long id) {
        School school = schoolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("School not found with id: " + id));
        school.setActive(false);
        schoolRepository.save(school);
    }
    
    public List<School> searchSchools(String search) {
        return schoolRepository.searchSchools(search);
    }
    
    public Long getTotalActiveSchools() {
        return schoolRepository.countActiveSchools();
    }
    
    public List<School> getSchoolsByCity(String city) {
        return schoolRepository.findByCity(city);
    }
    
    public List<School> getSchoolsByState(String state) {
        return schoolRepository.findByState(state);
    }
}