package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.dto.FlightTrackingRequest;
import com.makemytrip.makemytrip.dto.FlightTrackingResponse;
import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.repositories.FlightRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FlightTrackingService {

	@Autowired
    private final FlightRepository flightRepository;

    public FlightTrackingService(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    public FlightTrackingResponse trackFlight(FlightTrackingRequest request) {

        Flight flight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new RuntimeException("Flight not found"));
        
        String status = request.getStatus();
        String reason = getReason(status);
        String estimatedArrivalTime = flight.getArrivalTime();

        if ("DELAYED".equalsIgnoreCase(status)) {
            estimatedArrivalTime = getDelayedArrivalTime(flight.getArrivalTime());
        }

        return new FlightTrackingResponse(flight.getId(), flight.getFlightName(), flight.getFrom(),
                flight.getTo(), status, reason,flight.getDepartureTime(), 
                flight.getArrivalTime(), estimatedArrivalTime);
    }

    private String getReason(String status) {

        if ("DELAYED".equalsIgnoreCase(status)) {
            return "Technical issue caused a delay";
        }

        if ("BOARDING".equalsIgnoreCase(status)) {
            return "Passengers are currently boarding";
        }

        if ("ON TIME".equalsIgnoreCase(status)) {
            return "Flight is operating on schedule";
        }

        if ("CANCELLED".equalsIgnoreCase(status)) {
            return "Operational issue";
        }
        return "Flight status updated";
    }

    private String getDelayedArrivalTime(String arrivalTime) {
        // Mock revised ETA
        return arrivalTime + " + 1 hour";
    }
}