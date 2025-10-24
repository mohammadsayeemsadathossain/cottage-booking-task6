package com.TIES4520.onto.demo.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.TIES4520.onto.demo.model.Cottage;
import com.TIES4520.onto.demo.service.CottageService;

@RestController
@RequestMapping("/api/cottages")
public class CottageController {

    @Autowired
    private CottageService service;

    @GetMapping
    public ResponseEntity<List<Cottage>> getCottages() {
        return ResponseEntity.ok(service.getCottages());
    }

    @PostMapping
    public ResponseEntity<Void> addCottage(@RequestBody Cottage cottage) {
        service.addCottage(cottage);
        return ResponseEntity.ok().build();
    }

    @PutMapping
    public ResponseEntity<Void> updateCottages(@RequestBody Cottage cottage) {
    	// Need to check booking before updating
        service.updateCottages(cottage);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCottage(@PathVariable String id) {
    	// Need to check booking before deleting
        service.deleteCottage(id);
        return ResponseEntity.ok().build();
    }

    // Optional: availability search (dates as dd.MM.yyyy to match your task doc)
    @GetMapping("/search-availability")
    public ResponseEntity<List<Cottage>> searchAvailability(
            @RequestParam int requiredPlaces,
            @RequestParam int requiredBedrooms,
            @RequestParam int maxLakeDistanceMeters,
            @RequestParam(required = false) String city,
            @RequestParam int maxCityDistanceMeters,
            @RequestParam String startDay,           // dd.MM.yyyy
            @RequestParam int requiredDays           // nights
    ) {
        DateTimeFormatter IN = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        LocalDate s = LocalDate.parse(startDay, IN);
        LocalDate e = s.plusDays(requiredDays);
        var results = service.searchAvailable(
                requiredPlaces, requiredBedrooms, maxLakeDistanceMeters,
                city, maxCityDistanceMeters, s, e
        );
        return ResponseEntity.ok(results);
    }
}
