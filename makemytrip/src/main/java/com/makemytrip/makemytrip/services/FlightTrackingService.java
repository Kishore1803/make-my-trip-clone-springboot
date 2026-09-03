package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.dto.FlightTrackingRequest;
import com.makemytrip.makemytrip.dto.FlightTrackingResponse;
import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.FlightTracking;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.FlightTrackingRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FlightTrackingService {

	@Autowired
    private final FlightRepository flightRepository;
	
	@Autowired
    private final FlightTrackingRepository flightTrackingRepository;

    public FlightTrackingService(FlightRepository flightRepository, FlightTrackingRepository flightTrackingRepository) {
        this.flightRepository = flightRepository;
        this.flightTrackingRepository = flightTrackingRepository;
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

        FlightTracking tracking = flightTrackingRepository.findByFlightId(flight.getId())
                        .orElse(new FlightTracking());

        tracking.setFlightId(flight.getId());
        tracking.setFlightNumber(flight.getFlightName());
        tracking.setStatus(status);
        tracking.setReason(reason);
        tracking.setDepartureTime(flight.getDepartureTime());
        tracking.setArrivalTime(flight.getArrivalTime());
        tracking.setEstimatedArrivalTime(estimatedArrivalTime);
        tracking.setLastUpdated(LocalDateTime.now());

        flightTrackingRepository.save(tracking);

        return new FlightTrackingResponse(flight.getId(), flight.getFlightName(), flight.getFrom(), flight.getTo(),
                status, reason, flight.getDepartureTime(), flight.getArrivalTime(), estimatedArrivalTime);
    }

    private String getReason(String status) {

        if ("DELAYED".equalsIgnoreCase(status)) {
            return "Technical issue caused a delay";
        }

        if ("BOARDING".equalsIgnoreCase(status)) {
            return "Passengers are currently boarding";
        }

        if ("ON TIME".equalsIgnoreCase(status)|| "ON_TIME".equalsIgnoreCase(status)) {
            return "Flight is operating on schedule";
        }

        if ("CANCELLED".equalsIgnoreCase(status)) {
            return "Operational issue";
        }

        if ("DEPARTED".equalsIgnoreCase(status)) {
            return "Flight has departed";
        }

        if ("ARRIVED".equalsIgnoreCase(status)) {
            return "Flight has arrived at destination";
        }

        return "Flight status updated";
    }

    private String getDelayedArrivalTime(String arrivalTime) {
        return arrivalTime + " + 1 hour";
    }

    public List<FlightTracking> getAllTrackedFlights() {
        return flightTrackingRepository.findAll();
    }

    public FlightTracking getTrackedFlight(Long flightId) {
        return flightTrackingRepository.findByFlightId(flightId)
                .orElseThrow(() -> new RuntimeException("Flight tracking information not found"));
    }

    public void stopTracking(Long flightId) {
        FlightTracking tracking = flightTrackingRepository.findByFlightId(flightId)
                        .orElseThrow(() -> new RuntimeException("Flight is not being tracked"));
        flightTrackingRepository.delete(tracking);
    }
}