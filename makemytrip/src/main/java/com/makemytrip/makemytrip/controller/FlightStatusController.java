package com.makemytrip.makemytrip.controller;

import com.makemytrip.makemytrip.models.FlightStatus;
import com.makemytrip.makemytrip.service.FlightStatusService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flight-status")
public class FlightStatusController {

    private final FlightStatusService flightStatusService;

    public FlightStatusController(FlightStatusService flightStatusService) {
        this.flightStatusService = flightStatusService;
    }

    @GetMapping
    public ResponseEntity<List<FlightStatus>> getAllStatuses() {

        return ResponseEntity.ok(flightStatusService.getAllStatuses());
    }

    @GetMapping("/{flightId}")
    public ResponseEntity<FlightStatus> getStatusByFlightId(@PathVariable Long flightId) {

        return flightStatusService.getStatusByFlightId(flightId)
        		.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{flightId}")
    public ResponseEntity<FlightStatus> createStatus(@PathVariable Long flightId) {

        return ResponseEntity.ok(flightStatusService.createStatus(flightId));
    }

    @PutMapping("/{flightId}/simulate")
    public ResponseEntity<FlightStatus> simulateStatus( @PathVariable Long flightId) {

        return ResponseEntity.ok(flightStatusService.simulateStatus(flightId));
    }
}