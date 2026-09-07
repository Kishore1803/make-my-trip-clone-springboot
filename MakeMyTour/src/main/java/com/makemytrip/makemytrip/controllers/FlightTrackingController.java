package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.dto.FlightTrackingRequest;
import com.makemytrip.makemytrip.dto.FlightTrackingResponse;
import com.makemytrip.makemytrip.models.FlightTracking;
import com.makemytrip.makemytrip.services.FlightTrackingService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flight-tracking")
public class FlightTrackingController {

    private final FlightTrackingService flightTrackingService;

    public FlightTrackingController(FlightTrackingService flightTrackingService) {
        this.flightTrackingService = flightTrackingService;
    }

    @PostMapping
    public ResponseEntity<FlightTrackingResponse> trackFlight(@RequestBody FlightTrackingRequest request) {
        return ResponseEntity.ok(flightTrackingService.trackFlight(request));
    }

    @GetMapping
    public ResponseEntity<List<FlightTracking>> getTrackedFlights() {
        return ResponseEntity.ok(flightTrackingService.getAllTrackedFlights());
    }

    @GetMapping("/{flightId}")
    public ResponseEntity<FlightTracking> getTrackedFlight(@PathVariable Long flightId) {
        return ResponseEntity.ok(flightTrackingService.getTrackedFlight(flightId));
    }

    @DeleteMapping("/{flightId}")
    public ResponseEntity<?> stopTrackingFlight(@PathVariable Long flightId) {
        flightTrackingService.stopTracking(flightId);
        return ResponseEntity.ok("Flight tracking stopped successfully");
    }
}