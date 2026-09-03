package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.dto.FlightTrackingRequest;
import com.makemytrip.makemytrip.dto.FlightTrackingResponse;
import com.makemytrip.makemytrip.services.FlightTrackingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/flight-tracking")
public class FlightTrackingController {

	@Autowired
    private final FlightTrackingService flightTrackingService;

    public FlightTrackingController(FlightTrackingService flightTrackingService) {
        this.flightTrackingService = flightTrackingService;
    }

    @PostMapping
    public ResponseEntity<FlightTrackingResponse> trackFlight(@RequestBody FlightTrackingRequest request) {
        FlightTrackingResponse response = flightTrackingService.trackFlight(request);
        return ResponseEntity.ok(response);
    }
}