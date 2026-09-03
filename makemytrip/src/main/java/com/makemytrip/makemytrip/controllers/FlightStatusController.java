package com.makemytrip.makemytrip.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.makemytrip.makemytrip.dto.FlightStatusRequest;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/flight-status")
public class FlightStatusController {

    @GetMapping("/{flightId}")
    public ResponseEntity<?> getFlightStatus(@PathVariable Long flightId) {
        return ResponseEntity.ok(Map.of("flightId", flightId,"status", 
        		"ON TIME", "message", 
        		"Flight is operating on schedule", 
        		"lastUpdated", LocalDateTime.now()));
    }

    @PutMapping("/{flightId}")
    public ResponseEntity<?> updateFlightStatus(@PathVariable Long flightId, @RequestBody FlightStatusRequest request) {
        return ResponseEntity.ok(Map.of("flightId", flightId,
                        "status", request.getStatus(), "message", request.getMessage(),
                        "departureTime", request.getDepartureTime(),
                        "arrivalTime", request.getArrivalTime(),
                        "delayReason", request.getDelayReason(), 
                        "lastUpdated", LocalDateTime.now()));
    }

    @PutMapping("/{flightId}/delay")
    public ResponseEntity<?> delayFlight(@PathVariable Long flightId, @RequestParam int delayMinutes, @RequestParam String reason) {
        return ResponseEntity.ok(Map.of("flightId", flightId,
                        "status", "DELAYED", "message",
                        "Flight delayed by " + delayMinutes + " minutes",
                        "delayMinutes", delayMinutes, "delayReason",reason,
                        "lastUpdated",LocalDateTime.now()));
    }

    @PutMapping("/{flightId}/boarding")
    public ResponseEntity<?> boardingFlight(@PathVariable Long flightId) {
        return ResponseEntity.ok(Map.of("flightId", flightId,
                        "status", "BOARDING",
                        "message","Passengers are currently boarding",
                        "lastUpdated",LocalDateTime.now()));
    }

    @PutMapping("/{flightId}/on-time")
    public ResponseEntity<?> onTimeFlight( @PathVariable Long flightId) {
        return ResponseEntity.ok(Map.of("flightId", flightId,
                        "status", "ON TIME",
                        "message", "Flight is operating on schedule", 
                        "lastUpdated", LocalDateTime.now()));
    }

    @PutMapping("/{flightId}/cancel")
    public ResponseEntity<?> cancelFlight(@PathVariable Long flightId,@RequestParam String reason) {
        return ResponseEntity.ok(Map.of("flightId", flightId,
                        "status", "CANCELLED","message",
                        "Flight has been cancelled","reason",
                        reason,"lastUpdated",LocalDateTime.now()));
    }

    @GetMapping("/track")
    public ResponseEntity<?> trackFlights( @RequestParam String flightIds) {
        return ResponseEntity.ok(Map.of("flightIds", flightIds,"message",
                        "Multiple flights are being tracked",
                        "lastUpdated", LocalDateTime.now()));
    }
}